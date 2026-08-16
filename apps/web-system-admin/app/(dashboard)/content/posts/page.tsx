import { Plus, Search, Pencil, Trash2, Globe, EyeOff, FileText } from 'lucide-react'

const posts = [
  { id: '1', title: 'Top 10 Post-Workout Meals', category: 'Nutrition', type: 'article', published: true, created: 'Apr 8, 2025' },
  { id: '2', title: 'How to Improve Your Squat Form', category: 'Technique', type: 'guide', published: true, created: 'Apr 5, 2025' },
  { id: '3', title: 'Understanding Muscle Recovery', category: 'Recovery', type: 'article', published: false, created: 'Apr 10, 2025' },
  { id: '4', title: 'GymPulse App Update v2.1', category: 'News', type: 'news', published: true, created: 'Apr 12, 2025' },
  { id: '5', title: 'Beginner Guide to Supplement Stacking', category: 'Nutrition', type: 'guide', published: true, created: 'Mar 28, 2025' },
]

export default function ContentPostsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Content Posts</h1>
          <p className="text-sm text-slate-500 mt-0.5">Articles, guides and news for app users</p>
        </div>
        <a href="/content/posts/create" className="btn btn-primary h-9 text-sm">
          <Plus size={16} />
          Create Post
        </a>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-8 h-9 text-sm" placeholder="Search posts..." />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <select className="input h-9 w-auto text-sm py-0">
              <option>All Types</option>
              <option>Article</option>
              <option>Guide</option>
              <option>News</option>
            </select>
            <select className="input h-9 w-auto text-sm py-0">
              <option>All Statuses</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Post</th>
                <th className="table-th">Category</th>
                <th className="table-th">Type</th>
                <th className="table-th">Status</th>
                <th className="table-th">Date</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-surface/40 transition-colors">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <FileText size={15} className="text-slate-400" />
                      </div>
                      <p className="font-medium text-slate-800">{p.title}</p>
                    </div>
                  </td>
                  <td className="table-td">
                    <span className="badge badge-neutral">{p.category}</span>
                  </td>
                  <td className="table-td capitalize text-slate-500">{p.type}</td>
                  <td className="table-td">
                    <span className={`badge ${p.published ? 'badge-success' : 'badge-neutral'}`}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="table-td text-slate-400">{p.created}</td>
                  <td className="table-td text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className={`btn btn-ghost p-1.5 ${p.published ? 'text-warning hover:bg-warning-light' : 'text-success hover:bg-success-light'}`}
                        title={p.published ? 'Unpublish' : 'Publish'}
                      >
                        {p.published ? <EyeOff size={15} /> : <Globe size={15} />}
                      </button>
                      <button className="btn btn-ghost p-1.5" title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
