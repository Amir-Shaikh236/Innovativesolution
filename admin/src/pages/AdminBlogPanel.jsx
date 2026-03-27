import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Edit, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import api, { BASE_URL } from '../api';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

import BlogDialog from '../components/BlogDialog';
import DeleteDialog from '@/components/DeleteDialog';

export default function AdminBlogPanel() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  // 🚨 Premium Delete Confirmation State
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, title: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/blogs/all");
      setBlogs(res.data || []);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (id, title) => {
    setDeleteDialog({ open: true, id, title });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await api.delete(`/blogs/${deleteDialog.id}`);
      toast.success('Blog post deleted successfully');
      fetchBlogs();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error('Failed to delete blog post');
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ open: false, id: null, title: '' });
    }
  };

  const openAddDialog = () => {
    setSelectedBlog(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (blog) => {
    setSelectedBlog(blog);
    setIsDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    setIsDialogOpen(false);
    fetchBlogs();
  };

  const filteredBlogs = blogs.filter(b =>
    b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-full overflow-hidden">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50 tracking-tight flex items-center gap-2 transition-colors">
            <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
            Manage Blog Posts
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1 transition-colors">
            Draft, edit, and publish articles for your platform.
          </p>
        </div>

        <Button onClick={openAddDialog} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm rounded-xl transition-all duration-200">
          <Plus className="h-5 w-5" />
          Add Article
        </Button>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
          <Input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 pl-9 bg-gray-50/50 dark:bg-slate-950 dark:text-slate-100 border-transparent dark:border-slate-800 focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 dark:focus-visible:border-emerald-500/50 transition-all rounded-xl"
          />
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-gray-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900 transition-colors">
        {/* 🚨 Overflow wrapper for perfect mobile swiping */}
        <div className="overflow-x-auto w-full">
          <div className="min-w-[800px] px-4 sm:px-6 py-2">
            <Table>
              <TableHeader className="bg-gray-50/50 dark:bg-slate-800/50 rounded-t-xl transition-colors">
                <TableRow className="hover:bg-transparent border-gray-100 dark:border-slate-800">
                  <TableHead className="font-semibold text-gray-600 dark:text-slate-300 text-center rounded-tl-xl w-24">Cover</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-slate-300 text-left">Article Details</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-slate-300 text-center whitespace-nowrap">Category</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-slate-300 text-center whitespace-nowrap">Status</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-slate-300 text-center rounded-tr-xl w-28 whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow className="hover:bg-transparent border-gray-100 dark:border-slate-800">
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex justify-center items-center gap-2 text-gray-500 dark:text-slate-400">
                        <Loader2 className="h-5 w-5 animate-spin text-emerald-600 dark:text-emerald-500" /> Loading articles...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredBlogs.length === 0 ? (
                  <TableRow className="hover:bg-transparent border-gray-100 dark:border-slate-800">
                    <TableCell colSpan={5} className="h-48 text-center">
                      <BookOpen className="h-10 w-10 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-lg font-medium text-gray-900 dark:text-slate-100">No blogs found</p>
                      <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">Get started by creating a new article.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBlogs.map((blog) => (
                    <TableRow key={blog._id} className="hover:bg-emerald-50/60 dark:hover:bg-emerald-500/10 transition-colors duration-200 border-gray-100 dark:border-slate-800 last:border-0">

                      <TableCell className="text-center py-3">
                        <div className="flex justify-center">
                          {blog.image ? (
                            <img src={`${BASE_URL}${blog.image}`} alt={blog.title} className="w-14 h-10 object-cover rounded-lg shadow-sm border border-gray-200 dark:border-slate-700" />
                          ) : (
                            <div className="w-14 h-10 rounded-lg bg-gray-50 dark:bg-slate-800 border border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-gray-400 dark:text-slate-500" />
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-left">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 dark:text-slate-100 truncate max-w-[200px] sm:max-w-sm" title={blog.title}>
                            {blog.title}
                          </span>
                          <span className="text-[11px] text-gray-400 dark:text-slate-500 font-medium truncate max-w-[200px] sm:max-w-sm mt-0.5">
                            /{blog.slug}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center whitespace-nowrap">
                        <Badge variant="secondary" className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors font-medium">
                          {blog.category || 'Uncategorized'}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center whitespace-nowrap">
                        <Badge variant="outline" className={`font-semibold ${blog.published
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                          }`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center whitespace-nowrap">
                        <div className="flex justify-center gap-1 sm:gap-2">
                          <Button onClick={() => openEditDialog(blog)} variant="ghost" size="icon" className="text-gray-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 h-8 w-8 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => openDeleteDialog(blog._id, blog.title)} variant="ghost" size="icon" className="text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 h-8 w-8 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      <BlogDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} initialData={selectedBlog} onSuccess={handleDialogSuccess} />

      {/* 🚨 Premium Delete Confirmation Dialog */}
      <DeleteDialog isOpen={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null, name: '' })}
        onConfirm={confirmDelete}
        itemName={deleteDialog.name}
        entityType='Blog'
        isDeleting={isDeleting}
      />

    </div>
  );
}