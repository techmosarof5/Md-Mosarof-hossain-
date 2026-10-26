import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Video } from '../types';
import { INITIAL_VIDEOS } from '../data/defaultData';

export interface SyncResult {
  success: boolean;
  totalSynced: number;
  addedCount: number;
  updatedCount: number;
  message: string;
  videos: Video[];
}

/**
 * Categorize video based on title and description keywords in Bengali & English
 */
export function inferVideoCategory(title: string, desc: string): string {
  const text = `${title} ${desc}`.toLowerCase();
  if (text.includes('ইসলামী') || text.includes('ব্যাংক') || text.includes('ব্যাংকিং') || text.includes('কার্ড') || text.includes('ট্যাক্স') || text.includes('ডিপিএস') || text.includes('লোন') || text.includes('cib')) {
    return 'ব্যাংকিং ও অর্থনীতি';
  }
  if (text.includes('বিকাশ') || text.includes('নগদ') || text.includes('রকেট') || text.includes('ফিনটেক') || text.includes('mfs') || text.includes('wallet') || text.includes('রেমিট্যান্স')) {
    return 'মোবাইল ব্যাংকিং ও ফিনটেক';
  }
  if (text.includes('ফ্রিল্যান্স') || text.includes('আপওয়ার্ক') || text.includes('ফাইভার') || text.includes('পেওনিয়ার') || text.includes('ডলার') || text.includes('উপার্জন')) {
    return 'ফ্রিল্যান্সিং ও রেমিট্যান্স';
  }
  if (text.includes('হ্যাকিং') || text.includes('নিরাপত্তা') || text.includes('পাসওয়ার্ড') || text.includes('ওটিপি') || text.includes('স্ক্যাম') || text.includes('সাইবার')) {
    return 'সাইবার নিরাপত্তা';
  }
  return 'প্রযুক্তি ও সফটওয়্যার';
}

/**
 * Format ISO 8601 duration (e.g. PT14M32S -> 14:32)
 */
function formatDuration(isoDuration?: string): string {
  if (!isoDuration) return '12:00';
  const matches = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return '10:00';
  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);

  const secStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  if (hours > 0) {
    const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${minStr}:${secStr}`;
  }
  return `${minutes}:${secStr}`;
}

/**
 * Fetch and sync YouTube videos into Firestore
 */
export async function syncYouTubeVideos(
  channelId: string,
  apiKey?: string,
  maxPages: number = 2
): Promise<SyncResult> {
  const existingVideosMap = new Map<string, Video>();

  // 1. Fetch existing videos from Firestore to detect duplicates
  try {
    const querySnapshot = await getDocs(collection(db, 'videos'));
    querySnapshot.forEach((d) => {
      const data = d.data() as Video;
      existingVideosMap.set(data.videoId, { ...data, id: d.id });
    });
  } catch (err) {
    console.warn('Could not read existing videos from Firestore, starting fresh sync:', err);
  }

  let fetchedVideos: Video[] = [];

  // 2. Fetch from YouTube Data API v3 if API key and channelId are configured
  if (apiKey && apiKey.trim() && channelId && channelId.trim()) {
    try {
      let nextPageToken = '';
      let pageCount = 0;

      while (pageCount < maxPages) {
        pageCount++;
        const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
        searchUrl.searchParams.set('key', apiKey.trim());
        searchUrl.searchParams.set('channelId', channelId.trim());
        searchUrl.searchParams.set('part', 'snippet');
        searchUrl.searchParams.set('order', 'date');
        searchUrl.searchParams.set('maxResults', '50');
        searchUrl.searchParams.set('type', 'video');
        if (nextPageToken) {
          searchUrl.searchParams.set('pageToken', nextPageToken);
        }

        const res = await fetch(searchUrl.toString());
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const reason = errData?.error?.message || `HTTP ${res.status}`;
          throw new Error(`YouTube API Error: ${reason}`);
        }

        const data = await res.json();
        const items = data.items || [];
        if (items.length === 0) break;

        // Video IDs to query content details for duration & stats
        const videoIds = items.map((it: any) => it.id?.videoId).filter(Boolean);

        let detailsMap = new Map<string, { duration?: string; views?: number }>();
        if (videoIds.length > 0) {
          try {
            const detailUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
            detailUrl.searchParams.set('key', apiKey.trim());
            detailUrl.searchParams.set('part', 'contentDetails,statistics');
            detailUrl.searchParams.set('id', videoIds.join(','));

            const detailRes = await fetch(detailUrl.toString());
            if (detailRes.ok) {
              const detailData = await detailRes.json();
              detailData.items?.forEach((vid: any) => {
                detailsMap.set(vid.id, {
                  duration: formatDuration(vid.contentDetails?.duration),
                  views: parseInt(vid.statistics?.viewCount || '0', 10),
                });
              });
            }
          } catch (e) {
            console.warn('Could not retrieve video statistics:', e);
          }
        }

        for (const item of items) {
          const vidId = item.id?.videoId;
          if (!vidId) continue;

          const snippet = item.snippet || {};
          const detail = detailsMap.get(vidId) || {};
          const bestThumb =
            snippet.thumbnails?.maxres?.url ||
            snippet.thumbnails?.high?.url ||
            snippet.thumbnails?.medium?.url ||
            snippet.thumbnails?.default?.url ||
            `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;

          fetchedVideos.push({
            id: vidId,
            videoId: vidId,
            title: snippet.title || 'শিরোনামহীন ভিডিও',
            description: snippet.description || '',
            thumbnailUrl: bestThumb,
            publishedAt: snippet.publishedAt || new Date().toISOString(),
            category: inferVideoCategory(snippet.title || '', snippet.description || ''),
            duration: detail.duration || '12:00',
            views: detail.views || 0,
            isFeatured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }

        nextPageToken = data.nextPageToken;
        if (!nextPageToken) break;
      }
    } catch (err: any) {
      console.error('YouTube API sync error:', err);
      // If live API throws (e.g. quota or bad key), we report error or fallback
      throw new Error(`ইউটিউব এপিআই দিয়ে সিঙ্ক ব্যর্থ হয়েছে: ${err.message}`);
    }
  } else {
    // If no custom API key provided yet, seed / sync the initial curated high-yield video catalog
    fetchedVideos = [...INITIAL_VIDEOS];
  }

  // 3. Store/Merge into Firestore without duplicates
  let addedCount = 0;
  let updatedCount = 0;
  const savedVideos: Video[] = [];

  for (const video of fetchedVideos) {
    const existing = existingVideosMap.get(video.videoId);
    const docRef = doc(db, 'videos', video.videoId);

    const videoRecord: Video = {
      ...video,
      id: video.videoId,
      isFeatured: existing?.isFeatured ?? video.isFeatured ?? false,
      createdAt: existing?.createdAt || video.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(docRef, videoRecord, { merge: true });
      if (existing) {
        updatedCount++;
      } else {
        addedCount++;
      }
      savedVideos.push(videoRecord);
    } catch (writeErr) {
      handleFirestoreError(writeErr, OperationType.WRITE, `videos/${video.videoId}`);
    }
  }

  return {
    success: true,
    totalSynced: savedVideos.length,
    addedCount,
    updatedCount,
    message: apiKey
      ? `সফলভাবে ${savedVideos.length} টি ভিডিও ইউটিউব চ্যানেল থেকে সিঙ্ক হয়েছে (${addedCount} নতুন, ${updatedCount} আপডেট)।`
      : `কন্টেন্ট লাইব্রেরি সফলভাবে সিঙ্ক ও আপডেট করা হয়েছে (${savedVideos.length} টি ভিডিও প্রস্তুত)। লাইভ ইউটিউব এপিআই সিঙ্কের জন্য অ্যাডমিন প্যানেলে এপিআই কি দিন।`,
    videos: savedVideos,
  };
}
