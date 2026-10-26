import React, { useEffect, useState } from 'react';
import { Video } from '../types';
import { X, ExternalLink, Share2, Check, Clock, Eye, Calendar, Sparkles } from 'lucide-react';
import { useSite } from '../context/SiteContext';

interface VideoPlayerModalProps {
  video: Video | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const { videos, setActiveVideo } = useSite();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!video) return null;

  const handleShare = () => {
    const url = `https://www.youtube.com/watch?v=${video.videoId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relatedVideos = videos
    .filter((v) => v.videoId !== video.videoId && (v.category === video.category || v.isFeatured))
    .slice(0, 4);

  const formattedDate = new Date(video.publishedAt).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2 text-xs text-rose-400 font-medium">
            <span>{video.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">{formattedDate}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close video player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player + Details Content (Scrollable) */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* 16:9 Official YouTube Embedded Iframe */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>

          {/* Video Metadata & Controls */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="space-y-2 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                {video.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-400">
                {video.views ? (
                  <span className="tabular-nums font-medium text-slate-300">
                    {video.views.toLocaleString('bn-BD')} ভিউ
                  </span>
                ) : null}
                <span aria-hidden="true">·</span>
                <span>প্রকাশকাল: {formattedDate}</span>
                {video.duration && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{video.duration} মিনিট</span>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">লিংক কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-400" />
                    <span>শেয়ার</span>
                  </>
                )}
              </button>

              <a
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>ইউটিউবে খুলুন</span>
              </a>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
              ভিডিও বর্ণনা (Description)
            </h4>
            <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
              {video.description || 'এই ভিডিওর বিস্তারিত বিবরণ শীঘ্রই যুক্ত করা হবে। চ্যানেলটি সাবস্ক্রাইব করে সাথে থাকুন।'}
            </p>
          </div>

          {/* Related Videos Section */}
          {relatedVideos.length > 0 && (
            <div className="pt-2">
              <h4 className="text-sm font-semibold text-white mb-3">
                সম্পর্কিত অন্যান্য ভিডিও
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {relatedVideos.map((rv) => (
                  <div
                    key={rv.videoId}
                    onClick={() => setActiveVideo(rv)}
                    className="group bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-slate-700 transition-colors"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={rv.thumbnailUrl}
                        alt={rv.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] font-mono bg-black/80 text-white rounded">
                        {rv.duration || '10:00'}
                      </span>
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-medium text-slate-200 line-clamp-2 group-hover:text-rose-400 transition-colors">
                        {rv.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
