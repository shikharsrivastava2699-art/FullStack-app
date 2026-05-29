import type { Make } from "../types/make"

export async function fetchMakes(): Promise<Make[]> {
  const response = await fetch('/api/v1/makes')

  if (!response.ok) {
    throw new Error(`Failed to fetch makes: ${response.status}`)
  }

  const payload = await response.json()

  if (!payload?.success || !Array.isArray(payload.data?.makes)) {
    throw new Error('Unexpected API response format')
  }

  return payload.data.makes as Make[]
}
