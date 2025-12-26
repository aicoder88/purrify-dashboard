'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import * as React from 'react';
import { SocialMediaPost, type SocialMediaWidget as SocialMediaWidgetType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface SocialMediaWidgetProps {
  data: SocialMediaWidgetType;
  className?: string;
  loading?: boolean;
}

const FacebookIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.875 2.026-1.297 3.323-1.297s2.448.422 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.422-.928-.928 0-.49.438-.928.928-.928.49 0 .928.438.928.928 0 .506-.438.928-.928.928zm-4.262 9.781c-2.448 0-4.474-2.026-4.474-4.474s2.026-4.474 4.474-4.474 4.474 2.026 4.474 4.474-2.026 4.474-4.474 4.474z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const HeartIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const MessageIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const getPlatformIcon = (platform: SocialMediaPost['platform']) => {
  switch (platform) {
    case 'facebook':
      return <FacebookIcon />;
    case 'instagram':
      return <InstagramIcon />;
    case 'twitter':
      return <TwitterIcon />;
    case 'linkedin':
      return <LinkedInIcon />;
    default:
      return null;
  }
};

const getPlatformColor = (platform: SocialMediaPost['platform']) => {
  switch (platform) {
    case 'facebook':
      return 'text-blue-600';
    case 'instagram':
      return 'text-pink-600';
    case 'twitter':
      return 'text-blue-400';
    case 'linkedin':
      return 'text-blue-700';
    default:
      return 'text-neutral-600';
  }
};

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)  }M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)  }K`;
  }
  return num.toString();
};

const SocialMediaWidget: React.FC<SocialMediaWidgetProps> = ({
  data,
  className = '',
  loading = false,
}) => {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={className}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 bg-neutral-200 rounded"></div>
                    <div className="h-4 bg-neutral-200 rounded w-24"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-full"></div>
                    <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                  </div>
                  <div className="flex gap-4 mt-3">
                    <div className="h-3 bg-neutral-200 rounded w-12"></div>
                    <div className="h-3 bg-neutral-200 rounded w-12"></div>
                    <div className="h-3 bg-neutral-200 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={className}
    >
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-charcoal-900">
              {data.title}
            </CardTitle>
            <div className="text-right">
              <div className="text-sm font-medium text-charcoal-900">
                {formatNumber(data.totalEngagement)}
              </div>
              <div className="text-xs text-neutral-500">Total Engagement</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-neutral-600">Growth:</span>
              <span className={`font-medium ${
                data.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.growthRate >= 0 ? '+' : ''}{data.growthRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">
            {data.posts.map((post: SocialMediaPost, index: number) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="border border-neutral-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${getPlatformColor(post.platform)}`}>
                    {getPlatformIcon(post.platform)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-charcoal-900 capitalize">
                      {post.platform}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                  >
                    View Post
                  </a>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-neutral-700 line-clamp-3">
                    {post.content}
                  </p>
                </div>
                
                {post.imageUrl && (
                  <div className="mb-3 relative h-32 w-full">
                    <Image
                      src={post.imageUrl}
                      alt="Post image"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-xs text-neutral-500">
                  <div className="flex items-center gap-1">
                    <HeartIcon />
                    <span>{formatNumber(post.engagement.likes)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageIcon />
                    <span>{formatNumber(post.engagement.comments)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShareIcon />
                    <span>{formatNumber(post.engagement.shares)}</span>
                  </div>
                  {post.engagement.views && (
                    <div className="flex items-center gap-1">
                      <EyeIcon />
                      <span>{formatNumber(post.engagement.views)}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          {data.posts.length === 0 && (
            <div className="text-center py-8 text-neutral-500">
              <div className="text-sm">No recent posts available</div>
              <div className="text-xs mt-1">
                Connect your social media accounts to see posts here
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-neutral-200">
            <div className="text-center">
              <div className="text-xs text-neutral-500 mb-2">
                Powered by Make.com Integration
              </div>
              <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                Configure Webhook
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { SocialMediaWidget };