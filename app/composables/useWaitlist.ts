export function useWaitlist(source: 'hero' | 'early_access') {
  const email = ref('')
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
  const errorMessage = ref('')

  async function submit() {
    if (status.value === 'loading') return
    const value = email.value.trim()
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      status.value = 'error'
      errorMessage.value = 'Enter a valid email address.'
      return
    }
    status.value = 'loading'
    errorMessage.value = ''
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await $fetch<any>('/api/waitlist', {
        method: 'POST',
        body: { email: value, source }
      })
      status.value = 'success'
    } catch {
      status.value = 'error'
      errorMessage.value = "That didn't go through — try again in a moment."
    }
  }

  return { email, status, errorMessage, submit }
}
