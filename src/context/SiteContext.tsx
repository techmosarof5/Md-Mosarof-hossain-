import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { SiteSettings, Video } from '../types';
import { DEFAULT_SITE_SETTINGS, INITIAL_VIDEOS } from '../data/defaultData';
import { syncYouTubeVideos, SyncResult } from '../lib/youtubeSync';
import { useAuth } from './AuthContext';

interface SiteContextType {
  settings: SiteSettings;
  videos: Video[];
  featuredVideos: Video[];
  loading: boolean;
  activeVideo: Video | null;
  setActiveVideo: (video: Video | null) => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  syncVideos: () => Promise<SyncResult>;
  deleteVideo: (videoId: string) => Promise<void>;
  addOrUpdateVideo: (video: Video) => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  // 1. Subscribe to Site Settings
  useEffect(() => {
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'site'),
      (snap) => {
        if (snap.exists()) {
          setSettings({ ...DEFAULT_SITE_SETTINGS, ...(snap.data() as SiteSettings) });
        } else {
          setSettings(DEFAULT_SITE_SETTINGS);
        }
      },
      (error) => {
        console.warn('Snapshot error on settings/site:', error.message);
      }
    );

    return () => unsubSettings();
  }, []);

  // 2. Subscribe to Videos Collection
  useEffect(() => {
    const unsubVideos = onSnapshot(
      collection(db, 'videos'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Video[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as Video;
            list.push({ ...data, id: d.id });
          });

          // Sort by newest published date by default
          list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
          setVideos(list);
        } else {
          // If Firestore collection is empty, retain initial curated videos
          setVideos(INITIAL_VIDEOS);
        }
        setLoading(false);
      },
      (error) => {
        console.warn('Snapshot error on videos collection:', error.message);
        setLoading(false);
      }
    );

    return () => unsubVideos();
  }, []);

  // 3. Update Settings
  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated: SiteSettings = {
      ...settings,
      ...newSettings,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser?.uid || 'admin',
    };

    try {
      await setDoc(doc(db, 'settings', 'site'), updated, { merge: true });
      setSettings(updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/site');
    }
  };

  // 4. Sync YouTube videos
  const syncVideos = async (): Promise<SyncResult> => {
    return await syncYouTubeVideos(
      settings.youtubeChannelId || DEFAULT_SITE_SETTINGS.youtubeChannelId,
      settings.youtubeApiKey,
      2
    );
  };

  // 5. Delete video
  const deleteVideo = async (videoId: string) => {
    try {
      await deleteDoc(doc(db, 'videos', videoId));
      setVideos((prev) => prev.filter((v) => v.videoId !== videoId && v.id !== videoId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `videos/${videoId}`);
    }
  };

  // 6. Add or update manual video
  const addOrUpdateVideo = async (video: Video) => {
    try {
      const vidId = video.videoId.trim();
      const payload: Video = {
        ...video,
        id: vidId,
        videoId: vidId,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'videos', vidId), payload, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `videos/${video.videoId}`);
    }
  };

  const featuredVideos = videos.filter((v) => v.isFeatured);

  return (
    <SiteContext.Provider
      value={{
        settings,
        videos,
        featuredVideos: featuredVideos.length > 0 ? featuredVideos : videos.slice(0, 3),
        loading,
        activeVideo,
        setActiveVideo,
        updateSettings,
        syncVideos,
        deleteVideo,
        addOrUpdateVideo,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
