/**
 * Application Types
 */

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  bio: string;
  profilePhotoUrl: string;
  adminEmail: string;
  youtubeChannelId: string;
  youtubeApiKey?: string;
  contactEmail: string;
  youtubeUrl: string;
  facebookUrl: string;
  telegramUrl: string;
  phone?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface Video {
  id: string; // document ID
  videoId: string; // YouTube video ID (e.g. 11 chars)
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  category: string;
  duration?: string;
  views?: number;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserAccount {
  uid: string;
  email: string;
  displayName?: string;
  role: 'user' | 'admin';
  createdAt?: string;
  lastLoginAt?: string;
  bookmarks?: string[];
}

export type VideoCategory =
  | 'সব'
  | 'ব্যাংকিং ও অর্থনীতি'
  | 'মোবাইল ব্যাংকিং ও ফিনটেক'
  | 'ফ্রিল্যান্সিং ও রেমিট্যান্স'
  | 'সাইবার নিরাপত্তা'
  | 'প্রযুক্তি ও সফটওয়্যার';
