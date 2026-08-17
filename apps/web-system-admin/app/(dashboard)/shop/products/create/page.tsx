import { ArrowLeft, Upload } from 'lucide-react'

export default function CreateProductPage() {
  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <a href="/shop/products" className="btn btn-ghost p-2"><ArrowLeft size={18} /></a>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Add Product</h1>
          <p className="text-sm text-slate-500 mt-0.5">Add a new product to the shop catalogue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-4">
          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-700 text-sm">Product Information</h2>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Product Name</label>
              <input className="input" placeholder="e.g. Whey Protein 2kg" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Description</label>
              <textarea className="input resize-none h-24" placeholder="Product description…" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">SKU</label>
                <input className="input" placeholder="e.g. WP-001" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Category</label>
                <select className="input">
                  <option>Supplements</option><option>Equipment</option>
                  <option>Accessories</option><option>Recovery</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-700 text-sm">Pricing & Inventory</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Price ($)</label>
                <input type="number" className="input" placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Compare-at Price ($)</label>
                <input type="number" className="input" placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Cost ($)</label>
                <input type="number" className="input" placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Quantity in Stock</label>
                <input type="number" className="input" placeholder="0" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h2 className="font-semibold text-slate-700 text-sm mb-3">Product Images</h2>
            <div className="border-2 border-dashed border-surface-border rounded-xl p-6 flex flex-col items-center gap-2 hover:border-brand transition-colors cursor-pointer">
              <Upload size={20} className="text-slate-400" />
              <p className="text-xs text-slate-500 text-center">
                Drag & drop or <span className="text-brand font-semibold">browse</span>
              </p>
              <p className="text-[10px] text-slate-400">PNG, JPG — max 8 images</p>
            </div>
          </div>

          <div className="card space-y-3">
            <h2 className="font-semibold text-slate-700 text-sm">Settings</h2>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Status</label>
              <select className="input"><option>Active</option><option>Inactive</option></select>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" className="rounded" /> Mark as Featured
            </label>
          </div>

          <div className="flex gap-2">
            <a href="/shop/products" className="btn btn-outline flex-1">Discard</a>
            <button className="btn btn-primary flex-1">Save Product</button>
          </div>
        </div>
      </div>
    </div>
  )
}
