'use client';

import { PageHeader, NewMainLayout } from '@/components/layout/new-main-layout';
import { Card, CardContent } from '@/components/ui';

export default function SettingsPage() {
    return (
        <NewMainLayout>
            <PageHeader
                title="Settings"
                subtitle="Manage your dashboard preferences and account."
                gradient="orange"
            />

            <div className="max-w-4xl mx-auto space-y-8 mt-8">
                <section className="space-y-4">
                    <h3 className="text-xl font-bold text-charcoal-900 dark:text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile Configuration
                    </h3>
                    <Card>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">Full Name</label>
                                    <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 text-charcoal-900 dark:text-white">
                                        Gabriele Pitou
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase">Email Address</label>
                                    <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 text-charcoal-900 dark:text-white">
                                        gabriele@purrify.ca
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xl font-bold text-charcoal-900 dark:text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Security & Access
                    </h3>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/10 rounded-xl border border-primary-100 dark:border-primary-900/30">
                                <div>
                                    <h4 className="font-bold text-primary-700 dark:text-primary-400">Two-Factor Authentication</h4>
                                    <p className="text-sm text-primary-600 dark:text-primary-500">Add an extra layer of security to your account.</p>
                                </div>
                                <div className="w-12 h-6 bg-primary-500 rounded-full relative">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xl font-bold text-charcoal-900 dark:text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        Notifications
                    </h3>
                    <Card>
                        <CardContent className="space-y-4 pt-6">
                            {['Email Notifications', 'Push Notifications', 'Real-time Sales Alerts', 'Weekly Reports Summary'].map((item) => (
                                <div key={item} className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">{item}</span>
                                    <div className="w-10 h-5 bg-neutral-200 dark:bg-neutral-700 rounded-full relative">
                                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </NewMainLayout>
    );
}
