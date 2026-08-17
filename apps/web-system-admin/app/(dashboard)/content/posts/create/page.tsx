import { ArrowLeft, Upload } from 'lucide-react'

export default function CreatePostPage() {
  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <a href="/content/posts" className="btn btn-ghost p-2"><ArrowLeft size={18} /></a>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Create Content Post</h1>
          <p className="text-sm text-slate-500 mt-0.5">Publish an article, guide, or news update</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-4">
          <div className="card space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Title</label>
              <input className="input text-base font-semibold" placeholder="Post title…" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Body</label>
              <textarea className="input resize-none h-48" placeholder="Write your post content here…" />
            </div>
          </div>

          {/* Cover image */}
          <div className="card">
            <h2 className="font-semibold text-slate-700 text-sm mb-3">Cover Image</h2>
            <div className="border-2 border-dashed border-surface-border rounded-xl p-8 flex flex-col items-center gap-2 hover:border-brand transition-colors cursor-pointer">
              <Upload size={22} className="text-slate-400" />
              <p className="text-sm text-slate-500">Drag & drop or <span className="text-brand font-semibold">browse</span></p>
              <p className="text-xs text-slate-400">PNG or JPG, recommended 1200×630</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card space-y-3">
            <h2 className="font-semibold text-slate-700 text-sm">Publish Settings</h2>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Status</label>
              <select className="input"><option>Draft</option><option>Published</option></select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Type</label>
              <select className="input">
                <option>article</option><option>guide</option><option>news</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Category</label>
              <select className="input">
                <option>Nutrition</option><option>Technique</option><option>Recovery</option><option>News</option><option>Motivation</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <a href="/content/posts" className="btn btn-outline flex-1">Discard</a>
            <button className="btn btn-primary flex-1">Publish</button>
          </div>
        </div>
      </div>
    </div>
  )
}
