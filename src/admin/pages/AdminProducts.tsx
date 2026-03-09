import { useState } from 'react'
import { PageContainer } from '@shared/components'
import { formatPrice } from '@shared/utils'
import { useAppData } from '@shared/context'
import type { MenuItem, ProductType } from '@shared/types'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
  available: true,
  halfTrayAvailable: false,
  imageUrl: '' as string,
  productType: 'single' as ProductType,
  comboItemIds: [] as string[],
}

export default function AdminProducts() {
  const { categories, menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useAppData()
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [showForm, setShowForm] = useState(false)

  const resetForm = () => {
    setForm(emptyForm)
    setEditing(null)
    setShowForm(false)
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const name = form.name.trim()
    const description = form.description.trim()
    const price = parseFloat(form.price)
    const categoryId = form.categoryId
    if (!name || !categoryId || Number.isNaN(price) || price < 0) return
    addMenuItem({
      name,
      description,
      price,
      categoryId,
      available: form.available,
      halfTrayAvailable: form.halfTrayAvailable,
      imageUrl: form.imageUrl || undefined,
      productType: form.productType,
      comboItemIds: form.productType === 'combo' ? form.comboItemIds : undefined,
    })
    resetForm()
  }

  const startEdit = (item: MenuItem) => {
    setEditing(item)
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      categoryId: item.categoryId,
      available: item.available,
      halfTrayAvailable: item.halfTrayAvailable ?? false,
      imageUrl: item.imageUrl ?? '',
      productType: item.productType ?? 'single',
      comboItemIds: item.productType === 'combo' && Array.isArray(item.comboItemIds) ? [...item.comboItemIds] : [],
    })
    setShowForm(true)
  }

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    const name = form.name.trim()
    const description = form.description.trim()
    const price = parseFloat(form.price)
    const categoryId = form.categoryId
    if (!name || !categoryId || Number.isNaN(price) || price < 0) return
    updateMenuItem(editing.id, {
      name,
      description,
      price,
      categoryId,
      available: form.available,
      halfTrayAvailable: form.halfTrayAvailable,
      imageUrl: form.imageUrl || undefined,
      productType: form.productType,
      comboItemIds: form.productType === 'combo' ? form.comboItemIds : undefined,
    })
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Move this product to archive? You can restore or permanently delete it from Archive.')) deleteMenuItem(id)
    if (editing?.id === id) resetForm()
  }

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? '—'

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, imageUrl: reader.result as string }))
    reader.readAsDataURL(file)
  }

  const clearImage = () => setForm((f) => ({ ...f, imageUrl: '' }))

  /** Menu items that can be included in a combo (exclude current when editing). */
  const selectableForCombo = menuItems.filter((m) => m.id !== editing?.id)

  const toggleComboItem = (id: string) => {
    setForm((f) => ({
      ...f,
      comboItemIds: f.comboItemIds.includes(id) ? f.comboItemIds.filter((x) => x !== id) : [...f.comboItemIds, id],
    }))
  }

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-diamond">Product management</h1>
      <p className="mt-2 text-diamond-muted">Add, edit, and delete menu products.</p>

      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="mt-6 rounded bg-crimson px-4 py-3 min-h-[48px] sm:py-2 sm:min-h-0 font-medium text-white hover:bg-crimson-light touch-manipulation"
      >
        Add product
      </button>

      {showForm && (
        <form
          onSubmit={editing ? handleEdit : handleAdd}
          className="card-diamond mt-6 rounded-lg p-6"
        >
          <h2 className="text-lg font-medium text-diamond">{editing ? 'Edit product' : 'New product'}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-diamond-muted">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 w-full rounded border border-diamond-border px-3 py-2.5 sm:py-2 text-diamond min-h-[44px] sm:min-h-0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-diamond-muted">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                className="mt-1 w-full rounded border border-diamond-border px-3 py-2 text-diamond"
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <span className="block text-sm font-medium text-diamond-muted">Product type</span>
              <div className="mt-2 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="productType"
                    checked={form.productType === 'single'}
                    onChange={() => setForm((f) => ({ ...f, productType: 'single', comboItemIds: [] }))}
                    className="text-crimson focus:ring-crimson"
                  />
                  <span className="text-diamond">Single meal</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="productType"
                    checked={form.productType === 'combo'}
                    onChange={() => setForm((f) => ({ ...f, productType: 'combo' }))}
                    className="text-crimson focus:ring-crimson"
                  />
                  <span className="text-diamond">Combo / Package meal</span>
                </label>
              </div>
              {form.productType === 'combo' && (
                <p className="mt-1 text-xs text-diamond-muted">Select the meals included in this combo. Customer can order full or half tray (half = 50% of price).</p>
              )}
            </div>
            {form.productType === 'combo' && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-diamond-muted">Included meals</label>
                <div className="mt-2 max-h-48 overflow-y-auto rounded border border-diamond-border bg-diamond-surface p-3 space-y-2">
                  {categories.map((cat) => {
                    const itemsInCat = selectableForCombo.filter((m) => m.categoryId === cat.id)
                    if (itemsInCat.length === 0) return null
                    return (
                      <div key={cat.id}>
                        <p className="text-xs font-semibold text-diamond-muted mb-1">{cat.name}</p>
                        <div className="flex flex-wrap gap-2">
                          {itemsInCat.map((m) => (
                            <label key={m.id} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={form.comboItemIds.includes(m.id)}
                                onChange={() => toggleComboItem(m.id)}
                                className="rounded border-diamond-border text-crimson focus:ring-crimson"
                              />
                              <span className="text-sm text-diamond">{m.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                  {selectableForCombo.some((m) => !categories.some((c) => c.id === m.categoryId)) && (
                    <div>
                      <p className="text-xs font-semibold text-diamond-muted mb-1">Other</p>
                      <div className="flex flex-wrap gap-2">
                        {selectableForCombo
                          .filter((m) => !categories.some((c) => c.id === m.categoryId))
                          .map((m) => (
                            <label key={m.id} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={form.comboItemIds.includes(m.id)}
                                onChange={() => toggleComboItem(m.id)}
                                className="rounded border-diamond-border text-crimson focus:ring-crimson"
                              />
                              <span className="text-sm text-diamond">{m.name}</span>
                            </label>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-diamond-muted">Full tray price (₱)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="mt-1 w-full rounded border border-diamond-border px-3 py-2 text-diamond"
                required
              />
              {form.halfTrayAvailable && (
                <p className="mt-1 text-xs text-diamond-muted">Half tray = half of this price.</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available"
                checked={form.available}
                onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
                className="rounded border-diamond-border text-crimson focus:ring-diamond-surface0"
              />
              <label htmlFor="available" className="text-sm text-diamond-muted">
                Available
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="halfTrayAvailable"
                checked={form.halfTrayAvailable}
                onChange={(e) => setForm((f) => ({ ...f, halfTrayAvailable: e.target.checked }))}
                className="rounded border-diamond-border text-crimson focus:ring-diamond-surface0"
              />
              <label htmlFor="halfTrayAvailable" className="text-sm text-diamond-muted">
                Offer half tray (customer can choose half or full; half = 50% of full price)
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-diamond-muted">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="mt-1 w-full rounded border border-diamond-border px-3 py-2 text-diamond"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-diamond-muted">Product image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-diamond-muted file:mr-4 file:rounded file:border-0 file:bg-diamond-surface file:px-4 file:py-2 file:text-sm file:font-medium file:text-crimson-light hover:file:bg-diamond-border"
              />
              {form.imageUrl ? (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={form.imageUrl}
                    alt="Product preview"
                    className="h-24 w-24 rounded border border-diamond-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <p className="mt-1 text-xs text-diamond-muted">Choose a file to show the product image.</p>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="submit"
              className="rounded bg-crimson px-4 py-3 min-h-[48px] sm:py-2 sm:min-h-0 font-medium text-white hover:bg-crimson-light touch-manipulation"
            >
              {editing ? 'Save' : 'Add product'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded border border-diamond-border px-4 py-3 min-h-[48px] sm:py-2 sm:min-h-0 text-diamond-muted hover:bg-diamond-surface touch-manipulation"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="card-diamond mt-6 overflow-hidden rounded-lg -mx-3 sm:mx-0">
        <div className="overflow-x-auto overflow-y-visible" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="min-w-[560px] sm:min-w-full divide-y divide-diamond-border">
          <thead className="bg-diamond-surface">
            <tr>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Image</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Name</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Type</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Category</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Price</th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Available</th>
              <th className="px-2 sm:px-4 py-3 text-right text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-diamond-border bg-diamond-card">
            {menuItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-diamond-muted">
                  No products yet. Add categories first, then add products.
                </td>
              </tr>
            ) : (
              menuItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="h-12 w-12 rounded border border-diamond-border object-cover"
                      />
                    ) : (
                      <span className="text-xs text-diamond-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-diamond">{item.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${item.productType === 'combo' ? 'bg-crimson/15 text-crimson' : 'bg-diamond-surface text-diamond-muted'}`}>
                      {item.productType === 'combo' ? 'Combo' : 'Single'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-diamond-muted">{categoryName(item.categoryId)}</td>
                  <td className="px-4 py-3 text-diamond-muted">{formatPrice(item.price)}</td>
                  <td className="px-4 py-3">{item.available ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="mr-2 text-crimson hover:text-crimson-light"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
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
