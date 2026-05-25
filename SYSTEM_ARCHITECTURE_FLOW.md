# Ticket Raiser System: Technical Architecture & Lifecycle Flow

This document details the software engineering components and structural flow of data for the Serverless Ticket Raising application built using Next.js.

## 🛠️ The Tech Stack

| Component | Technology | Selection Rationale | Cost |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | High performance via React Server Components, unified backend API routing. | Free |
| **Styling** | Tailwind CSS | Utility-first styling enabling fast, responsive UI prototyping. | Free |
| **Database** | Google Sheets API v4 | Zero-cost storage layer giving the client an instant, familiar workspace. | Free |
| **Email Relay** | Nodemailer + Gmail SMTP | Bypasses custom domain restrictions; delivers up to 500 emails per day securely. | Free |

---

## 🔄 End-to-End Execution Flow

Below is the step-by-step lifecycle of an issue tracking execution, mapping out how the system handles operations across systems:

### Phase 1: Client Ingestion (Frontend)
1. The user inputs their details (`userName`, `userEmail`, `ticketTitle`) into the responsive Tailwind form component.
2. The React layer interceptor blocks normal web-refresh behavior upon submission.
3. The component serializes the text inputs into a structured JSON payload and executes a secure asynchronous JavaScript `POST` fetch command directed to the `/api/tickets` service router.

### Phase 2: Processing & Data Mutation (Backend Serverless Route)
4. The server receives the runtime execution request environment payload.
5. The API endpoint executes validation sanity checks on values to prevent blank entries.
6. A randomized alphanumeric incident reference hash is programmatically compiled (e.g., `INC-83921`).
7. The system establishes a secure `JWT` authentication handshake with Google Cloud Systems using the project's encoded Private Keys.
8. The system executes a `values.append()` structural update command to insert the timestamp, tracking ID, and customer issues directly into the linked Google Sheet as a brand new rows block.

### Phase 3: Outbound Notification & Success Validation
9. Nodemailer initializes a secure TLS socket connection with Google's physical outbound relay node (`smtp.gmail.com`) using the secure account application credentials.
10. The system compiles the dynamic HTML boilerplate email containing the transaction reference hash and submits it to Google for regional delivery routing.
11. The server API drops down an HTTP code `200 Success` array back down to the user's browser runtime.
12. The client interface cleanly unmounts the interactive data form view and displays a success confirmation module including a manual action copy button for the issued reference hash.