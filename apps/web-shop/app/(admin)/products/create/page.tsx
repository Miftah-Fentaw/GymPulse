import { ArrowLeft, Upload } from 'lucide-react'

export default function CreateProductPage() {
  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <a href="/products" className="btn btn-ghost p-2">
          <ArrowLeft size={18} />
        </a>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Add Product</h1>
          <p className="text-sm text-gray-400 mt-0.5">Fill in the details to add a new product</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Main form */}
        <div className="md:col-span-2 space-y-4">
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-700 text-sm">Product Information</h2>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Product Name</label>
              <input className="input" placeholder="e.g. Whey Protein 2kg" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
              <textarea className="input resize-none h-24" placeholder="Product description..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">SKU</label>
                <input className="input" placeholder="e.g. WP-001" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Category</label>
                <select className="input">
                  <option>Supplements</option>
                  <option>Equipment</option>
                  <option>Accessories</option>
                  <option>Recovery</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-700 text-sm">Pricing & Stock</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Price ($)</label>
                <input type="number" className="input" placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Compare-at Price ($)</label>
                <input type="number" className="input" placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Cost ($)</label>
                <input type="number" className="input" placeholder="0.00" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Quantity in Stock</label>
                <input type="number" className="input" placeholder="0" />
              </div>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Image upload */}
          <div className="card">
            <h2 className="font-semibold text-gray-700 text-sm mb-3">Product Images</h2>
            <div className="border-2 border-dashed border-surface-border rounded-xl p-6 flex flex-col items-center gap-2 hover:border-brand transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center">
                <Upload size={18} className="text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 text-center">
                Drag & drop or <span className="text-brand font-semibold">browse</span>
              </p>
              <p className="text-[10px] text-gray-400">PNG, JPG up to 5 MB</p>
            </div>
          </div>

          {/* Status */}
          <div className="card space-y-3">
            <h2 className="font-semibold text-gray-700 text-sm">Status</h2>
            <select className="input">
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="rounded" />
              Mark as Featured
            </label>
          </div>

          {/* Tags */}
          <div className="card">
            <h2 className="font-semibold text-gray-700 text-sm mb-2">Tags</h2>
            <input className="input" placeholder="e.g. protein, supplement…" />
            <p className="text-[10px] text-gray-400 mt-1.5">Separate tags with commas</p>
          </div>

          <div className="flex gap-2">
            <button className="btn btn-outline flex-1">Discard</button>
            <button className="btn btn-primary flex-1">Save Product</button>
          </div>
        </div>
      </div>
    </div>
  )
}
