'use client';

import { PageHeader, NewMainLayout } from '@/components/layout/new-main-layout';
import { Card, CardContent } from '@/components/ui';

export default function SalesPage() {
    return (
        <NewMainLayout>
            <PageHeader
                title="Sales Management"
                subtitle="Track every interaction, sample, and purchase across Canada."
                gradient="green"
            />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Active Leads', value: '1,284', color: 'text-blue-500' },
                    { label: 'Pipeline Value', value: '$452,100', color: 'text-green-500' },
                    { label: 'Closing Rate', value: '24.8%', color: 'text-purple-500' },
                    { label: 'Avg. Deal Size', value: '$3,420', color: 'text-orange-500' }
                ].map((stat, i) => (
                    <Card key={i} hover>
                        <CardContent className="pt-6">
                            <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">{stat.label}</p>
                            <h4 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h4>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-8 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl p-12 text-center bg-neutral-50/20 dark:bg-neutral-900/10">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2">Detailed Sales CRM coming soon</h3>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto">
                    We are building a comprehensive CRM tool to help you manage leads and close more deals.
                </p>
            </div>
        </NewMainLayout>
    );
}
