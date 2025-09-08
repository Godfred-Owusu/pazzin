// qr-code-email.template.ts

export function qrCodeEmailTemplate(
  name: string,
  program: string,
  qrCodeUrl: string,
): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your QR Code</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f8f9fa;
        color: #333;
        line-height: 1.6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      h1 {
        color: #007bff;
      }
      p {
        margin-bottom: 15px;
      }
      .qr-code {
        display: block;
        margin: 20px auto;
        max-width: 250px;
      }
      .footer {
        font-size: 0.85em;
        color: #555;
        margin-top: 30px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Hello ${name},</h1>
      <p>Thank you for registering for <strong>${program}</strong>. Here is your QR code:</p>
      <img src="cid:qrCode" alt="QR Code" class="qr-code" />
      <p>Keep it safe and present it at the event.</p>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
}
