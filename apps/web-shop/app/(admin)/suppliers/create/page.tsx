import { ArrowLeft } from 'lucide-react'

export default function CreateSupplierPage() {
  return (
    <div className="space-y-5 max-w-xl">
      <div className="flex items-center gap-3">
        <a href="/suppliers" className="btn btn-ghost p-2"><ArrowLeft size={18} /></a>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Add Supplier</h1>
          <p className="text-sm text-gray-400 mt-0.5">Register a new product supplier</p>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="font-semibold text-sm text-gray-700 pb-2 border-b border-surface-border">Supplier Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Company Name</label>
            <input className="input" placeholder="e.g. NutriSource Co." />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Contact Person</label>
            <input className="input" placeholder="e.g. David Kim" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
            <input type="email" className="input" placeholder="contact@supplier.com" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Phone</label>
            <input type="tel" className="input" placeholder="+1 555 000 0000" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Category</label>
            <select className="input">
              <option>Supplements</option><option>Equipment</option>
              <option>Accessories</option><option>Recovery</option><option>Apparel</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Country</label>
            <input className="input" placeholder="e.g. United States" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-500 mb-1 block">Address</label>
            <input className="input" placeholder="Full mailing address" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-500 mb-1 block">Notes</label>
            <textarea className="input resize-none h-16" placeholder="Payment terms, lead time, etc." />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <a href="/suppliers" className="btn btn-outline">Cancel</a>
          <button className="btn btn-primary">Add Supplier</button>
        </div>
      </div>
    </div>
  )
}
