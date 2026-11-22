import { useEffect, useRef, useState } from 'react'

const GSI_SRC = 'https://accounts.google.com/gsi/client'
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

let scriptPromise
function loadGsi() {
  if (window.google?.accounts?.id) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = GSI_SRC
      script.async = true
      script.onload = resolve
      script.onerror = () => {
        scriptPromise = undefined
        reject(new Error('Failed to load Google Sign-In'))
      }
      document.head.appendChild(script)
    })
  }
  return scriptPromise
}

export default function GoogleSignInButton({ onCredential, onError, text = 'continue_with' }) {
  const containerRef = useRef(null)
  const callbackRef = useRef(onCredential)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    callbackRef.current = onCredential
  }, [onCredential])

  useEffect(() => {
    if (!CLIENT_ID) return
    let cancelled = false
    loadGsi()
      .then(() => {
        if (cancelled || !containerRef.current) return
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response) => callbackRef.current?.(response.credential),
        })
        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text,
          shape: 'pill',
          width: containerRef.current.offsetWidth || 320,
        })
      })
      .catch((err) => {
        if (cancelled) return
        setFailed(true)
        onError?.(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [text, onError])

  if (!CLIENT_ID || failed) return null

  return (
    <div>
      <div ref={containerRef} className="w-full flex justify-center" />
      <div className="flex items-center gap-3 my-5 text-xs text-[var(--color-text-muted)]">
        <span className="flex-1 h-px bg-[var(--color-border-default)]" />
        or
        <span className="flex-1 h-px bg-[var(--color-border-default)]" />
      </div>
    </div>
  )
}
