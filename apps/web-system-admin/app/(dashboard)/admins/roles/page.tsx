import { ShieldCheck, ShoppingBag, Dumbbell, Users } from 'lucide-react'

const roles = [
  {
    key: 'super_admin',
    label: 'Super Admin',
    icon: <ShieldCheck size={22} className="text-brand" />,
    bg: 'bg-brand/10',
    count: 1,
    description: 'Full platform access — can manage all admins, content, shop, users, and system settings.',
    permissions: [
      'Manage all admin accounts',
      'Access all platform sections',
      'Modify system settings',
      'View audit logs & storage',
      'Create/delete categories',
      'Delete any user or content',
    ],
  },
  {
    key: 'user_admin',
    label: 'User Admin',
    icon: <Users size={22} className="text-success" />,
    bg: 'bg-success/10',
    count: 2,
    description: 'Manages app-user accounts — can view, update, ban, and unban users.',
    permissions: [
      'List & view all app users',
      'Update user profile data',
      'Ban / unban users',
      'Delete users (super_admin grants)',
    ],
  },
  {
    key: 'shop_admin',
    label: 'Shop Admin',
    icon: <ShoppingBag size={22} className="text-warning" />,
    bg: 'bg-warning/10',
    count: 2,
    description: 'Manages the shop — products they own, orders, and images.',
    permissions: [
      'Create & update own products',
      'Upload/delete product images',
      'View & update order statuses',
      'Cannot create categories (super_admin only)',
    ],
  },
  {
    key: 'sport_admin',
    label: 'Sport Admin',
    icon: <Dumbbell size={22} className="text-purple-500" />,
    bg: 'bg-purple-100',
    count: 1,
    description: 'Manages sport content — workouts, programs, exercises, and content posts.',
    permissions: [
      'CRUD workouts & exercises',
      'CRUD fitness programs',
      'CRUD content posts & media',
      'Publish / unpublish content',
      'Cannot create categories (super_admin only)',
    ],
  },
]

export default function RolesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Role Overview</h1>
        <p className="text-sm text-slate-500 mt-0.5">Permissions breakdown for each admin role</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map(r => (
          <div key={r.key} className="card">
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${r.bg}`}>
                {r.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-slate-800">{r.label}</p>
                  <span className="badge badge-neutral text-[10px]">{r.count} admin{r.count > 1 ? 's' : ''}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{r.description}</p>
              </div>
            </div>
            <ul className="space-y-1.5">
              {r.permissions.map(p => (
                <li key={p} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="text-success mt-0.5 shrink-0">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
