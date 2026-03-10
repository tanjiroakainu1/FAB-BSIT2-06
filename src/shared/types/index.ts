/** Single item or combo/package that includes multiple meals. */
export type ProductType = 'single' | 'combo'

export interface MenuItem {
  id: string
  name: string
  description: string
  /** Full tray price. If halfTrayAvailable, half tray = price/2. */
  price: number
  imageUrl?: string
  categoryId: string
  available: boolean
  /** If true, customer can choose half tray (half price) or full tray. */
  halfTrayAvailable?: boolean
  /** Single meal or combo/package of multiple meals. Default 'single'. */
  productType?: ProductType
  /** For combo/package: menu item IDs included in this product. */
  comboItemIds?: string[]
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface OrderItem {
  menuItemId: string
  name: string
  quantity: number
  price: number
  traySize?: 'half' | 'full'
  /** Add-on or special instructions for this line. */
  notes?: string
}

export type PaymentMethod = 'cash' | 'gcash'
export type PaymentStatus = 'pending' | 'paid'
export type DeliveryOption = 'delivery' | 'pickup'
export type DeliveryStatus = 'pending' | 'out_for_delivery' | 'delivered' | 'picked_up'
/** Admin-only: whether order has been called out to customer. */
export type CalledStatus = 'pending' | 'completed'
/** Admin-only: kitchen progress. */
export type KitchenStatus = 'pending' | 'completed'

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  createdAt: string
  /** Set when order is placed by a logged-in registered customer (users.id). */
  customerId?: string
  customerName: string
  customerEmail: string
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  deliveryOption: DeliveryOption
  deliveryStatus: DeliveryStatus
  /** Delivery address (for delivery orders). */
  deliveryAddress?: string
  /** Event type (e.g. birthday, meeting). */
  eventType?: string
  /** Customer contact number. */
  contactNumber?: string
  /** Admin-only: order called out to customer (pending | completed). */
  calledStatus?: CalledStatus
  /** Admin-only: kitchen status (pending | completed). */
  kitchenStatus?: KitchenStatus
  /** Order-level notes (e.g. add-on packages, special requests). */
  orderNotes?: string
  /** Cash/GCash reference number submitted by customer. */
  paymentReference?: string
  /** Customer's GCash mobile number (when payment is GCash). */
  gcashMobileNumber?: string
  /** When the customer needs this order (date, YYYY-MM-DD). */
  needByDate?: string
  /** When the customer needs this order (time, HH:mm). */
  needByTime?: string
  /** Customer-uploaded GCash receipt image (data URL). */
  paymentReceiptDataUrl?: string
  /** When the receipt was submitted. */
  paymentReceiptSubmittedAt?: string
  /** When admin marked order as done (moves to Done order histories). */
  doneAt?: string
}

export type OrderStatus = Order['status']

/** Role that created the ups/downs entry (admin, kitchen, delivery). */
export type UpsAndDownsRole = 'admin' | 'kitchen' | 'delivery'

export interface UpsAndDownsEntry {
  id: string
  type: 'up' | 'down'
  label: string
  createdAt: string
  role: UpsAndDownsRole
}
