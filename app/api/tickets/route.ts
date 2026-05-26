import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { transporter } from '@/utils/nodemailer';

export const runtime = 'nodejs'; 
export const dynamic = 'force-dynamic'; 

export async function POST(request: Request) {
  try {
    // 1. Structural Guard Check: Ensure support target configuration parameters exist in memory
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID || !process.env.SUPPORT_TEAM_EMAIL) {
      console.error("🚨 CONFIGURATION FAILURE: Missing variables inside environment matrix.");
      return NextResponse.json(
        { success: false, error: "System authentication variables are missing on the hosting platform." }, 
        { status: 500 }
      );
    }

    // 2. Parse the incoming multi-item battery data array and customer specifications
    const body = await request.json();
    const { 
      items, modelName, customerName, userEmail, country, customerNo, 
      dealerNo, address, state, district, tehsil, pincode, 
      problemInSystem, coordinates 
    } = body;

    // Strict validation verification check to protect integrity of row insertions
    if (!customerName || !customerNo || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Mandatory portal validation parameters missing.' }, 
        { status: 400 }
      );
    }

    // 3. Generate Official Government-Style Ticket Token & Capture Timestamp
    const ticketId = `NOC-BATT-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 4. Flatten dynamic sub-arrays into single comma-separated strings for clean row storage
    const serialsSeparated = items.map((i: any) => i.serialNumber).join(', ');
    const warrantiesSeparated = items.map((i: any) => i.warrantyStatus).join(', ');
    const datesSeparated = items.map((i: any) => i.purchaseDate).join(', ');
    const coordinateString = coordinates ? `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}` : 'Not Provided';

    // 5. Initialize Google Sheets Secure JWT Access Handshake (With Safe Compilation Fallbacks)
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.replace(/^['"]|['"]$/g, '') || '';
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/^['"]|['"]$/g, '') || '';
    const targetSpreadsheetId = process.env.GOOGLE_SHEET_ID?.replace(/^['"]|['"]$/g, '') || '';
    const supportEmail = process.env.SUPPORT_TEAM_EMAIL?.replace(/^['"]|['"]$/g, '') || '';

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 6. Append System Diagnostics directly to the sheet database ledger matrix (Columns A to P)
    await sheets.spreadsheets.values.append({
      auth, 
      spreadsheetId: targetSpreadsheetId,
      range: 'Sheet1!A:P',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          timestamp, 
          ticketId, 
          customerName, 
          customerNo, 
          modelName, 
          serialsSeparated, 
          warrantiesSeparated, 
          datesSeparated, 
          state, 
          district, 
          tehsil, 
          pincode, 
          address, 
          problemInSystem, 
          coordinateString,
          'Open' // Default tracking state value row
        ]],
      },
    });

    // 7. Dynamic asset row generation helper used inside both target HTML structures
    const tableRowsHtml = items.map((item: any) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-family: monospace; color: #0f172a;">${item.serialNumber}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">${item.warrantyStatus}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">${item.purchaseDate}</td>
      </tr>
    `).join('');

    const textFallbackMetrics = items.map((item: any, idx: number) => 
      `Asset ${idx + 1}: Serial: ${item.serialNumber} (${item.warrantyStatus})`
    ).join('\n');

    // 8. EMAIL CONFIGURATION A: Official Acknowledgment Receipt for the Customer
    const customerMailOptions = {
      from: `"National Battery Support Desk" <${process.env.SMTP_EMAIL}>`,
      to: userEmail || `${customerNo}@national-battery-portal.in`, 
      subject: `OFFICIAL COMPLAINT ACKNOWLEDGEMENT: REQ-${ticketId}`,
      text: `OFFICIAL NOTIFICATION\n\nGrievance Token logged under unique reference ID: ${ticketId}.\nRegistered on: ${timestamp}\nCustomer Name: ${customerName}\n\nEquipment Diagnostics:\n${textFallbackMetrics}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 2px solid #1e3a8a; padding: 0; color: #334155; background-color: #ffffff;">
          <div style="background-color: #1e3a8a; color: #ffffff; padding: 16px; text-align: center;">
            <h2 style="margin: 0; font-size: 18px; letter-spacing: 1px; font-weight: bold;">NATIONAL BATTERY CENTRAL REGISTRY & SUPPORT</h2>
            <p style="margin: 4px 0 0 0; font-size: 11px; opacity: 0.8; font-family: sans-serif;">Grievance Redressal & Warranty Management System</p>
          </div>
          
          <div style="padding: 24px;">
            <p style="font-size: 14px; margin-top: 0;">Dear Customer, this confirms that your equipment system failure details have been logged on <strong>${timestamp}</strong>.</p>
            
            <table style="width: 100%; margin: 20px 0; border-collapse: collapse; font-size: 13px;">
              <tr style="background-color: #f8fafc;">
                <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; width: 35%;">Grievance Token ID</td>
                <td style="padding: 10px; border: 1px solid #cbd5e1; font-family: monospace; font-weight: bold; color: #1e3a8a; font-size: 14px;">${ticketId}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Battery Class Subtype</td>
                <td style="padding: 10px; border: 1px solid #cbd5e1;">${modelName}</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Reported Diagnostic Status</td>
                <td style="padding: 10px; border: 1px solid #cbd5e1; color: #b91c1c;"><strong>${problemInSystem}</strong></td>
              </tr>
            </table>

            <h4 style="color: #1e3a8a; margin: 24px 0 8px 0; font-size: 13px; text-transform: uppercase;">Linked Power Assets Matrix</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;">
              <thead>
                <tr style="background-color: #334155; color: #ffffff;">
                  <th style="padding: 8px; border: 1px solid #cbd5e1;">Hardware Serial String</th>
                  <th style="padding: 8px; border: 1px solid #cbd5e1;">Warranty Parameter</th>
                  <th style="padding: 8px; border: 1px solid #cbd5e1;">Invoice Allocation Date</th>
                </tr>
              </thead>
              <tbody>${tableRowsHtml}</tbody>
            </table>
            <p style="font-size: 12px; color: #64748b; margin-top: 20px;">A service representative from our field operations desk will evaluate these profile parameters and contact you shortly.</p>
          </div>
        </div>
      `,
    };

    // 9. EMAIL CONFIGURATION B: Internal High-Priority Action Alert for your Support Team
    const supportMailOptions = {
      from: `"Portal Action Dispatcher" <${process.env.SMTP_EMAIL}>`,
      to: supportEmail,
      subject: `🚨 CRITICAL SERVICE REQUIRED: [${ticketId}] - ${customerName}`,
      text: `NEW INCIDENT DISPATCH URGENT\n\nTicket: ${ticketId}\nCustomer: ${customerName}\nPhone: ${customerNo}\nProblem: ${problemInSystem}\nAddress: ${address}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 2px solid #b91c1c; padding: 0; color: #334155; background-color: #ffffff;">
          <div style="background-color: #b91c1c; color: #ffffff; padding: 16px; text-align: center;">
            <h2 style="margin: 0; font-size: 18px; font-weight: bold;">🚨 ACTION REQUIRED: NEW INCIDENT LOGGED</h2>
            <p style="margin: 4px 0 0 0; font-size: 11px; opacity: 0.9;">Please review parameters and assign an operations engineer row.</p>
          </div>
          
          <div style="padding: 24px;">
            <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse; font-size: 13px;">
              <tr style="background-color: #fef2f2;">
                <td style="padding: 10px; border: 1px solid #fca5a5; font-weight: bold; width: 35%; color: #991b1b;">Assigned Ticket ID</td>
                <td style="padding: 10px; border: 1px solid #fca5a5; font-family: monospace; font-weight: bold; color: #b91c1c; font-size: 14px;">${ticketId}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Customer Name</td>
                <td style="padding: 10px; border: 1px solid #cbd5e1;">${customerName}</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Contact Number</td>
                <td style="padding: 10px; border: 1px solid #cbd5e1; font-family: monospace; font-weight: bold;">${customerNo}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Customer Email</td>
                <td style="padding: 10px; border: 1px solid #cbd5e1;">${userEmail || 'Not Provided'}</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Failure Classification</td>
                <td style="padding: 10px; border: 1px solid #cbd5e1; color: #b91c1c; font-weight: bold;">${problemInSystem}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Installation Site</td>
                <td style="padding: 10px; border: 1px solid #cbd5e1; line-height: 1.4;">${address}<br /><strong>Region Details:</strong> ${tehsil}, ${district}, ${state} - [${pincode}]</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">GPS Coordinates</td>
                <td style="padding: 10px; border: 1px solid #cbd5e1; font-family: monospace; color: #2563eb;">${coordinateString}</td>
              </tr>
            </table>

            <h4 style="color: #334155; margin: 24px 0 8px 0; font-size: 12px; font-weight: bold; text-transform: uppercase;">Target Hardware Stacks Component Inventory</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;">
              <thead>
                <tr style="background-color: #475569; color: #ffffff;">
                  <th style="padding: 8px; border: 1px solid #cbd5e1;">Hardware Serial String</th>
                  <th style="padding: 8px; border: 1px solid #cbd5e1;">Warranty Coverage</th>
                  <th style="padding: 8px; border: 1px solid #cbd5e1;">Purchase Date</th>
                </tr>
              </thead>
              <tbody>${tableRowsHtml}</tbody>
            </table>
          </div>
        </div>
      `,
    };

    // 10. Execute parallel multi-threaded dual-channel mailing dispatches simultaneously
    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(supportMailOptions)
    ]);

    // 11. Return clean success data layout block back to frontend router scope
    return NextResponse.json({ success: true, ticketId });

  } catch (error: any) {
    console.error('System registration pipeline collapse:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal system processing error.' }, 
      { status: 500 }
    );
  }
}