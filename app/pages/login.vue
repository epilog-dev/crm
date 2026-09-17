<script setup lang="ts">
definePageMeta({ layout: false, auth: false, guestOnly: true })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const route = useRoute()

// Only follow same-origin paths from ?redirect= -- never an absolute URL.
const redirectTo = computed(() => {
  const r = route.query.redirect
  return typeof r === 'string' && r.startsWith('/') && !r.startsWith('//') ? r : '/app'
})

const state = reactive({
  email: '',
  password: ''
})
const loading = ref(false)
const error = ref('')

async function signIn() {
  loading.value = true
  error.value = ''

  const { error: err } = await supabase.auth.signInWithPassword({
    email: state.email,
    password: state.password
  })

  loading.value = false

  if (err) {
    error.value = err.message
    return
  }

  // `useSupabaseUser` is filled in by the auth-state listener a tick after
  // sign-in resolves; navigate only once it's set or the auth middleware
  // would bounce us straight back here.
  if (!user.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(user, (u) => { if (u) { stop(); resolve() } })
    })
  }
  await router.replace(redirectTo.value)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">Welcome back</h1>
          <p class="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>
      </template>

      <UForm :state="state" class="space-y-4" @submit="signIn">
        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="you@example.com"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            class="w-full"
          />
        </UFormField>

        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          :description="error"
        />

        <UButton type="submit" block :loading="loading">
          Sign In
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-gray-500">
          Don't have an account?
          <NuxtLink to="/register" class="text-primary font-medium hover:underline">
            Register
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
