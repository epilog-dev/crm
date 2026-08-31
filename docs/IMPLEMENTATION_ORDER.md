# Product Roadmap & Implementation Order

This document outlines the recommended step-by-step roadmap for building the **Plum** Instagram DM → Order Management SaaS.

---

## 🎯 Phase 1: Core MVP (Minimum Viable Product)
*Goal: Get a seller from an Instagram DM conversation to a confirmed, paid order as quickly as possible with zero unnecessary overhead.*

### Step 1: Base Shell & Layout Architecture
- Establish standard dashboard layout with collapsed/expandable sidebar navigation (`/`, `/inbox`, `/orders`, `/customers`, `/settings`).
- Configure light/dark mode theme support with distinct sidebar shading for contrast.
- Setup core state composable (`useSellerSettings.ts`) for store preferences (UPI VPA, COD toggle).

### Step 2: Instagram Business API & Settings Page (`/settings`)
- Build Meta API connection interface for Instagram Professional accounts.
- Implement seller UPI QR configuration (`retrothrift@upi`) and Cash on Delivery (COD) enable/disable toggle.
- Display Meta webhook diagnostic status indicators.

### Step 3: Sales DM Inbox & 1-Click Order Link Creation (`/inbox`)
- Create 2-column DM chat workspace (Conversation Stream list ↔ Active DM thread view).
- Implement `[ + Create Order ]` modal auto-filling customer `@handle`, item, variant, and price.
- Generate unique public order link (`/order/:id`) and post it into the DM conversation.
- Add quick canned reply chips (`📦 In Stock?`, `🚚 Delivery Time`, `💳 Payment Info`).

### Step 4: Standalone Customer Order Link Page (`/order/:id`)
- Build standalone checkout page without admin sidebar or navigation header (`layout: false`).
- Implement customer delivery form (Full Name, Mobile Number, Shipping Address, Pincode).
- Build dynamic payment selector:
  - **Pay Now**: Displays seller UPI QR code + screenshot receipt uploader.
  - **COD**: Available only if enabled by seller settings.
- Implement customer order tracking progress bar (`Confirmed` → `Awaiting Payment` → `Paid` → `Shipped` → `Delivered`).

### Step 5: Orders Workspace & 1-Tap Shipping Labels (`/orders`)
- Build Order Pipeline table with status indicators (`Confirmed`, `Awaiting Payment`, `Paid`, `Shipped`, `Delivered`, `Cancelled`).
- Implement Order Details Slideover:
  - Manual payment status toggle (`Pending` ↔ `Paid`).
  - Order status dropdown.
- Build 1-Tap `[ Print Shipping Slip ]` modal generating 4x6 inch labels formatted for polybag shipping.

---

## 🚀 Phase 2: High-Value Usability & Efficiency Features
*Goal: Remove daily operational friction for power sellers processing dozens of orders daily.*

### Step 6: Kanban Pipeline & High-Volume View (`/orders`)
- Add **Table View ↔ Kanban Board** toggle switch.
- Build vertical column scrolling and horizontal overflow support for managing high order volumes.
- Implement drag-and-drop or status shift controls.

### Step 7: DM Inbox Productivity & Customer Context (`/inbox`)
- Add **Customer Delivery Summary Banner** at top of DM thread when an order is linked.
- Add inline **`[ 📋 Copy Order Link ]`** button on order message bubbles.
- Add repeat customer badges (`+1`, `+2`) for buyers placing multiple orders.
- Add direct `[ Message on Instagram ]` shortcut buttons (`https://instagram.com/direct/t/:handle`).

### Step 8: Courier Logistics & Address Helpers (`/orders`)
- Add **`[ 📋 Copy Address ]`** 1-click button to format name, phone, address, and pincode for pasting into Dunzo/Porter/Delhivery.
- Add **`[ 📍 Maps Search ]`** button opening Google Maps pre-filled with the buyer's pincode & address.

### Step 9: Customers Directory CRM (`/customers`)
- Build customer database automatically populated from confirmed order links.
- Implement auto-responsive rendering (Touch Profile Cards on small screens, Data Table on large screens).

---

## ✨ Phase 3: Engagement, Focus & Growth Features
*Goal: Prevent seller burnout and drive viral word-of-mouth growth for the platform.*

### Step 10: ✨ Focus Mode Dashboard (`/`)
- Implement **Focus Mode** toggle switch to hide all analytics noise, charts, and metrics.
- Replace dashboard with a clean 2-action launchpad (*1. Reply & Create Orders*, *2. Fulfill & Ship*).
- Build 4-step Seller Setup Progress Checklist with dynamic progress bar.

### Step 11: 🏆 Seller Gamification & Milestone Badges (`/`)
- Implement Seller Tier Ranks (Emerging Seller ➔ DM Pro ➔ Power Store ➔ Instagram Elite).
- Build unlockable achievement badges (*First DM Order*, *Fast Converter*, *Power Store*, *100 DM Club*).
- Build **Shareable Instagram Story Badge Modal**:
  - Formatted graphic card optimized for screenshotting & posting to Instagram Stories.
  - Generates viral referral word-of-mouth for the SaaS platform.

### Step 12: Real-Time Notifications Slideover (Global Layout)
- Build notifications drawer in top navbar with unread counters.
- Add live updates for payment uploads, address confirmations, and Meta webhooks.
- Implement auto-close behavior when clicking `[ View Details → ]`.
