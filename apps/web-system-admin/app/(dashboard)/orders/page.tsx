import { redirect } from 'next/navigation'
// Legacy route — orders live under /shop/orders
export default function OrdersRedirect() {
  redirect('/shop/orders')
}
