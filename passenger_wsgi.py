# Passenger WSGI entry point for cPanel/Apache hosting
# This file tells Phusion Passenger how to load your Flask app.

import os
import sys

# Ensure the app root is on sys.path
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
if APP_ROOT not in sys.path:
    sys.path.insert(0, APP_ROOT)

# Expose the WSGI callable as 'application'
from app import app as application  # noqa: E402

# Optional: set default envs if not defined in cPanel's UI
os.environ.setdefault('SECRET_KEY', 'change-me')
# Example mail settings (override in cPanel UI -> Environment variables)
os.environ.setdefault('MAIL_SERVER', 'smtp.gmail.com')
os.environ.setdefault('MAIL_PORT', '587')
os.environ.setdefault('MAIL_USE_TLS', 'True')
os.environ.setdefault('MAIL_USE_SSL', 'False')
# os.environ.setdefault('MAIL_USERNAME', 'you@example.com')
# os.environ.setdefault('MAIL_PASSWORD', 'app-password')
# os.environ.setdefault('MAIL_DEFAULT_SENDER', 'info@yourdomain.com')
