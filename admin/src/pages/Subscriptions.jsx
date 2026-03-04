import React, { useState, useEffect } from 'react';
import { Mail, Search, Loader2, RefreshCw, CalendarDays, Download, AlertCircle, Trash2, Users } from 'lucide-react';
import api from '../api';
import { toast, Toaster } from 'sonner';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, email: '' });
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { fetchSubscriptions(); }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/subscriptions');
      setSubscriptions(res.data || []);
    } catch (err) {
      toast.error('Failed to load subscriptions', {
        description: 'Please check your connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    const toastId = toast.loading('Refreshing subscriptions...');
    try {
      await fetchSubscriptions();
      toast.success('Subscriptions refreshed', { id: toastId, description: 'List is up to date.' });
    } catch {
      toast.error('Refresh failed', { id: toastId });
    }
  };

  const handleDelete = async () => {
    const { id, email } = deleteDialog;
    setDeleteDialog({ open: false, id: null, email: '' });
    setDeletingId(id);
    const toastId = toast.loading(`Removing ${email}...`);
    try {
      await api.delete(`/subscriptions/${id}`);
      setSubscriptions(prev => prev.filter(s => s._id !== id));
      toast.success('Subscriber removed', {
        id: toastId,
        description: `${email} has been unsubscribed.`,
      });
    } catch {
      toast.error('Failed to remove subscriber', {
        id: toastId,
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCSV = () => {
    if (filteredSubscriptions.length === 0) {
      toast.error('Nothing to export', { description: 'No subscriptions match your current filter.' });
      return;
    }
    const csv = ['Email,Subscribed At', ...filteredSubscriptions.map(s =>
      `${s.email},${new Date(s.subscribedAt).toLocaleDateString()}`
    )].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscriptions.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export successful', { description: `${filteredSubscriptions.length} subscribers exported.` });
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return {
      display: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      relative: Math.floor((Date.now() - date) / (1000 * 60 * 60 * 24)) + 'd ago',
    };
  };

  // Group by month for a subtle visual cue
  const thisMonth = subscriptions.filter(s => {
    const d = new Date(s.subscribedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <Mail className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Newsletter Subscriptions</h1>
              <p className="text-sm text-gray-500">Manage and export your subscriber list</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleExportCSV} variant="outline" size="sm"
              className="gap-2 rounded-lg border-gray-200 text-gray-600 font-medium shadow-sm hover:text-gray-900">
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}
              className="gap-2 rounded-lg border-gray-200 text-gray-600 font-medium shadow-sm hover:text-gray-900">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Subscribers', value: subscriptions.length, icon: Users, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
            { label: 'New This Month', value: thisMonth, icon: CalendarDays, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { label: 'Filtered Results', value: loading ? '—' : filteredSubscriptions.length, icon: Search, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`bg-white rounded-xl border ${border} p-4 shadow-sm flex items-center gap-4`}>
              <div className={`${bg} p-2.5 rounded-lg`}><Icon className={`h-4 w-4 ${color}`} /></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{loading ? '—' : value}</p>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input type="text" placeholder="Search by email..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-8 text-sm bg-gray-50 border-gray-200 focus-visible:ring-1 focus-visible:ring-slate-400 rounded-lg" />
            </div>
            {searchTerm && (
              <Badge variant="outline" className="text-xs font-medium text-gray-500 border-gray-200 bg-gray-50 rounded-full px-2.5">
                {filteredSubscriptions.length} result{filteredSubscriptions.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-gray-100">
                <TableHead className="pl-6 font-semibold text-gray-500 text-xs uppercase tracking-wider">Email Address</TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Subscribed</TableHead>
                <TableHead className="text-center font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="pr-6 text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="h-48 text-center">
                    <div className="flex flex-col justify-center items-center gap-3 text-gray-400">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
                      <span className="text-sm font-medium">Loading subscriptions...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredSubscriptions.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-gray-100 rounded-full"><Mail className="h-6 w-6 text-gray-400" /></div>
                      <p className="font-semibold text-gray-700">No subscribers found</p>
                      <p className="text-sm text-gray-400">
                        {searchTerm ? 'Try a different search term.' : 'No one has subscribed yet.'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscriptions.map((sub) => {
                  const { display, relative } = formatDate(sub.subscribedAt);
                  const isDeleting = deletingId === sub._id;
                  const isNew = (Date.now() - new Date(sub.subscribedAt)) < 7 * 24 * 60 * 60 * 1000;
                  return (
                    <TableRow key={sub._id} className="border-gray-100 hover:bg-slate-50/60 transition-colors group">

                      {/* Email */}
                      <TableCell className="pl-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                            <Mail className="w-3 h-3 text-blue-500" />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{sub.email}</span>
                        </div>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="py-3.5">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-700 font-medium">{display}</span>
                          <span className="text-xs text-gray-400">{relative}</span>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center py-3.5">
                        {isNew ? (
                          <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border-emerald-200">
                            ✦ New
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-50 text-gray-500 border-gray-200">
                            Active
                          </Badge>
                        )}
                      </TableCell>

                      {/* Action */}
                      <TableCell className="pr-6 text-right py-3.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => setDeleteDialog({ open: true, id: sub._id, email: sub.email })}
                              variant="ghost" size="sm" disabled={isDeleting}
                              className="h-8 w-8 p-0 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100">
                              {isDeleting
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <Trash2 className="h-3.5 w-3.5" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left" className="text-xs">Remove subscriber</TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {!loading && filteredSubscriptions.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
              <p className="text-xs text-gray-400 font-medium">
                Showing <span className="text-gray-600 font-semibold">{filteredSubscriptions.length}</span> of{' '}
                <span className="text-gray-600 font-semibold">{subscriptions.length}</span> subscribers
              </p>
            </div>
          )}
        </div>

        {/* Delete Confirm Dialog */}
        <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog(p => ({ ...p, open: false }))}>
          <AlertDialogContent className="rounded-2xl max-w-sm">
            <AlertDialogHeader>
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-1">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <AlertDialogTitle className="text-base font-bold text-gray-900">Remove Subscriber</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-500">
                This will permanently unsubscribe{' '}
                <span className="font-semibold text-gray-700">{deleteDialog.email}</span>.
                They will no longer receive newsletters.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 mt-2">
              <AlertDialogCancel className="rounded-lg h-9 text-sm font-medium border-gray-200">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}
                className="rounded-lg h-9 text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white">
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </TooltipProvider>
  );
}