import { Search, Star } from 'lucide-react'

const reviews = [
  { id: '1', product: 'Whey Protein 2kg',    user: 'Ahmed H.', rating: 5, comment: 'Best protein I\'ve ever used. Mixes perfectly.', date: 'Apr 12, 2025', status: 'published' },
  { id: '2', product: 'Resistance Bands',    user: 'Sara A.',  rating: 4, comment: 'Great quality, shipped fast!',                    date: 'Apr 11, 2025', status: 'published' },
  { id: '3', product: 'Gym Gloves Pro',      user: 'Mike T.',  rating: 2, comment: 'Stitching came apart after 2 weeks.',             date: 'Apr 10, 2025', status: 'flagged'   },
  { id: '4', product: 'Smart Water Bottle',  user: 'Layla N.', rating: 5, comment: 'Love the design and the app integration.',        date: 'Apr 9, 2025',  status: 'published' },
  { id: '5', product: 'Foam Roller Elite',   user: 'James O.', rating: 3, comment: 'Decent but a bit firm for my liking.',            date: 'Apr 8, 2025',  status: 'published' },
]

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} className={i <= n ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Reviews</h1>
        <p className="text-sm text-gray-400 mt-0.5">Monitor and moderate product reviews</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Reviews', value: '1,482', color: 'text-gray-800' },
          { label: 'Avg. Rating',   value: '4.3',   color: 'text-amber-500' },
          { label: 'Published',     value: '1,420', color: 'text-success' },
          { label: 'Flagged',       value: '12',    color: 'text-danger' },
        ].map(s => (
          <div key={s.label} className="card py-4">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-8 h-9 text-xs" placeholder="Search reviews..." />
          </div>
          <select className="input h-9 w-auto text-xs py-0 ml-auto">
            <option>All Ratings</option>
            <option>5 Stars</option>
            <option>4 Stars</option>
            <option>3 Stars</option>
            <option>2 Stars</option>
            <option>1 Star</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="th">Product</th>
                <th className="th">User</th>
                <th className="th">Rating</th>
                <th className="th">Comment</th>
                <th className="th">Status</th>
                <th className="th">Date</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id} className="hover:bg-surface/60 transition-colors">
                  <td className="td font-medium text-xs text-gray-800">{r.product}</td>
                  <td className="td text-xs text-gray-500">{r.user}</td>
                  <td className="td"><Stars n={r.rating} /></td>
                  <td className="td text-xs text-gray-500 max-w-[220px] truncate">{r.comment}</td>
                  <td className="td">
                    <span className={`badge text-[10px] ${r.status === 'published' ? 'badge-success' : 'badge-danger'}`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </td>
                  <td className="td text-xs text-gray-400">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
