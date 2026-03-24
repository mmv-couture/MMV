import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

const AdminUsers: React.FC = () => {
  const { getAllUsers, updateUserRole, deleteUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'date'>('name');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setUsers(getAllUsers());
  }, [getAllUsers]);

  const handleRoleChange = (id: string, role: any) => {
    updateUserRole(id, role);
    setUsers(getAllUsers());
  };

  const handleDelete = (id: string) => {
    if (!confirm('🚨 ATTENTION: Supprimer cet utilisateur ? Cette action est irréversible.')) return;
    setDeletingId(id);
    setTimeout(() => {
      deleteUser(id);
      setUsers(getAllUsers());
      setDeletingId(null);
    }, 300);
  };

  const filteredUsers = users
    .filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'role') return a.role.localeCompare(b.role);
      return a.email.localeCompare(b.email);
    });

  const superadminCount = users.filter(u => u.role === 'superadmin').length;
  const managerCount = users.filter(u => u.role === 'manager').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm">
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Total Utilisateurs</p>
          <p className="text-3xl font-black text-orange-900 mt-2">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm">
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Superadmins</p>
          <p className="text-3xl font-black text-purple-700 mt-2">{superadminCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Managers</p>
          <p className="text-3xl font-black text-blue-700 mt-2">{managerCount}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-orange-200 bg-orange-50 focus:border-orange-900 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sm"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 rounded-lg border border-orange-200 bg-orange-50 focus:border-orange-900 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sm font-medium"
          >
            <option value="name">Trier par Email</option>
            <option value="role">Trier par Rôle</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-orange-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-orange-50 border-b-2 border-orange-200">
            <tr>
              <th className="px-6 py-4 font-black text-xs uppercase tracking-widest text-gray-600">Email</th>
              <th className="px-6 py-4 font-black text-xs uppercase tracking-widest text-gray-600">Rôle</th>
              <th className="px-6 py-4 font-black text-xs uppercase tracking-widest text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-50">
            {filteredUsers.map((u) => (
              <tr
                key={u.id}
                className={`hover:bg-orange-50/50 transition-colors duration-200 ${
                  deletingId === u.id ? 'opacity-50' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs">
                      {u.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{u.email}</p>
                      <p className="text-xs text-gray-400">ID: {u.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className={`px-3 py-2 rounded-lg border font-bold text-xs uppercase tracking-wider transition-all ${
                      u.role === 'superadmin'
                        ? 'bg-purple-50 border-purple-200 text-purple-700'
                        : 'bg-blue-50 border-blue-200 text-blue-700'
                    }`}
                  >
                    <option value="manager">Manager</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(u.id)}
                    disabled={deletingId === u.id}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200 font-bold text-xs uppercase tracking-wider hover:bg-red-100 transition-all disabled:opacity-50"
                  >
                    {deletingId === u.id ? 'Suppression...' : 'Supprimer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
