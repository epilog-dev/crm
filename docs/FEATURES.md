# Instagram DM → Order Management SaaS Architecture & Features Documentation

## Product Philosophy
> **Core Value Proposition**: *"Turn your Instagram DMs into organized orders."*
>
> Instagram is where customers discover products and start sales conversations. Our application sits directly between Instagram DMs and fulfillment—enabling sellers to turn a confirmed DM into a tracked order without maintaining a separate storefront, catalog, or manual copy-pasting.

- 📌 **Implementation Roadmap**: See [`docs/IMPLEMENTATION_ORDER.md`](file:///Users/moonshiner/Workspace/dummy-projects/crm/docs/IMPLEMENTATION_ORDER.md) for step-by-step build order.

---

## 🚀 Key Implemented Features

### 1. Instagram Business API Integration & Settings
- **Location**: [`app/pages/settings/index.vue`](file:///Users/moonshiner/Workspace/dummy-projects/crm/app/pages/settings/index.vue)
- **Live Status Monitoring**: Displays real-time Meta API Webhook sync status for `@thrift_store_india`.
- **UPI QR & Payment Settings**: Configure Store UPI ID / VPA (`retrothrift@upi`) displayed on customer payment links.
- **Dynamic Cash on Delivery (COD) Toggle**: Allows sellers to enable or disable COD globally. When disabled, forces customers to pay via UPI QR code to prevent RTO (Return-to-Origin) losses.
- **Mandatory Screenshot Toggle**: Option to make payment receipt upload mandatory before order submission.

### 2. Unified DM Sales Inbox
- **Location**: [`app/pages/inbox.vue`](file:///Users/moonshiner/Workspace/dummy-projects/crm/app/pages/inbox.vue)
- **Real-Time DM Conversations**: Integrated Instagram DM list with unread counters and live Meta API indicators.
- **Subtle SVG Chat Doodle Background Pattern**: Custom inline SVG pattern featuring chat speech bubbles, stars, and shopping bag doodles adaptively styled for light mode (`stroke-slate-400 opacity-15`) and dark mode (`stroke-neutral-600 opacity-25`).
- **`[ + Create Order ]` Workflow**: Instant modal auto-attaching buyer handle (`@maria`), item, variant, and price. Generates a unique order link (`/order/ORD-1082`) and posts it directly into the chat.
- **Repeat Customer Support**: Handles multiple order IDs per buyer (`orderIds: ["ORD-1082", "ORD-1042"]`) with repeat buyer badges (`+1`, `+2`).
- **Quick Reply Snippets Bar**: One-tap pre-formatted response chips (`📦 In Stock?`, `🚚 Delivery Time`, `💳 Payment Info`, `⚡ Create Order Link`).
- **Customer Delivery Summary Banner**: Displays confirmed shipping address & phone number right at the top of the chat stream.
- **1-Click Copy Order Link**: Inline floating button on order message bubbles to copy order URLs instantly.
- **Direct Instagram Action**: `[ Message on Instagram ]` button linking directly to `https://instagram.com/direct/t/:handle`.

### 3. Customer Order Link & Confirmation Page (Public Flow)
- **Location**: [`app/pages/order/[id].vue`](file:///Users/moonshiner/Workspace/dummy-projects/crm/app/pages/order/%5Bid%5D.vue)
- **Standalone Layout (`layout: false`)**: Mobile-first public checkout page rendered cleanly without admin sidebars or navigation clutter.
- **Dynamic Payment Selector**: Pay Now (UPI QR Code + Screenshot Upload) vs Cash on Delivery (COD). Dynamically hides COD option if disabled in Seller Settings.
- **Real-Time Order Tracking Timeline**: Visual progress steps (`Confirmed` → `Awaiting Payment` → `Paid` → `Shipped` → `Delivered`).

### 4. Orders Workspace & Fulfillment Dashboard
- **Location**: [`app/pages/orders/index.vue`](file:///Users/moonshiner/Workspace/dummy-projects/crm/app/pages/orders/index.vue)
- **Dual View Modes (Table ↔ Kanban)**: Instant toggle between a full Data Table and a visual Kanban Board with drag-and-drop status progression.
- **High-Volume Kanban Optimization**: Independent vertical scrolling per column and horizontal overflow handling.
- **Order Management Slideover**:
  - Manual Payment Status toggle (`Pending` ↔ `Paid`).
  - Order Lifecycle selector (`Confirmed`, `Awaiting Payment`, `Paid`, `Shipped`, `Delivered`, `Cancelled`).
  - Direct `[ DM on Instagram ]` action button.
  - 1-Click `[ 📋 Copy Address ]` (for courier apps like Delhivery, Dunzo, Porter).
  - 1-Click `[ 📍 Maps Search ]` (opens Google Maps with buyer address & pincode).
- **1-Tap Printable Shipping Slips**: Contextual modal generating 4x6 inch shipping labels formatted for polybags and thermal printers.

### 5. Sales Dashboard, Focus Mode & Seller Gamification
- **Location**: [`app/pages/index.vue`](file:///Users/moonshiner/Workspace/dummy-projects/crm/app/pages/index.vue)
- **✨ Focus Mode (ADHD-Friendly Minimalist View)**: Toggle switch that hides all metrics, charts, and clutter—replacing the dashboard with a clean 2-action launchpad (*1. Reply & Create Orders*, *2. Fulfill & Ship*).
- **🏆 Seller Rank & Tiers**: Progress sellers through zero-cost ranks based on completed order milestones:
  - 🌱 **Tier 1: Emerging Seller** (0–10 Orders)
  - 🥈 **Tier 2: DM Pro** (10–30 Orders)
  - 🥇 **Tier 3: Power Store** (30–100 Orders)
  - 👑 **Tier 4: Instagram Elite** (100+ Orders)
- **🏅 Unlockable Achievement Badges**: Earn milestone badges (*First DM Order*, *Fast Converter*, *Power Store*, *100 DM Club*).
- **📲 Shareable Instagram Story Graphics Modal**: Sellers can click `[ Share to IG Story 📲 ]` on any unlocked badge to open a beautifully styled graphic card optimized for screenshotting & posting to their store's Instagram Story (driving viral word-of-mouth growth for Plum).
- **Seller Setup Progress Checklist**: Interactive 4-step checklist with a dynamic percentage progress bar (`3 of 4 Completed - 75%`).
- **KPI Metrics Grid**: Live tracking of Total Sales (₹), Pending Payments, Conversion Rate (DM → Order), and Active DM counters.

### 6. Customers CRM Directory
- **Location**: [`app/pages/customers.vue`](file:///Users/moonshiner/Workspace/dummy-projects/crm/app/pages/customers.vue)
- **Auto Responsive Views**: Renders as touch-friendly profile cards on small screens (`< lg`) and expands into a full data table on larger screens (`≥ lg`).
- **Buyer Insights**: Track purchase history, total value spent, phone numbers, and saved shipping addresses.

### 7. Layout & Navigation UX
- **Location**: [`app/layouts/default.vue`](file:///Users/moonshiner/Workspace/dummy-projects/crm/app/layouts/default.vue) & [`app/composables/useNavigation.ts`](file:///Users/moonshiner/Workspace/dummy-projects/crm/app/composables/useNavigation.ts)
- **Restored Plum Brand Identity**: Clean sidebar header with Plum logo (`P`).
- **Sidebar Background Contrast**: Subtle neutral shading in light mode (`bg-neutral-100/70`) and dark mode (`dark:bg-neutral-900/90`).
- **Numeric Activity Badges**: Clean color-coded counters on navigation items (`Inbox: 8`, `Orders: 3`, `Connect Instagram: ✓`).
- **Live Notifications Slideover**: Full notifications drawer with unread badges, mark-all-as-read, dismiss actions, and auto-closing on link clicks.

---

## ❌ Explicitly Omitted (Not in MVP Scope)
- ❌ Product Catalog / E-commerce storefront
- ❌ Payment Gateways (Razorpay/Stripe/UPI auto-verification)
- ❌ AI Order Detection
- ❌ Courier / Inventory API integrations
