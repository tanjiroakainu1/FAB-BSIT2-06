import { useState, useRef, useEffect } from 'react'
import { PageContainer } from '@shared/components'
import { useAppData } from '@shared/context'
import type { CommunityChatSender } from '@shared/context/AppDataContext'

const SENDER_LABELS: Record<CommunityChatSender, string> = {
  admin: 'Admin',
  kitchen: 'Kitchen',
  delivery: 'Delivery',
}

interface CommunityChatProps {
  sender: CommunityChatSender
}

export function CommunityChat({ sender }: CommunityChatProps) {
  const { adminChatMessages, addAdminChatMessage } = useAppData()
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight)
  }, [adminChatMessages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    addAdminChatMessage(sender, input)
    setInput('')
  }

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <PageContainer>
      <div className="mb-6 flex items-baseline gap-3">
        <h1 className="text-2xl font-bold text-diamond sm:text-3xl">Community Chat</h1>
        <span className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-crimson/60 to-transparent" aria-hidden />
      </div>
      <p className="mt-2 text-diamond-muted">
        Chat with Admin, Kitchen, and Delivery. You are signed in as <strong>{SENDER_LABELS[sender]}</strong>.
      </p>

      <div className="card-diamond mt-6 flex flex-col rounded-xl overflow-hidden">
        <div
          ref={listRef}
          className="flex max-h-[50vh] sm:max-h-[420px] min-h-[240px] sm:min-h-[320px] flex-col overflow-y-auto overflow-x-hidden p-4"
        >
          {adminChatMessages.length === 0 ? (
            <p className="text-center text-diamond-muted">No messages yet. Say hello!</p>
          ) : (
            adminChatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 max-w-[85%] rounded-lg px-3 py-2 ${
                  msg.sender === sender
                    ? 'ml-auto bg-crimson/20 text-diamond'
                    : 'mr-auto bg-diamond-surface text-diamond'
                }`}
              >
                <div className="text-xs font-medium text-diamond-muted">
                  {SENDER_LABELS[msg.sender]}
                  <span className="ml-2">{formatTime(msg.createdAt)}</span>
                </div>
                <p className="mt-0.5 whitespace-pre-wrap break-words">{msg.text}</p>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSubmit} className="border-t border-diamond-border p-3">
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 min-w-0 rounded-lg border border-diamond-border bg-diamond-surface px-3 py-2.5 sm:py-2 text-diamond placeholder-diamond-muted focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20 min-h-[44px] sm:min-h-0"
              autoComplete="off"
            />
            <button
              type="submit"
              className="rounded-lg bg-crimson px-4 py-2.5 sm:py-2 font-medium text-white hover:bg-crimson-light focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-diamond-bg min-h-[44px] sm:min-h-0 touch-manipulation"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  )
}
