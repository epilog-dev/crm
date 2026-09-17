/* eslint-disable @typescript-eslint/no-explicit-any -- realtime rows come in raw */

/**
 * Pops a toast and plays a short chime when a buyer DMs the store. Wired to
 * the realtime `messages` insert stream from the dashboard layout, so it
 * fires on every page -- except when the seller is already looking at that
 * very thread with the tab focused, where a pop would just be noise.
 */

const TOAST_MS = 8000
const PREVIEW_CHARS = 120

// The chime is synthesized with Web Audio rather than shipped as an mp3: no
// asset to load, and an AudioContext unlocked by one user gesture keeps
// working for the rest of the session.
let audioCtx: AudioContext | null = null
let unlockBound = false

function getAudioContext() {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext || (window as any).webkitAudioContext
  if (!Ctor) return null
  if (!audioCtx) audioCtx = new Ctor()
  return audioCtx
}

/** Browsers only let audio start after a gesture; grab the first one and resume. */
function bindAudioUnlock() {
  if (unlockBound || typeof window === 'undefined') return
  unlockBound = true
  const unlock = () => {
    const ctx = getAudioContext()
    if (ctx?.state === 'suspended') ctx.resume().catch(() => {})
  }
  for (const evt of ['pointerdown', 'keydown', 'touchstart']) {
    window.addEventListener(evt, unlock, { passive: true })
  }
}

/** Two rising sine notes with a fast decay -- the classic "message pop". */
export function playDmChime() {
  const ctx = getAudioContext()
  if (!ctx) return
  if (ctx.state === 'suspended') {
    // No gesture yet this session -- nothing we can do, the toast still shows.
    ctx.resume().catch(() => {})
    if (ctx.state === 'suspended') return
  }

  const now = ctx.currentTime
  const master = ctx.createGain()
  master.gain.value = 0.18
  master.connect(ctx.destination)

  const notes: [number, number][] = [[880, 0], [1318.5, 0.11]] // A5 → E6
  for (const [freq, offset] of notes) {
    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    env.gain.setValueAtTime(0, now + offset)
    env.gain.linearRampToValueAtTime(1, now + offset + 0.012)
    env.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.32)
    osc.connect(env).connect(master)
    osc.start(now + offset)
    osc.stop(now + offset + 0.35)
  }
}

export function useDmAlerts() {
  const toast = useToast()
  const route = useRoute()
  const { conversations, activeId, fetchConversations } = useConversations()
  const { fetchNotifications } = useNotifications()

  onMounted(bindAudioUnlock)

  function isViewingThread(conversationId: string) {
    if (typeof document === 'undefined') return false
    return route.path === '/inbox'
      && activeId.value === conversationId
      && document.visibilityState === 'visible'
      && document.hasFocus()
  }

  async function onNewMessage(row: any) {
    if (row.sender !== 'customer') return

    // The webhook inserts the bell notification right after the message, so
    // refresh the slideover instead of waiting for its next poll.
    setTimeout(() => { fetchNotifications().catch(() => {}) }, 800)

    if (isViewingThread(row.conversation_id)) return

    let conversation = conversations.value.find(c => c.id === row.conversation_id)
    if (!conversation) {
      // First DM from a new buyer -- the list refresh is already in flight
      // from applyIncomingMessage, but we need the handle for the toast.
      await fetchConversations({ silent: true }).catch(() => {})
      conversation = conversations.value.find(c => c.id === row.conversation_id)
    }

    playDmChime()

    const body = String(row.body ?? '')
    const preview = body.length > PREVIEW_CHARS ? `${body.slice(0, PREVIEW_CHARS)}…` : body
    const title = conversation ? `${conversation.name} · ${conversation.handle}` : 'New Instagram DM'

    const t = toast.add({
      title,
      description: preview,
      ...(conversation?.avatar
        ? { avatar: { src: conversation.avatar, alt: conversation.name } }
        : { icon: 'i-simple-icons-instagram' }),
      color: 'primary',
      duration: TOAST_MS,
      progress: false,
      actions: [{
        label: 'Open',
        icon: 'i-lucide-reply',
        color: 'primary',
        variant: 'solid',
        size: 'xs',
        onClick: () => {
          toast.remove(t.id)
          navigateTo({ path: '/inbox', query: { c: row.conversation_id } })
        }
      }]
    })
  }

  return { onNewMessage, playDmChime }
}
