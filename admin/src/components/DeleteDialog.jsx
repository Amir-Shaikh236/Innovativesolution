import React from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DeleteDialog({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    entityType = "Item", // e.g., "Category", "Subpage", "User"
    isDeleting = false
}) {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && !isDeleting && onClose()}>
            <AlertDialogContent className="rounded-2xl max-w-sm bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 transition-colors z-[60]">
                <AlertDialogHeader>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1 bg-rose-50 dark:bg-rose-500/10">
                        <Trash2 className="w-5 h-5 text-rose-600 dark:text-rose-500" />
                    </div>
                    <AlertDialogTitle className="text-base font-bold text-gray-900 dark:text-slate-100">
                        Delete {entityType}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-500 dark:text-slate-400">
                        Are you sure you want to permanently delete <span className="font-semibold text-gray-700 dark:text-slate-300">{itemName}</span>? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 mt-2">
                    <AlertDialogCancel
                        disabled={isDeleting}
                        className="rounded-lg h-9 text-sm font-medium border-gray-200 dark:border-slate-700 bg-transparent text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => { e.preventDefault(); onConfirm(); }}
                        disabled={isDeleting}
                        className="rounded-lg h-9 text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-600 dark:hover:bg-rose-700"
                    >
                        {isDeleting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</> : `Delete ${entityType}`}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}