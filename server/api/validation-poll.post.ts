import { serverSupabaseServiceRole } from '#supabase/server'

const ANSWERS = ['yes', 'maybe', 'no']

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const answer = body?.answer

  if (!ANSWERS.includes(answer)) {
    throw createError({ statusCode: 400, message: 'answer must be yes, maybe or no' })
  }

  let monthlyAmount: number | null = null
  if (answer !== 'no' && body?.monthlyAmount != null) {
    const parsed = Number(body.monthlyAmount)
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100000) {
      throw createError({ statusCode: 400, message: 'monthlyAmount must be between 0 and 100000' })
    }
    monthlyAmount = Math.round(parsed)
  }

  const client = serverSupabaseServiceRole(event)
  const { error } = await client
    .from('pricing_validation_responses')
    .insert({ answer, monthly_amount: monthlyAmount })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { ok: true }
})
