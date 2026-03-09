import { PageContainer } from '@shared/components'
import { formatPrice } from '@shared/utils'
import { useAppData, type ArchivedMenuItem } from '@shared/context'

export default function AdminArchive() {
  const { categories, archivedMenuItems, restoreMenuItem, permanentlyDeleteMenuItem } = useAppData()

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? '—'

  const handleRestore = (item: ArchivedMenuItem) => {
    if (window.confirm(`Restore "${item.name}" back to Products?`)) restoreMenuItem(item.id)
  }

  const handlePermanentDelete = (item: ArchivedMenuItem) => {
    if (window.confirm(`Permanently delete "${item.name}"? This cannot be undone.`)) {
      permanentlyDeleteMenuItem(item.id)
    }
  }

  const formatArchivedDate = (iso: string) => new Date(iso).toLocaleString()

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-diamond">Archive management</h1>
      <p className="mt-2 text-diamond-muted">
        Deleted products are moved here. Restore to bring them back to Products, or permanently delete to remove them for good.
      </p>

      <div className="card-diamond mt-6 overflow-hidden rounded-xl">
        {archivedMenuItems.length === 0 ? (
          <div className="p-8 text-center text-diamond-muted">
            No archived products. Delete a product from Products to see it here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[500px] w-full divide-y divide-diamond-border">
              <thead className="bg-diamond-surface">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Archived</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-diamond-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-diamond-border bg-diamond-card">
                {archivedMenuItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover shrink-0"
                          />
                        )}
                        <div>
                          <span className="font-medium text-diamond">{item.name}</span>
                          {item.description && (
                            <p className="text-xs text-diamond-muted line-clamp-1">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-diamond-muted">{categoryName(item.categoryId)}</td>
                    <td className="px-4 py-3 text-sm text-diamond">{formatPrice(item.price)}</td>
                    <td className="px-4 py-3 text-sm text-diamond-muted">{formatArchivedDate(item.archivedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleRestore(item)}
                          className="rounded bg-crimson px-3 py-1.5 text-xs font-medium text-white hover:bg-crimson-light"
                        >
                          Restore
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePermanentDelete(item)}
                          className="rounded border border-diamond-border px-3 py-1.5 text-xs font-medium text-diamond-muted hover:bg-diamond-surface"
                        >
                          Permanently delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
