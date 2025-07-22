import nodemailer, { SendMailOptions } from "nodemailer";

export interface SendEmailOptions {
  cc?: string | string[];
  replyTo?: string;
  headers?: Record<string, string>;
  bookingId?: string;
  inReplyTo?: string;
}

export async function sendEmail(
  to: string,
  subject: string,
  content: string,
  attachments: SendMailOptions["attachments"] = [],
  options: SendEmailOptions = {}
): Promise<string> {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "vickymuthunga@gmail.com",
      pass: "phao chdg beqx cgla",
    },
  });

  const mailOptions: SendMailOptions = {
    from: "vickymuthunga@gmail.com",
    to,
    subject,
    html: content,
    attachments,
    replyTo: options.replyTo || "vickymuthunga@gmail.com",
    headers: {
      ...(options.headers || {}),
      "X-Booking-ID": options.bookingId || "",
    },
  };

  if (options.cc) {
    mailOptions.cc = options.cc;
  }

  if (options.inReplyTo) {
    mailOptions.headers = {
      ...mailOptions.headers,
      "In-Reply-To": options.inReplyTo,
      References: options.inReplyTo,
    };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!", info.messageId);
    return info.messageId;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
