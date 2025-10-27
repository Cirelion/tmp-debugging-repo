"use server"

import { IErrorResponse, ITextToImage, Runware } from "@runware/sdk-js"

const handleRunwareError = (error: IErrorResponse) => {
  console.error(`Task ${error.taskUUID} failed: ${error.message}`)
  return { error: error.message as string }
}

const runware = new Runware({
  apiKey: process.env.RUNWARE_API_KEY,
  shouldReconnect: true,
  globalMaxRetries: 3,
})

export const generateImage = async (
  model: string,
  positivePrompt: string
): Promise<ITextToImage[] | { error: string }> => {
  try {
    const images = await runware.requestImages({
      model,
      positivePrompt,
      width: 1024,
      height: 1024,
      steps: 50,
    })

    return images || []
  } catch (result) {
    return handleRunwareError((result as Record<string, unknown>).error as IErrorResponse)
  }
}
