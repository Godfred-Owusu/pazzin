import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { qrCodeEmailTemplate } from './qr-code-email.template';

@Injectable()
export class EmailService {
  private transporter;
  private logger = new Logger(EmailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // replace with your SMTP host
      port: 465, // or 465 for secure
      secure: true, // true if port 465
      auth: {
        user: 'godfredmirekuowusu@gmail.com', // SMTP username
        pass: 'doyp zkra jraz lftz', // SMTP password
      },
    });
  }

  async sendQrCodeEmail(
    to: string,
    qrCodeUrl: string,
    name: string,
    program: string,
  ) {
    try {
      const info = await this.transporter.sendMail({
        from: '"Ticket System" <godfredmirekuowusu@gmail.com>', // sender
        to,
        subject: `Your QR Code for ${program}`,
        // html: `
        //   <p>Hello ${name},</p>
        //   <p>Thank you for registering for ${program}. Here is your QR code:</p>
        //   <img src="cid:qrCode" alt="QR Code" />
        //   <p>Keep it safe and present it at the event.</p>
        // `,
        html: qrCodeEmailTemplate(name, program, qrCodeUrl),
        attachments: [
          {
            filename: 'qrcode.png',
            content: qrCodeUrl.split(',')[1], // remove "data:image/png;base64,"
            encoding: 'base64',
            cid: 'qrCode', // reference in img src
          },
        ],
      });

      return info;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
