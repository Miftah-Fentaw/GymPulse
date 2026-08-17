import { ArrowLeft } from 'lucide-react'

export default function CreateCategoryPage() {
  return (
    <div className="space-y-5 max-w-md">
      <div className="flex items-center gap-3">
        <a href="/categories" className="btn btn-ghost p-2"><ArrowLeft size={18} /></a>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Add Category</h1>
          <p className="text-sm text-gray-400 mt-0.5">Create a new product category</p>
        </div>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Category Name</label>
          <input className="input" placeholder="e.g. Recovery" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Slug</label>
          <input className="input" placeholder="e.g. recovery" />
          <p className="text-[11px] text-gray-400 mt-1">Used in URLs — lowercase, no spaces.</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
          <textarea className="input resize-none h-20" placeholder="Optional description…" />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <a href="/categories" className="btn btn-outline">Cancel</a>
          <button className="btn btn-primary">Create Category</button>
        </div>
      </div>
    </div>
  )
}
