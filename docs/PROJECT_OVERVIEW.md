# Instagram DM → Order Management Workspace (Plum CRM)

## Executive Summary

**Plum** is a lightweight, dedicated sales workspace built specifically for small Instagram sellers (thrift stores, clothing boutiques, handmade craft shops, customized gifts, etc.) who take orders directly through Instagram DMs.

---

## 🎯 The Core Problem

Small Instagram sellers face a common operational bottleneck:

1. **Overwhelm in Instagram DMs**: High-intent buyer inquiries get buried under casual comments, price questions, and spam.
2. **Friction of Traditional Storefronts**: Forcing Instagram buyers to leave Instagram, navigate a website, add to cart, and create an e-commerce account leads to high drop-off rates.
3. **Manual Copy-Pasting**: Sellers spend hours manually asking for delivery addresses, copying pincodes into notes apps, and tracking bank/UPI transfers in Excel sheets.
4. **Order Tracking Confusion**: Buyers constantly message *"Did my order ship?"* or *"When will it arrive?"*, creating unnecessary DM clutter.

---

## 💡 Our Product Philosophy

> **"Instagram is where customers discover products and start sales conversations. Our app is where sellers manage the conversation and turn confirmed buyers into organized orders."**

- **No Product Catalog Needed**: Sellers don't need to upload photos, set inventory levels, or maintain a website storefront.
- **No Payment Gateway Fees**: Money is paid directly to the seller via their normal payment methods (UPI QR scan, Bank Transfer, or Cash on Delivery).
- **Zero Friction for Buyers**: The customer stays in their Instagram DM until they say *"I'll take it"*, at which point they receive a simple, unique 1-click order link.

---

## 🔄 End-to-End Workflow

```
[1. Discovery] ──> Customer sees a product post on Instagram
      │
[2. Inquiry]   ──> Customer DMs seller: "How much for the Nike Jacket in Medium?"
      │
[3. Sync]      ──> DM appears live in Plum Inbox via Meta Instagram Professional API
      │
[4. Chat]      ──> Seller chats with buyer from Plum Inbox using Quick Reply Snippets
      │
[5. Intent]    ──> Customer says: "I'll take it."
      │
[6. Order]     ──> Seller clicks [+ Create Order] inside Plum Inbox
      │               • Auto-attaches buyer handle (@maria)
      │               • Seller enters: Item: Nike Jacket (M) | Price: ₹1,500
      │               • App generates unique link: https://crm.app/order/ORD-1082
      │
[7. Link DM]   ──> Order link is posted directly into the Instagram DM conversation
      │
[8. Confirm]   ──> Customer opens link on mobile and enters:
      │               • Full Name & Phone Number
      │               • Shipping Address & Pincode
      │               • Selects Payment Method: Pay Now (UPI QR + Screenshot) OR Cash on Delivery
      │
[9. Fulfill]   ──> Seller sees confirmed order in Orders Dashboard / Kanban:
      │               • Verifies payment screenshot / COD preference
      │               • Updates status: Confirmed ➔ Awaiting Payment ➔ Paid ➔ Shipped ➔ Delivered
      │               • Clicks [Print Shipping Slip] for 4x6 courier polybag label
      │
[10. Tracking] ──> Customer re-opens their order link anytime to check live fulfillment status
```

---

## 🏗️ Core Application Modules

### 1. Unified Instagram DM Sales Inbox
A dedicated workspace for direct messages synced via Meta's Instagram Professional Webhook API.
- **Key Features**: Chat stream, quick canned reply snippets (`📦 In Stock?`, `🚚 Delivery Time`), `[ + Create Order ]` modal, linked order history badges for repeat buyers, and direct `[ Message on Instagram ]` links.

### 2. Standalone Customer Order Link (`/order/:id`)
A mobile-optimized, standalone customer checkout page (rendered without admin layout chrome).
- **Key Features**: Product summary, delivery address form, UPI QR payment screen with screenshot receipt uploader, optional COD selector, and live order tracking progress bar.

### 3. Orders Workspace & Fulfillment Dashboard
A management hub for tracking sales pipeline states (`Confirmed`, `Awaiting Payment`, `Paid`, `Shipped`, `Delivered`, `Cancelled`).
- **Key Features**: Dual Table ↔ Kanban views, slideover order details with 1-click address copying and Google Maps location search, and 1-tap printable 4x6 inch thermal shipping labels.

### 4. Sales Overview & ✨ Focus Mode Dashboard
A high-level dashboard balancing sales metrics with seller well-being.
- **Key Features**: Total DM Sales (₹), pending payment trackers, DM-to-Order conversion rate, an interactive 4-step onboarding checklist, and an ADHD-friendly **Focus Mode** toggle that hides all charts to leave a clean 2-action launchpad.

### 5. Customers CRM Directory
A directory of all confirmed Instagram DM buyers.
- **Key Features**: Auto-responsive view switching (touch profile cards on mobile, complete data table on desktop) tracking order counts, lifetime value, phone numbers, and delivery addresses.

---

## 🚫 Scope Boundaries (What We Don't Do)

To maintain extreme focus and simplicity, the platform explicitly avoids:
- ❌ Online e-commerce storefronts or catalogs
- ❌ Payment gateway integration fees (Razorpay, Stripe, etc.)
- ❌ Automatic AI order detection
- ❌ Inventory management or warehouse tracking
- ❌ Automatic courier API integrations

---

## 📈 Summary Value Proposition

> **"Stop losing sales in your Instagram DMs."**
>
> Plum provides Instagram sellers with a dedicated, distraction-free workspace that sits cleanly between Instagram DMs and courier fulfillment.
