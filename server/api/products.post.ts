interface VariantInput {
  label: string
  sku?: string
  price?: number
  stock?: number
  attributes?: Record<string, unknown>
}

export default defineEventHandler(async (event) => {
  const { client, store } = await requireStore(event)

  const body = await readBody(event)
  const { title, description, base_price, currency, image_url, attributes, variants } = body

  if (!title) {
    throw createError({ statusCode: 400, message: 'title is required' })
  }

  const { data: product, error } = await client
    .from('products')
    .insert({
      store_id: store.id,
      title,
      description: description ?? null,
      base_price: base_price ?? null,
      currency: currency || 'INR',
      image_url: image_url ?? null,
      attributes: attributes ?? {}
    })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  let insertedVariants: unknown[] = []
  if (Array.isArray(variants) && variants.length) {
    const rows = (variants as VariantInput[]).map((v) => ({
      product_id: product.id,
      store_id: store.id,
      label: v.label,
      sku: v.sku ?? null,
      price: v.price ?? null,
      stock: v.stock ?? 0,
      attributes: v.attributes ?? {}
    }))

    const { data: variantData, error: variantError } = await client
      .from('product_variants')
      .insert(rows)
      .select()

    if (variantError) {
      throw createError({ statusCode: 500, message: variantError.message })
    }
    insertedVariants = variantData ?? []
  }

  return { ...product, product_variants: insertedVariants }
})
