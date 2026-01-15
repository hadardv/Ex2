'use client'

import { useState } from 'react'
import styles from './NewsCard.module.css'

// Define the shape of our repository data
// This matches the data structure from our API
interface NewsCardProps {
  name: string
  description: string | null
  stars: number
  url: string
  language?: string | null
  owner: {
    login: string
    avatar: string
  }
  onOpenSettings: () => void
}

export default function NewsCard({
  name,
  description,
  stars,
  url,
  language,
  owner,
  onOpenSettings,
}: NewsCardProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formattedStars = stars.toLocaleString()

  const handleSummarize = async () => {
    const apiKey = localStorage.getItem('groq_api_key')

    if (!apiKey) {
      alert('Please add your Groq API key in Settings first')
      onOpenSettings()
      return
    }

    if (summary) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: description || name,
          apiKey: apiKey,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to summarize')
      }

      const data = await response.json()
      setSummary(data.summary)
    } catch (err) {
      console.error('Error summarizing:', err)
      setError(err instanceof Error ? err.message : 'Failed to summarize')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <article className={styles.card}>
      <h2 className={styles.title}>{name}</h2>

      <p className={styles.description}>
        {description || 'No description available'}
      </p>

      {summary && (
        <div className={styles.summaryContainer}>
          <div className={styles.summaryLabel}>✨ AI Summary</div>
          <p className={styles.summaryText}>{summary}</p>
        </div>
      )}

      {error && <div className={styles.errorText}>{error}</div>}

      <button
        onClick={handleSummarize}
        disabled={isLoading || !!summary}
        className={styles.summarizeButton}
      >
        {isLoading ? 'Summarizing...' : summary ? '✓ Summarized' : '✨ Summarize'}
      </button>

      <div className={styles.footer}>
        <div className={styles.metadata}>
          <div className={styles.stars}>
            <span className={styles.starIcon}>⭐</span>
            <span className={styles.starCount}>{formattedStars}</span>
          </div>

          {language && <div className={styles.language}>{language}</div>}
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          View on GitHub →
        </a>
      </div>
    </article>
  )
}

