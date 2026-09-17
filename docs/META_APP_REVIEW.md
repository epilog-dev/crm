# Meta App Review — Instagram messaging permissions

Goal: Advanced Access on `instagram_business_basic` and
`instagram_business_manage_messages` so any Instagram professional account can
connect to DMSell, not only the ≤25 Instagram Testers.

Where: App Dashboard → **App Review → Permissions and Features** → request
Advanced Access on both → fill the submission form. Everything below maps to
that form.

---

## 0. Before you submit (checklist)

- [ ] **Business verification** — App Dashboard → App settings → Basic →
      *Verification*. Needs legal business name, address and one document
      (GST certificate, Udyam registration, or incorporation certificate work
      for India). Reviewers won't grant messaging permissions without it.
- [ ] **App icon** uploaded (1024×1024 PNG, the DMSell logo mark).
- [ ] Privacy policy URL is live: `https://crm-chi-nine-65.vercel.app/privacy` ✔
- [ ] Data deletion callback set: `…/api/instagram/data-deletion` ✔
- [ ] **A reviewer login for DMSell.** Create a normal account at
      `/register` (e.g. `reviewer@yourdomain`), confirm the email, and set a
      strong password. Put it in the "Test credentials" field of the form —
      never anywhere public.
- [ ] At least one real seller (a tester) has used it for a few days, so the
      screencast shows real-looking data — reviewers reject "lorem ipsum" demos.
- [ ] Record the screencast (section 3) as MP4, ≤ 5 min, ≤ 100 MB.

---

## 1. `instagram_business_basic`

**Form field: "Describe how your app uses this permission"**

> DMSell is an order-management workspace for small Instagram sellers in India.
> After a seller connects their Instagram professional account, we use
> `instagram_business_basic` for one purpose: to read the connected account's
> own profile — user ID, username, name, profile picture and follower count —
> so the seller can see which account is linked on the Settings page and so we
> can route incoming webhook notifications to the correct seller by account ID.
> We do not read media, insights, or any other account's data with this
> permission.

**Form field: "Step-by-step instructions for the reviewer"**

> 1. Go to https://crm-chi-nine-65.vercel.app/login and sign in with the test
>    credentials provided.
> 2. Open **Settings** (left sidebar) and click **Connect Instagram**.
> 3. Log in with your Instagram professional account and accept the
>    permissions.
> 4. You are redirected back to Settings. The "Connected Instagram Business
>    Profile" card now shows the account's username, name, profile picture,
>    follower count and connection date — this data is retrieved with
>    `instagram_business_basic`.
> 5. Click **Disconnect Account** to revoke; the card returns to the
>    "Connect your Instagram Account" state and the stored token is deleted.

---

## 2. `instagram_business_manage_messages`

**Form field: "Describe how your app uses this permission"**

> Small sellers on Instagram take orders entirely through DMs and lose track of
> them. DMSell uses `instagram_business_manage_messages` to (a) receive the
> seller's incoming Instagram direct messages via webhooks and display them in
> a unified inbox, (b) let the seller reply to those customers from DMSell, and
> (c) send the customer a link to an order confirmation page inside the same DM
> thread after the seller creates an order from the conversation.
>
> Messages are only ever sent in reply to a customer who has messaged the
> seller first, within Meta's standard messaging window. There is no bulk
> messaging, no automated marketing, and no messaging of users who have not
> contacted the seller. Message content is stored so the seller can see the
> conversation history alongside the order; it is deleted when the seller
> disconnects Instagram or deletes their account.

**Form field: "Step-by-step instructions for the reviewer"**

> 1. Sign in at https://crm-chi-nine-65.vercel.app/login with the test
>    credentials and connect your Instagram professional account from
>    **Settings → Connect Instagram** (see instagram_business_basic).
> 2. From a *second* Instagram account, send a direct message to the connected
>    professional account (e.g. "Hi, is this still available?").
> 3. In DMSell open **Inbox**. Within a few seconds the conversation appears
>    with the sender's username and the message text — received via the
>    `messages` webhook.
> 4. Type a reply in the message box and press Enter. The reply appears in the
>    thread, and arrives in the Instagram app for the second account — sent via
>    the Send API.
> 5. Click **+ Order** in the thread header, enter an item name and price, and
>    click **Create Order**. A message containing the order link is posted to
>    the Instagram DM thread; the second account receives it in Instagram.
> 6. Open the order link from the second account to see the customer-facing
>    confirmation page (no Instagram permissions used here).

---

## 3. Screencast shot list

One continuous recording, screen + phone side by side if possible (QuickTime
on Mac can record the iPhone screen; otherwise pick the phone up on webcam).
Narrate or add captions. Reviewers must *see* each permission being exercised.

| # | On screen | Proves |
|---|---|---|
| 1 | Browser: `/login` → sign in → dashboard. 5 s. | App is real, credentials work |
| 2 | Settings page in the **disconnected** state. Click **Connect Instagram**. | Entry point |
| 3 | Meta's login + consent dialog. **Pause on the permissions list** so both permission names are legible. Click Allow. | User consent |
| 4 | Redirect back to Settings: card shows username, avatar, follower count, "Webhook sync active". Hover/zoom on it. | `instagram_business_basic` |
| 5 | Phone: second IG account sends a DM to the connected account. | Real inbound message |
| 6 | Browser: Inbox — the thread appears live, badge increments, message text visible. | `manage_messages` (receive) |
| 7 | Browser: type a reply, send. Phone: reply arrives in Instagram. Show both. | `manage_messages` (send) |
| 8 | Browser: **+ Order** → fill item/price → Create. Thread shows "Order created … Order link". Phone: same message arrives in IG. | `manage_messages` (send, order flow) |
| 9 | Phone: tap the link → customer order page. Confirm. Browser: order shows as confirmed. | The business purpose |
| 10 | Settings → **Disconnect Account** → card resets. | Data deletion / revocation |

Tips that avoid the common rejections:
- Show the **whole browser window** including the URL bar (they check it's
  the domain in your settings).
- No cuts between step 5 and 7 — they want to see the message go in and come
  out in one take.
- Use a realistic store name and product; avoid "test", "asdf", "lorem".
- Keep English UI; if any Hindi appears, caption it.
- Under 5 minutes. They stop watching.

---

## 4. Data handling questions (asked once per submission)

| Question | Answer |
|---|---|
| Does your app share Platform Data with third parties? | **Yes — service providers only.** Supabase (database, auth, file storage), Vercel (hosting). No data brokers, no advertising partners. |
| Do you use Platform Data for advertising? | No |
| Do you sell Platform Data? | No |
| Do you transfer Platform Data outside of the country? | Yes — Supabase project region + Vercel edge (state the Supabase region shown in your project settings). |
| How do you protect Platform Data? | TLS in transit; encrypted at rest by Supabase; row-level security so each store only reads its own rows; Instagram tokens stored server-side in a table with no client access; secrets in Vercel environment variables. |
| How can users delete their data? | Disconnect Instagram in Settings (immediate token + profile deletion), remove the app from Instagram (deauthorize callback), or the data-deletion callback / email in the privacy policy. |

---

## 5. If it gets rejected

Read the rejection reason literally; they are formulaic. The three that
account for most messaging rejections:

1. **"We couldn't see the permission being used"** → the screencast skipped a
   step in section 3, usually #3 (consent dialog) or #7 (reply arriving on
   the phone). Re-record, resubmit.
2. **"Test credentials didn't work"** → the reviewer account got locked by
   Supabase's email confirmation or the password was rotated. Log in as the
   reviewer yourself right before submitting.
3. **"Business verification required"** → section 0, first item.

Resubmission is unlimited; each round takes ~2–7 days.
