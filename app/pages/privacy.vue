<script setup lang="ts">
definePageMeta({ layout: false, auth: false })

useSeoMeta({
  title: 'Privacy Policy — DMSell',
  description: 'What DMSell collects from your Instagram account and your customers, how it is used, and how to delete it.'
})

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'
    }
  ]
})

const route = useRoute()
// Meta's data-deletion callback sends users here with the confirmation code
// we returned, so they can see the request was actioned.
const deletionCode = computed(() => (route.query.deletion as string | undefined) || null)

const lastUpdated = '17 September 2026'
const contactEmail = 'epilogcodes@gmail.com'
</script>

<template>
  <div class="legal min-h-dvh bg-[#f7f5f1] text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
    <header class="border-b border-black/[0.07] dark:border-white/[0.07]">
      <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
        <NuxtLink to="/" class="flex items-center gap-2">
          <LogoMark :size="22" />
          <span class="font-display font-semibold">DMSell</span>
        </NuxtLink>
        <NuxtLink to="/login" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Log in</NuxtLink>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div
        v-if="deletionCode"
        class="mb-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm"
      >
        <p class="font-semibold text-emerald-700 dark:text-emerald-300">Data deletion request received</p>
        <p class="mt-1 text-zinc-700 dark:text-zinc-300">
          Your Instagram connection has been removed and the profile data we held for it has been deleted.
          Confirmation code: <code class="rounded bg-black/5 px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">{{ deletionCode }}</code>
        </p>
      </div>

      <h1 class="font-display text-4xl font-bold tracking-tight sm:text-5xl">Privacy Policy</h1>
      <p class="mt-3 text-sm text-zinc-500 dark:text-zinc-400">Last updated {{ lastUpdated }}</p>

      <div class="prose-legal mt-10 space-y-10 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
        <section>
          <h2>What DMSell is</h2>
          <p>
            DMSell is a workspace for small sellers who sell through Instagram direct messages. When you connect your
            Instagram professional account, DMSell reads the DMs sent to that account, lets you reply from inside DMSell,
            and turns confirmed conversations into orders with a shareable order link.
          </p>
        </section>

        <section>
          <h2>Data we collect</h2>
          <h3>From your account</h3>
          <ul>
            <li>Your email address and password hash, used to sign you in.</li>
            <li>Store settings you enter: store name, UPI ID, and order-form preferences.</li>
          </ul>
          <h3>From Instagram, once you connect it</h3>
          <ul>
            <li>Your Instagram account ID, username, display name, profile picture and follower count.</li>
            <li>An access token that lets DMSell act on your behalf. It is stored server-side only and is never exposed to your browser.</li>
            <li>Direct messages sent to your account and replies you send, including the sender's Instagram username, name and profile picture.</li>
          </ul>
          <h3>From your customers</h3>
          <ul>
            <li>Details a customer enters on an order link you send them: name, phone number, delivery address and pincode, payment method, a UPI reference and, optionally, a payment screenshot.</li>
          </ul>
        </section>

        <section>
          <h2>How we use it</h2>
          <ul>
            <li>To show your Instagram DMs inside DMSell and deliver your replies back to Instagram.</li>
            <li>To create and track orders, and to send the order link into the relevant DM thread when you have enabled that.</li>
            <li>To notify you about new messages, order confirmations and payment uploads.</li>
          </ul>
          <p>
            We do not sell your data or your customers' data, do not use it for advertising, and do not share it with
            third parties except the service providers listed below.
          </p>
        </section>

        <section>
          <h2>Instagram and Meta platform</h2>
          <p>
            DMSell uses the Instagram API with Instagram Login, with the <code>instagram_business_basic</code> and
            <code>instagram_business_manage_messages</code> permissions. Our use of information received from Meta
            APIs adheres to the
            <a href="https://developers.facebook.com/terms/" target="_blank" rel="noopener">Meta Platform Terms</a>
            and <a href="https://developers.facebook.com/devpolicy/" target="_blank" rel="noopener">Developer Policies</a>.
            DMSell does not post content, manage comments or read anything on your account beyond your profile and direct messages.
          </p>
        </section>

        <section>
          <h2>Where it's stored</h2>
          <ul>
            <li><strong>Supabase</strong> — database, authentication and file storage (payment screenshots).</li>
            <li><strong>Vercel</strong> — hosts the application.</li>
            <li><strong>Meta</strong> — Instagram API calls and webhook delivery.</li>
          </ul>
          <p>Data is transmitted over HTTPS and stored with row-level access controls so only members of your store can see your store's data.</p>
        </section>

        <section>
          <h2>Deleting your data</h2>
          <ul>
            <li>
              <strong>Disconnect Instagram</strong> from <em>Settings</em> at any time. This deletes the access token and
              your Instagram profile data from DMSell immediately and stops all message syncing. Removing DMSell from
              <em>Instagram → Settings → Apps and websites</em> has the same effect.
            </li>
            <li>
              <strong>Delete everything</strong> — email <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a> from the
              address you signed up with and we will delete your account, store, conversations, orders and uploaded files within 7 days.
            </li>
          </ul>
        </section>

        <section>
          <h2>Contact</h2>
          <p>Questions about this policy: <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>.</p>
        </section>
      </div>
    </main>

    <footer class="border-t border-black/[0.07] dark:border-white/[0.07]">
      <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-8 text-sm text-zinc-500 dark:text-zinc-400 sm:px-6">
        <span>© {{ new Date().getFullYear() }} DMSell</span>
        <NuxtLink to="/" class="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">Home</NuxtLink>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.legal {
  font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
}
.legal .font-display {
  font-family: 'Bricolage Grotesque', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
}
.prose-legal h2 {
  font-family: 'Bricolage Grotesque', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: rgb(24 24 27);
  margin-bottom: 0.75rem;
}
.dark .prose-legal h2 { color: rgb(244 244 245); }
.prose-legal h3 {
  font-weight: 600;
  color: rgb(39 39 42);
  margin-top: 1rem;
  margin-bottom: 0.25rem;
}
.dark .prose-legal h3 { color: rgb(228 228 231); }
.prose-legal p + p, .prose-legal ul + p { margin-top: 0.75rem; }
.prose-legal ul {
  list-style: disc;
  padding-left: 1.25rem;
}
.prose-legal li + li { margin-top: 0.375rem; }
.prose-legal a {
  color: rgb(124 58 237);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.prose-legal code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85em;
  background: rgb(0 0 0 / 0.05);
  padding: 0.1em 0.35em;
  border-radius: 0.25rem;
}
.dark .prose-legal code { background: rgb(255 255 255 / 0.1); }
</style>
