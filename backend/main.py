import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from services.email_service import send_daily_digest
from database import Base, engine
from migrations import ensure_schema

from routes.analysis import router as analysis_router
from services.arxiv_pipeline import run_pipeline_all_domains

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)

logger = logging.getLogger(__name__)

# ── Scheduler Setup ────────────────────────────────────────────
scheduler = BackgroundScheduler()

def scheduled_pipeline():

    """Runs every day at 7AM — fetches and analyzes new papers."""
    logger.info("Scheduled pipeline starting...")
    try:
        results = run_pipeline_all_domains()
        total_saved = sum(r.get("saved", 0) for r in results)
        logger.info(f"Scheduled pipeline complete — {total_saved} papers saved")
    except Exception as e:
        logger.error(f"Scheduled pipeline failed: {e}")

# Run every day at 7:00 AM
scheduler.add_job(
    scheduled_pipeline,
    CronTrigger(hour=7, minute=0),
    id="daily_arxiv_pipeline",
    replace_existing=True
)

# ── App Lifespan ───────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting scheduler...")
    scheduler.start()
    logger.info("Scheduler started — pipeline runs daily at 7AM")
    yield
    # Shutdown
    logger.info("Shutting down scheduler...")
    scheduler.shutdown()

# ── App Setup ─────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)
ensure_schema()

app = FastAPI(
    title="ResearchOS Backend",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis_router)

# ── Manual Trigger Route ───────────────────────────────────────
@app.post("/api/trigger-pipeline")
def trigger_pipeline():
    logger.info("Manual pipeline trigger called")
    try:
        results = run_pipeline_all_domains()
        total_saved = sum(r.get("saved", 0) for r in results)

        # Send email digest
        email_sent = send_daily_digest(results)

        return {
            "message": "Pipeline complete!",
            "total_saved": total_saved,
            "email_sent": email_sent,  # ← this should appear
            "results": results
        }
    except Exception as e:
        logger.error(f"Manual pipeline failed: {e}")
        return {"error": str(e)}

@app.get("/")
def home():
    return {"message": "ResearchOS Backend Running"}