import { useState } from 'react'
import { PageContainer } from '@shared/components'
import { useAppData } from '@shared/context'
import type { Category } from '@shared/types'

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAppData()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Category | null>(null)
  const [addName, setAddName] = useState('')
  const [editName, setEditName] = useState('')

  const searchLower = search.trim().toLowerCase()
  const filteredCategories = searchLower
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.slug.toLowerCase().includes(searchLower)
      )
    : categories

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const name = addName.trim()
    if (!name) return
    addCategory(name)
    setAddName('')
  }

  const startEdit = (cat: Category) => {
    setEditing(cat)
    setEditName(cat.name)
  }

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    const name = editName.trim()
    if (!name) return
    updateCategory(editing.id, name)
    setEditing(null)
    setEditName('')
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this category? Products in it will be unassigned.')) {
      deleteCategory(id)
      if (editing?.id === id) setEditing(null)
    }
  }

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-diamond">Category management</h1>
      <p className="mt-2 text-diamond-muted">Add, edit, and delete categories.</p>

      <form onSubmit={handleAdd} className="mt-6 flex flex-wrap gap-2">
        <input
          type="text"
          value={addName}
          onChange={(e) => setAddName(e.target.value)}
          placeholder="New category name"
          className="flex-1 min-w-[180px] rounded border border-diamond-border px-3 py-2.5 sm:py-2 text-diamond focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson bg-diamond-surface min-h-[44px] sm:min-h-0"
        />
        <button
          type="submit"
          className="rounded bg-crimson px-4 py-3 min-h-[48px] sm:py-2 sm:min-h-0 font-medium text-white hover:bg-crimson-light touch-manipulation"
        >
          Add category
        </button>
      </form>

      <div className="card-diamond mt-6 rounded-xl p-4 sm:p-5">
        <label htmlFor="category-search" className="sr-only">Search categories</label>
        <input
          id="category-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or slug..."
          className="w-full max-w-md rounded-lg border border-diamond-border bg-diamond-surface px-4 py-2.5 text-diamond placeholder-diamond-muted transition focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
          aria-label="Search categories"
        />
      </div>

      <div className="card-diamond mt-6 overflow-hidden rounded-lg -mx-3 sm:mx-0">
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        <table className="min-w-[320px] sm:min-w-full divide-y divide-diamond-border">
          <thead className="bg-diamond-surface">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Slug</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-diamond-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-diamond-border bg-diamond-card">
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-diamond-muted">
                  {categories.length === 0 ? 'No categories yet. Add one above.' : 'No categories match your search.'}
                </td>
              </tr>
            ) : (
              filteredCategories.map((cat) => (
                <tr key={cat.id}>
                  <td className="px-4 py-3 text-diamond">
                    {editing?.id === cat.id ? (
                      <form onSubmit={handleEdit} className="flex gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full min-w-0 rounded border border-diamond-border bg-diamond-surface px-2 py-1 text-diamond sm:w-48"
                          autoFocus
                        />
                        <button type="submit" className="text-crimson hover:text-crimson-light">
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(null)}
                          className="text-diamond-muted hover:text-diamond-muted"
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-diamond-muted">{cat.slug}</td>
                  <td className="px-4 py-3 text-right">
                    {editing?.id !== cat.id && (
                      <>
                        <button
                          type="button"
                          onClick={() => startEdit(cat)}
                          className="mr-2 text-crimson hover:text-crimson-light"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </PageContainer>
  )
}
