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
import DeleteDialog from '@/components/DeleteDialog';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Delete Confirmation State
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

  const openDeleteDialog = (id, name) => {
    setDeleteDialog({ open: true, id, name });
  };

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
    <div className="space-y-6 max-w-full overflow-hidden">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50 tracking-tight flex items-center gap-2 transition-colors">
            <Layers className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
            Manage Categories
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1 transition-colors">
            Create, edit, and organize your platform's categories.
          </p>
        </div>
        <Button onClick={openAddDialog} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm rounded-xl transition-all duration-200">
          <Plus className="h-5 w-5" /> Add Category
        </Button>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 pl-9 bg-gray-50/50 dark:bg-slate-950 dark:text-slate-100 border-transparent dark:border-slate-800 focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 dark:focus-visible:border-emerald-500/50 transition-all rounded-xl"
          />
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-gray-100 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900 transition-colors">
        {/* 🚨 This overflow-x-auto wrapper is the key to perfect mobile tables! */}
        <div className="overflow-x-auto w-full">
          <div className="min-w-[600px] px-4 sm:px-6 py-2">
            <Table>
              <TableHeader className="bg-gray-50/50 dark:bg-slate-800/50 rounded-t-xl transition-colors">
                <TableRow className="hover:bg-transparent border-gray-100 dark:border-slate-800">
                  <TableHead className="font-semibold text-gray-600 dark:text-slate-300 text-center rounded-tl-xl whitespace-nowrap">Category Name</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-slate-300 text-center">Description</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-slate-300 text-center whitespace-nowrap">Status</TableHead>
                  <TableHead className="font-semibold text-gray-600 dark:text-slate-300 text-center rounded-tr-xl whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow className="hover:bg-transparent border-gray-100 dark:border-slate-800">
                    <TableCell colSpan={4} className="h-32 text-center">
                      <div className="flex justify-center items-center gap-2 text-gray-500 dark:text-slate-400">
                        <Loader2 className="h-5 w-5 animate-spin text-emerald-600 dark:text-emerald-500" /> Loading categories...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCategories.length === 0 ? (
                  <TableRow className="hover:bg-transparent border-gray-100 dark:border-slate-800">
                    <TableCell colSpan={4} className="h-48 text-center">
                      <Layers className="h-10 w-10 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-lg font-medium text-gray-900 dark:text-slate-100">No categories found</p>
                      <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">Get started by creating a new category.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category._id} className="hover:bg-emerald-50/60 dark:hover:bg-emerald-500/10 transition-colors duration-200 border-gray-100 dark:border-slate-800 last:border-0">
                      <TableCell className="font-medium text-gray-900 dark:text-slate-100 text-center whitespace-nowrap">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-gray-500 dark:text-slate-400 max-w-[150px] sm:max-w-xs truncate text-center mx-auto">
                        {category.description || "No description provided."}
                      </TableCell>
                      <TableCell className="text-center whitespace-nowrap">
                        <div className="flex justify-center">
                          <Badge
                            variant="outline"
                            className={`font-medium ${category.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                              : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                              }`}
                          >
                            {category.isActive !== false ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center whitespace-nowrap">
                        <div className="flex justify-center gap-1 sm:gap-2">
                          <Button onClick={() => openEditDialog(category)} variant="ghost" size="icon" className="text-gray-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 h-8 w-8 rounded-lg cursor-pointer transition-colors duration-200">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => openDeleteDialog(category._id, category.name)} variant="ghost" size="icon" className="text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 h-8 w-8 rounded-lg cursor-pointer transition-colors duration-200">
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

      {/* Forms Component */}
      <CategoryDialog isOpen={isFormOpen} onOpenChange={setIsFormOpen} initialData={selectedCategory} onSuccess={handleFormSuccess} />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog isOpen={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null, name: '' })}
        onConfirm={confirmDelete}
        itemName={deleteDialog.name}
        entityType='Category'
        isDeleting={isDeleting}
      />

    </div>
  );
}