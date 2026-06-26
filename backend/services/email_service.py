"""Email digest service for ResearchDB."""

import logging
from datetime import date
from typing import List, Dict
import os
import urllib.request
import urllib.error
import json

logger = logging.getLogger(__name__)


def _send_via_sendgrid(subject: str, html_body: str) -> bool:
    api_key = os.getenv("SENDGRID_API_KEY")
    email_sender = os.getenv("EMAIL_SENDER")
    email_receiver = os.getenv("EMAIL_RECEIVER")

    if not api_key or not email_sender:
        logger.error("SendGrid credentials not configured!")
        return False

    payload = json.dumps({
        "personalizations": [{"to": [{"email": email_receiver}]}],
        "from": {"email": email_sender},
        "subject": subject,
        "content": [{"type": "text/html", "value": html_body}]
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.sendgrid.com/v3/mail/send",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as resp:
            logger.info("Email sent! Status: %s", resp.status)
            return True
    except urllib.error.HTTPError as e:
        logger.error("SendGrid error: %s %s", e.code, e.read().decode())
        return False
    except Exception as e:
        logger.error("Email failed: %s", e)
        return False


def send_daily_digest(results: List[Dict]) -> bool:
    subject, html_body = _build_email(results)
    return _send_via_sendgrid(subject, html_body)


def send_test_email() -> bool:
    subject = "✅ ResearchDB Email Test"
    html_body = "<h2>Email is working via SendGrid!</h2>"
    return _send_via_sendgrid(subject, html_body)


def _build_email(results: List[Dict]):
    today = date.today().strftime("%d %B %Y")
    total_saved = sum(r.get("saved", 0) for r in results)
    subject = f"📚 ResearchDB Daily Digest — {today} ({total_saved} new papers)"

    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; padding: 20px;">
        <h1 style="color: #1a1a2e; border-bottom: 3px solid #6c63ff; padding-bottom: 10px;">
            📚 ResearchDB Daily Digest
        </h1>
        <p style="color: #666;">
            <strong>Date:</strong> {today} &nbsp;|&nbsp;
            <strong>Total Papers:</strong> {total_saved}
        </p>
    """

    for result in results:
        domain = result.get("domain", "Unknown")
        saved = result.get("saved", 0)
        papers = result.get("papers", [])

        if saved == 0:
            continue

        colors = {
            "AI/ML": "#6c63ff",
            "Battery/Materials": "#00b894",
            "Biomedical": "#e17055",
            "Finance": "#fdcb6e",
            "Cybersecurity": "#d63031"
        }
        color = colors.get(domain, "#6c63ff")

        html += f"""
        <div style="margin: 20px 0; padding: 15px;
                    border-left: 4px solid {color};
                    background: #f8f9fa; border-radius: 4px;">
            <h2 style="color: {color}; margin: 0 0 10px 0;">
                {domain} — {saved} papers
            </h2>
        """

        for paper in papers:
            title = paper.get("title", "Unknown")
            arxiv_id = paper.get("arxiv_id", "")
            arxiv_url = f"https://arxiv.org/abs/{arxiv_id}"

            html += f"""
            <div style="margin: 10px 0; padding: 10px;
                        background: white; border-radius: 4px;
                        border: 1px solid #dee2e6;">
                <a href="{arxiv_url}"
                   style="color: {color}; font-weight: bold;
                          text-decoration: none; font-size: 14px;">
                    {title}
                </a>
                <p style="color: #888; font-size: 12px; margin: 4px 0 0 0;">
                    arxiv: {arxiv_id}
                </p>
            </div>
            """

        html += "</div>"

    html += """
        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
        <p style="color: #aaa; font-size: 12px; text-align: center;">
            ResearchDB — AI Powered Research Intelligence Platform
        </p>
    </body>
    </html>
    """

    return subject, html