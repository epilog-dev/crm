<script setup lang="ts">
definePageMeta({ layout: false, auth: false })

const supabase = useSupabaseClient()
const router = useRouter()

const state = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})
const loading = ref(false)
const error = ref('')
const success = ref('')

async function register() {
  error.value = ''
  success.value = ''

  if (state.password !== state.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true

  const { error: err } = await supabase.auth.signUp({
    email: state.email,
    password: state.password
  })

  loading.value = false

  if (err) {
    error.value = err.message
  } else {
    success.value = 'Check your email for a confirmation link!'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold">Create an account</h1>
          <p class="text-sm text-gray-500 mt-1">Get started for free</p>
        </div>
      </template>

      <UForm :state="state" class="space-y-4" @submit="register">
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

        <UFormField label="Confirm Password" name="confirmPassword">
          <UInput
            v-model="state.confirmPassword"
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

        <UAlert
          v-if="success"
          color="success"
          variant="soft"
          :description="success"
        />

        <UButton type="submit" block :loading="loading">
          Create Account
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-gray-500">
          Already have an account?
          <NuxtLink to="/login" class="text-primary font-medium hover:underline">
            Sign in
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
