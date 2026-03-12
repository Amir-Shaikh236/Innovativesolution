import React, { useState, useEffect } from 'react';
import { Users, Search, Loader2, Shield, ShieldAlert, AlertCircle, RefreshCw, UserCheck } from 'lucide-react';
import api from '../api';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [confirmDialog, setConfirmDialog] = useState({ open: false, userId: null, isAdmin: false, name: '' });
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/users');
      setUsers(res.data || []);
    } catch (err) {
      setError('Failed to fetch users. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const openConfirmDialog = (userId, isAdmin, name) => {
    setConfirmDialog({ open: true, userId, isAdmin, name });
  };

  const handleConfirmToggle = async () => {
    const { userId, isAdmin } = confirmDialog;
    setConfirmDialog({ open: false, userId: null, isAdmin: false, name: '' });
    setUpdatingId(userId);
    try {
      await api.put(`/users/${userId}/admin`, { isAdmin: !isAdmin });
      await fetchUsers();
    } catch (err) {
      setError('Failed to update user role. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchString = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || (filterRole === "admin" ? user.isAdmin : !user.isAdmin);
    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter(u => u.isAdmin).length;
  const standardCount = users.filter(u => !u.isAdmin).length;

  const getInitials = (first = '', last = '') => `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

  // 🚨 Upgraded to include dark mode background/text colors for avatars
  const getAvatarColor = (name = '') => {
    const colors = [
      'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400',
      'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
      'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
      'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400',
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400'
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <TooltipProvider>
      {/* 🚨 Replaced hardcoded wrapper with the standard layout wrapper */}
      <div className="space-y-6 max-w-full overflow-hidden">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm transition-colors">
              <Users className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-slate-50 tracking-tight transition-colors">User Management</h1>
              <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors">Manage roles and administrator access</p>
            </div>
          </div>
          <Button
            onClick={fetchUsers}
            variant="outline"
            size="sm"
            className="gap-2 rounded-lg bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 font-medium shadow-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors w-full sm:w-auto"
            disabled={loading}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats (Responsive Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Users', value: users.length, icon: Users, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-800' },
            { label: 'Administrators', value: adminCount, icon: Shield, color: 'text-emerald-600 dark:text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20' },
            { label: 'Standard Users', value: standardCount, icon: UserCheck, color: 'text-blue-600 dark:text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/20' },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`bg-white dark:bg-slate-900 rounded-xl border ${border} p-4 shadow-sm flex items-center gap-4 transition-colors`}>
              <div className={`${bg} p-2.5 rounded-lg transition-colors`}><Icon className={`h-4 w-4 ${color}`} /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-50 transition-colors">{loading ? '—' : value}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium transition-colors">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center justify-between gap-3 px-4 py-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-700 dark:text-red-400 transition-colors">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 dark:hover:text-red-300 text-lg leading-none">&times;</button>
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors">

          {/* Toolbar */}
          <div className="px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 dark:text-slate-500" />
              <Input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-8 text-sm bg-gray-50/50 dark:bg-slate-950 dark:text-slate-100 border-gray-200 dark:border-slate-800 focus-visible:ring-1 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-500/50 rounded-lg transition-colors" />
            </div>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800/50 p-1 rounded-lg w-full sm:w-auto overflow-x-auto custom-scrollbar transition-colors">
              {[['all', 'All'], ['admin', 'Admins'], ['standard', 'Standard']].map(([val, label]) => (
                <button key={val} onClick={() => setFilterRole(val)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap flex-1 sm:flex-none ${filterRole === val
                    ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
                    }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Responsive Table Wrapper */}
          <div className="overflow-x-auto w-full">
            <div className="min-w-[650px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80 dark:bg-slate-800/50 hover:bg-gray-50/80 dark:hover:bg-slate-800/50 border-gray-100 dark:border-slate-800 transition-colors">
                    <TableHead className="pl-6 font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">User</TableHead>
                    <TableHead className="font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Email</TableHead>
                    <TableHead className="text-center font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Role</TableHead>
                    <TableHead className="pr-6 text-right font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow className="hover:bg-transparent border-gray-100 dark:border-slate-800">
                      <TableCell colSpan={4} className="h-48 text-center">
                        <div className="flex flex-col justify-center items-center gap-3 text-gray-400 dark:text-slate-500">
                          <Loader2 className="h-6 w-6 animate-spin text-emerald-500 dark:text-emerald-400" />
                          <span className="text-sm font-medium">Loading users...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow className="hover:bg-transparent border-gray-100 dark:border-slate-800">
                      <TableCell colSpan={4} className="h-48 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-full transition-colors"><Users className="h-6 w-6 text-gray-400 dark:text-slate-500" /></div>
                          <p className="font-semibold text-gray-700 dark:text-slate-300">No users found</p>
                          <p className="text-sm text-gray-400 dark:text-slate-500">Try adjusting your search or filter.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => {
                      const fullName = `${user.name || ''} `;
                      const isUpdating = updatingId === user._id;
                      return (
                        <TableRow key={user._id} className="border-gray-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group">
                          <TableCell className="pl-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 shadow-sm">
                                <AvatarFallback className={`text-xs font-bold ${getAvatarColor(user.firstName || user.name)}`}>
                                  {getInitials(user.firstName || user.name, user.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <p className="font-semibold text-gray-900 dark:text-slate-100 text-sm whitespace-nowrap">{fullName}</p>
                            </div>
                          </TableCell>
                          <TableCell className="py-3.5 text-sm text-gray-500 dark:text-slate-400">{user.email}</TableCell>
                          <TableCell className="text-center py-3.5 whitespace-nowrap">
                            <Badge variant="outline" className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${user.isAdmin
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                              : 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                              }`}>
                              {user.isAdmin ? <><Shield className="inline w-3 h-3 mr-1" />Admin</> : 'Standard'}
                            </Badge>
                          </TableCell>
                          <TableCell className="pr-6 text-right py-3.5 whitespace-nowrap">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                {/* 🚨 Fixed mobile opacity issue: `opacity-100` on mobile, `sm:opacity-0` for desktop hover effect */}
                                <Button onClick={() => openConfirmDialog(user._id, user.isAdmin, fullName)} variant="ghost" size="sm" disabled={isUpdating}
                                  className={`h-8 px-3 rounded-lg text-xs font-semibold opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all ${user.isAdmin
                                    ? 'text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-500 dark:hover:bg-rose-500/10'
                                    : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-500 dark:hover:bg-emerald-500/10'
                                    }`}>
                                  {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    : user.isAdmin ? <><ShieldAlert className="w-3.5 h-3.5 mr-1.5" />Revoke Admin</>
                                      : <><Shield className="w-3.5 h-3.5 mr-1.5" />Grant Admin</>}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="text-xs bg-gray-900 text-white dark:bg-slate-800 border-none">
                                {user.isAdmin ? 'Remove admin privileges' : 'Promote to administrator'}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {!loading && filteredUsers.length > 0 && (
            <div className="px-4 sm:px-6 py-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 transition-colors">
              <p className="text-xs text-gray-400 dark:text-slate-500 font-medium">
                Showing <span className="text-gray-600 dark:text-slate-300 font-semibold">{filteredUsers.length}</span> of <span className="text-gray-600 dark:text-slate-300 font-semibold">{users.length}</span> users
              </p>
            </div>
          )}
        </div>

        {/* Role Toggle Confirm Dialog */}
        <AlertDialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog(p => ({ ...p, open: false }))}>
          <AlertDialogContent className="rounded-2xl max-w-sm bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 transition-colors">
            <AlertDialogHeader>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-colors ${confirmDialog.isAdmin ? 'bg-rose-50 dark:bg-rose-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}>
                {confirmDialog.isAdmin
                  ? <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-500" />
                  : <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                }
              </div>
              <AlertDialogTitle className="text-base font-bold text-gray-900 dark:text-slate-100">
                {confirmDialog.isAdmin ? 'Revoke Admin Access' : 'Grant Admin Access'}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-500 dark:text-slate-400">
                {confirmDialog.isAdmin ? 'This will remove administrator privileges from ' : 'This will grant full administrator privileges to '}
                <span className="font-semibold text-gray-700 dark:text-slate-300">{confirmDialog.name}</span>. Are you sure?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 mt-2">
              <AlertDialogCancel className="rounded-lg h-9 text-sm font-medium border-gray-200 dark:border-slate-700 bg-transparent text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmToggle}
                className={`rounded-lg h-9 text-sm font-semibold transition-colors ${confirmDialog.isAdmin
                  ? 'bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-600 dark:hover:bg-rose-700'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700'
                  }`}>
                {confirmDialog.isAdmin ? 'Revoke Access' : 'Grant Access'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </TooltipProvider>
  );
}