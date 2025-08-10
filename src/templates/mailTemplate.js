const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Feedback Acknowledgment</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333333;
            padding: 0;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .email-wrapper {
            padding: 40px 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .email-container {
            max-width: 650px;
            width: 100%;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            position: relative;
        }
        
        .header {
            background: {{headerColor}};
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><radialGradient id="a" cx="50%" cy="0%" r="100%"><stop offset="0%" stop-color="rgba(255,255,255,.1)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient></defs><rect width="100" height="20" fill="url(%23a)"/></svg>') repeat-x;
            opacity: 0.3;
        }
        
        .header-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            position: relative;
            z-index: 1;
        }
        
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 40px 30px;
            background: #ffffff;
        }
        
        .greeting {
            font-size: 18px;
            color: #2c3e50;
            margin-bottom: 25px;
            font-weight: 600;
        }
        
        .message-box {
            background: {{messageBoxColor}};
            border-left: 5px solid {{borderColor}};
            padding: 25px;
            margin: 25px 0;
            border-radius: 8px;
            font-size: 16px;
            line-height: 1.7;
            position: relative;
        }
        
        .message-box::before {
            content: '{{messageIcon}}';
            position: absolute;
            top: -10px;
            right: 20px;
            background: {{borderColor}};
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }
        
        .appreciation {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin: 30px 0;
            font-weight: 500;
        }
        
        .signature {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px solid #f8f9fa;
        }
        
        .signature-name {
            color: #2c3e50;
            font-weight: 700;
            font-size: 18px;
            margin-top: 10px;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 25px 30px;
            text-align: center;
            font-size: 13px;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
        }
        
        .footer-icon {
            display: inline-block;
            margin: 0 5px;
            opacity: 0.6;
        }
        
        /* Responsive Design */
        @media (max-width: 600px) {
            .email-wrapper {
                padding: 20px 10px;
            }
            
            .header, .content {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
        }
        
        /* Animations */
        .email-container {
            animation: slideIn 0.6s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-container">
            <div class="header">
                <div class="header-icon">{{headerIcon}}</div>
                <h1>{{headerTitle}}</h1>
            </div>
            
            <div class="content">
                <div class="greeting">Dear Valued User,</div>
                
                <div class="message-box">
                    {{responseMessage}}
                </div>
                
                <div class="appreciation">
                    {{appreciationMessage}}
                </div>
                
                <div class="signature">
                    <p>Thank you for being part of our community!</p>
                    <div class="signature-name">The Support Team</div>
                </div>
            </div>
            
            <div class="footer">
                <span class="footer-icon">🔒</span>
                This is an automated message. Please do not reply directly to this email.
                <span class="footer-icon">📧</span>
            </div>
        </div>
    </div>
</body>
</html>
`;

// Function to generate email content based on feedback type
function generateEmailContent(responseMessage, isPositive = true) {
    const positiveConfig = {
        headerColor: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        headerIcon: '🎉',
        headerTitle: 'Thank You for Your Feedback!',
        messageBoxColor: '#e8f5e8',
        borderColor: '#4CAF50',
        messageIcon: '✓',
        appreciationMessage: 'Your positive feedback motivates us to continue delivering exceptional service and innovative solutions.'
    };
    
    const negativeConfig = {
        headerColor: 'linear-gradient(135deg, #FF6B6B 0%, #ee5a52 100%)',
        headerIcon: '🛠️',
        headerTitle: 'We Value Your Feedback',
        messageBoxColor: '#fef2f2',
        borderColor: '#FF6B6B',
        messageIcon: '!',
        appreciationMessage: 'We take your concerns seriously and are committed to addressing them. Your feedback helps us improve and serve you better.'
    };
    
    const config = isPositive ? positiveConfig : negativeConfig;
    
    return htmlTemplate
        .replace(/{{headerColor}}/g, config.headerColor)
        .replace(/{{headerIcon}}/g, config.headerIcon)
        .replace(/{{headerTitle}}/g, config.headerTitle)
        .replace(/{{messageBoxColor}}/g, config.messageBoxColor)
        .replace(/{{borderColor}}/g, config.borderColor)
        .replace(/{{messageIcon}}/g, config.messageIcon)
        .replace(/{{responseMessage}}/g, responseMessage)
        .replace(/{{appreciationMessage}}/g, config.appreciationMessage);
}

// Export the function for use in your application
module.exports = { generateEmailContent };