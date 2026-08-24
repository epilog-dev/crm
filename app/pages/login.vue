<script setup lang="ts">
definePageMeta({ layout: false, auth: false })

const supabase = useSupabaseClient()
const router = useRouter()

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
  } else {
    await router.push('/')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
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
