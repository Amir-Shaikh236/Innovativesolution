import React, { useState, useEffect } from 'react';
import {
    X, Loader2, UploadCloud, Trash2,
    BookOpen, ChevronDown, Check, Save
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

/* ─────────────────── constants ─────────────────── */
const BLOG_CATEGORIES = [
    "Software Services", "AI Agents", "HR Solutions",
    "Case Studies", "Future of Work / Industry Trends"
];

const INITIAL_FORM = {
    title: "", summary: "", body: "", image: "",
    published: false, slug: "", category: "", tags: "", _id: null
};

/* ─────────────────── tiny helpers ─────────────────── */
function Label({ children, required, hint }) {
    return (
        <div className="flex items-center justify-between mb-1.5">
            <label className="text-[13px] font-semibold text-gray-600 dark:text-slate-300 transition-colors">
                {children}
                {required && <span className="text-emerald-500 ml-0.5">*</span>}
            </label>
            {hint && <span className="text-[11px] text-gray-400 dark:text-slate-500 transition-colors">{hint}</span>}
        </div>
    );
}

function SectionDivider({ title }) {
    return (
        <div className="flex items-center gap-3 py-1">
            <span className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap transition-colors">
                {title}
            </span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-slate-800 transition-colors" />
        </div>
    );
}

/* shared Tailwind tokens with Dark Mode injected */
const INPUT = "h-11 text-sm bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-slate-100 rounded-lg placeholder:text-gray-300 dark:placeholder:text-slate-600 focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-400 dark:focus-visible:border-emerald-500/50 transition-colors w-full";
const SELECT = "w-full h-11 pl-3.5 pr-9 text-sm bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 dark:focus:border-emerald-500/50 text-gray-700 dark:text-slate-100 transition-colors cursor-pointer";
const TAREA = "text-sm bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-slate-100 rounded-lg placeholder:text-gray-300 dark:placeholder:text-slate-600 focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-400 dark:focus-visible:border-emerald-500/50 resize-y transition-colors w-full";

/* ═══════════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════════ */
export default function BlogDialog({ isOpen, onOpenChange, initialData, onSuccess }) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    // 🚨 Update Confirmation Dialog State
    const [confirmUpdateDialog, setConfirmUpdateDialog] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        if (initialData) {
            setForm({
                ...initialData,
                tags: initialData.tags ? initialData.tags.join(", ") : "",
            });
            setPreview(
                initialData.image
                    ? (initialData.image.startsWith('blob:') ? initialData.image : `${BASE_URL}${initialData.image}`)
                    : ''
            );
        } else {
            setForm(INITIAL_FORM);
            setPreview('');
        }
        setError('');
    }, [isOpen, initialData]);

    const set = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

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
        } catch { setError('Image upload failed. Please try again.'); }
        finally { setUploading(false); }
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setPreview('');
        setForm(p => ({ ...p, image: '' }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!form.image) {
            setError('Please upload a cover image for the blog post.');
            return;
        }

        if (form._id) {
            setConfirmUpdateDialog(true);
        } else {
            executeSave();
        }
    };

    const executeSave = async () => {
        setConfirmUpdateDialog(false);
        const blogData = {
            ...form,
            tags: form.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        };

        try {
            if (form._id) {
                await api.put(`/blogs/${form._id}`, blogData);
                toast.success('Blog post updated successfully!');
            } else {
                await api.post('/blogs', blogData);
                toast.success('Blog post created successfully!');
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
            <DialogContent className="w-[95vw] sm:w-[90vw] max-w-[860px] h-[90vh] sm:h-[88vh] max-h-[850px] p-0 overflow-hidden bg-[#f8faf9] dark:bg-slate-950 border-none rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/50 flex flex-col [&>button]:hidden transition-colors">

                {/* ▸ Top accent stripe */}
                <div className="h-[3px] w-full bg-gradient-to-r from-emerald-400 to-teal-400 shrink-0" />

                {/* ══ HEADER ══════════════════════════════════════════════ */}
                <div className="shrink-0 flex items-center justify-between px-5 sm:px-9 py-4 sm:py-5 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors">
                    <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center shrink-0 transition-colors">
                            <BookOpen className="w-[18px] h-[18px] text-emerald-600 dark:text-emerald-500" />
                        </div>
                        <div className="min-w-0">
                            <DialogTitle className="text-[16px] sm:text-[17px] font-bold text-gray-900 dark:text-slate-50 leading-tight truncate">
                                {form._id ? 'Edit Blog Post' : 'Create New Blog Post'}
                            </DialogTitle>
                            <p className="text-[11px] sm:text-xs text-gray-400 dark:text-slate-500 mt-0.5 truncate">
                                {form._id ? 'Update article details and save your changes.' : 'Draft a new article for your readers.'}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => onOpenChange(false)} className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                        <X className="w-[15px] h-[15px]" />
                    </button>
                </div>

                {/* ══ SCROLLABLE BODY ═════════════════════════════════════ */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <form id="blog-form" onSubmit={handleFormSubmit}>
                        <div className="px-5 sm:px-9 py-6 sm:py-7 space-y-8">

                            {/* ── Error ── */}
                            {error && (
                                <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-sm text-red-600 dark:text-red-400 transition-colors">
                                    <X className="w-4 h-4 shrink-0" />
                                    <span className="font-medium">{error}</span>
                                </div>
                            )}

                            {/* ══════════════════════════════════
                                SECTION 1 — Post Metadata
                            ══════════════════════════════════ */}
                            <div className="space-y-5">
                                <SectionDivider title="Post Metadata" />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <Label required>Article Title</Label>
                                        <Input name="title" value={form.title} onChange={set} required placeholder="e.g. The Future of AI Agents" className={INPUT} />
                                    </div>
                                    <div>
                                        <Label required hint="Used in page URL">URL Slug</Label>
                                        <div className="relative">
                                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-sm select-none">/</span>
                                            <Input name="slug" value={form.slug} onChange={set} required placeholder="future-of-ai-agents" className={`${INPUT} pl-[26px]`} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <Label required>Category</Label>
                                        <div className="relative">
                                            <select name="category" value={form.category} onChange={set} required className={SELECT}>
                                                <option value="" disabled>Select Category…</option>
                                                {BLOG_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label hint="Comma-separated">Tags</Label>
                                        <Input name="tags" value={form.tags} onChange={set} placeholder="e.g. Technology, AI, Updates" className={INPUT} />
                                    </div>
                                </div>
                            </div>

                            {/* ══════════════════════════════════
                                SECTION 2 — Cover Image
                            ══════════════════════════════════ */}
                            <div className="space-y-4">
                                <SectionDivider title="Cover Image" />

                                <div className="flex flex-col sm:flex-row gap-5">
                                    <label className="
                                        flex-1 flex flex-col items-center justify-center gap-3
                                        min-h-[140px] rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-800
                                        bg-white dark:bg-slate-900 hover:border-emerald-400 dark:hover:border-emerald-500/50
                                        hover:bg-emerald-50/20 dark:hover:bg-emerald-500/5 cursor-pointer transition-all group
                                    ">
                                        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="sr-only" />
                                        <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                                            {uploading ? <Loader2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-spin" /> : <UploadCloud className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                                        </div>
                                        <div className="text-center px-4">
                                            <p className="text-sm font-semibold text-gray-600 dark:text-slate-300">
                                                {uploading ? 'Uploading…' : 'Drop file or click to browse'}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Recommended: 1200x630px (Max 2MB)</p>
                                        </div>
                                    </label>

                                    {/* Preview Box */}
                                    <div className={`
                                        relative group/preview w-full sm:w-40 h-[140px] rounded-xl overflow-hidden shrink-0
                                        flex items-center justify-center transition-colors
                                        ${preview && !uploading ? 'border-2 border-emerald-200 dark:border-emerald-500/50 shadow-sm' : 'border-2 border-dashed border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900'}
                                    `}>
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

                            {/* ══════════════════════════════════
                                SECTION 3 — Article Content
                            ══════════════════════════════════ */}
                            <div className="space-y-5">
                                <SectionDivider title="Article Content" />

                                <div>
                                    <Label required>Summary Excerpt</Label>
                                    <Textarea name="summary" value={form.summary} onChange={set} rows={2} required placeholder="A brief hook or excerpt displayed on the blog listing page..." className={TAREA} />
                                </div>

                                <div>
                                    <Label required>Full Body Content</Label>
                                    <Textarea name="body" value={form.body} onChange={set} rows={12} required placeholder="Write your full article here (Markdown/HTML supported if your frontend renders it)..." className={TAREA} />
                                </div>
                            </div>

                            {/* ══════════════════════════════════
                                SECTION 4 — Visibility  
                            ══════════════════════════════════ */}
                            <div className="space-y-4 pt-2">
                                <SectionDivider title="Visibility Status" />
                                <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-500/10 transition-colors w-fit">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${form.published ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-gray-50 dark:bg-slate-950 border-gray-300 dark:border-slate-700 text-transparent'}`}>
                                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                    </div>
                                    <input type="checkbox" name="published" checked={form.published} onChange={set} className="sr-only" />
                                    <div>
                                        <p className="text-[13px] font-bold text-gray-800 dark:text-slate-200">Publish Article</p>
                                        <p className="text-[11px] text-gray-500 dark:text-slate-400">Make this post visible to the public.</p>
                                    </div>
                                </label>
                            </div>

                        </div>
                    </form>
                </div>

                {/* ══ FOOTER ═════════════════════════════════════════════ */}
                <div className="shrink-0 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 px-5 sm:px-9 py-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 transition-colors">
                    <p className="text-xs text-gray-400 dark:text-slate-500 text-center sm:text-left">
                        Fields marked <span className="text-emerald-500 dark:text-emerald-400 font-semibold">*</span> are required
                    </p>
                    <div className="flex flex-col-reverse sm:flex-row gap-2.5">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-10 px-5 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                            Cancel
                        </Button>
                        <Button type="submit" form="blog-form" disabled={uploading} className="h-10 px-7 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm shadow-emerald-200/60 dark:shadow-none transition-all">
                            {uploading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Uploading…</> : form._id ? 'Save Changes' : 'Publish Article'}
                        </Button>
                    </div>
                </div>

                {/* 🚨 Update Confirmation Dialog (Emerald Theme) */}
                <UpdateDialog isOpen={confirmUpdateDialog} onClose={() => setConfirmUpdateDialog(false)}
                    onConfirm={executeSave}
                    itemName={form.name}
                    isUpdating={false}
                />

            </DialogContent>
        </Dialog>
    );
}