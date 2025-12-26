'use client';

import { motion } from 'framer-motion';
import { PageHeader, NewMainLayout } from '@/components/layout/new-main-layout';

export default function AnalyticsPage() {
    return (
        <NewMainLayout>
            <PageHeader
                title="Predictive Analytics"
                subtitle="AI-driven insights and forecasting for your sales data."
                gradient="blue"
            />

            <div className="mt-8 flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl bg-neutral-50/50 dark:bg-neutral-900/50">
                <motion.div
                    animate={{ scale: [0.95, 1, 0.95] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="text-center"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-2">Calculating Deep Insights...</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto">
                        Our AI engine is processing your historical sales data to generate predictive forecasts. Check back soon for the full report.
                    </p>
                </motion.div>
            </div>
        </NewMainLayout>
    );
}
