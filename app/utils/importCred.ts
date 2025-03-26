import { saveRaw } from './googleDrive'

interface ProcessResult {
  success: boolean
  error?: string
  file?: {
    id: string
  }
}

export async function importCredential(
  url: string,
  accessToken: string | undefined
): Promise<ProcessResult> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch URL: ${response.statusText}`
      }
    }

    const content = await response.text()
    const jsonData = JSON.parse(content)
    const file = await saveRaw(accessToken, jsonData)
    return {
      success: true,
      file: file
    }
  } catch (e) {
    return {
      success: false,
      error: `${e}`
    }
  }
}
