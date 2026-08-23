export interface MusicPreset {
  id: string;
  name: string;
  artist: string;
  genre: string;
  audioUrl: string;
  coverUrl: string;
}

export const musicPresets: MusicPreset[] = [
  {
    id: 'lofi-study',
    name: 'Lofi Study & Code',
    artist: 'Chill Beats Collective',
    genre: 'Lofi / Ambient',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'synthwave-sunset',
    name: 'Sunset Neon Drive',
    artist: 'Retro Horizon',
    genre: 'Synthwave / Retro',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=electronic-future-beats-117997.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'coffee-chill',
    name: 'Morning Coffee Acoustics',
    artist: 'Warm Acoustics',
    genre: 'Acoustic / Relax',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=acoustic-guitars-ambient-10852.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'deep-focus',
    name: 'Deep Focus Ambient',
    artist: 'Mind Wave Labs',
    genre: 'Electronic Chill',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&auto=format&fit=crop'
  }
];
