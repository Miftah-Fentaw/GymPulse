'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, ShoppingBag, Dumbbell, Users, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../../lib/apiClient';
import { countValue } from '../../../../lib/utils';

const roles = [
  {
    key: 'super_admin',
    label: 'Super Admin',
    icon: <ShieldCheck size={22} className="text-brand" />,
    bg: 'bg-brand/10',
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
    description: 'Manages sport content — workouts, programs, exercises, and content posts.',
    permissions: [
      'CRUD workouts & exercises',
      'CRUD fitness programs',
      'CRUD content posts & media',
      'Publish / unpublish content',
      'Cannot create categories (super_admin only)',
    ],
  },
];

export default function RolesPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      const { data, error } = await apiFetch('/admin/system/admins/overview');
      if (error) {
        setErrorMsg(error);
        setCounts({});
      } else {
        setCounts({
          super_admin: countValue(data?.super_admin),
          user_admin: countValue(data?.user_admin),
          shop_admin: countValue(data?.shop_admin),
          sport_admin: countValue(data?.sport_admin),
          regular_user: countValue(data?.regular_user),
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Role Overview</h1>
        <p className="text-sm text-slate-500 mt-0.5">Permissions breakdown for each admin role</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading roles…
        </div>
      ) : (
        <>
          <div className="card py-4 text-center max-w-xs">
            <p className="text-xs text-slate-400">Regular users (no admin role)</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{counts.regular_user ?? 0}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((r) => {
              const count = counts[r.key] ?? 0;
              return (
                <div key={r.key} className="card">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${r.bg}`}>
                      {r.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800">{r.label}</p>
                        <span className="badge badge-neutral text-[10px]">
                          {count} admin{count === 1 ? '' : 's'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{r.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {r.permissions.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="text-success mt-0.5 shrink-0">✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
