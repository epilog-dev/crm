/** Deep link to the DM thread with a buyer. Accepts handles with or without the leading @. */
export function instagramDmUrl(handle: string) {
  return `https://instagram.com/direct/t/${handle.replace(/^@/, '')}`
}
