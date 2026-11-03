import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import fs from 'fs';

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
    user: process.env.SMTP_USER || 'support@vesperaparfum.com',
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

// Function to book a shipment with Delhivery CMU API (MOCKED)
async function bookDelhiveryShipment({ orderReference, amount, notes }) {
  console.log(`[MOCK DELHIVERY SHIPMENT] Attempting to book Delhivery shipment for order ${orderReference}...`);
  const randomSuffix = Math.floor(1000000000 + Math.random() * 9000000000);
  const waybill = `VESPERA-MOCK-${randomSuffix}`;
  console.log(`[MOCK DELHIVERY SHIPMENT] Delhivery shipment booked successfully. Waybill: ${waybill}`);
  return waybill;
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
  const adminEmail = process.env.SMTP_USER || 'support@vesperaparfum.com';

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
          <strong style="font-weight: 600;">${notes?.items || 'VESPERA Luxury Product'}</strong>
        </td>
        <td style="padding: 15px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a1a; text-align: center;">1</td>
        <td style="padding: 15px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #1a1a1a; text-align: right;">₹${amount}</td>
      </tr>
    `;
    itemsAdminHtml = `
      <tr>
        <td style="padding: 12px 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${notes?.items || 'VESPERA Luxury Product'}</td>
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
    <title>${isCod ? 'COD Order Placed' : 'Order Confirmed'} - VESPERA</title>
  </head>
  <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f7f9; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
    <div style="width: 100%; background-color: #f7f7f9; padding: 40px 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e3e3e7; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-bottom: 3px solid #B38E34;">
          <h1 style="font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #ffffff; margin: 0; text-transform: uppercase;">VESPERA</h1>
          <p style="font-size: 11px; letter-spacing: 2px; color: #B38E34; margin: 5px 0 0 0; text-transform: uppercase; font-weight: 600;">Luxury Fragrances</p>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="font-size: 20px; font-weight: 600; color: #1a1a1a; margin-top: 0; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">${isCod ? 'Order Placed (COD)' : 'Order Confirmed'}</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin-bottom: 25px;">Dear ${customerName},</p>
          <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin-bottom: 25px;">
            ${isCod 
              ? `Thank you for choosing VESPERA. Your Cash on Delivery (COD) order has been successfully placed. Our team in New Delhi is preparing your order. Please keep <strong>₹${amount}</strong> cash ready for collection upon delivery.` 
              : 'Thank you for choosing VESPERA. We are pleased to confirm that your payment has been successfully processed, and your order is now confirmed. Our team in New Delhi is preparing your luxurious fragrance selection for dispatch.'
            }
          </p>
          
          <table style="width: 100%; background-color: #fafafa; border: 1px solid #eaeaea; border-radius: 6px; padding: 15px; margin-bottom: 30px; border-collapse: collapse;">
            <tr>
              <td style="color: #7a7a7a; font-size: 14px; padding: 6px 0;">Order Reference:</td>
              <td style="font-weight: 600; color: #1a1a1a; font-size: 14px; text-align: right; padding: 6px 0;">${orderReference}</td>
            </tr>
            <tr>
              <td style="color: #7a7a7a; font-size: 14px; padding: 6px 0;">Payment Method:</td>
              <td style="font-weight: 600; color: #1a1a1a; font-size: 14px; text-align: right; padding: 6px 0;">${notes?.payment_method || 'Instant Prepaid'}</td>
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
          
          <p style="margin-top: 40px; font-size: 14px; color: #4a4a4a;">If you have any questions or require custom assistance, please feel free to reach out to us at <a href="mailto:support@vesperaparfum.com" style="color: #B38E34; text-decoration: none; font-weight: 500;">support@vesperaparfum.com</a>.</p>
          
          <p style="margin-bottom: 0; font-size: 14px; color: #4a4a4a;">Warm regards,<br><strong style="color: #1a1a1a;">The VESPERA Team</strong></p>
        </div>
        <div style="background-color: #f0f0f2; padding: 25px; text-align: center; font-size: 12px; color: #7a7a7a; border-top: 1px solid #e3e3e7;">
          <p style="margin: 0 0 5px 0;">&copy; 2026 VESPERA Fragrances. All rights reserved.</p>
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
    <title>New ${isCod ? 'COD' : 'Paid'} Order Alert - VESPERA</title>
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
              : 'A new payment has been successfully completed. Details below:'
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
              <td style="font-weight: 600; color: #1a1a1a; font-size: 14px; padding: 8px 0;">${notes?.payment_method || 'Instant Prepaid'}</td>
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
        from: `"VESPERA" <${adminEmail}>`,
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
      from: `"VESPERA Alert" <${adminEmail}>`,
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

// Custom json parser to keep raw body for webhook verification with generous payload limit
app.use(express.json({
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ─── FILE-BASED PRODUCTS DATABASE INITIALIZATION ───
const PRODUCTS_FILE_PATH = path.join(__dirname, 'products.json');

const INITIAL_PRODUCTS = [
  {
    id: 'discovery-set',
    name: 'Discovery Collection',
    type: 'Discovery Sets',
    size: '5 × 8ml',
    mrp: 1499,
    price: 799,
    image: '/assets/discovery_set.png',
    certImage: '/assets/product_discovery_infographic.jpg',
    notes: 'Rose · Sandalwood · Citrus · Oud · Amber',
    category: 'discovery',
    isDiscovery: true,
    description: 'A curated collection of five signature fragrances (8ml each) designed to help you experience VESPERA and discover your perfect signature scent.',
    longDescription: 'Our Discovery Collection is the perfect introduction to the world of VESPERA. It contains five premium travel-sized spray vials (8ml each), allowing you to wear and test each fragrance on your skin before choosing a full 50ml bottle. Packaged in a luxury matte black presentation box.',
    olfactiveNotes: {
      top: 'Various (Floral, Woody, Citrus, Smoky)',
      heart: 'Various (Jasmine, Iris, Patchouli, Amber)',
      base: 'Various (Musk, Sandalwood, Leather, Cedar)'
    },
    longevity: '8+ Hours',
    projection: 'Moderate to Strong',
    occasion: 'Daily Discovery & Gifting',
    howToUse: 'Spritz on pulse points (wrists, neck, and behind ears). Wear them individually or layer them to create your own signature scent blend.'
  },
  {
    id: 'vespera-blue',
    name: 'VESPERA Blue',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_blue.jpg',
    certImage: '/assets/product_blue_infographic.jpg',
    notes: 'Aqua · Lime · Jasmine',
    category: 'unisex',
    description: 'A vibrant, fresh aquatic signature bursting with crisp lime, cool aqua notes, and delicate jasmine blossoms.',
    longDescription: 'VESPERA Blue is a bold, invigorating journey into freshness. It opens with a sparkling burst of zesty lime and crisp aquatic accords, transitioning into a heart of fresh jasmine and clean white florals. The base settles into cool musk and cedarwood — energetic, clean, and undeniably modern.',
    olfactiveNotes: {
      top: 'Lime, Aquatic Accord, Bergamot',
      heart: 'Jasmine, White Flowers, Green Leaves',
      base: 'Cool Musk, Cedarwood, Amberwood'
    },
    longevity: '8-10 Hours',
    projection: 'Moderate to Strong',
    occasion: 'Daily Wear, Office & Outdoor Activities',
    howToUse: 'Spray 2-3 times on pulse points — wrists, neck, and collarbones. Ideal after a shower for a long-lasting, refreshing projection throughout the day.'
  },
  {
    id: 'vespera-wood',
    name: 'VESPERA Wood',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_wood.jpg',
    certImage: '/assets/product_wood_infographic.jpg',
    notes: 'Sandalwood · Amber · Cedar',
    category: 'women',
    description: 'A deep, warm woody signature crafted from rich sandalwood, golden amber, and smooth cedarwood for an enduring presence.',
    longDescription: 'VESPERA Wood is an ode to the warmth of ancient forests. It opens with a spiced, golden accord of cardamom and cinnamon, leading into a heart of creamy Australian sandalwood and smooth cedar. The dry-down reveals a rich, resinous amber that clings to skin for hours — sophisticated, bold, and deeply comforting.',
    olfactiveNotes: {
      top: 'Cardamom, Cinnamon, Black Pepper',
      heart: 'Australian Sandalwood, Cedarwood, Vetiver',
      base: 'Golden Amber, Musk, Leather'
    },
    longevity: '10-12 Hours',
    projection: 'Strong & Warm',
    occasion: 'Formal Events, Evenings & Winter Season',
    howToUse: 'Spray 2-3 times on pulse points — wrists, neck, and chest. For enhanced longevity, apply a fragrance-free moisturizer beforehand. Spray from a distance of 6 inches.'
  },
  {
    id: 'vespera-oud',
    name: 'VESPERA Oud',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_oud_new.jpg',
    certImage: '/assets/product_oud_infographic.jpg',
    notes: 'Oud · Amber · Incense',
    category: 'women',
    description: 'A commanding, smoky oud signature rich with precious agarwood, golden amber resin, and sacred incense.',
    longDescription: 'VESPERA Oud is an intense, deeply evocative journey into the heart of Middle Eastern luxury. It opens with a burst of saffron and smoky incense, building to a powerful core of aged agarwood (oud) and warm amber resin. The base is a lingering trail of sandalwood and musk — powerful, mysterious, and unforgettable.',
    olfactiveNotes: {
      top: 'Saffron, Incense, Black Pepper',
      heart: 'Cambodian Oud, Golden Amber, Frankincense',
      base: 'Sandalwood, Dark Musk, Leather'
    },
    longevity: '12+ Hours',
    projection: 'Heavy & Room-Filling',
    occasion: 'Special Occasions, Weddings & Evening Events',
    howToUse: 'A potent formulation — 1-2 sprays maximum on the neck or wrists. Let it settle naturally to appreciate the deep, evolving transitions from opening to dry-down.'
  },
  {
    id: 'vespera-pure',
    name: 'VESPERA Pure',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_pure.jpg',
    certImage: '/assets/product_pure_infographic.jpg',
    notes: 'White Musk · Vetiver · Bamboo',
    category: 'men',
    description: 'A clean, luminous, skin-close fragrance that captures the quiet elegance of pure white musk and soft vetiver.',
    longDescription: 'VESPERA Pure is minimalism elevated to luxury. Inspired by the stillness of a sunlit morning, it opens with a sheer breeze of bamboo and green leaves, blooming into a heart of soft white florals. The base is a weightless cushion of clean musk and earthy vetiver — effortlessly pure, endlessly wearable.',
    olfactiveNotes: {
      top: 'Bamboo, Green Tea, Bergamot',
      heart: 'White Rose, Lily of the Valley, Jasmine',
      base: 'White Musk, Vetiver, Warm Sandalwood'
    },
    longevity: '8-10 Hours',
    projection: 'Soft & Intimate',
    occasion: 'Daily Wear, Office & All-Season Signature',
    howToUse: 'Spray 2-3 times on pulse points — wrists, neck, and behind ears. A versatile everyday scent that pairs beautifully with light moisturiser for a radiant skin-scent effect.'
  },
  {
    id: 'vespera-dark',
    name: 'VESPERA Dark',
    type: 'Eau de Parfum',
    size: '50ml',
    mrp: 2499,
    price: 1199,
    image: '/assets/product_dark.jpg',
    certImage: '/assets/product_dark_infographic.jpg',
    notes: 'Dark Cocoa · Leather · Spices',
    category: 'men',
    description: 'An intense, mysterious fragrance featuring dark cocoa, smoked leather, and warm spices.',
    longDescription: 'VESPERA Dark is a seductive blend for the night. It starts with a bold hit of dark cocoa and cardamom, moving into a heart of smoked leather. The base settles into a rich blend of vanilla and patchouli, creating an unforgettable aura.',
    olfactiveNotes: {
      top: 'Dark Cocoa, Cardamom, Black Pepper',
      heart: 'Smoked Leather, Tobacco Leaf, Clove',
      base: 'Madagascar Vanilla, Patchouli, Amber'
    },
    longevity: '10-12 Hours',
    projection: 'Strong & Lasting',
    occasion: 'Evenings, Night Out & Date Nights',
    howToUse: 'Spray 1-2 times on pulse points. The fragrance is highly concentrated and will evolve beautifully throughout the night.'
  }
];

// Write default file if not existing
if (!fs.existsSync(PRODUCTS_FILE_PATH)) {
  fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(INITIAL_PRODUCTS, null, 2), 'utf-8');
}

// Helpers
function readProductsFromFile() {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading products file, returning fallback:', err);
    return INITIAL_PRODUCTS;
  }
}

function writeProductsToFile(products) {
  try {
    fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing products file:', err);
  }
}

// ─── FILE-BASED BANNERS DATABASE INITIALIZATION ───
const BANNERS_FILE_PATH = path.join(__dirname, 'banners.json');

const INITIAL_BANNERS = [
  {
    id: 'banner-1',
    image: '/assets/hero_perfume_v6.jpg',
    title: 'Crafted to\nBecome Your\nSignature Scent',
    subtitle: 'VESPERA Parfums — Maison de Haute Parfumerie',
    description: 'Premium fragrances designed with timeless elegance, finest ingredients, and enduring performance for every occasion.',
    isActive: true
  }
];

if (!fs.existsSync(BANNERS_FILE_PATH)) {
  fs.writeFileSync(BANNERS_FILE_PATH, JSON.stringify(INITIAL_BANNERS, null, 2), 'utf-8');
}

function readBannersFromFile() {
  try {
    const data = fs.readFileSync(BANNERS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading banners file, returning fallback:', err);
    return INITIAL_BANNERS;
  }
}

function writeBannersToFile(banners) {
  try {
    fs.writeFileSync(BANNERS_FILE_PATH, JSON.stringify(banners, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing banners file:', err);
  }
}

// ─── FILE-BASED CATEGORIES DATABASE INITIALIZATION ───
const CATEGORIES_FILE_PATH = path.join(__dirname, 'categories.json');

const INITIAL_CATEGORIES = [
  {
    id: 'women',
    label: "Women's Perfumes",
    image: '/assets/product_pure.jpg',
    icon: 'Sparkles'
  },
  {
    id: 'men',
    label: "Men's Perfumes",
    image: '/assets/product_wood.jpg',
    icon: 'Compass'
  },
  {
    id: 'unisex',
    label: "Unisex Fragrances",
    image: '/assets/product_blue.jpg',
    icon: 'Layers'
  },
  {
    id: 'discovery',
    label: "Discovery Sets",
    image: '/assets/discovery_set.png',
    icon: 'Grid'
  },
  {
    id: 'oils',
    label: "Perfume Oils",
    image: '/assets/product_dark.jpg',
    icon: 'Droplet'
  }
];

if (!fs.existsSync(CATEGORIES_FILE_PATH)) {
  fs.writeFileSync(CATEGORIES_FILE_PATH, JSON.stringify(INITIAL_CATEGORIES, null, 2), 'utf-8');
}

function readCategoriesFromFile() {
  try {
    const data = fs.readFileSync(CATEGORIES_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading categories file, returning fallback:', err);
    return INITIAL_CATEGORIES;
  }
}

function writeCategoriesToFile(categories) {
  try {
    fs.writeFileSync(CATEGORIES_FILE_PATH, JSON.stringify(categories, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing categories file:', err);
  }
}

// ─── FILE-BASED HOMEPAGE SETTINGS DATABASE INITIALIZATION ───
const HOMEPAGE_FILE_PATH = path.join(__dirname, 'homepage.json');

const INITIAL_HOMEPAGE = {
  announcementText: 'VESPERA INTERACTIVE DEMO EXPERIENCE — SIMULATED PAYMENTS & MOCK CHECKOUT',
  whatsappNumber: '9187584729',
  highlightsTitle: 'Why Choose VESPERA?',
  highlight1Title: 'Long Lasting',
  highlight1Desc: 'Expertly formulated to linger beautifully on skin for up to 12 hours, evolving gracefully through the day.',
  highlight2Title: 'Premium Ingredients',
  highlight2Desc: 'Blended from the finest natural reserves — pure essential oils, rare resins, and hand-selected botanicals.',
  highlight3Title: 'Made in India',
  highlight3Desc: "Proudly crafted in small batches locally, celebrating India's rich olfactory heritage and world-class standards.",
  storyTitle: 'Our Story',
  storyOneHeading: 'Crafted to Leave a Lasting Impression.',
  storyOneBody: 'VESPERA was born from a simple conviction — that luxury fragrance should be within reach, without ever sacrificing craft, quality, or design. Every bottle is developed with intention, using premium ingredients and housed in packaging that honours the art of presentation.',
  storyOneImage: '/assets/story_one.png',
  storyTwoHeading: 'Rooted in Tradition. Refined for Today.',
  storyTwoBody: "Our creations draw inspiration from timeless traditions and the world's most exquisite natural ingredients. From carefully sourced botanicals to our meticulous blending process, every detail reflects our commitment to authenticity.",
  storyTwoImage: '/assets/story_two.png',
  footerAbout: 'VESPERA Parfums is a Maison de Haute Parfumerie dedicated to crafting premium signature fragrances with enduring performance and classic elegance.',
  footerCopyright: '© 2026 VESPERA. All Rights Reserved.'
};

if (!fs.existsSync(HOMEPAGE_FILE_PATH)) {
  fs.writeFileSync(HOMEPAGE_FILE_PATH, JSON.stringify(INITIAL_HOMEPAGE, null, 2), 'utf-8');
}

function readHomepageFromFile() {
  try {
    const data = fs.readFileSync(HOMEPAGE_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading homepage file, returning fallback:', err);
    return INITIAL_HOMEPAGE;
  }
}

function writeHomepageToFile(homepage) {
  try {
    fs.writeFileSync(HOMEPAGE_FILE_PATH, JSON.stringify(homepage, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing homepage file:', err);
  }
}

// ─── FILE-BASED SYSTEM SETTINGS DATABASE INITIALIZATION ───
const SETTINGS_FILE_PATH = path.join(__dirname, 'settings.json');

const INITIAL_SETTINGS = {
  packageMode: 'full_ecom'
};

if (!fs.existsSync(SETTINGS_FILE_PATH)) {
  fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(INITIAL_SETTINGS, null, 2), 'utf-8');
}

function readSettingsFromFile() {
  try {
    const data = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading settings file, returning fallback:', err);
    return INITIAL_SETTINGS;
  }
}

function writeSettingsToFile(settings) {
  try {
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing settings file:', err);
  }
}

// ─── FILE-BASED COUPONS DATABASE INITIALIZATION ───
const COUPONS_FILE_PATH = path.join(__dirname, 'coupons.json');

const INITIAL_COUPONS = [
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minSubtotal: 500,
    isActive: true
  },
  {
    code: 'VESPERAFREE200',
    type: 'fixed',
    value: 200,
    minSubtotal: 1000,
    isActive: true
  }
];

if (!fs.existsSync(COUPONS_FILE_PATH)) {
  fs.writeFileSync(COUPONS_FILE_PATH, JSON.stringify(INITIAL_COUPONS, null, 2), 'utf-8');
}

function readCouponsFromFile() {
  try {
    const data = fs.readFileSync(COUPONS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading coupons file, returning fallback:', err);
    return INITIAL_COUPONS;
  }
}

function writeCouponsToFile(coupons) {
  try {
    fs.writeFileSync(COUPONS_FILE_PATH, JSON.stringify(coupons, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing coupons file:', err);
  }
}


// ─── FILE-BASED ORDERS DATABASE INITIALIZATION ───
const ORDERS_FILE_PATH = path.join(__dirname, 'orders.json');

function readOrdersFromFile() {
  try {
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      const data = fs.readFileSync(ORDERS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  } catch (err) {
    console.error('Error reading orders file:', err);
    return [];
  }
}

function writeOrdersToFile(orders) {
  try {
    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing orders file:', err);
  }
}

// ─── API PRODUCT ROUTE ENDPOINTS ───

// 1. GET ALL PRODUCTS
app.get('/api/products', (req, res) => {
  const products = readProductsFromFile();
  return res.json(products);
});

// 1.5 RESET ALL PRODUCTS, BANNERS, CATEGORIES AND HOMEPAGE TO DEFAULT
app.post('/api/products/reset', (req, res) => {
  try {
    writeProductsToFile(INITIAL_PRODUCTS);
    writeBannersToFile(INITIAL_BANNERS);
    writeCategoriesToFile(INITIAL_CATEGORIES);
    writeHomepageToFile(INITIAL_HOMEPAGE);
    writeCouponsToFile(INITIAL_COUPONS);
    writeSettingsToFile(INITIAL_SETTINGS);
    return res.json({ 
      status: 'ok', 
      products: INITIAL_PRODUCTS, 
      banners: INITIAL_BANNERS, 
      categories: INITIAL_CATEGORIES,
      homepage: INITIAL_HOMEPAGE,
      coupons: INITIAL_COUPONS,
      settings: INITIAL_SETTINGS
    });
  } catch (err) {
    console.error('Failed to reset data to file:', err);
    return res.status(500).json({ error: 'Failed to reset database' });
  }
});

// 2. ADD/UPSERT PRODUCT
app.post('/api/products', (req, res) => {
  try {
    const products = readProductsFromFile();
    const newProduct = req.body;
    
    // Ensure image and images stay synchronized
    if (Array.isArray(newProduct.images) && newProduct.images.length > 0) {
      newProduct.image = newProduct.images[0];
    } else if (newProduct.image) {
      newProduct.images = [newProduct.image];
    }
    
    const existsIdx = products.findIndex(p => p.id === newProduct.id);
    if (existsIdx !== -1) {
      products[existsIdx] = newProduct;
    } else {
      products.push(newProduct);
    }
    
    writeProductsToFile(products);
    return res.json({ status: 'ok', product: newProduct });
  } catch (err) {
    console.error('Failed to add product to file:', err);
    return res.status(500).json({ error: 'Failed to write product' });
  }
});

// 3. UPDATE PRODUCT
app.put('/api/products/:id', (req, res) => {
  try {
    const products = readProductsFromFile();
    const { id } = req.params;
    const updatedFields = req.body;
    
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      const merged = { ...products[idx], ...updatedFields };
      // Ensure image and images stay synchronized
      if (Array.isArray(merged.images) && merged.images.length > 0) {
        merged.image = merged.images[0];
      } else if (merged.image) {
        merged.images = [merged.image];
      }
      products[idx] = merged;
      writeProductsToFile(products);
      return res.json({ status: 'ok', product: products[idx] });
    } else {
      return res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    console.error('Failed to update product in file:', err);
    return res.status(500).json({ error: 'Failed to update product' });
  }
});

// 4. DELETE PRODUCT
app.delete('/api/products/:id', (req, res) => {
  try {
    const products = readProductsFromFile();
    const { id } = req.params;
    
    const filtered = products.filter(p => p.id !== id);
    writeProductsToFile(filtered);
    return res.json({ status: 'ok' });
  } catch (err) {
    console.error('Failed to delete product from file:', err);
    return res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ─── API HERO BANNERS ROUTE ENDPOINTS ───

// 1. GET ALL BANNERS
app.get('/api/banners', (req, res) => {
  const banners = readBannersFromFile();
  return res.json(banners);
});

// 2. ADD/UPSERT BANNER
app.post('/api/banners', (req, res) => {
  try {
    const banners = readBannersFromFile();
    const newBanner = req.body;
    
    if (!newBanner.id) {
      newBanner.id = 'banner-' + Date.now();
    }
    
    const existsIdx = banners.findIndex(b => b.id === newBanner.id);
    if (existsIdx !== -1) {
      banners[existsIdx] = newBanner;
    } else {
      banners.push(newBanner);
    }
    
    writeBannersToFile(banners);
    return res.json({ status: 'ok', banner: newBanner });
  } catch (err) {
    console.error('Failed to add banner to file:', err);
    return res.status(500).json({ error: 'Failed to write banner' });
  }
});

// 3. UPDATE BANNER
app.put('/api/banners/:id', (req, res) => {
  try {
    const banners = readBannersFromFile();
    const { id } = req.params;
    const updatedFields = req.body;
    
    const idx = banners.findIndex(b => b.id === id);
    if (idx !== -1) {
      banners[idx] = { ...banners[idx], ...updatedFields };
      writeBannersToFile(banners);
      return res.json({ status: 'ok', banner: banners[idx] });
    } else {
      return res.status(404).json({ error: 'Banner not found' });
    }
  } catch (err) {
    console.error('Failed to update banner in file:', err);
    return res.status(500).json({ error: 'Failed to update banner' });
  }
});

// 4. DELETE BANNER
app.delete('/api/banners/:id', (req, res) => {
  try {
    const banners = readBannersFromFile();
    const { id } = req.params;
    
    const filtered = banners.filter(b => b.id !== id);
    writeBannersToFile(filtered);
    return res.json({ status: 'ok' });
  } catch (err) {
    console.error('Failed to delete banner from file:', err);
    return res.status(500).json({ error: 'Failed to delete banner' });
  }
});

// ─── API CATEGORIES ROUTE ENDPOINTS ───

// 1. GET ALL CATEGORIES
app.get('/api/categories', (req, res) => {
  const categories = readCategoriesFromFile();
  return res.json(categories);
});

// 2. ADD/UPSERT CATEGORY
app.post('/api/categories', (req, res) => {
  try {
    const categories = readCategoriesFromFile();
    const newCategory = req.body;
    
    if (!newCategory.id) {
      newCategory.id = newCategory.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    
    const existsIdx = categories.findIndex(c => c.id === newCategory.id);
    if (existsIdx !== -1) {
      categories[existsIdx] = newCategory;
    } else {
      categories.push(newCategory);
    }
    
    writeCategoriesToFile(categories);
    return res.json({ status: 'ok', category: newCategory });
  } catch (err) {
    console.error('Failed to add category to file:', err);
    return res.status(500).json({ error: 'Failed to write category' });
  }
});

// 3. UPDATE CATEGORY
app.put('/api/categories/:id', (req, res) => {
  try {
    const categories = readCategoriesFromFile();
    const { id } = req.params;
    const updatedFields = req.body;
    
    const idx = categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      categories[idx] = { ...categories[idx], ...updatedFields };
      writeCategoriesToFile(categories);
      return res.json({ status: 'ok', category: categories[idx] });
    } else {
      return res.status(404).json({ error: 'Category not found' });
    }
  } catch (err) {
    console.error('Failed to update category in file:', err);
    return res.status(500).json({ error: 'Failed to update category' });
  }
});

// 4. DELETE CATEGORY
app.delete('/api/categories/:id', (req, res) => {
  try {
    const categories = readCategoriesFromFile();
    const { id } = req.params;
    
    const filtered = categories.filter(c => c.id !== id);
    writeCategoriesToFile(filtered);
    return res.json({ status: 'ok' });
  } catch (err) {
    console.error('Failed to delete category from file:', err);
    return res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ─── API GENERAL HOMEPAGE SETTINGS ENDPOINTS ───

// 1. GET HOMEPAGE SETTINGS
app.get('/api/homepage', (req, res) => {
  const homepage = readHomepageFromFile();
  return res.json(homepage);
});

// 2. UPDATE HOMEPAGE SETTINGS
app.post('/api/homepage', (req, res) => {
  try {
    const updated = req.body;
    writeHomepageToFile(updated);
    return res.json({ status: 'ok', homepage: updated });
  } catch (err) {
    console.error('Failed to write homepage settings to file:', err);
    return res.status(500).json({ error: 'Failed to save homepage settings' });
  }
});

// ─── API SYSTEM SETTINGS ENDPOINTS ───

// 1. GET SYSTEM SETTINGS
app.get('/api/settings', (req, res) => {
  const settings = readSettingsFromFile();
  return res.json(settings);
});

// 2. UPDATE SYSTEM SETTINGS
app.post('/api/settings', (req, res) => {
  try {
    const current = readSettingsFromFile();
    const updatedSettings = { ...current, ...req.body };
    writeSettingsToFile(updatedSettings);
    return res.json({ status: 'ok', settings: updatedSettings });
  } catch (err) {
    console.error('Failed to save settings:', err);
    return res.status(500).json({ error: 'Failed to save settings' });
  }
});

// ─── API COUPONS ROUTE ENDPOINTS ───

// 1. GET ALL COUPONS
app.get('/api/coupons', (req, res) => {
  const coupons = readCouponsFromFile();
  return res.json(coupons);
});

// 2. ADD/UPSERT COUPON
app.post('/api/coupons', (req, res) => {
  try {
    const coupons = readCouponsFromFile();
    const newCoupon = req.body;
    if (!newCoupon.code) {
      return res.status(400).json({ error: 'Coupon code is required' });
    }
    newCoupon.code = newCoupon.code.toUpperCase().trim();
    newCoupon.value = Number(newCoupon.value) || 0;
    newCoupon.minSubtotal = Number(newCoupon.minSubtotal) || 0;
    newCoupon.isActive = typeof newCoupon.isActive === 'boolean' ? newCoupon.isActive : true;
    
    const existsIdx = coupons.findIndex(c => c.code === newCoupon.code);
    if (existsIdx !== -1) {
      coupons[existsIdx] = { ...coupons[existsIdx], ...newCoupon };
    } else {
      coupons.push(newCoupon);
    }
    
    writeCouponsToFile(coupons);
    return res.json({ status: 'ok', coupon: newCoupon });
  } catch (err) {
    console.error('Failed to save coupon to file:', err);
    return res.status(500).json({ error: 'Failed to save coupon' });
  }
});

// 3. UPDATE/TOGGLE COUPON
app.put('/api/coupons/:code', (req, res) => {
  try {
    const coupons = readCouponsFromFile();
    const code = req.params.code.toUpperCase().trim();
    const updatedFields = req.body;
    
    const idx = coupons.findIndex(c => c.code === code);
    if (idx !== -1) {
      coupons[idx] = { ...coupons[idx], ...updatedFields };
      writeCouponsToFile(coupons);
      return res.json({ status: 'ok', coupon: coupons[idx] });
    } else {
      return res.status(404).json({ error: 'Coupon not found' });
    }
  } catch (err) {
    console.error('Failed to update coupon in file:', err);
    return res.status(500).json({ error: 'Failed to update coupon' });
  }
});

// 4. DELETE COUPON
app.delete('/api/coupons/:code', (req, res) => {
  try {
    const coupons = readCouponsFromFile();
    const code = req.params.code.toUpperCase().trim();
    
    const filtered = coupons.filter(c => c.code !== code);
    writeCouponsToFile(filtered);
    return res.json({ status: 'ok' });
  } catch (err) {
    console.error('Failed to delete coupon from file:', err);
    return res.status(500).json({ error: 'Failed to delete coupon' });
  }
});



// ─── API ORDERS ROUTE ENDPOINTS ───

// 1. GET ALL ORDERS
app.get('/api/orders', (req, res) => {
  const orders = readOrdersFromFile();
  // Return sorted newest first
  orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return res.json(orders);
});

// 2. CREATE/RECORD ORDER
app.post('/api/orders', (req, res) => {
  try {
    const orders = readOrdersFromFile();
    const orderData = req.body;
    const orderId = orderData.id || orderData.order_reference || `VP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      ...orderData,
      id: orderId,
      order_reference: orderData.order_reference || orderId,
      status: orderData.status || 'confirmed',
      createdAt: orderData.createdAt || new Date().toISOString()
    };

    const existsIdx = orders.findIndex(o => o.id === newOrder.id);
    if (existsIdx !== -1) {
      orders[existsIdx] = newOrder;
    } else {
      orders.unshift(newOrder);
    }

    writeOrdersToFile(orders);
    return res.json({ status: 'ok', order: newOrder });
  } catch (err) {
    console.error('Failed to create order:', err);
    return res.status(500).json({ error: 'Failed to create order' });
  }
});

// 3. UPDATE ORDER (e.g. Status, tracking, notes)
app.put('/api/orders/:id', (req, res) => {
  try {
    const orders = readOrdersFromFile();
    const { id } = req.params;
    const updatedFields = req.body;

    const idx = orders.findIndex(o => o.id === id || o.order_reference === id);
    if (idx !== -1) {
      orders[idx] = { ...orders[idx], ...updatedFields };
      writeOrdersToFile(orders);
      return res.json({ status: 'ok', order: orders[idx] });
    } else {
      return res.status(404).json({ error: 'Order not found' });
    }
  } catch (err) {
    console.error('Failed to update order:', err);
    return res.status(500).json({ error: 'Failed to update order' });
  }
});

// 4. DELETE ORDER
app.delete('/api/orders/:id', (req, res) => {
  try {
    const orders = readOrdersFromFile();
    const { id } = req.params;
    const filtered = orders.filter(o => o.id !== id && o.order_reference !== id);
    writeOrdersToFile(filtered);
    return res.json({ status: 'ok' });
  } catch (err) {
    console.error('Failed to delete order:', err);
    return res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Route: Delhivery Serviceability Check (MOCKED)
app.get('/api/serviceability', async (req, res) => {
  const { pincode } = req.query;

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return res.status(400).json({ error: 'Invalid pincode format. Must be 6 digits.' });
  }

  console.log(`[MOCK SERVICEABILITY Check] Pincode ${pincode} is serviceable.`);
  return res.json({ serviceable: true });
});

// Route: Prepaid Order Notification (Simulating payment capture & shipment booking)
app.post('/api/prepaid-order', async (req, res) => {
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
    const paymentId = 'MOCK_PAY_' + Math.floor(100000 + Math.random() * 900000);
    const notes = {
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
      payment_method: 'Instant Prepaid (Mocked)',
      coupon_code,
      discount_amount
    };

    console.log(`[MOCK PREPAID ORDER RECEIVED] Order Ref: ${order_reference}, Amount: ${amount}`);

    // Parse structured items
    const parsedItems = parseItemDetails(itemDetails);

    // Save order into database
    try {
      const orders = readOrdersFromFile();
      const newOrder = {
        id: order_reference,
        order_reference: order_reference,
        customer: {
          name,
          email,
          phone,
          address,
          pincode,
          city,
          state
        },
        items: parsedItems.length > 0 ? parsedItems : [{ name: items || 'VESPERA Product', size: '50ml', quantity: 1, price: amount }],
        itemsSummary: items || (parsedItems.map(i => `${i.name} (${i.size}) x ${i.quantity}`).join(', ')),
        totalAmount: Number(amount) + Number(discount_amount || 0),
        discountAmount: Number(discount_amount || 0),
        couponCode: coupon_code || null,
        finalAmount: Number(amount),
        paymentMethod: 'Prepaid UPI',
        paymentId: paymentId,
        status: 'confirmed',
        waybill: `VESPERA-DLH-${Math.floor(1000000 + Math.random() * 9000000)}`,
        createdAt: new Date().toISOString()
      };
      orders.unshift(newOrder);
      writeOrdersToFile(orders);
    } catch (saveErr) {
      console.error('Failed to persist prepaid order to orders.json:', saveErr);
    }

    // Asynchronously trigger Delhivery booking and email dispatch in the background
    (async () => {
      let waybill = null;
      try {
        waybill = await bookDelhiveryShipment({
          orderReference: order_reference,
          amount: amount,
          notes: notes
        });
      } catch (delhiveryErr) {
        console.error('Error during automatic Delhivery booking execution:', delhiveryErr);
      }

      await sendOrderEmails({
        paymentId: paymentId,
        amount: amount,
        notes: notes,
        waybill: waybill
      });
    })().catch(err => {
      console.error('Failed executing post-payment background sequence:', err);
    });

    return res.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing prepaid order:', error);
    return res.status(500).json({ error: 'Prepaid order failed' });
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
    const paymentId = 'COD_' + order_reference;
    // Parse structured items
    const parsedItems = parseItemDetails(itemDetails);

    // Save order into database
    try {
      const orders = readOrdersFromFile();
      const newOrder = {
        id: order_reference,
        order_reference: order_reference,
        customer: {
          name,
          email,
          phone,
          address,
          pincode,
          city,
          state
        },
        items: parsedItems.length > 0 ? parsedItems : [{ name: items || 'VESPERA Product', size: '50ml', quantity: 1, price: amount }],
        itemsSummary: items || (parsedItems.map(i => `${i.name} (${i.size}) x ${i.quantity}`).join(', ')),
        totalAmount: Number(amount) + Number(discount_amount || 0),
        discountAmount: Number(discount_amount || 0),
        couponCode: coupon_code || null,
        finalAmount: Number(amount),
        paymentMethod: 'Cash on Delivery',
        paymentId: paymentId,
        status: 'processing',
        waybill: null,
        createdAt: new Date().toISOString()
      };
      orders.unshift(newOrder);
      writeOrdersToFile(orders);
    } catch (saveErr) {
      console.error('Failed to persist COD order to orders.json:', saveErr);
    }

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
  console.log(`VESPERA Backend Server running on http://0.0.0.0:${PORT}`);
});
