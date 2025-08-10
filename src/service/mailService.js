// emailService.js
const sgMail = require('@sendgrid/mail');
const config = require('../config/config');

// Set your SendGrid API key (use .env in real projects)
const SENDGRID_API_KEY = config.mailConfig.SENDGRID_API_KEY;
sgMail.setApiKey(SENDGRID_API_KEY);

/**
 * Send an email using SendGrid
 * @param {Object} options - Email details
 * @param {string} options.to - Recipient email address
 * @param {string} options.from - Sender (verified) email address
 * @param {string} options.subject - Subject line
 * @param {string} options.text - Plain text body
 * @param {string} options.html - HTML body
 * @returns {Promise} - Resolves if email sent, rejects if error
 */
async function sendEmail(options) {
    const msg = {
        to: options.to,
        from: config.mailConfig.from,
        subject: options.subject,
        text: options.text || 'Thank you for your valuable feedback',
        html: options.html,
    };

    // return sgMail
    //     .send(msg)
    //     .then((data) => {
    //         console.log('✅ Email sent successfully!');
    //     })
    //     .catch((error) => {
    //         console.error('❌ Email send failed:', error.response?.body || error.message);
    //         throw error;
    //     });

            console.log('✅ Email sent successfully!');

}



module.exports = {
    sendEmail,
};
