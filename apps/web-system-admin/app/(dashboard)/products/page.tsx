import { redirect } from 'next/navigation'
// Legacy route — products live under /shop/products
export default function ProductsRedirect() {
  redirect('/shop/products')
}
