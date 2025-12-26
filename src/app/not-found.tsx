'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { NewMainLayout } from '@/components/layout/new-main-layout';
import { Button } from '@/components/ui';

export default function NotFound() {
    return (
        <NewMainLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-8"
                >
                    {/* Animated 404 with glow */}
                    <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-primary-500 to-secondary-500 animate-pulse">
                        404
                    </h1>
                    <div className="absolute -inset-4 bg-primary-500/20 blur-3xl -z-10 rounded-full animate-float" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-3xl font-bold text-charcoal-900 dark:text-white mb-4">
                        Oops! This page is taking a nap. 🐱
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-8 text-lg">
                        The page you&apos;re looking for doesn&apos;t exist yet or has been moved.
                        We&apos;re working hard to bring more analytics to your fingertips!
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/dashboard">
                            <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 rounded-2xl text-lg font-bold shadow-lg shadow-teal-500/30 transition-all hover:scale-105 active:scale-95">
                                Back to Dashboard
                            </Button>
                        </Link>

                        <Link href="mailto:support@purrify.ca">
                            <Button variant="outline" className="border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 px-8 py-6 rounded-2xl text-lg font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all">
                                Report Issue
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Decorative elements */}
                <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 opacity-20">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-12 h-12 rounded-xl bg-neutral-200 dark:bg-neutral-700 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                </div>
            </div>
        </NewMainLayout>
    );
}
