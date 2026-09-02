/* eslint-disable @typescript-eslint/no-explicit-any -- mapping raw Supabase rows */
export interface ProductVariant {
  id: string
  label: string
  price: number | null
  stock: number
}

export interface Product {
  id: string
  title: string
  basePrice: number | null
  currency: string
  imageUrl?: string
  variants: ProductVariant[]
}

function mapProduct(row: any): Product {
  return {
    id: row.id,
    title: row.title,
    basePrice: row.base_price,
    currency: row.currency,
    imageUrl: row.image_url || undefined,
    variants: (row.product_variants || []).map((v: any) => ({
      id: v.id,
      label: v.label,
      price: v.price,
      stock: v.stock
    }))
  }
}

export function useProducts() {
  const products = useState<Product[]>('products', () => [])
  const pending = useState<boolean>('productsPending', () => false)

  async function fetchProducts() {
    pending.value = true
    try {
      const data = await $fetch<any[]>('/api/products')
      products.value = data.map(mapProduct)
      return products.value
    } finally {
      pending.value = false
    }
  }

  return {
    products,
    pending,
    fetchProducts
  }
}
