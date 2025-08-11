# Complete Nodemailer Library Guide

## Overview
Nodemailer is a module for Node.js applications that allows easy email sending. It's the most popular email sending library for Node.js with zero dependencies and supports Unicode, attachments, embedded images, secure authentication, and custom plugins.

## Installation

```bash
npm install nodemailer
```

## Basic Setup and Configuration

### Creating a Transporter
A transporter is an object that defines how emails are sent.

```javascript
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
    service: 'gmail', // or other email service
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password' // Use app-specific password for Gmail
    }
});
```

### Manual SMTP Configuration
```javascript
const transporter = nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password'
    }
});
```

## Email Options Object

### Basic Email Structure
```javascript
const mailOptions = {
    from: 'sender@example.com',
    to: 'recipient@example.com',
    subject: 'Email Subject',
    text: 'Plain text body',
    html: '<h1>HTML body</h1>'
};
```

### Complete Mail Options
```javascript
const mailOptions = {
    // Sender information
    from: '"Sender Name" <sender@example.com>',
    
    // Recipients
    to: 'recipient1@example.com, recipient2@example.com',
    cc: 'cc@example.com',
    bcc: 'bcc@example.com',
    
    // Email content
    subject: 'Email Subject',
    text: 'Plain text version of the email',
    html: '<p>HTML version of the email</p>',
    
    // Headers
    headers: {
        'X-Custom-Header': 'Custom Value'
    },
    
    // Reply-to
    replyTo: 'noreply@example.com',
    
    // Priority
    priority: 'high', // high, normal, low
    
    // Attachments
    attachments: [
        {
            filename: 'document.pdf',
            path: '/path/to/document.pdf'
        }
    ]
};
```

## Sending Emails

### Basic Send Method
```javascript
const sendEmail = async () => {
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Call the function
sendEmail();
```

### Using Callbacks
```javascript
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error:', error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
```

## Authentication Methods

### OAuth2 Authentication
```javascript
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'your-email@gmail.com',
        clientId: 'your-client-id',
        clientSecret: 'your-client-secret',
        refreshToken: 'your-refresh-token'
    }
});
```

### XOAUTH2 Token
```javascript
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'your-email@gmail.com',
        accessToken: 'your-access-token'
    }
});
```

## Attachments

### File Attachments
```javascript
const mailOptions = {
    from: 'sender@example.com',
    to: 'recipient@example.com',
    subject: 'File Attachment',
    text: 'Please find attached file',
    attachments: [
        {
            filename: 'document.pdf',
            path: './files/document.pdf'
        },
        {
            filename: 'image.jpg',
            path: './images/image.jpg'
        }
    ]
};
```

### Buffer Attachments
```javascript
const fs = require('fs');

const mailOptions = {
    // ... other options
    attachments: [
        {
            filename: 'data.txt',
            content: Buffer.from('Hello World!', 'utf-8')
        }
    ]
};
```

### Stream Attachments
```javascript
const fs = require('fs');

const mailOptions = {
    // ... other options
    attachments: [
        {
            filename: 'large-file.pdf',
            content: fs.createReadStream('./large-file.pdf')
        }
    ]
};
```

### Embedded Images (CID)
```javascript
const mailOptions = {
    from: 'sender@example.com',
    to: 'recipient@example.com',
    subject: 'Embedded Image',
    html: '<p>Here is an image: <img src="cid:unique@image.cid"/></p>',
    attachments: [
        {
            filename: 'image.png',
            path: './images/image.png',
            cid: 'unique@image.cid' // Content-ID
        }
    ]
};
```

## HTML Templates and Styling

### Rich HTML Content
```javascript
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: #f4f4f4; padding: 20px; }
        .content { padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome!</h1>
        </div>
        <div class="content">
            <p>This is a formatted email.</p>
        </div>
    </div>
</body>
</html>
`;

const mailOptions = {
    from: 'sender@example.com',
    to: 'recipient@example.com',
    subject: 'HTML Email',
    html: htmlContent
};
```

## Multiple Recipients

### Array Format
```javascript
const mailOptions = {
    from: 'sender@example.com',
    to: ['user1@example.com', 'user2@example.com', 'user3@example.com'],
    subject: 'Multiple Recipients',
    text: 'This email is sent to multiple recipients'
};
```

### String Format
```javascript
const mailOptions = {
    from: 'sender@example.com',
    to: 'user1@example.com, user2@example.com, user3@example.com',
    subject: 'Multiple Recipients',
    text: 'This email is sent to multiple recipients'
};
```

## Email Services Configuration

### Gmail
```javascript
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password' // Use App Password, not regular password
    }
});
```

### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransporter({
    service: 'hotmail',
    auth: {
        user: 'your-email@hotmail.com',
        pass: 'your-password'
    }
});
```

### Yahoo
```javascript
const transporter = nodemailer.createTransporter({
    service: 'yahoo',
    auth: {
        user: 'your-email@yahoo.com',
        pass: 'your-password'
    }
});
```

### Custom SMTP
```javascript
const transporter = nodemailer.createTransporter({
    host: 'mail.your-domain.com',
    port: 587,
    secure: false,
    auth: {
        user: 'your-email@your-domain.com',
        pass: 'your-password'
    },
    tls: {
        rejectUnauthorized: false
    }
});
```

## Advanced Features

### Email Verification
```javascript
const verifyTransporter = async () => {
    try {
        await transporter.verify();
        console.log('Server is ready to take our messages');
    } catch (error) {
        console.error('Server connection error:', error);
    }
};

verifyTransporter();
```

### Connection Pooling
```javascript
const transporter = nodemailer.createTransporter({
    pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password'
    },
    maxConnections: 5,
    maxMessages: 10
});
```

### Rate Limiting
```javascript
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password'
    },
    pool: true,
    rateLimit: 5 // max 5 messages per second
});
```

## Error Handling

### Comprehensive Error Handling
```javascript
const sendEmailWithErrorHandling = async (mailOptions) => {
    try {
        // Verify transporter
        await transporter.verify();
        
        // Send email
        const info = await transporter.sendMail(mailOptions);
        
        return {
            success: true,
            messageId: info.messageId,
            response: info.response
        };
    } catch (error) {
        console.error('Email sending failed:', error);
        
        // Handle specific error types
        if (error.code === 'EAUTH') {
            console.error('Authentication failed');
        } else if (error.code === 'ECONNECTION') {
            console.error('Connection failed');
        }
        
        return {
            success: false,
            error: error.message
        };
    }
};
```

## Testing and Development

### Ethereal Email (Testing)
```javascript
const createTestTransporter = async () => {
    // Create test account
    const testAccount = await nodemailer.createTestAccount();
    
    // Create transporter
    const transporter = nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
    
    return transporter;
};

// Usage
const sendTestEmail = async () => {
    const testTransporter = await createTestTransporter();
    
    const info = await testTransporter.sendMail({
        from: '"Test Sender" <test@example.com>',
        to: 'recipient@example.com',
        subject: 'Test Email',
        text: 'This is a test email'
    });
    
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
};
```

## Complete Working Example

```javascript
const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }
    
    async sendEmail(options) {
        try {
            const mailOptions = {
                from: `"${options.senderName}" <${options.from}>`,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
                attachments: options.attachments || []
            };
            
            const info = await this.transporter.sendMail(mailOptions);
            
            return {
                success: true,
                messageId: info.messageId,
                response: info.response
            };
        } catch (error) {
            console.error('Email sending failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('Email service is ready');
            return true;
        } catch (error) {
            console.error('Email service verification failed:', error);
            return false;
        }
    }
}

// Usage
const emailService = new EmailService();

const sendWelcomeEmail = async (userEmail, userName) => {
    const result = await emailService.sendEmail({
        senderName: 'Your App',
        from: 'noreply@yourapp.com',
        to: userEmail,
        subject: 'Welcome!',
        text: `Welcome ${userName}!`,
        html: `<h1>Welcome ${userName}!</h1><p>Thanks for joining us.</p>`
    });
    
    if (result.success) {
        console.log('Welcome email sent successfully');
    } else {
        console.error('Failed to send welcome email:', result.error);
    }
};
```

## Security Best Practices

### Environment Variables
```javascript
// Use environment variables for sensitive data
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});
```

### Input Validation
```javascript
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const sendValidatedEmail = async (to, subject, content) => {
    if (!validateEmail(to)) {
        throw new Error('Invalid email address');
    }
    
    // Proceed with sending email
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: content
    };
    
    return await transporter.sendMail(mailOptions);
};
```

## Common Issues and Solutions

### Gmail Authentication
- Use App Passwords instead of regular passwords
- Enable 2-factor authentication
- Use OAuth2 for production applications

### Connection Issues
- Check firewall settings
- Verify SMTP settings
- Use connection pooling for high-volume sending

### Rate Limiting
- Implement delays between emails
- Use connection pooling
- Consider email service limits

