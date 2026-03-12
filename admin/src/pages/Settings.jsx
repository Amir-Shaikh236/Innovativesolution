import React, { useState, useEffect } from 'react';
import {
    User, Lock, Palette, Save, Eye, EyeOff, Check,
    Mail, Phone, MapPin, Building2, Camera,
    Sun, Moon, Monitor
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '../api';
import { useTheme } from '@/components/ThemeProvider';

// ─── Shared helpers ────────────────────────────────────────────────────────────

function Field({ label, id, hint, children, className = "" }) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <div className="flex items-center justify-between">
                <Label htmlFor={id} className="text-[13px] font-semibold text-gray-700 dark:text-slate-300 transition-colors">{label}</Label>
                {hint && <span className="text-[11px] text-gray-400 dark:text-slate-500 transition-colors">{hint}</span>}
            </div>
            {children}
        </div>
    );
}

const inputCls =
    'h-10 rounded-lg border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 text-sm ' +
    'placeholder:text-gray-400 dark:placeholder:text-slate-600 ' +
    'focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 dark:focus-visible:border-emerald-500/50 ' +
    'disabled:opacity-50 transition-colors w-full';

// ══════════════════════════════════════════════════════════════════════════════
//  TAB 1 — Profile
// ══════════════════════════════════════════════════════════════════════════════
function ProfileTab() {
    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '',
        phone: '', company: '', location: '', bio: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

    useEffect(() => {
        api.get('/admin/settings/profile')
            .then(({ data }) => {
                if (data.success) setForm({
                    firstName: data.data.firstName ?? '',
                    lastName: data.data.lastName ?? '',
                    email: data.data.email ?? '',
                    phone: data.data.phone ?? '',
                    company: data.data.company ?? '',
                    location: data.data.location ?? '',
                    bio: data.data.bio ?? '',
                });
            })
            .catch(() => toast.error('Could not load profile.'))
            .finally(() => setLoading(false));
    }, []);

    const save = async () => {
        if (!form.firstName.trim() || !form.lastName.trim())
            return toast.error('First and last name are required.');
        if (!form.email.includes('@'))
            return toast.error('A valid email is required.');

        setSaving(true);
        try {
            const { data } = await api.put('/admin/settings/profile', form);
            if (data.success) toast.success('Profile updated successfully.');
            else toast.error(data.msg || 'Failed to save profile.');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to save profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="py-16 text-center text-sm text-gray-400 dark:text-slate-500">Loading profile…</div>;

    return (
        <div className="space-y-6">
            <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors w-full overflow-hidden">
                <CardHeader className="pb-4 border-b border-gray-100 dark:border-slate-800/60 mb-4">
                    <CardTitle className="text-base font-bold text-gray-900 dark:text-slate-100">Profile Picture</CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-slate-400">Your avatar shown across the dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="relative shrink-0">
                            <div className="w-[88px] h-[88px] rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                                <span className="text-4xl font-black text-white select-none">
                                    {form.firstName ? form.firstName[0].toUpperCase() : 'A'}
                                </span>
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                <Camera className="w-4 h-4 text-gray-600 dark:text-slate-400" />
                            </button>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Upload a new photo</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Recommended: Square JPG, PNG or GIF — max 2 MB</p>
                            <Button variant="outline" size="sm" className="mt-3 h-9 text-xs rounded-lg border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-700 dark:text-slate-300 font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                Choose File
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors w-full overflow-hidden">
                <CardHeader className="pb-4 border-b border-gray-100 dark:border-slate-800/60 mb-4">
                    <CardTitle className="text-base font-bold text-gray-900 dark:text-slate-100">Personal Information</CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-slate-400">Your name, contact details, and public bio.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* 🚨 Constrained to max-w-3xl so fields don't stretch into infinity */}
                    <div className="max-w-3xl space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Field label="First Name" id="fn">
                                <Input id="fn" value={form.firstName} onChange={set('firstName')} className={inputCls} />
                            </Field>
                            <Field label="Last Name" id="ln">
                                <Input id="ln" value={form.lastName} onChange={set('lastName')} className={inputCls} />
                            </Field>
                            <Field label="Email Address" id="em">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                                    <Input id="em" type="email" value={form.email} onChange={set('email')} className={`${inputCls} pl-10`} />
                                </div>
                            </Field>
                            <Field label="Phone Number" id="ph">
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                                    <Input id="ph" value={form.phone} onChange={set('phone')} className={`${inputCls} pl-10`} />
                                </div>
                            </Field>
                            <Field label="Company / Organization" id="co">
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                                    <Input id="co" value={form.company} onChange={set('company')} className={`${inputCls} pl-10`} />
                                </div>
                            </Field>
                            <Field label="Location" id="loc">
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                                    <Input id="loc" value={form.location} onChange={set('location')} className={`${inputCls} pl-10`} />
                                </div>
                            </Field>
                        </div>

                        <Field label="Public Bio" id="bio" hint="Optional">
                            <Textarea id="bio" rows={4} placeholder="A short bio about yourself or your role…"
                                value={form.bio} onChange={set('bio')}
                                className="rounded-lg border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 text-sm placeholder:text-gray-400 dark:placeholder:text-slate-600 resize-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 dark:focus-visible:border-emerald-500/50 transition-colors w-full" />
                        </Field>
                    </div>
                </CardContent>
                {/* 🚨 Changed to justify-start so button aligns with the form */}
                <CardFooter className="bg-gray-50/50 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-800/60 px-6 py-4 flex justify-start">
                    <Button onClick={save} disabled={saving} className="h-10 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm gap-2 text-[13px] w-full sm:w-auto transition-all cursor-pointer">
                        {saving ? 'Saving…' : <><Save className="w-4 h-4" />Save Profile</>}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
//  TAB 2 — Security
// ══════════════════════════════════════════════════════════════════════════════
function SecurityTab() {
    const [show, setShow] = useState({ cur: false, nw: false, cf: false });
    const [pwd, setPwd] = useState({ cur: '', nw: '', cf: '' });
    const [saving, setSaving] = useState(false);

    const toggle = k => () => setShow(p => ({ ...p, [k]: !p[k] }));
    const setP = k => e => setPwd(p => ({ ...p, [k]: e.target.value }));

    const strength = (() => {
        const p = pwd.nw; if (!p) return null;
        let s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return [
            { label: 'Weak', color: 'bg-red-400', w: 'w-1/4' },
            { label: 'Fair', color: 'bg-amber-400', w: 'w-2/4' },
            { label: 'Good', color: 'bg-blue-400', w: 'w-3/4' },
            { label: 'Strong', color: 'bg-emerald-500', w: 'w-full' },
        ][Math.min(s - 1, 3)];
    })();

    const changePwd = async () => {
        if (!pwd.cur || !pwd.nw || !pwd.cf) return toast.error('Fill in all password fields.');
        if (pwd.nw !== pwd.cf) return toast.error('New passwords do not match.');
        if (pwd.nw.length < 8) return toast.error('Password must be at least 8 characters.');

        setSaving(true);
        try {
            const { data } = await api.put('/admin/settings/security/password', {
                currentPassword: pwd.cur,
                newPassword: pwd.nw,
                confirmPassword: pwd.cf,
            });
            if (data.success) { toast.success('Password changed successfully.'); setPwd({ cur: '', nw: '', cf: '' }); }
            else toast.error(data.msg || 'Failed to change password.');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to change password.');
        } finally { setSaving(false); }
    };

    const PwdRow = ({ id, label, field, showKey }) => (
        <Field label={label} id={id}>
            <div className="relative">
                <Input id={id} type={show[showKey] ? 'text' : 'password'}
                    value={pwd[field]} onChange={setP(field)} placeholder="••••••••"
                    className={`${inputCls} pr-10`} />
                <Button type="button" variant="ghost" size="icon" onClick={toggle(showKey)} tabIndex={-1}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-transparent cursor-pointer">
                    {show[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
            </div>
        </Field>
    );

    return (
        <div className="space-y-6">
            <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors w-full overflow-hidden">
                <CardHeader className="pb-4 border-b border-gray-100 dark:border-slate-800/60 mb-4">
                    <CardTitle className="text-base font-bold text-gray-900 dark:text-slate-100">Change Password</CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-slate-400">Ensure your account is using a long, random password to stay secure.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* 🚨 Constrained to max-w-xl so inputs aren't miles long */}
                    <div className="max-w-xl space-y-5">
                        <PwdRow id="cur" label="Current Password" field="cur" showKey="cur" />
                        <PwdRow id="nw" label="New Password" field="nw" showKey="nw" />
                        {pwd.nw && strength && (
                            <div className="space-y-1.5">
                                <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.w}`} />
                                </div>
                                <p className="text-[12px] text-gray-500 dark:text-slate-400 font-medium transition-colors">Password Strength: <span className="font-bold">{strength.label}</span></p>
                            </div>
                        )}
                        <PwdRow id="cf" label="Confirm New Password" field="cf" showKey="cf" />
                    </div>
                </CardContent>
                {/* 🚨 Justify-start aligned */}
                <CardFooter className="bg-gray-50/50 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-800/60 px-6 py-4 flex justify-start">
                    <Button onClick={changePwd} disabled={saving}
                        className="h-10 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm gap-2 text-[13px] w-full sm:w-auto transition-all cursor-pointer">
                        {saving ? 'Updating…' : <><Lock className="w-4 h-4" />Update Password</>}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
//  TAB 3 — Appearance
// ══════════════════════════════════════════════════════════════════════════════
function AppearanceTab() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="space-y-6">
            <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors w-full overflow-hidden">
                <CardHeader className="pb-4 border-b border-gray-100 dark:border-slate-800/60 mb-4">
                    <CardTitle className="text-base font-bold text-gray-900 dark:text-slate-100">Theme Preference</CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-slate-400">Select your preferred color scheme for the dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { id: 'light', label: 'Light Mode', Icon: Sun },
                            { id: 'dark', label: 'Dark Mode', Icon: Moon },
                            { id: 'system', label: 'System Default', Icon: Monitor },
                        ].map(({ id, label, Icon }) => {
                            const isActive = theme === id;
                            return (
                                <button
                                    key={id}
                                    onClick={() => setTheme(id)}
                                    className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all cursor-pointer ${isActive
                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                                        : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-emerald-200 dark:hover:border-emerald-500/30'
                                        }`}
                                >
                                    <Icon className={`w-7 h-7 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-slate-500'}`} />
                                    <span className={`text-[14px] font-bold ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-600 dark:text-slate-300'}`}>
                                        {label}
                                    </span>

                                    <div className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-emerald-500 scale-100 opacity-100' : 'bg-transparent scale-50 opacity-0'
                                        }`}>
                                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors w-full overflow-hidden">
                <CardHeader className="pb-4 border-b border-gray-100 dark:border-slate-800/60 mb-4">
                    <CardTitle className="text-base font-bold text-gray-900 dark:text-slate-100">Localisation</CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-slate-400">Language and regional formatting options.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Language" id="lang">
                            <Select defaultValue="en">
                                <SelectTrigger id="lang" className="h-10 rounded-lg border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 text-sm transition-colors w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                                    <SelectItem value="en">English (US)</SelectItem>
                                    <SelectItem value="en-gb">English (UK)</SelectItem>
                                    <SelectItem value="es">Spanish</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Timezone" id="tz">
                            <Select defaultValue="Asia/Kolkata">
                                <SelectTrigger id="tz" className="h-10 rounded-lg border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 text-sm transition-colors w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                                    <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


// ══════════════════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
const TABS = [
    { id: 'profile', label: 'Profile', Icon: User },
    { id: 'security', label: 'Security', Icon: Lock },
    { id: 'appearance', label: 'Appearance', Icon: Palette },
];

export default function Settings() {
    return (
        <div className="space-y-6 w-full max-w-full overflow-hidden">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-[26px] font-black text-gray-900 dark:text-slate-50 tracking-tight transition-colors">Settings</h1>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 transition-colors">Manage your profile, security, and platform configuration.</p>
                </div>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <div className="w-full mb-6">
                    <TabsList className="flex w-full h-12 sm:h-14 bg-gray-100/70 dark:bg-slate-900/60 border border-gray-200/60 dark:border-slate-800/80 rounded-xl sm:p-1.5 gap-1.5 transition-colors">
                        {TABS.map(({ id, label, Icon }) => (
                            <TabsTrigger key={id} value={id}
                                className="flex-1 flex items-center justify-center gap-2 h-full rounded-lg text-[13px] sm:text-[14px] font-bold text-gray-500 dark:text-slate-400
                                    data-[state=active]:bg-emerald-600 data-[state=active]:text-white dark:data-[state=active]:bg-emerald-500 data-[state=active]:shadow-md
                                    hover:text-gray-800 dark:hover:text-slate-200 transition-all cursor-pointer min-w-0">
                                <Icon className="w-4 h-4 shrink-0" />
                                <span className="truncate">{label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="w-full">
                    <TabsContent value="profile" className="mt-0 focus-visible:ring-0"><ProfileTab /></TabsContent>
                    <TabsContent value="security" className="mt-0 focus-visible:ring-0"><SecurityTab /></TabsContent>
                    <TabsContent value="appearance" className="mt-0 focus-visible:ring-0"><AppearanceTab /></TabsContent>
                </div>
            </Tabs>
        </div>
    );
}