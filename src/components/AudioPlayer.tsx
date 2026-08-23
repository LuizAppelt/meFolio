import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Volume1, Music, Video } from 'lucide-react';
import type { AudioPlayerConfig, AppTheme } from '../types';

interface AudioPlayerProps {
  config: AudioPlayerConfig;
  theme: AppTheme;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ config, theme }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(config.defaultVolume ?? 0.25);
  const [isMuted, setIsMuted] = useState(false);

  // Check if Spotify Embed or Link
  const isSpotify = Boolean(
    config.spotifyUrl || 
    (config.audioUrl && (config.audioUrl.includes('spotify.com') || config.audioUrl.includes('<iframe')))
  );

  // Check if YouTube link
  const isYouTube = Boolean(
    config.youtubeUrl || 
    (config.audioUrl && (config.audioUrl.includes('youtube.com') || config.audioUrl.includes('youtu.be')))
  );

  // Extract Spotify Embed URL from raw iframe string or normal link
  const getSpotifyEmbedUrl = (rawInput: string) => {
    try {
      // If full iframe code was pasted
      if (rawInput.includes('<iframe') && rawInput.includes('src="')) {
        const matchSrc = rawInput.match(/src="([^"]+)"/);
        if (matchSrc && matchSrc[1]) {
          return matchSrc[1];
        }
      }

      // If direct Spotify link
      const match = rawInput.match(/open\.spotify\.com\/(track|album|playlist|episode|artist)\/([a-zA-Z0-9]+)/);
      if (match) {
        const type = match[1];
        const id = match[2];
        return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
      }

      return rawInput;
    } catch {
      return rawInput;
    }
  };

  // Extract YouTube ID
  const getYouTubeVideoId = (url: string) => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (config.autoplay && audioRef.current && !isYouTube && !isSpotify) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [config.autoplay, isYouTube, isSpotify]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!config.enabled) return null;

  // 1. SPOTIFY EMBED (Official Player with Audio Streaming)
  if (isSpotify) {
    const rawUrl = config.spotifyUrl || config.audioUrl || '';
    const embedUrl = getSpotifyEmbedUrl(rawUrl);

    return (
      <div className={`w-full overflow-hidden rounded-2xl border transition-all ${theme.cardBackground} shadow-xl p-1 bg-black/40 backdrop-blur-md`}>
        <iframe
          src={embedUrl}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-xl border-0 w-full"
        />
      </div>
    );
  }

  // 2. YOUTUBE AUDIO-ONLY PLAYER
  if (isYouTube) {
    const ytUrl = config.youtubeUrl || config.audioUrl || '';
    const videoId = getYouTubeVideoId(ytUrl);
    const thumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : config.coverUrl;
    const embedUrl = videoId 
      ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${config.autoplay ? 1 : 0}&enablejsapi=1&controls=1`
      : ytUrl;

    return (
      <div className={`w-full p-3 rounded-2xl border transition-all ${theme.cardBackground} backdrop-blur-xl shadow-lg flex flex-col gap-2`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-red-950/40 border border-red-500/30 shrink-0">
              {thumbUrl ? (
                <img src={thumbUrl} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <Video className="w-4 h-4 text-red-400 m-auto" />
              )}
            </div>
            <div className="min-w-0 truncate">
              <h4 className="text-xs font-bold text-white truncate">{config.title || 'Áudio do YouTube'}</h4>
              <p className="text-[10px] text-red-400 font-medium truncate">{config.artist || 'Streaming de Áudio'}</p>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 text-[10px] font-mono border border-red-500/30">
            YouTube
          </span>
        </div>

        {/* Embedded player */}
        <div className="w-full h-24 rounded-xl overflow-hidden bg-black shadow-inner">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      </div>
    );
  }

  // 3. NATIVE MP3 STREAM / PC UPLOADED AUDIO / PRESETS
  if (!config.audioUrl) return null;

  return (
    <div className={`w-full p-3 rounded-2xl border transition-all ${theme.cardBackground} backdrop-blur-xl shadow-lg flex flex-col gap-2.5`}>
      <audio
        ref={audioRef}
        src={config.audioUrl}
        loop
        autoPlay={config.autoplay}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex items-center justify-between gap-2.5">
        {/* Cover / Icon & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center shrink-0">
            {config.coverUrl ? (
              <img src={config.coverUrl} alt="Album" className="w-full h-full object-cover" />
            ) : (
              <Music className="w-4 h-4 text-indigo-400" />
            )}
            
            {/* Animated sound wave bars when playing */}
            {isPlaying && (
              <div className="absolute inset-0 bg-black/50 flex items-end justify-center gap-0.5 pb-1">
                <span className="w-1 bg-indigo-400 rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
                <span className="w-1 bg-indigo-400 rounded-full animate-bounce h-4" style={{ animationDelay: '150ms' }} />
                <span className="w-1 bg-indigo-400 rounded-full animate-bounce h-3" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </div>

          <div className="min-w-0 truncate">
            <h4 className="text-xs font-bold text-white truncate">{config.title || 'Música de Fundo'}</h4>
            <p className="text-[10px] text-zinc-400 truncate">{config.artist || 'Trilha Sonora'}</p>
          </div>
        </div>

        {/* Play / Pause Action Button */}
        <button
          onClick={togglePlay}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform active:scale-90 shadow-md ${theme.accent}`}
          title={isPlaying ? 'Pausar música' : 'Ouvir música'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
        </button>
      </div>

      {/* Volume Controller Slider */}
      <div className="flex items-center gap-2 pt-1 border-t border-zinc-800/60">
        <button
          onClick={toggleMute}
          className="text-zinc-400 hover:text-zinc-200 transition-colors shrink-0"
          title={isMuted ? 'Desmutar' : 'Mutar'}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
          ) : volume < 0.5 ? (
            <Volume1 className="w-3.5 h-3.5 text-zinc-300" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-zinc-300" />
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
        />

        <span className="text-[10px] font-mono text-zinc-400 shrink-0 w-7 text-right">
          {Math.round((isMuted ? 0 : volume) * 100)}%
        </span>
      </div>
    </div>
  );
};
