import React, { useState, useEffect } from 'react';
import { Layers, Plus, Search, Edit, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import api from '../api';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import CategoryDialog from '../components/CategoryDialog';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 🚨 New Delete Confirmation State
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data.categories || response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // 🚨 Opens the custom Delete Alert Dialog
  const openDeleteDialog = (id, name) => {
    setDeleteDialog({ open: true, id, name });
  };

  // 🚨 Handles the actual deletion after confirmation
  const confirmDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await api.delete(`/categories/${deleteDialog.id}`);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch {
      toast.error('Failed to delete category');
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ open: false, id: null, name: '' });
    }
  };

  const openAddDialog = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const openEditDialog = (category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchCategories();
  };

  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Layers className="h-6 w-6 text-emerald-600" />
            Manage Categories
          </h1>
          <p className="text-gray-500 text-sm mt-1">Create, edit, and organize your platform's categories.</p>
        </div>
        <Button onClick={openAddDialog} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm rounded-xl transition-all duration-200">
          <Plus className="h-5 w-5" /> Add Category
        </Button>
      </div>

      {/* Controls */}
      <div className="bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input type="text" placeholder="Search categories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-10 pl-9 bg-gray-50/50 border-transparent focus-visible:bg-white focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all rounded-xl" />
        </div>
      </div>

      {/* Table */}
      <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden">
        <div className='px-6 py-2'>
          <Table>
            <TableHeader className="bg-gray-50/50 rounded-t-xl">
              <TableRow className="hover:bg-transparent border-gray-100">
                <TableHead className="font-semibold text-gray-600 text-center rounded-tl-xl">Category Name</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center">Description</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center">Status</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center rounded-tr-xl">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex justify-center items-center gap-2 text-gray-500">
                      <Loader2 className="h-5 w-5 animate-spin text-emerald-600" /> Loading categories...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="h-48 text-center">
                    <Layers className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-900">No categories found</p>
                    <p className="text-sm text-gray-500 mt-1">Get started by creating a new category.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category._id} className="hover:bg-emerald-50/60 transition-colors duration-200 border-gray-50">
                    <TableCell className="font-medium text-gray-900 text-center">{category.name}</TableCell>
                    <TableCell className="text-gray-500 max-w-xs truncate text-center mx-auto">{category.description || "No description provided."}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Badge variant="outline" className={`font-medium ${category.isActive !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                          {category.isActive !== false ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button onClick={() => openEditDialog(category)} variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 h-8 w-8 rounded-lg cursor-pointer transition-colors duration-200">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => openDeleteDialog(category._id, category.name)} variant="ghost" size="icon" className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 rounded-lg cursor-pointer transition-colors duration-200">
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

      {/* Forms Component */}
      <CategoryDialog isOpen={isFormOpen} onOpenChange={setIsFormOpen} initialData={selectedCategory} onSuccess={handleFormSuccess} />

      {/* 🚨 Delete Confirmation Dialog using your Gold Standard Blueprint */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && !isDeleting && setDeleteDialog(p => ({ ...p, open: false }))}>
        <AlertDialogContent className="rounded-2xl max-w-sm">
          <AlertDialogHeader>
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1 bg-rose-50">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>
            <AlertDialogTitle className="text-base font-bold text-gray-900">
              Delete Category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500">
              Are you sure you want to permanently delete <span className="font-semibold text-gray-700">{deleteDialog.name}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 mt-2">
            <AlertDialogCancel disabled={isDeleting} className="rounded-lg h-9 text-sm font-medium border-gray-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); confirmDelete(); }} disabled={isDeleting}
              className="rounded-lg h-9 text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white">
              {isDeleting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</> : 'Delete Category'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}