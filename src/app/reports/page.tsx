'use client';

import { motion } from 'framer-motion';
import { PageHeader, NewMainLayout } from '@/components/layout/new-main-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';

export default function ReportsPage() {
    return (
        <NewMainLayout>
            <PageHeader
                title="Reports"
                subtitle="Detailed business reports and exports."
                gradient="pink"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {[
                    { title: 'Monthly Sales', desc: 'Summary of all sales activities for the current month.' },
                    { title: 'Inventory Status', desc: 'Current stock levels across all regions.' },
                    { title: 'Store Performance', desc: 'Ranking of best performing retail partners.' },
                    { title: 'Sample Conversion', desc: 'Analysis of sample-to-order conversion rates.' },
                    { title: 'Regional Growth', desc: 'Year-over-year growth by province.' },
                    { title: 'Audit Logs', desc: 'Record of all data imports and manual adjustments.' }
                ].map((report, i) => (
                    <motion.div
                        key={report.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card hover className="h-full cursor-pointer group">
                            <CardHeader>
                                <CardTitle className="text-lg group-hover:text-teal-400 transition-colors">{report.title}</CardTitle>
                                <CardDescription>{report.desc}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <button className="text-sm font-bold text-teal-500 hover:text-teal-400 flex items-center gap-2 transition-transform hover:translate-x-1">
                                    Generate Report
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </NewMainLayout>
    );
}
