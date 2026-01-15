'use client'

import { useState, useEffect } from 'react'
import styles from './SettingsModal.module.css'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  // Load the existing API key from localStorage when modal opens
  // This runs whenever isOpen changes
  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem('groq_api_key')
      setApiKey(savedKey || '')
    }
  }, [isOpen])

  const handleSave = () => {
    if (!apiKey.trim()) {
      alert('Please enter an API key')
      return
    }

    localStorage.setItem('groq_api_key', apiKey.trim())
    
    setShowSuccess(true)
    
    setTimeout(() => {
      setShowSuccess(false)
      onClose()
    }, 1500)
  }

  const handleClear = () => {
    localStorage.removeItem('groq_api_key')
    setApiKey('')
    alert('API key cleared')
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Settings</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <label className={styles.label}>
            Groq API Key
            <span className={styles.subtitle}>
              Get your free API key at{' '}
              <a
                href="https://console.groq.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                console.groq.com
              </a>
            </span>
          </label>

          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Groq API key"
            className={styles.input}
          />

          <div className={styles.actions}>
            <button onClick={handleSave} className={styles.saveButton}>
              {showSuccess ? '✓ Saved!' : 'Save'}
            </button>
            {apiKey && (
              <button onClick={handleClear} className={styles.clearButton}>
                Clear
              </button>
            )}
          </div>

          <p className={styles.note}>
            Your API key is stored locally in your browser and never sent to our
            servers. It's only used to make direct requests to Groq.
          </p>
        </div>
      </div>
    </div>
  )
}

