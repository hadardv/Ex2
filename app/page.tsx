'use client'

import { useEffect, useState } from 'react'
import NewsCard from '@/components/NewsCard/NewsCard'
import SettingsModal from '@/components/SettingsModal/SettingsModal'
import styles from './page.module.css'

// Define the repository type matching our API response
interface Repository {
  id: number
  name: string
  fullName: string
  description: string | null
  stars: number
  forks: number
  language: string | null
  url: string
  createdAt: string
  owner: {
    login: string
    avatar: string
  }
}

export default function HomePage() {
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    async function fetchTrends() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/trends')

        if (!response.ok) {
          throw new Error('Failed to fetch trends')
        }

        const data = await response.json()
        console.log('Fetched data:', data)
        setRepos(data.data || [])
      } catch (err) {
        console.error('Error fetching trends:', err)
        setError('Failed to load trending repositories. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchTrends()
  }, []) 

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>YUV.AI Trends</h1>
          <p className={styles.subtitle}>
            Discover the hottest AI & Machine Learning projects from the past week
          </p>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className={styles.settingsButton}
          title="Settings"
        >
          ⚙️
        </button>
      </div>

      {loading && <div className={styles.loading}>Loading...</div>}

      {error && <div className={styles.error}>{error}</div>}

      {!loading && !error && repos.length > 0 && (
        <div className={styles.grid}>
          {repos.map((repo) => (
            <NewsCard
              key={repo.id}
              name={repo.name}
              description={repo.description}
              stars={repo.stars}
              url={repo.url}
              language={repo.language}
              owner={repo.owner}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          ))}
        </div>
      )}

      {!loading && !error && repos.length === 0 && (
        <div className={styles.empty}>
          No trending repositories found. Check back later!
        </div>
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </main>
  )
}

