import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Edit, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import api, { BASE_URL } from '../api';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

import SubpageDialog from '../components/SubpageDialog';

export default function Subpages() {
  const [subpages, setSubpages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubpage, setSelectedSubpage] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [subRes, catRes] = await Promise.all([
        api.get('/subpages'),
        api.get('/categories')
      ]);
      setSubpages(subRes.data || []);
      setCategories(catRes.data.categories || catRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subpage?')) return;
    try {
      await api.delete(`/subpages/${id}`);
      fetchInitialData();
    } catch {
      alert('Delete failed');
    }
  };

  const openAddDialog = () => {
    setSelectedSubpage(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (subpage) => {
    setSelectedSubpage(subpage);
    setIsDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    setIsDialogOpen(false);
    fetchInitialData();
  };

  const filteredSubpages = subpages.filter(sp =>
    sp.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-emerald-600" />
            Manage Subpages
          </h1>
          <p className="text-gray-500 text-sm mt-1">Create and structure content pages within your categories.</p>
        </div>

        <Button onClick={openAddDialog} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm rounded-xl transition-all duration-200">
          <Plus className="h-5 w-5" />
          Add Subpage
        </Button>
      </div>

      <div className="bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search subpages..."
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
                <TableHead className="font-semibold text-gray-600 text-center rounded-tl-xl">Image</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center">Title</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center">Category</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center">Order</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center rounded-tr-xl">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex justify-center items-center gap-2 text-gray-500">
                      <Loader2 className="h-5 w-5 animate-spin text-emerald-600" /> Loading subpages...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredSubpages.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="h-48 text-center">
                    <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-900">No subpages found</p>
                    <p className="text-sm text-gray-500 mt-1">Get started by creating a new subpage.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubpages.map((sp) => (
                  <TableRow key={sp._id} className="hover:bg-emerald-50/60 transition-colors duration-200 border-gray-50">
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {sp.image ? (
                          <img src={`${BASE_URL}${sp.image}`} alt={sp.title} className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900 text-center">
                      <div className="flex flex-col items-center">
                        <span>{sp.title}</span>
                        <span className="text-xs text-gray-400 font-normal mt-0.5">/{sp.slug}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                        {sp.category ? (typeof sp.category === 'object' ? sp.category.name : 'Linked Category') : 'No Category'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-gray-500 font-medium">{sp.order || '0'}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button onClick={() => openEditDialog(sp)} variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 h-8 w-8 rounded-lg cursor-pointer transition-colors duration-200">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDelete(sp._id)} variant="ghost" size="icon" className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 rounded-lg cursor-pointer transition-colors duration-200">
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

      <SubpageDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} initialData={selectedSubpage} onSuccess={handleDialogSuccess} categories={categories} />
    </div>
  );
}