export default defineEventHandler(async (event) => {
  const { store, role } = await requireStore(event)
  return { ...store, role }
})
