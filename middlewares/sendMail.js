import { createTransport } from "nodemailer";

// const sendMail = async (email, subject, date) => {
const sendMail = async (email, subject, data, date) => {

    const transport = createTransport({
        host: "smtp.gmail.com",
        port: 465, 
        auth: {
            user: process.env.Gmail,
            pass: process.env.Password,
        },
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
     <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            text-align: center;
            background-image: linear-gradient(to top, #dabbf2 0%, #fff 100%);
        
        }
        h1 {
            color: #f00058;
            font-weight: bolder;
            padding: 10px 20px; 
            
        }
        p {
            margin-bottom: 20px;
            color: #4f4e4e;
        }
        .otp {
            font-size: 36px;
            color: #5f357e; /* Purple text */
            margin-bottom: 30px;
            font-weight: bold;
            padding: 10px 20px; /* Added padding for better spacing */
        }
        
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <p>Hello ${data.name} your (One-Time Password) for your account verification is</p>
        <p class="otp">${data.otp}</p> 
    </div>
</body>
</html>`;

    await transport.sendMail({
        from: process.env.Gmail,
        to: email,
        subject,
        html,
    });
};

export default sendMail; // Export the sendMail function for use in other modules