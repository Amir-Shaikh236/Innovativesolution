import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Edit, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import api, { BASE_URL } from '../api';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

// 🚨 Import the stunning dialog we just built
import BlogDialog from '../components/BlogDialog';

export default function AdminBlogPanel() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this blog post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error("Delete failed:", error);
      alert('Delete failed');
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
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-emerald-600" />
            Manage Blog Posts
          </h1>
          <p className="text-gray-500 text-sm mt-1">Draft, edit, and publish articles for your platform.</p>
        </div>

        <Button onClick={openAddDialog} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm rounded-xl transition-all duration-200">
          <Plus className="h-5 w-5" />
          Add Article
        </Button>
      </div>

      <div className="bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 pl-9 bg-gray-50/50 border-transparent focus-visible:bg-white focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all rounded-xl"
          />
        </div>
      </div>

      <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        <div className='px-6 py-2'>
          <Table>
            <TableHeader className="bg-gray-50/50 rounded-t-xl">
              <TableRow className="hover:bg-transparent border-gray-100">
                <TableHead className="font-semibold text-gray-600 text-center rounded-tl-xl w-24">Cover</TableHead>
                <TableHead className="font-semibold text-gray-600 text-left">Article Details</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center">Category</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center">Status</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center rounded-tr-xl w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex justify-center items-center gap-2 text-gray-500">
                      <Loader2 className="h-5 w-5 animate-spin text-emerald-600" /> Loading articles...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBlogs.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="h-48 text-center">
                    <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-900">No blogs found</p>
                    <p className="text-sm text-gray-500 mt-1">Get started by creating a new article.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBlogs.map((blog) => (
                  <TableRow key={blog._id} className="hover:bg-emerald-50/60 transition-colors duration-200 border-gray-50">
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {blog.image ? (
                          <img src={`${BASE_URL}${blog.image}`} alt={blog.title} className="w-14 h-10 object-cover rounded shadow-sm border border-gray-200" />
                        ) : (
                          <div className="w-14 h-10 rounded bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-left">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 truncate max-w-sm" title={blog.title}>{blog.title}</span>
                        <span className="text-xs text-gray-400 font-medium truncate max-w-sm">/{blog.slug}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium">
                        {blog.category || 'Uncategorized'}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge variant="outline" className={`font-semibold ${blog.published ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {blog.published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        <Button onClick={() => openEditDialog(blog)} variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 h-8 w-8 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDelete(blog._id)} variant="ghost" size="icon" className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 rounded-lg transition-colors">
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
      </Card>

      <BlogDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} initialData={selectedBlog} onSuccess={handleDialogSuccess} />
    </div>
  );
}