import React, { useState, useEffect } from 'react';
import {
    Plus, X, Loader2, UploadCloud, Trash2,
    LayoutTemplate, ChevronDown, Layers, Save
} from 'lucide-react';
import api, { BASE_URL } from '../api';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent as AlertContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import UpdateDialog from './UpdateDialog';

/* ─────────────────── constants & helpers ─────────────────── */
const SECTION_TYPES = [
    { value: 'overview', label: 'Overview' },
    { value: 'features', label: 'Features' },
    { value: 'target', label: 'Target Audience' },
    { value: 'cta', label: 'Call to Action' }
];

const INITIAL_FORM = { name: '', slug: '', description: '', order: 0, image: '', sections: [], _id: null };

function Label({ children, required, hint }) {
    return (
        <div className="flex items-center justify-between mb-1.5">
            <label className="text-[13px] font-semibold text-gray-600 dark:text-slate-300">
                {children}{required && <span className="text-emerald-500 ml-0.5">*</span>}
            </label>
            {hint && <span className="text-[11px] text-gray-400 dark:text-slate-500">{hint}</span>}
        </div>
    );
}

function SectionDivider({ title }) {
    return (
        <div className="flex items-center gap-3 py-1">
            <span className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">{title}</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-slate-800" />
        </div>
    );
}

// Fixed badge colors to support dark mode
const BADGE_COLORS = {
    overview: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20',
    features: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20',
    target: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    cta: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
};

function TypeBadge({ type }) {
    const label = SECTION_TYPES.find(t => t.value === type)?.label;
    if (!label) return null;
    return (
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${BADGE_COLORS[type] ?? 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}>
            {label}
        </span>
    );
}

// Extracted styles to include dark mode utilities
const INPUT = "h-11 text-sm bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-slate-100 rounded-lg placeholder:text-gray-300 dark:placeholder:text-slate-600 focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-400 dark:focus-visible:border-emerald-500/50 transition-colors w-full";
const SELECT = "w-full h-11 pl-3.5 pr-9 text-sm bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 dark:focus:border-emerald-500/50 text-gray-700 dark:text-slate-100 transition-colors cursor-pointer";
const TAREA = "text-sm bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-slate-100 rounded-lg placeholder:text-gray-300 dark:placeholder:text-slate-600 focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-400 dark:focus-visible:border-emerald-500/50 resize-none transition-colors w-full";

/* ═══════════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════════ */
export default function CategoryDialog({ isOpen, onOpenChange, initialData, onSuccess }) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    const [confirmUpdateDialog, setConfirmUpdateDialog] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        if (initialData) {
            setForm({ ...initialData, sections: initialData.sections || [] });
            setPreview(initialData.image ? (initialData.image.startsWith('blob:') ? initialData.image : `${BASE_URL}${initialData.image}`) : '');
        } else {
            setForm(INITIAL_FORM);
            setPreview('');
        }
        setError('');
    }, [isOpen, initialData]);

    const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    const patchSection = (idx, field, value) => setForm(p => { const s = [...p.sections]; s[idx] = { ...s[idx], [field]: value }; return { ...p, sections: s }; });
    const addSection = () => setForm(p => ({ ...p, sections: [...p.sections, { type: '', heading: '', content: '' }] }));
    const removeSection = (i) => setForm(p => ({ ...p, sections: p.sections.filter((_, j) => j !== i) }));

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setUploading(true);
        const fd = new FormData();
        fd.append('image', file);
        try {
            const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setForm(p => ({ ...p, image: data.url }));
        } catch {
            toast.error('Image upload failed. Please try again.');
        } finally { setUploading(false); }
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setPreview('');
        setForm(p => ({ ...p, image: '' }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (form._id) {
            setConfirmUpdateDialog(true);
        } else {
            executeSave();
        }
    };

    const executeSave = async () => {
        setConfirmUpdateDialog(false);
        try {
            if (form._id) {
                await api.put(`/categories/${form._id}`, form);
                toast.success('Category updated successfully!');
            } else {
                await api.post('/categories', form);
                toast.success('Category created successfully!');
            }
            onSuccess();
        } catch (err) {
            const msg = err.response?.data?.error || 'Save failed. Please check your connection.';
            setError(msg);
            toast.error(msg);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {/* Added max-h for small mobile screens to prevent cutting off */}
            <DialogContent className="w-[95vw] sm:w-[90vw] max-w-[860px] h-[90vh] sm:h-[88vh] max-h-[850px] p-0 overflow-hidden bg-[#f8faf9] dark:bg-slate-950 border-none rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/50 flex flex-col [&>button]:hidden transition-colors">

                <div className="h-[3px] w-full bg-gradient-to-r from-emerald-400 to-teal-400 shrink-0" />

                {/* Header */}
                <div className="shrink-0 flex items-center justify-between px-5 sm:px-9 py-4 sm:py-5 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors">
                    <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center shrink-0 transition-colors">
                            <LayoutTemplate className="w-[18px] h-[18px] text-emerald-600 dark:text-emerald-500" />
                        </div>
                        <div className="min-w-0">
                            <DialogTitle className="text-[16px] sm:text-[17px] font-bold text-gray-900 dark:text-slate-50 leading-tight truncate">
                                {form._id ? 'Edit Category' : 'Create New Category'}
                            </DialogTitle>
                            <p className="text-[11px] sm:text-xs text-gray-400 dark:text-slate-500 mt-0.5 truncate">
                                {form._id ? 'Update details and save your changes.' : 'Fill in the details to add a new category.'}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => onOpenChange(false)} className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                        <X className="w-[15px] h-[15px]" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <form id="cat-form" onSubmit={handleFormSubmit}>
                        <div className="px-5 sm:px-9 py-6 sm:py-7 space-y-8">

                            {error && (
                                <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-sm text-red-600 dark:text-red-400 transition-colors">
                                    <X className="w-4 h-4 shrink-0" />
                                    <span className="font-medium">{error}</span>
                                </div>
                            )}

                            {/* --- BASIC DETAILS --- */}
                            <div className="space-y-5">
                                <SectionDivider title="Basic Details" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <Label required>Category Name</Label>
                                        <Input name="name" value={form.name} onChange={set} required placeholder="e.g. Graphic Design" className={INPUT} />
                                    </div>
                                    <div>
                                        <Label required hint="Used in page URL">URL Slug</Label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-sm select-none">/</span>
                                            <Input name="slug" value={form.slug} onChange={set} required placeholder="graphic-design" className={`${INPUT} pl-[26px]`} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Label>Short Description</Label>
                                    <Textarea name="description" value={form.description} onChange={set} rows={3} placeholder="A brief summary of what this category offers…" className={TAREA} />
                                </div>
                                <div className="sm:w-1/3">
                                    <Label hint="Optional">Display Order</Label>
                                    <Input type="number" name="order" value={form.order} onChange={set} className={INPUT} />
                                </div>
                            </div>

                            {/* --- CATEGORY BANNER --- */}
                            <div className="space-y-4">
                                <SectionDivider title="Category Banner" />
                                <div className="flex flex-col sm:flex-row gap-5">
                                    <label className="flex-1 flex flex-col items-center justify-center gap-3 min-h-[140px] rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:bg-emerald-50/20 dark:hover:bg-emerald-500/5 cursor-pointer transition-all group">
                                        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="sr-only" />
                                        <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                                            {uploading ? <Loader2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-spin" /> : <UploadCloud className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                                        </div>
                                        <div className="text-center px-4">
                                            <p className="text-sm font-semibold text-gray-600 dark:text-slate-300">{uploading ? 'Uploading…' : 'Drop file or click to browse'}</p>
                                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">PNG, JPG, GIF — max 2 MB</p>
                                        </div>
                                    </label>

                                    <div className={`relative group/preview w-full sm:w-40 h-[140px] rounded-xl overflow-hidden shrink-0 flex items-center justify-center transition-colors ${preview && !uploading ? 'border-2 border-emerald-200 dark:border-emerald-500/50 shadow-sm' : 'border-2 border-dashed border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
                                        {preview && !uploading ? (
                                            <>
                                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/0 group-hover/preview:bg-black/60 transition-all flex items-center justify-center">
                                                    <button type="button" onClick={handleRemoveImage} className="opacity-0 group-hover/preview:opacity-100 transition-all flex flex-col items-center gap-1.5 text-white">
                                                        <div className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-colors cursor-pointer">
                                                            <Trash2 className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-[11px] font-semibold drop-shadow">Remove</span>
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-xs text-gray-400 dark:text-slate-500 text-center px-4">Preview will appear here</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* --- PAGE SECTIONS --- */}
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">Page Sections</span>
                                    {form.sections.length > 0 && <span className="text-[11px] font-bold px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-md">{form.sections.length}</span>}
                                    <div className="flex-1 h-px bg-gray-100 dark:bg-slate-800 min-w-[50px]" />
                                    <button type="button" onClick={addSection} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 rounded-lg transition-colors shrink-0">
                                        <Plus className="w-3.5 h-3.5" /> Add Section
                                    </button>
                                </div>

                                {form.sections.length === 0 ? (
                                    <div className="flex flex-col items-center gap-3 py-10 sm:py-12 rounded-xl bg-white dark:bg-slate-900 border-2 border-dashed border-gray-200 dark:border-slate-800 transition-colors">
                                        <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center">
                                            <Layers className="w-5 h-5 text-gray-300 dark:text-slate-500" />
                                        </div>
                                        <div className="text-center px-4">
                                            <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">No sections yet</p>
                                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Click "Add Section" to start building the page.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {form.sections.map((section, idx) => (
                                            <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden group transition-colors">

                                                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="w-5 h-5 rounded-md text-[11px] font-bold text-gray-400 dark:text-slate-400 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                                                            {idx + 1}
                                                        </span>
                                                        {section.type ? <TypeBadge type={section.type} /> : <span className="text-xs text-gray-400 dark:text-slate-500">Untitled block</span>}
                                                    </div>
                                                    <button type="button" onClick={() => removeSection(idx)} className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-all sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100">
                                                        <Trash2 className="w-3 h-3" /> <span className="hidden sm:inline">Remove</span>
                                                    </button>
                                                </div>

                                                <div className="p-4 sm:p-5 space-y-4">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label required>Block Type</Label>
                                                            <div className="relative">
                                                                <select value={section.type} onChange={e => patchSection(idx, 'type', e.target.value)} required className={SELECT}>
                                                                    <option value="" disabled>Select a type…</option>
                                                                    {SECTION_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                                                </select>
                                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label required={section.type !== 'cta'}>Heading</Label>
                                                            <Input value={section.heading} onChange={e => patchSection(idx, 'heading', e.target.value)} placeholder="e.g. Why choose us?" required={section.type !== 'cta'} className={INPUT} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label required>Content</Label>
                                                        <Textarea rows={3} value={section.content} onChange={e => patchSection(idx, 'content', e.target.value)} placeholder="Enter section content…" required className={TAREA} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Controls */}
                <div className="shrink-0 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 px-5 sm:px-9 py-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 transition-colors">
                    <p className="text-xs text-gray-400 dark:text-slate-500 text-center sm:text-left">
                        Fields marked <span className="text-emerald-500 dark:text-emerald-400 font-semibold">*</span> are required
                    </p>
                    <div className="flex flex-col-reverse sm:flex-row gap-2.5">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-10 px-5 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                            Cancel
                        </Button>
                        <Button type="submit" form="cat-form" disabled={uploading} className="h-10 px-7 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm shadow-emerald-200/60 dark:shadow-none transition-all">
                            {uploading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Uploading…</> : form._id ? 'Save Changes' : 'Create Category'}
                        </Button>
                    </div>
                </div>

                {/* Update Confirmation Dialog */}
                <UpdateDialog isOpen={confirmUpdateDialog} onClose={() => setConfirmUpdateDialog(false)}
                    onConfirm={executeSave}
                    itemName={form.name}
                    isUpdating={false}
                />
            </DialogContent>
        </Dialog>
    );
}