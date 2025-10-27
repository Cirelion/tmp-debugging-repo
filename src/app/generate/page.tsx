"use client"

import { useState } from "react"
import Image from "next/image"

import { ITextToImage } from "@runware/sdk-js"

import { generateImage } from "@/lib/runware"

import "../page.css"
import "./generate.css"

interface GenerateResult {
  images?: ITextToImage[]
  error?: string
}

const MODELS = [
  { id: "runware:101@1", name: "FLUX.1 Dev", description: "High-quality FLUX model" },
  {
    id: "bytedance:5@0",
    name: "Seedream 4.0",
    description: "Next-gen multimodal AI model (NOTE: Needs billing first)",
  },
  {
    id: "civitai:133005@782002",
    name: "Juggernaut XL XI",
    description: "Popular SDXL model",
  },
  {
    id: "civitai:4384@128713",
    name: "Dreamshaper v1",
    description: "Stable Diffusion 1.5 model",
  },
]

export default function Generate() {
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<GenerateResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) {
      setResult({ error: "Please enter a prompt" })
      return
    }

    setIsGenerating(true)
    setResult(null)

    try {
      const response = await generateImage(selectedModel, prompt)

      if ("error" in response) {
        setResult({ error: response.error })
      } else {
        setResult({ images: response })
      }
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="generate-main">
      <div className="generate-content">
        <div className="hero-section">
          <h1 className="hero-title">AI Image Generation</h1>
        </div>

        <div className="generation-card">
          <div className="generation-header">
            <h2 className="generation-header-title">
              <svg
                className="generation-header-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Generate Image
            </h2>
          </div>

          <div className="generation-body">
            <form onSubmit={handleSubmit} className="generation-form">
              <div className="form-group">
                <label htmlFor="model" className="form-label">
                  Model
                </label>
                <select
                  id="model"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="form-select"
                  disabled={isGenerating}
                >
                  {MODELS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} - {model.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="prompt" className="form-label">
                  Prompt
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                  className="form-textarea"
                  rows={4}
                  disabled={isGenerating}
                />
              </div>

              <button type="submit" className="submit-button" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <svg className="spinner" viewBox="0 0 24 24">
                      <circle
                        className="spinner-circle"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Generate Image
                  </>
                )}
              </button>
            </form>

            {result && (
              <div className="results-section">
                {result.error ? (
                  <div className="error-card">
                    <svg
                      className="error-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="error-message">{result.error}</p>
                  </div>
                ) : result.images && result.images.length > 0 ? (
                  <div className="images-grid">
                    {result.images.map(
                      (image, index) =>
                        image.imageURL && (
                          <div key={image.imageUUID || index} className="image-card">
                            <Image
                              src={image.imageURL}
                              alt={`Generated image ${index + 1}`}
                              width={1024}
                              height={1024}
                              className="generated-image"
                            />
                            <div className="image-actions">
                              <a
                                href={image.imageURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="image-action-button"
                              >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                                Open
                              </a>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
