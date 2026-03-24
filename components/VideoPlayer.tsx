import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  thumbnail?: string;
  onClose?: () => void;
  fullscreen?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, onClose, fullscreen = false }) => {
  // Extract video ID from YouTube URL
  const getYouTubeId = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      } else if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.slice(1);
      }
    } catch {
      // Try direct ID format
      return url.includes('/') ? null : url;
    }
    return null;
  };

  const videoId = getYouTubeId(videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : videoUrl;

  if (!videoId && !videoUrl.includes('youtube.com/embed')) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-red-800 dark:text-red-300">
        <p>❌ URL vidéo invalide. Utilisez une URL YouTube valide.</p>
      </div>
    );
  }

  return (
    <div className={`${fullscreen ? 'fixed inset-0 z-50 bg-black flex items-center justify-center' : 'w-full'}`}>
      {fullscreen && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-51 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
        >
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      <div className={`${fullscreen ? 'w-11/12 h-5/6 max-w-4xl' : 'w-full aspect-video'} relative bg-black rounded-lg overflow-hidden`}>
        <iframe
          width="100%"
          height="100%"
          src={`${embedUrl}?autoplay=1&controls=1&modestbranding=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
