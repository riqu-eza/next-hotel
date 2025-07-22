// lib/emailBodies.ts

import { IBooking } from "@/models/booking";

export function createClientBookingEmail(booking: IBooking): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #1a365d;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          padding: 25px;
          background-color: #f9fafb;
          border: 1px solid #e2e8f0;
          border-top: none;
        }
        .details {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .detail-item {
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #edf2f7;
        }
        .detail-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .footer {
          margin-top: 30px;
          font-size: 14px;
          color: #718096;
          text-align: center;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #3182ce;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Booking Confirmation</h1>
      </div>
      <div class="content">
        <p>Dear ${booking.name},</p>
        <p>Thank you for choosing us! Your booking has been confirmed. Below are your reservation details:</p>
        
        <div class="details">
          <div class="detail-item">
            <strong>Reservation Number:</strong> #${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
          </div>
          <div class="detail-item">
            <strong>Room Type:</strong> ${booking.roomType}
          </div>
          <div class="detail-item">
            <strong>Check-in:</strong> ${new Date(booking.fromDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div class="detail-item">
            <strong>Check-out:</strong> ${new Date(booking.endDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div class="detail-item">
            <strong>Number of Guests:</strong> ${booking.people}
          </div>
          <div class="detail-item">
            <strong>Total Nights:</strong> ${Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.fromDate).getTime()) / (1000 * 60 * 60 * 24))}
          </div>
        </div>

        <p>We're excited to welcome you! If you have any special requests or need to modify your reservation, please don't hesitate to contact us.</p>
        
        <p>For your convenience, you may also:</p>
        <a href="#" class="button">View Your Booking</a>
        <a href="#" class="button" style="background-color: #e53e3e;">Cancel Reservation</a>

        <div class="footer">
          <p>Thank you for your trust in our services.</p>
          <p><strong>The Hotel Team</strong></p>
          <p>${process.env.HOTEL_PHONE} | ${process.env.HOTEL_EMAIL}</p>
          <p>${process.env.HOTEL_ADDRESS}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function createHotelBookingEmail(booking: IBooking): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2c5282;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          padding: 25px;
          background-color: #f9fafb;
          border: 1px solid #e2e8f0;
          border-top: none;
        }
        .details {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .detail-item {
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #edf2f7;
        }
        .detail-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .footer {
          margin-top: 30px;
          font-size: 14px;
          color: #718096;
        }
        .urgent {
          background-color: #fffaf0;
          padding: 15px;
          border-left: 4px solid #dd6b20;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>New Booking Notification</h1>
      </div>
      <div class="content">
        <p>Dear Hotel Team,</p>
        <p>A new reservation has been made with the following details:</p>
        
        <div class="details">
          <div class="detail-item">
            <strong>Guest Name:</strong> ${booking.name}
          </div>
          <div class="detail-item">
            <strong>Contact Email:</strong> ${booking.email}
          </div>
          <div class="detail-item">
            <strong>Room Type:</strong> ${booking.roomType}
          </div>
          <div class="detail-item">
            <strong>Check-in:</strong> ${new Date(booking.fromDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div class="detail-item">
            <strong>Check-out:</strong> ${new Date(booking.endDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div class="detail-item">
            <strong>Number of Guests:</strong> ${booking.people}
          </div>
          <div class="detail-item">
            <strong>Booking Time:</strong> ${new Date().toLocaleString()}
          </div>
        </div>

        <div class="urgent">
          <strong>Action Required:</strong> Please prepare the room and send a confirmation to the guest.
        </div>

        <p>You can view this booking in your admin dashboard or contact the guest if additional information is needed.</p>

        <div class="footer">
          <p>This is an automated notification. Please do not reply to this email.</p>
          <p><strong>Booking System</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;
}