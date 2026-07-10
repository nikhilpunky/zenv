import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.zoho.in',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'support@zenvparfum.com',
    pass: process.env.SMTP_PASS || 'ajqrAa87mc3F'
  }
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Setup verification failed:', error);
  } else {
    console.log('SMTP Setup is verified and ready to send emails.');
  }
});

// Function to book a shipment with Delhivery CMU API
async function bookDelhiveryShipment({ orderReference, amount, notes }) {
  const token = process.env.DELHIVERY_API_TOKEN;
  if (!token) {
    console.error('DELHIVERY_API_TOKEN is not configured.');
    return null;
  }

  const url = process.env.DELHIVERY_API_URL || 'https://track.delhivery.com/api/cmu/create.json';

  const pickupLocation = {
    name: process.env.DELHIVERY_WAREHOUSE_NAME || "ZENV Delhi Warehouse",
    add: process.env.DELHIVERY_WAREHOUSE_ADDRESS || "ZENV Fragrances, Connaught Place",
    city: process.env.DELHIVERY_WAREHOUSE_CITY || "New Delhi",
    state: process.env.DELHIVERY_WAREHOUSE_STATE || "Delhi",
    country: "India",
    pin: process.env.DELHIVERY_WAREHOUSE_PINCODE || "110001",
    phone: process.env.DELHIVERY_WAREHOUSE_PHONE || "9310912279"
  };

  const shipment = {
    order: orderReference,
    waybill: "",
    payment_mode: "Prepaid",
    total_amount: amount,
    package_desc: notes?.items || "ZENV Luxury Fragrances",
    weight: 0.5,
    packages_count: 1,
    name: notes?.name || 'Customer',
    phone: notes?.phone || '0000000000',
    add: notes?.address || 'N/A',
    city: notes?.city || 'N/A',
    state: notes?.state || 'N/A',
    pin: notes?.pincode || '000000',
    country: "India"
  };

  const payloadData = {
    pickup_location: pickupLocation,
    shipments: [shipment]
  };

  try {
    console.log(`Attempting to book Delhivery shipment for order ${orderReference}...`);
    console.log(`Delhivery Booking Request URL: ${url}`);
    const maskedToken = token ? `${token.substring(0, 4)}...${token.substring(token.length - 4)}` : 'undefined';
    console.log(`Delhivery Booking Request Headers:`, JSON.stringify({
      'Authorization': `Token ${maskedToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }));
    console.log(`Delhivery Booking Request Payload:`, JSON.stringify(payloadData, null, 2));
    
    // Format parameters as URL-encoded: format=json&data={JSON}
    const params = new URLSearchParams();
    params.append('format', 'json');
    params.append('data', JSON.stringify(payloadData));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    console.log(`Delhivery Booking Response Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      throw new Error(`Delhivery API returned HTTP status ${response.status}`);
    }

    const result = await response.json();
    console.log('Delhivery Booking Response Body:', JSON.stringify(result, null, 2));

    if (result.success && result.packages && result.packages.length > 0) {
      const pkg = result.packages[0];
      if (pkg.waybill) {
        console.log(`Delhivery shipment booked successfully. Waybill: ${pkg.waybill}`);
        return pkg.waybill;
      }
    }
    console.warn('Delhivery response did not indicate success or lacked waybill:', result.rmk || 'No remarks');
    return null;
  } catch (error) {
    console.error('Error booking Delhivery shipment:', error);
    return null;
  }
}

// Parse custom itemDetails string format (e.g. "Name|Size|Qty|Price;Name|Size|Qty|Price")
function parseItemDetails(itemDetailsStr) {
  if (!itemDetailsStr) return [];
  return itemDetailsStr.split(';').map(itemStr => {
    const [name, size, quantity, price] = itemStr.split('|');
    return {
      name: name || 'Luxury Fragrance Product',
      size: size || '50ml',
      quantity: parseInt(quantity, 10) || 1,
      price: parseFloat(price) || 0
    };
  }).filter(item => item.name);
}

// Function to send Order Confirmation and Admin Alert emails
async function sendOrderEmails({ paymentId, amount, notes, waybill }) {
  const orderReference = notes?.order_reference || 'N/A';
  const customerName = notes?.name || 'Valued Customer';
  const customerEmail = notes?.email || 'N/A';
  const customerPhone = notes?.phone || 'N/A';
  const customerAddress = notes?.address || 'N/A';
  const itemDetailsStr = notes?.itemDetails || '';

  const items = parseItemDetails(itemDetailsStr);
  const adminEmail = process.env.SMTP_USER || 'support@zenvparfum.com';

  let itemsHtml = '';
  let itemsAdminHtml = '';

  if (items.length > 0) {
    items.forEach(item => {
      itemsHtml += `
        <tr>
          <td style="padding: 15px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a1a;">
            <strong style="font-weight: 600;">${item.name}</strong><br>
            <span style="font-size: 12px; color: #7a7a7a;">${item.size}</span>
          </td>
          <td style="padding: 15px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a1a; text-align: center;">${item.quantity}</td>
          <td style="padding: 15px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a1a; text-align: right;">₹${item.price * item.quantity}</td>
        </tr>
      `;
      itemsAdminHtml += `
        <tr>
          <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${item.name}</td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${item.size}</td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px; text-align: right;">₹${item.price * item.quantity}</td>
        </tr>
      `;
    });
  } else {
    itemsHtml = `
      <tr>
        <td style="padding: 15px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a1a;">
          <strong style="font-weight: 600;">${notes?.items || 'ZENV Luxury Product'}</strong>
        </td>
        <td style="padding: 15px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a1a; text-align: center;">1</td>
        <td style="padding: 15px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a1a; text-align: right;">₹${amount}</td>
      </tr>
    `;
    itemsAdminHtml = `
      <tr>
        <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${notes?.items || 'ZENV Luxury Product'}</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px;">-</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px; text-align: center;">1</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px; text-align: right;">₹${amount}</td>
      </tr>
    `;
  }

  const isCod = notes?.payment_method === 'Cash on Delivery';

  // Create conditional tracking blocks
  let trackingHtml = '';
  if (waybill) {
    trackingHtml = `
      <table style="width: 100%; background-color: #f0f7f4; border: 1px solid #d4edda; border-radius: 6px; padding: 15px; margin-bottom: 30px; border-collapse: collapse;">
        <tr>
          <td style="color: #155724; font-size: 14px; padding: 4px 0; font-weight: 600;">Delivery Carrier:</td>
          <td style="font-weight: 600; color: #155724; font-size: 14px; text-align: right; padding: 4px 0;">Delhivery</td>
        </tr>
        <tr>
          <td style="color: #155724; font-size: 14px; padding: 4px 0; font-weight: 600;">Waybill / Tracking ID:</td>
          <td style="font-weight: 600; color: #155724; font-size: 14px; text-align: right; padding: 4px 0;">${waybill}</td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: center; padding-top: 10px;">
            <a href="https://track.delhivery.com/track/package/${waybill}" target="_blank" style="display: inline-block; background-color: #B38E34; color: #ffffff; padding: 8px 18px; border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Track Shipment</a>
          </td>
        </tr>
      </table>
    `;
  }

  let adminTrackingHtml = '';
  if (!isCod) {
    if (waybill) {
      adminTrackingHtml = `
        <tr>
          <td style="color: #7a7a7a; font-size: 14px; padding: 8px 0;">Delhivery Waybill:</td>
          <td style="font-weight: 600; color: #1a1a1a; font-size: 14px; padding: 8px 0;">
            <a href="https://track.delhivery.com/track/package/${waybill}" target="_blank" style="color: #B38E34; text-decoration: none;">${waybill}</a> (Booked Automatically)
          </td>
        </tr>
      `;
    } else {
      adminTrackingHtml = `
        <tr>
          <td style="color: #7a7a7a; font-size: 14px; padding: 8px 0;">Delhivery Booking:</td>
          <td style="font-weight: 600; color: #c0392b; font-size: 14px; padding: 8px 0;">Failed or skipped (Check logs)</td>
        </tr>
      `;
    }
  }

  // 1. Customer HTML Template
  const customerHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${isCod ? 'COD Order Placed' : 'Order Confirmed'} - ZENV</title>
  </head>
  <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f7f9; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
    <div style="width: 100%; background-color: #f7f7f9; padding: 40px 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e3e3e7; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-bottom: 3px solid #B38E34;">
          <h1 style="font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #ffffff; margin: 0; text-transform: uppercase;">ZENV</h1>
          <p style="font-size: 11px; letter-spacing: 2px; color: #B38E34; margin: 5px 0 0 0; text-transform: uppercase; font-weight: 600;">Luxury Fragrances</p>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="font-size: 20px; font-weight: 600; color: #1a1a1a; margin-top: 0; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">${isCod ? 'Order Placed (COD)' : 'Order Confirmed'}</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin-bottom: 25px;">Dear ${customerName},</p>
          <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin-bottom: 25px;">
            ${isCod 
              ? `Thank you for choosing ZENV. Your Cash on Delivery (COD) order has been successfully placed. Our team in New Delhi is preparing your order. Please keep <strong>₹${amount}</strong> cash ready for collection upon delivery.` 
              : 'Thank you for choosing ZENV. We are pleased to confirm that your payment has been successfully processed, and your order is now confirmed. Our team in New Delhi is preparing your luxurious fragrance selection for dispatch.'
            }
          </p>
          
          <table style="width: 100%; background-color: #fafafa; border: 1px solid #eaeaea; border-radius: 6px; padding: 15px; margin-bottom: 30px; border-collapse: collapse;">
            <tr>
              <td style="color: #7a7a7a; font-size: 14px; padding: 6px 0;">Order Reference:</td>
              <td style="font-weight: 600; color: #1a1a1a; font-size: 14px; text-align: right; padding: 6px 0;">${orderReference}</td>
            </tr>
            <tr>
              <td style="color: #7a7a7a; font-size: 14px; padding: 6px 0;">Payment Method:</td>
              <td style="font-weight: 600; color: #1a1a1a; font-size: 14px; text-align: right; padding: 6px 0;">${notes?.payment_method || 'Instant Prepaid (Razorpay)'}</td>
            </tr>
            ${paymentId && !paymentId.includes('COD') ? `
            <tr>
              <td style="color: #7a7a7a; font-size: 14px; padding: 6px 0;">Payment ID:</td>
              <td style="font-weight: 600; color: #1a1a1a; font-size: 14px; text-align: right; padding: 6px 0;">${paymentId}</td>
            </tr>
            ` : ''}
          </table>
          
          ${trackingHtml}
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 12px 10px; border-bottom: 2px solid #eaeaea; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #7a7a7a;">Product</th>
                <th style="text-align: center; padding: 12px 10px; border-bottom: 2px solid #eaeaea; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #7a7a7a; width: 60px;">Qty</th>
                <th style="text-align: right; padding: 12px 10px; border-bottom: 2px solid #eaeaea; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #7a7a7a; width: 100px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          ${notes?.coupon_code ? `
          <div style="text-align: right; font-size: 14px; color: #7a7a7a; margin-top: 10px;">
            Discount (Coupon: <strong style="font-family: monospace;">${notes.coupon_code}</strong>): <span style="color: #c0392b; margin-left: 10px;">-₹${notes.discount_amount}</span>
          </div>
          ` : ''}
          <div style="text-align: right; font-size: 16px; font-weight: 700; color: #1a1a1a; margin-top: 10px; padding-top: 15px; border-top: 2px solid #eaeaea;">
            Total Amount: <span style="color: #B38E34; font-size: 20px; margin-left: 10px;">₹${amount}</span>
          </div>
          
          <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #1a1a1a; margin-top: 40px; margin-bottom: 10px;">Shipping Destination</h3>
          <div style="border-left: 3px solid #B38E34; padding-left: 15px; margin-bottom: 30px; font-size: 14px; line-height: 1.6; color: #4a4a4a;">
            <strong style="color: #1a1a1a;">${customerName}</strong><br>
            ${customerAddress}<br>
            Phone: ${customerPhone}
          </div>
          
          <p style="margin-top: 40px; font-size: 14px; color: #4a4a4a;">If you have any questions or require custom assistance, please feel free to reach out to us at <a href="mailto:support@zenvparfum.com" style="color: #B38E34; text-decoration: none; font-weight: 500;">support@zenvparfum.com</a>.</p>
          
          <p style="margin-bottom: 0; font-size: 14px; color: #4a4a4a;">Warm regards,<br><strong style="color: #1a1a1a;">The ZENV Team</strong></p>
        </div>
        <div style="background-color: #f0f0f2; padding: 25px; text-align: center; font-size: 12px; color: #7a7a7a; border-top: 1px solid #e3e3e7;">
          <p style="margin: 0 0 5px 0;">&copy; 2026 ZENV Fragrances. All rights reserved.</p>
          <p style="margin: 0;">Delhi, India</p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  // 2. Admin HTML Template
  const adminHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>New ${isCod ? 'COD' : 'Paid'} Order Alert - ZENV</title>
  </head>
  <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f7f9; margin: 0; padding: 0;">
    <div style="width: 100%; background-color: #f7f7f9; padding: 40px 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e3e3e7; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #B38E34; padding: 20px; text-align: center;">
          <h1 style="font-size: 20px; font-weight: 700; letter-spacing: 2px; color: #ffffff; margin: 0; text-transform: uppercase;">New ${isCod ? 'COD' : 'Paid'} Order Alert</h1>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 15px; color: #4a4a4a; margin-top: 0; margin-bottom: 20px;">
            ${isCod 
              ? 'A new Cash on Delivery (COD) order has been successfully placed. Details below:'
              : 'A new payment has been successfully completed via Razorpay. Details below:'
            }
          </p>
          
          <h2 style="font-size: 14px; font-weight: 600; color: #1a1a1a; border-bottom: 2px solid #eaeaea; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 25px;">Order Info</h2>
          <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse;">
            <tr>
              <td style="color: #7a7a7a; font-size: 14px; padding: 8px 0; width: 150px;">Order Reference:</td>
              <td style="font-weight: 600; color: #1a1a1a; font-size: 14px; padding: 8px 0;">${orderReference}</td>
            </tr>
            <tr>
              <td style="color: #7a7a7a; font-size: 14px; padding: 8px 0;">Payment Method:</td>
              <td style="font-weight: 600; color: #1a1a1a; font-size: 14px; padding: 8px 0;">${notes?.payment_method || 'Instant Prepaid (Razorpay)'}</td>
            </tr>
            ${paymentId && !paymentId.includes('COD') ? `
            <tr>
              <td style="color: #7a7a7a; font-size: 14px; padding: 8px 0;">Payment ID:</td>
              <td style="font-weight: 600; color: #1a1a1a; font-size: 14px; padding: 8px 0;">${paymentId}</td>
            </tr>
            ` : ''}
            ${adminTrackingHtml}
            ${notes?.coupon_code ? `
            <tr>
              <td style="color: #7a7a7a; font-size: 14px; padding: 8px 0; width: 150px;">Applied Coupon:</td>
              <td style="font-weight: 600; color: #1a1a1a; font-size: 14px; padding: 8px 0; font-family: monospace;">${notes.coupon_code}</td>
            </tr>
            <tr>
              <td style="color: #7a7a7a; font-size: 14px; padding: 8px 0;">Coupon Discount:</td>
              <td style="font-weight: 600; color: #c0392b; font-size: 14px; padding: 8px 0;">-₹${notes.discount_amount}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="color: #7a7a7a; font-size: 14px; padding: 8px 0; width: 150px;">Order Value:</td>
              <td style="font-weight: 600; color: #B38E34; font-size: 16px; padding: 8px 0;">₹${amount}</td>
            </tr>
            <tr>
              <td style="color: #7a7a7a; font-size: 14px; padding: 8px 0;">Date/Time:</td>
              <td style="font-weight: 600; color: #1a1a1a; font-size: 14px; padding: 8px 0;">${new Date().toLocaleString()}</td>
            </tr>
          </table>

          <h2 style="font-size: 14px; font-weight: 600; color: #1a1a1a; border-bottom: 2px solid #eaeaea; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 25px;">Customer Details</h2>
          <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse;">
            <tr>
              <td style="color: #7a7a7a; font-size: 14px; padding: 8px 0; width: 150px;">Name:</td>
              <td style="font-weight: 600; color: #1a1a1a; font-size: 14px; padding: 8px 0;">${customerName}</td>
            </tr>
            <tr>
              <td style="color: #7a7a7a; font-size: 14px; padding: 8px 0;">Email:</td>
              <td style="font-weight: 600; color: #1a1a1a; font-size: 14px; padding: 8px 0;">${customerEmail}</td>
            </tr>
            <tr>
              <td style="color: #7a7a7a; font-size: 14px; padding: 8px 0;">Contact / Phone:</td>
              <td style="font-weight: 600; color: #1a1a1a; font-size: 14px; padding: 8px 0;">${customerPhone}</td>
            </tr>
            <tr>
              <td style="color: #7a7a7a; font-size: 14px; padding: 8px 0;">Shipping Address:</td>
              <td style="font-weight: 600; color: #1a1a1a; font-size: 14px; padding: 8px 0; line-height: 1.4;">${customerAddress}</td>
            </tr>
          </table>

          <h2 style="font-size: 14px; font-weight: 600; color: #1a1a1a; border-bottom: 2px solid #eaeaea; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 25px;">Items Ordered</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 10px; border-bottom: 2px solid #eaeaea; font-size: 12px; color: #7a7a7a;">Product</th>
                <th style="text-align: left; padding: 10px; border-bottom: 2px solid #eaeaea; font-size: 12px; color: #7a7a7a; width: 80px;">Size</th>
                <th style="text-align: center; padding: 10px; border-bottom: 2px solid #eaeaea; font-size: 12px; color: #7a7a7a; width: 60px;">Qty</th>
                <th style="text-align: right; padding: 10px; border-bottom: 2px solid #eaeaea; font-size: 12px; color: #7a7a7a; width: 100px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsAdminHtml}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  // Send Customer Email
  if (customerEmail && customerEmail !== 'N/A') {
    try {
      await transporter.sendMail({
        from: `"ZENV" <${adminEmail}>`,
        to: customerEmail,
        subject: isCod ? `COD Order Placed - ${orderReference}` : `Order Confirmed - ${orderReference}`,
        html: customerHtml
      });
      console.log(`Confirmation email sent successfully to customer: ${customerEmail}`);
    } catch (err) {
      console.error('Error sending confirmation email to customer:', err);
    }
  }

  // Send Admin Email
  try {
    await transporter.sendMail({
      from: `"ZENV Alert" <${adminEmail}>`,
      to: adminEmail,
      subject: isCod ? `New COD Order Alert [${orderReference}]` : `New Paid Order Alert [${orderReference}]`,
      html: adminHtml
    });
    console.log(`Order notification email sent successfully to admin: ${adminEmail}`);
  } catch (err) {
    console.error('Error sending notification email to admin:', err);
  }
}

const app = express();
const PORT = process.env.PORT || 3218;

app.use(cors());

// Custom json parser to keep raw body for webhook verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Route: Delhivery Serviceability Check
app.get('/api/serviceability', async (req, res) => {
  const { pincode } = req.query;

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return res.status(400).json({ error: 'Invalid pincode format. Must be 6 digits.' });
  }

  const token = process.env.DELHIVERY_API_TOKEN;
  if (!token) {
    console.error('DELHIVERY_API_TOKEN is not configured in .env file.');
    return res.status(500).json({ error: 'Internal configuration error.' });
  }

  const targetUrl = `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}`;
  const maskedToken = token ? `${token.substring(0, 4)}...${token.substring(token.length - 4)}` : 'undefined';

  try {
    console.log(`Checking Delhivery serviceability for pincode: ${pincode}`);
    console.log(`Delhivery Serviceability Request URL: ${targetUrl}`);
    console.log(`Delhivery Serviceability Request Headers:`, JSON.stringify({
      'Authorization': `Token ${maskedToken}`,
      'Accept': 'application/json'
    }));

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Accept': 'application/json'
      }
    });

    console.log(`Delhivery Serviceability Response Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      throw new Error(`Delhivery API returned status ${response.status}`);
    }

    const data = await response.json();
    console.log(`Delhivery Serviceability Response Body:`, JSON.stringify(data, null, 2));

    // Determine serviceability: delivery_codes contains elements, and pre_paid is "Y"
    const serviceable = !!(
      data.delivery_codes &&
      data.delivery_codes.length > 0 &&
      data.delivery_codes[0].postal_code &&
      data.delivery_codes[0].postal_code.pre_paid === 'Y'
    );

    console.log(`Delhivery Serviceability Final Decision for pincode ${pincode}: ${serviceable}`);

    return res.json({ serviceable });
  } catch (error) {
    console.error('Error fetching Delhivery serviceability:', error);
    // On API error, default to true or false? Let's default to true so users are not blocked 
    // from checkout in case Delhivery is temporarily down.
    console.warn(`Delhivery Serviceability Fallback triggered for pincode ${pincode}: defaulting to true`);
    return res.json({ serviceable: true, error: 'Failed to verify serviceability with carrier. Defaulting to true.' });
  }
});

// Route: Razorpay Webhook Payment Confirmation
app.post('/api/razorpay-webhook', (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!signature) {
    return res.status(400).json({ error: 'x-razorpay-signature header is missing' });
  }

  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET is not configured in .env file.');
    return res.status(500).json({ error: 'Internal configuration error.' });
  }

  try {
    const shasum = crypto.createHmac('sha256', webhookSecret);
    shasum.update(req.rawBody || '');
    const digest = shasum.digest('hex');

    if (digest !== signature) {
      console.warn('Invalid Razorpay signature received in webhook.');
      console.warn('Received Signature:', signature);
      console.warn('Computed Digest:', digest);
      console.warn('rawBody length:', req.rawBody ? req.rawBody.length : 'undefined');
      console.warn('rawBody content preview:', req.rawBody ? req.rawBody.toString('utf8').substring(0, 100) : 'none');
      console.warn('webhookSecret (masked):', webhookSecret ? `${webhookSecret.substring(0, 2)}...${webhookSecret.substring(webhookSecret.length - 2)}` : 'undefined');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Webhook is authentic. Process events (e.g. payment.captured or order.paid)
    const event = req.body.event;
    console.log(`Razorpay webhook verified. Event: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = req.body.payload?.payment?.entity;
      console.log('Payment Captured Successfully:', {
        payment_id: paymentEntity?.id,
        amount: paymentEntity?.amount / 100, // in Rupees
        email: paymentEntity?.email,
        contact: paymentEntity?.contact,
        order_id: paymentEntity?.order_id
      });
      
      // Asynchronously trigger Delhivery booking and email dispatch in the background
      (async () => {
        let waybill = null;
        try {
          waybill = await bookDelhiveryShipment({
            orderReference: paymentEntity?.notes?.order_reference || 'N/A',
            amount: paymentEntity?.amount / 100,
            notes: paymentEntity?.notes
          });
        } catch (delhiveryErr) {
          console.error('Error during automatic Delhivery booking execution:', delhiveryErr);
        }

        await sendOrderEmails({
          paymentId: paymentEntity?.id,
          amount: paymentEntity?.amount / 100,
          notes: paymentEntity?.notes,
          waybill: waybill
        });
      })().catch(err => {
        console.error('Failed executing post-payment background sequence:', err);
      });
    }

    return res.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing Razorpay webhook:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Route: COD Order Notification (Send emails only, skip Delhivery booking)
app.post('/api/cod-order', async (req, res) => {
  const {
    order_reference,
    name,
    email,
    phone,
    address,
    pincode,
    city,
    state,
    items,
    itemDetails,
    amount,
    coupon_code,
    discount_amount
  } = req.body;

  if (!order_reference || !name || !email) {
    return res.status(400).json({ error: 'Missing required order details' });
  }

  try {
    // Send Order confirmation and admin notification emails asynchronously in the background
    sendOrderEmails({
      paymentId: 'COD (Cash on Delivery)',
      amount: amount,
      notes: {
        order_reference,
        name,
        email,
        phone,
        address,
        pincode,
        city,
        state,
        items,
        itemDetails,
        payment_method: 'Cash on Delivery',
        coupon_code,
        discount_amount
      },
      waybill: null // Skip Delhivery waybill for COD
    }).catch(err => {
      console.error('Failed executing sendOrderEmails background task for COD:', err);
    });

    return res.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing COD order notification:', error);
    return res.status(500).json({ error: 'Notification failed' });
  }
});

// Serve frontend build in production/static context
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback: Send all other requests to index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ZENV Backend Server running on http://0.0.0.0:${PORT}`);
});
