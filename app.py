"""
Himma Group website - Flask application
Serves the landing page with three detail pages for Coffee, Machines, and Materials.
Includes SEO sitemap, form validation, CSRF protection, structured data, email notifications, and rate limiting.
"""

from flask import Flask, render_template, request, jsonify, url_for, make_response
from flask_wtf.csrf import CSRFProtect
from flask_mail import Mail, Message
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from email_validator import validate_email, EmailNotValidError
from bleach import clean
import os
from datetime import datetime

app = Flask(__name__, template_folder='templates', static_folder='static')

# Secret key for CSRF protection (use environment variable in production)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key-change-in-production')

# Email configuration (using environment variables for security)
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL', 'False') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'info@himmagroup.com')
app.config['MAIL_MAX_EMAILS'] = int(os.getenv('MAIL_MAX_EMAILS', 10))

# Initialize extensions
csrf = CSRFProtect(app)
mail = Mail(app)

# Rate limiting configuration
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# Content configuration (mirrors content/data.js)
SITE_CONFIG = {
    'site': {
        'name': 'Himma Group',
        'email': 'info@himmagroup.com',
        'phone': '+251 93 598 8288',
        'whatsapp': '+251 93 598 8288',
        'whatsappMessage': 'Hello Himma Group, I would like to know more about your services.'
    },
    'links': {
        'coffeeApp': '',
        'machinesApp': '',
        'materialsApp': ''
    }
}

@app.context_processor
def inject_config():
    """Make SITE_CONFIG available to all templates."""
    return {
        'site': SITE_CONFIG['site'],
        'links': SITE_CONFIG['links']
    }

@app.route('/sitemap.xml')
def sitemap():
    """Generate sitemap.xml dynamically."""
    routes = [
        ('index', {}, 1.0),
        ('coffee', {}, 0.8),
        ('machines', {}, 0.8),
        ('materials', {}, 0.8)
    ]
    
    sitemap_xml = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
'''
    
    for route_name, args, priority in routes:
        url = url_for(route_name, _external=True, **args)
        sitemap_xml += f'''  <url>
    <loc>{url}</loc>
    <priority>{priority}</priority>
  </url>
'''
    
    sitemap_xml += '</urlset>'
    
    response = make_response(sitemap_xml)
    response.headers['Content-Type'] = 'application/xml'
    return response

@app.route('/api/csrf-token', methods=['GET'])
def get_csrf_token():
    """Return CSRF token for JavaScript forms."""
    from flask_wtf.csrf import generate_csrf
    return jsonify({'csrf_token': generate_csrf()})

@app.route('/')
def index():
    """Render the landing page."""
    return render_template('index.html')

@app.route('/company/coffee')
def coffee():
    """Render the Coffee page with embedded app."""
    embed_url = request.args.get('url', SITE_CONFIG['links'].get('coffeeApp', ''))
    return render_template('company/coffee.html', embed_url=embed_url)

@app.route('/company/machines')
def machines():
    """Render the Machines page with embedded app."""
    embed_url = request.args.get('url', SITE_CONFIG['links'].get('machinesApp', ''))
    return render_template('company/machines.html', embed_url=embed_url)

@app.route('/company/materials')
def materials():
    """Render the Materials page with embedded app."""
    embed_url = request.args.get('url', SITE_CONFIG['links'].get('materialsApp', ''))
    return render_template('company/materials.html', embed_url=embed_url)

@app.route('/api/config')
def get_config():
    """API endpoint to retrieve site configuration (for JS use)."""
    return jsonify(SITE_CONFIG)

def sanitize_input(value, max_length=500):
    """Sanitize and validate user input."""
    if not value or not isinstance(value, str):
        return None
    # Strip tags and limit length
    sanitized = clean(value.strip(), tags=[], strip=True)
    return sanitized[:max_length] if sanitized else None

def validate_form_data(data):
    """Validate contact form data."""
    errors = {}
    
    # Name validation
    name = sanitize_input(data.get('name', ''), 100)
    if not name or len(name) < 2:
        errors['name'] = 'Name is required and must be at least 2 characters.'
    
    # Email validation
    email = sanitize_input(data.get('email', ''), 254)
    if not email:
        errors['email'] = 'Email is required.'
    else:
        try:
            validate_email(email)
        except EmailNotValidError as e:
            errors['email'] = f'Invalid email address: {str(e)}'
    
    # Subject validation (optional but recommended)
    subject = sanitize_input(data.get('subject', ''), 200)
    
    # Message validation
    message = sanitize_input(data.get('message', ''), 2000)
    if not message or len(message) < 10:
        errors['message'] = 'Message is required and must be at least 10 characters.'
    
    return {
        'valid': len(errors) == 0,
        'errors': errors,
        'data': {
            'name': name,
            'email': email,
            'subject': subject or 'No subject',
            'message': message
        }
    }

def send_contact_email(form_data):
    """Send email notification for contact form submission."""
    try:
        # Email to admin
        admin_msg = Message(
            subject=f"New Contact Form Submission: {form_data['subject']}",
            recipients=[SITE_CONFIG['site']['email']],
            body=f"""
New contact form submission received at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

From: {form_data['name']}
Email: {form_data['email']}
Subject: {form_data['subject']}

Message:
{form_data['message']}

---
This email was sent from the Himma Group contact form.
            """,
            html=f"""
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #1f8a4c; border-bottom: 2px solid #1f8a4c; padding-bottom: 10px;">New Contact Form Submission</h2>

        <p style="background-color: #f6f7f5; padding: 10px; border-left: 4px solid #1f8a4c;">
            <strong>Received:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        </p>

        <table style="width: 100%; margin-top: 20px;">
            <tr>
                <td style="padding: 8px; background-color: #f6f7f5;"><strong>Name:</strong></td>
                <td style="padding: 8px;">{form_data['name']}</td>
            </tr>
            <tr>
                <td style="padding: 8px; background-color: #f6f7f5;"><strong>Email:</strong></td>
                <td style="padding: 8px;"><a href="mailto:{form_data['email']}">{form_data['email']}</a></td>
            </tr>
            <tr>
                <td style="padding: 8px; background-color: #f6f7f5;"><strong>Subject:</strong></td>
                <td style="padding: 8px;">{form_data['subject']}</td>
            </tr>
        </table>

        <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 4px;">
            <strong>Message:</strong>
            <p style="margin-top: 10px; white-space: pre-wrap;">{form_data['message']}</p>
        </div>

        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">This email was sent from the Himma Group contact form.</p>
    </div>
</body>
</html>
            """
        )

        # Auto-reply to customer
        customer_msg = Message(
            subject="Thank you for contacting Himma Group",
            recipients=[form_data['email']],
            body=f"""
Dear {form_data['name']},

Thank you for reaching out to Himma Group. We have received your message and will get back to you as soon as possible.

Your message:
{form_data['message']}

Best regards,
Himma Group Team

---
This is an automated message. Please do not reply to this email.
            """,
            html=f"""
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #1f8a4c;">Thank you for contacting Himma Group</h2>

        <p>Dear {form_data['name']},</p>

        <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>

        <div style="margin: 20px 0; padding: 15px; background-color: #f6f7f5; border-left: 4px solid #1f8a4c;">
            <strong>Your message:</strong>
            <p style="margin-top: 10px; white-space: pre-wrap;">{form_data['message']}</p>
        </div>

        <p>Best regards,<br><strong>Himma Group Team</strong></p>

        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">This is an automated message. Please do not reply to this email.</p>
    </div>
</body>
</html>
            """
        )

        # Send both emails
        if app.config['MAIL_USERNAME']:  # Only send if email is configured
            mail.send(admin_msg)
            mail.send(customer_msg)
            return True
        else:
            print("Email not configured. Skipping email send.")
            print(f"Contact form data: {form_data}")
            return True  # Still return success for development

    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

@app.route('/api/contact', methods=['POST'])
@limiter.limit("5 per hour")  # Rate limit: 5 submissions per hour per IP
def contact():
    """Handle contact form submissions with validation, sanitization, and email notifications."""
    try:
        # Accept both JSON and form submissions
        data = request.get_json(silent=True) or request.form.to_dict() or {}

        # Validate form data
        validation_result = validate_form_data(data)

        if not validation_result['valid']:
            return jsonify({
                'status': 'error',
                'message': 'Please fix the following errors:',
                'errors': validation_result['errors']
            }), 400

        # Send email notification
        email_sent = send_contact_email(validation_result['data'])

        if email_sent:
            return jsonify({
                'status': 'success',
                'message': 'Thank you for your message. We will get back to you shortly!'
            }), 200
        else:
            return jsonify({
                'status': 'error',
                'message': 'Failed to send email. Please try again or contact us directly.'
            }), 500

    except Exception as e:
        print(f"Contact form error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while processing your request. Please try again later.'
        }), 500

if __name__ == '__main__':
    # Development server - set debug=False for production
    app.run(debug=True, host='0.0.0.0', port=5000)

