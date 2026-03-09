import { useState, useRef, useEffect, useMemo } from 'react'
import { PageContainer } from '@shared/components'
import { useAppData, useAuth } from '@shared/context'
import { getConversationId, type CommunityChatSender } from '@shared/context/AppDataContext'
import type { StoredStaffUser } from '@shared/context/AuthContext'

const ROLE_LABELS: Record<CommunityChatSender, string> = {
  admin: 'Admin',
  kitchen: 'Kitchen',
  delivery: 'Delivery',
}

interface CommunityChatProps {
  sender: CommunityChatSender
}

/** Resolve current user's chat participant id (admin, kitchen, delivery, or staff id). */
function getMyChatId(sender: CommunityChatSender, staffId?: string): string {
  if (sender === 'admin') return 'admin'
  if (sender === 'kitchen') return staffId ?? 'kitchen'
  return staffId ?? 'delivery'
}

/** Label for a participant id in chat. */
function getParticipantLabel(id: string, staffUsers: StoredStaffUser[]): string {
  if (id === 'admin') return 'Admin'
  if (id === 'kitchen') return 'Kitchen'
  if (id === 'delivery') return 'Delivery'
  const staff = staffUsers.find((u) => u.id === id)
  return staff ? `${staff.name} (${staff.role === 'kitchen' ? 'Kitchen' : 'Delivery'})` : id.slice(0, 8)
}

type ChatEntry = { id: string; type: 'admin' | 'group' | 'staff'; label: string; staff?: StoredStaffUser }

export function CommunityChat({ sender }: CommunityChatProps) {
  const { user, staffUsers } = useAuth()
  const { directChatMessages, addDirectChatMessage, adminChatMessages, addAdminChatMessage } = useAppData()
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const groupListRef = useRef<HTMLDivElement>(null)

  const myId = getMyChatId(sender, user?.type === 'kitchen' ? user.staffId : user?.type === 'deliveryguy' ? user.staffId : undefined)

  const staffOnly = useMemo(
    () => staffUsers.filter((u) => u.role === 'kitchen' || u.role === 'deliveryguy'),
    [staffUsers]
  )

  const chatEntries = useMemo((): ChatEntry[] => {
    const fixed: ChatEntry[] = []
    if (sender !== 'admin') {
      fixed.push({ id: 'admin', type: 'admin', label: 'Admin' })
    }
    fixed.push({ id: 'group', type: 'group', label: 'Group chat' })
    const staffEntries: ChatEntry[] = staffOnly.map((u) => ({
      id: u.id,
      type: 'staff' as const,
      label: u.name,
      staff: u,
    }))
    return [...fixed, ...staffEntries]
  }, [sender, staffOnly])

  const searchLower = search.trim().toLowerCase()
  const filteredEntries = useMemo(
    () =>
      searchLower
        ? chatEntries.filter(
            (e) =>
              e.label.toLowerCase().includes(searchLower) ||
              (e.staff && (e.staff.email.toLowerCase().includes(searchLower) || e.staff.role.toLowerCase().includes(searchLower)))
          )
        : chatEntries,
    [chatEntries, searchLower]
  )

  const conversationId = selectedId && selectedId !== 'group' ? getConversationId(myId, selectedId) : null
  const directMessages = useMemo(
    () =>
      conversationId
        ? directChatMessages
          .filter((m) => m.conversationId === conversationId)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        : [],
    [directChatMessages, conversationId]
  )

  const groupMessages = useMemo(
    () => [...adminChatMessages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [adminChatMessages]
  )

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight)
  }, [directMessages])

  useEffect(() => {
    groupListRef.current?.scrollTo(0, groupListRef.current.scrollHeight)
  }, [groupMessages])

  const handleSubmitDirect = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !conversationId || !selectedId || selectedId === 'group') return
    addDirectChatMessage(conversationId, myId, selectedId, input)
    setInput('')
  }

  const handleSubmitGroup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || selectedId !== 'group') return
    addAdminChatMessage(sender, input)
    setInput('')
  }

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const selectedEntry = selectedId ? chatEntries.find((e) => e.id === selectedId) : null
  const isGroupChat = selectedId === 'group'

  return (
    <PageContainer>
      <div className="mb-6 flex items-baseline gap-3">
        <h1 className="text-2xl font-bold text-diamond sm:text-3xl">Chat</h1>
        <span className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-crimson/60 to-transparent" aria-hidden />
      </div>
      <p className="mt-2 text-diamond-muted">
        Group chat with Admin, Kitchen &amp; Delivery, or 1-on-1 with Admin and staff. You are signed in as <strong>{ROLE_LABELS[sender]}</strong>.
      </p>

      <div className="card-diamond mt-6 rounded-xl p-4 sm:p-5">
        <label htmlFor="chat-search" className="sr-only">Search chats</label>
        <input
          id="chat-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or role..."
          className="w-full max-w-md rounded-lg border border-diamond-border bg-diamond-surface px-4 py-2.5 text-diamond placeholder-diamond-muted transition focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
          aria-label="Search chats"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card-diamond rounded-xl overflow-hidden">
          <h2 className="border-b border-diamond-border bg-diamond-surface px-4 py-2 text-sm font-semibold text-diamond-muted">
            Admin, Group chat &amp; staff
          </h2>
          <ul className="max-h-[280px] overflow-y-auto p-2">
            {filteredEntries.length === 0 ? (
              <li className="px-3 py-4 text-center text-sm text-diamond-muted">
                {chatEntries.length === 0
                  ? 'No chats available.'
                  : 'No matches for your search.'}
              </li>
            ) : (
              filteredEntries.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(e.id)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${
                      selectedId === e.id
                        ? 'bg-crimson/15 text-crimson font-medium'
                        : 'text-diamond hover:bg-diamond-surface'
                    }`}
                  >
                    <span className="block font-medium truncate">{e.label}</span>
                    {e.staff && (
                      <>
                        <span className="block truncate text-xs text-diamond-muted">{e.staff.email}</span>
                        <span className="mt-0.5 inline-block rounded bg-crimson/10 px-1.5 py-0.5 text-xs text-crimson capitalize">
                          {e.staff.role === 'deliveryguy' ? 'Delivery' : e.staff.role}
                        </span>
                      </>
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="lg:col-span-2 flex flex-col min-h-0">
          <div className="card-diamond flex flex-1 flex-col rounded-xl overflow-hidden">
            {selectedEntry ? (
              <>
                <div className="border-b border-diamond-border bg-diamond-surface px-4 py-2 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-diamond">
                    {selectedEntry.type === 'staff' && selectedEntry.staff
                      ? `${selectedEntry.staff.name} (${selectedEntry.staff.role === 'deliveryguy' ? 'Delivery' : 'Kitchen'})`
                      : selectedEntry.label}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="text-xs text-diamond-muted hover:text-diamond"
                  >
                    Close
                  </button>
                </div>
                {isGroupChat ? (
                  <>
                    <div
                      ref={groupListRef}
                      className="flex max-h-[50vh] sm:max-h-[320px] min-h-[200px] flex-1 flex-col overflow-y-auto overflow-x-hidden p-4"
                    >
                      {groupMessages.length === 0 ? (
                        <p className="text-center text-sm text-diamond-muted py-4">No messages yet. Say hello!</p>
                      ) : (
                        groupMessages.map((msg) => {
                          const isMe = msg.sender === sender
                          return (
                            <div
                              key={msg.id}
                              className={`mb-3 max-w-[85%] rounded-lg px-3 py-2 ${
                                isMe ? 'ml-auto bg-crimson/20 text-diamond' : 'mr-auto bg-diamond-surface text-diamond'
                              }`}
                            >
                              <div className="text-xs font-medium text-diamond-muted">
                                {ROLE_LABELS[msg.sender]}
                                <span className="ml-2">{formatTime(msg.createdAt)}</span>
                              </div>
                              <p className="mt-0.5 whitespace-pre-wrap break-words">{msg.text}</p>
                            </div>
                          )
                        })
                      )}
                    </div>
                    <form onSubmit={handleSubmitGroup} className="border-t border-diamond-border p-3">
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
                  </>
                ) : (
                  <>
                    <div
                      ref={listRef}
                      className="flex max-h-[50vh] sm:max-h-[320px] min-h-[200px] flex-1 flex-col overflow-y-auto overflow-x-hidden p-4"
                    >
                      {directMessages.length === 0 ? (
                        <p className="text-center text-sm text-diamond-muted py-4">No messages yet. Say hello!</p>
                      ) : (
                        directMessages.map((msg) => {
                          const isMe = msg.fromId === myId
                          return (
                            <div
                              key={msg.id}
                              className={`mb-3 max-w-[85%] rounded-lg px-3 py-2 ${
                                isMe ? 'ml-auto bg-crimson/20 text-diamond' : 'mr-auto bg-diamond-surface text-diamond'
                              }`}
                            >
                              <div className="text-xs font-medium text-diamond-muted">
                                {getParticipantLabel(msg.fromId, staffUsers)}
                                <span className="ml-2">{formatTime(msg.createdAt)}</span>
                              </div>
                              <p className="mt-0.5 whitespace-pre-wrap break-words">{msg.text}</p>
                            </div>
                          )
                        })
                      )}
                    </div>
                    <form onSubmit={handleSubmitDirect} className="border-t border-diamond-border p-3">
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
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-diamond-muted">
                <p className="text-sm">Select Admin, Group chat, or a staff member to start chatting.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
