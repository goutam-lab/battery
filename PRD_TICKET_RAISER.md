# Product Requirement Document (PRD)

## Project Overview
A lightweight, zero-maintenance, free-to-operate support ticketing pipeline built for a client without access to a custom brand domain or dedicated IT infrastructure. The system leverages accessible consumer frameworks to log requests and immediately reassure end-users with structured automation.

---

## 👥 User Personas & Core Journeys

### 1. The Submitting User (Customer/End-user)
* **Goal:** Log a software or service issue quickly and receive confirmation that their problem is being addressed.
* **Journey:** Visits the webpage -> Submits details -> Receives an instant Ticket ID on screen -> Finds an confirmation notification receipt waiting in their email inbox.

### 2. The Operations Manager (Your Client)
* **Goal:** A simple, organized view to check incoming incidents without needing to learn complex databases or backend dashboards.
* **Journey:** Opens a standard shared Google Sheets bookmark on desktop or mobile -> Reviews new ticket rows -> Standardizes categorization and status tracking directly inside the cells.

---

## 📋 Functional Requirements

### Functional Module 1: The Public Ticket Interface
* **FR-1.1:** The user interface must present fields for Full Name, Valid Email Address, and Description of Issue.
* **FR-1.2:** The form must execute local client validation checks to ensure email strings match standard syntactic structures (`user@domain.com`) before triggering network calls.
* **FR-1.3:** The layout must adapt across mobile, tablet, and desktop viewports.

### Functional Module 2: The Google Sheets Storage Engine
* **FR-2.1:** The platform must automatically append incoming data points sequentially into rows to avoid overwriting existing logged incidents.
* **FR-2.2:** Every entry must log a standardized chronological timestamp (HH:MM:SS / DD-MM-YYYY format) capturing exactly when the user submitted the data.
* **FR-2.3:** A default state value text string reading `"Open"` must be written to the status column automatically upon row initialization.

### Functional Module 3: The Automated Email System
* **FR-3.1:** The email sender configuration must route exclusively through a free Google SMTP channel utilizing an App Password layer to maintain structural security.
* **FR-3.2:** The output confirmation template must contain the specific user's name and unique Ticket ID.

---

## 📉 Non-Functional Requirements & Constraints

* **Cost Boundaries:** The operational layout of all third-party services used (Vercel deployment hosting, Cloud APIs, Gmail transport pipes) must fall strictly inside their respective **$0/month free-tier brackets**.
* **Traffic Thresholds:** The architecture must cap gracefully at a ceiling constraint of **500 individual email dispatches per 24-hour cycle** (enforced by Google's SMTP limits).
* **Security & Token Isolation:** No plain-text access tokens, service accounts, or application passwords may be written into client-accessible files. They must live completely inside environment configuration panels.