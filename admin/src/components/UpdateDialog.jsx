import React from 'react';
import { Save, Loader2 } from 'lucide-react';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function UpdateDialog({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    isUpdating = false
}) {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && !isUpdating && onClose()}>
            <AlertDialogContent className="rounded-2xl max-w-sm z-[70] bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 transition-colors">
                <AlertDialogHeader>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1 bg-emerald-50 dark:bg-emerald-500/10 transition-colors">
                        <Save className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <AlertDialogTitle className="text-base font-bold text-gray-900 dark:text-slate-100">
                        Confirm Update
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-500 dark:text-slate-400">
                        Are you sure you want to update <span className="font-semibold text-gray-700 dark:text-slate-300">{itemName}</span>? This will overwrite the live data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 mt-2">
                    <AlertDialogCancel
                        disabled={isUpdating}
                        className="rounded-lg h-9 text-sm font-medium border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                    >
                        Back to Edit
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => { e.preventDefault(); onConfirm(); }}
                        disabled={isUpdating}
                        className="rounded-lg h-9 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-emerald-600"
                    >
                        {isUpdating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}