// App.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Track {
  title: string;
  artist: string;
  album: string;
  year: number;
  src: string;
  coverArt: string | null; // Allow null for placeholder/fallback
}

// --- Configuration ---
// Base URL where the 'music' folder is served (e.g., GitHub Pages)
const GITHUB_PAGES_BASE_URL = "https://nullptr-rs.github.io/nullptr-rs-player";
// Path to the music directory relative to the base URL
const MUSIC_BASE_PATH = "/music/";
// Filename of the playlist manifest within an album directory
const PLAYLIST_FILENAME = "playlist.json";
// The specific album playlist to load (relative to MUSIC_BASE_PATH)
const ALBUM_TO_LOAD = "Hymns_of_the_Lost";

// Type definition for the structure of playlist.json
interface PlaylistJsonTrack {
  track_number: number;
  title: string;
  file: string; // Relative path within music dir e.g., "Album/Track/Track.m4a"
  cover_art: string; // Relative path e.g., "Album/Track/Track.jpg"
}

interface PlaylistJson {
  album: string;
  artist: string;
  year: number;
  genre?: string; // Optional genre field
  tracks: PlaylistJsonTrack[];
}

// --- Glitch Styles (Keep as is) ---
const glitchStyles = `
  /* ... (Keep the existing glitchStyles string here) ... */
  .glitch-container {
    position: relative;
    display: inline-block;
    min-height: 40px; /* Ensure space for text */
  }

  .glitch-text {
    position: relative;
    z-index: 1;
    color: #05d9e8; /* neon-blue */
    text-shadow:
      0 0 5px #05d9e8,
      0 0 10px #05d9e8,
      0 0 20px #d300c5; /* neon-purple */
  }

  .glitch-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Don't block interactions */
    white-space: nowrap; /* Prevent wrapping during glitch */
    /* background: #0d0208; */ /* dark-matrix - removed for transparency */
  }

  .glitch-1 {
    z-index: 2;
    color: #ff2a6d; /* neon-pink */
    text-shadow:
      0 0 5px #ff2a6d,
      0 0 15px #ff2a6d;
    clip-path: polygon(0 0, 100% 0, 100% 30%, 0 30%);
    animation: glitch-anim-1 4s infinite linear alternate-reverse;
  }

  .glitch-2 {
    z-index: 3;
    color: #05d9e8; /* neon-blue */
    text-shadow:
      0 0 5px #05d9e8,
      0 0 15px #05d9e8;
    clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
    animation: glitch-anim-2 3s infinite linear alternate-reverse;
  }

  .glitch-3 {
    z-index: 4;
    color: #00ff9d; /* glitch-green */
    text-shadow:
      0 0 5px #00ff9d,
      0 0 15px #00ff9d;
    clip-path: polygon(0 30%, 100% 30%, 100% 60%, 0 60%);
    animation: glitch-anim-3 5s infinite linear alternate-reverse;
  }

  .glitch-scanline {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: #05d9e8; /* neon-blue */
    opacity: 0.8;
    z-index: 5;
    animation: scanline-anim 8s linear infinite;
    box-shadow: 0 0 10px #05d9e8;
    pointer-events: none;
  }

  .glitch-flicker {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #0d0208; /* dark-matrix */
    z-index: 6;
    animation: flicker-anim 12s infinite steps(1);
    pointer-events: none;
    opacity: 0.05; /* Make flicker less intrusive */
  }

  @keyframes glitch-anim-1 {
    0%, 7%, 9%, 11%, 13%, 53%, 55%, 70%, 72%, 100% { transform: translate(0); clip-path: polygon(0 0, 100% 0, 100% 30%, 0 30%); }
    1% { transform: translate(-2px, 2px); clip-path: polygon(0 10%, 100% 10%, 100% 40%, 0 40%); }
    3% { transform: translate(3px, -1px) skewX(10deg); clip-path: polygon(0 5%, 100% 5%, 100% 35%, 0 35%); }
    5% { transform: translate(-1px, 3px) skewY(-15deg); clip-path: polygon(0 20%, 100% 20%, 100% 50%, 0 50%); }
    8% { transform: translate(0px, -5px); }
    10% { transform: translate(-5px, 0px); clip-path: polygon(0 15%, 100% 15%, 100% 45%, 0 45%); }
    12% { transform: translate(5px, 5px); }
    54% { transform: translate(2px, -2px) skewX(-5deg); clip-path: polygon(0 25%, 100% 25%, 100% 55%, 0 55%); }
    71% { transform: translate(-3px, 1px) skewY(5deg); }
  }

  @keyframes glitch-anim-2 {
    0%, 5%, 7%, 9%, 11%, 50%, 52%, 68%, 70%, 100% { transform: translate(0); clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%); }
    1% { transform: translate(3px, -3px); clip-path: polygon(0 50%, 100% 50%, 100% 90%, 0 90%); }
    3% { transform: translate(-2px, 1px) skewY(15deg); clip-path: polygon(0 70%, 100% 70%, 100% 100%, 0 100%); }
    6% { transform: translate(0px, 4px); }
    8% { transform: translate(5px, 0px); clip-path: polygon(0 55%, 100% 55%, 100% 95%, 0 95%); }
    10% { transform: translate(-5px, -5px); }
    51% { transform: translate(-2px, 2px) skewY(-10deg); clip-path: polygon(0 65%, 100% 65%, 100% 95%, 0 95%); }
    69% { transform: translate(3px, -1px) skewX(5deg); }
  }

  @keyframes glitch-anim-3 {
    0%, 6%, 8%, 10%, 12%, 51%, 53%, 69%, 71%, 100% { transform: translate(0); clip-path: polygon(0 30%, 100% 30%, 100% 60%, 0 60%); }
    2% { transform: translate(-3px, -1px); clip-path: polygon(0 40%, 100% 40%, 100% 70%, 0 70%); }
    4% { transform: translate(2px, 3px) skewX(-15deg); clip-path: polygon(0 35%, 100% 35%, 100% 65%, 0 65%); }
    7% { transform: translate(0px, -4px); }
    9% { transform: translate(4px, 0px); clip-path: polygon(0 25%, 100% 25%, 100% 55%, 0 55%); }
    11% { transform: translate(-4px, 4px); }
    52% { transform: translate(3px, -3px) skewX(10deg); clip-path: polygon(0 30%, 100% 30%, 100% 70%, 0 70%); }
    70% { transform: translate(-2px, 2px) skewY(-5deg); }
  }

  @keyframes scanline-anim {
    0% { top: -5%; opacity: 0; }
    5% { opacity: 0.1; }
    15% { opacity: 0.3; }
    20% { opacity: 0.05; }
    100% { top: 105%; opacity: 0; }
  }

  @keyframes flicker-anim {
     0% { opacity: 0.01; }
     2% { opacity: 0.05; }
     4% { opacity: 0.02; }
     6% { opacity: 0.1; }
     8% { opacity: 0.03; }
     10% { opacity: 0.07; }
     10.1% { opacity: 0; }
     10.2% { opacity: 0.05; }
     10.3% { opacity: 0; }
     /* Add more sparse flicker moments */
     25% { opacity: 0.06; }
     25.1% { opacity: 0; }
     50% { opacity: 0.04; }
     50.1% { opacity: 0; }
     75% { opacity: 0.08; }
     75.1% { opacity: 0; }
     100% { opacity: 0.01; }
  }

    /* Custom Scrollbar for Playlist */
    .scrollbar-thin {
      scrollbar-width: thin; /* Firefox */
      scrollbar-color: #0e7490 #1f2937; /* thumb track - Tailwind cyan-700, gray-800 */
    }
    /* Webkit (Chrome, Safari, Edge) */
    .scrollbar-thin::-webkit-scrollbar {
      width: 8px;
    }
    .scrollbar-thin::-webkit-scrollbar-track {
      background: #1f2937; /* gray-800 */
      border-radius: 4px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background-color: #0e7490; /* cyan-700 */
      border-radius: 4px;
      border: 2px solid #1f2937; /* gray-800 - creates padding */
    }
      .scrollbar-thin::-webkit-scrollbar-thumb:hover {
        background-color: #0891b2; /* cyan-600 */
      }

    /* Pulse animation for loading */
    @keyframes pulse {
      50% { opacity: .5; }
    }
    .animate-pulse-bg { /* Custom pulse for background */
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    .animate-pulse-text { /* Custom pulse for text */
        animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    /* Focus visibility for accessibility */
    *:focus-visible {
          outline: 2px solid #22d3ee; /* cyan-400 */
          outline-offset: 2px;
          border-radius: 2px; /* Slightly rounded outline */
    }
    /* Override specific focus rings defined inline if needed */
    input[type="range"]:focus-visible {
        outline: none; /* Use the Tailwind focus:ring classes instead */
    }
    button:focus-visible {
          outline: none; /* Use the Tailwind focus:ring classes instead */
    }
`;

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) {
    return '0:00';
  }
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const NullPtrMp3Player: React.FC = () => {
  // --- State ---
  const [tracks, setTracks] = useState<Track[]>([]); // Initialize empty
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0); // Start at 0, but list is initially empty
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [originalTracks, setOriginalTracks] = useState<Track[]>([]); // Store original order for unshuffling
  const [isLoadingTrack, setIsLoadingTrack] = useState<boolean>(false); // For individual track loading (audio element events)
  const [playbackError, setPlaybackError] = useState<string | null>(null); // For errors during playback/loading of a track
  const [isPlaylistLoading, setIsPlaylistLoading] = useState<boolean>(true); // For initial playlist fetch
  const [playlistError, setPlaylistError] = useState<string | null>(null); // For errors during playlist fetch

  // --- Refs ---
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const playlistRef = useRef<HTMLDivElement>(null);

  // Determine the current track safely, only if tracks exist
  const currentTrack = tracks.length > 0 && currentTrackIndex >= 0 && currentTrackIndex < tracks.length
    ? tracks[currentTrackIndex]
    : null; // Handle cases where index might be invalid or tracks not loaded yet


  // --- Fetch Playlist Data ---
  useEffect(() => {
    const fetchPlaylist = async () => {
      setIsPlaylistLoading(true);
      setPlaylistError(null);
      setTracks([]); // Clear existing tracks before fetching
      setOriginalTracks([]);
      setCurrentTrackIndex(0); // Reset index

      const playlistUrl = `${GITHUB_PAGES_BASE_URL}${MUSIC_BASE_PATH}${ALBUM_TO_LOAD}/${PLAYLIST_FILENAME}`;

      try {
        console.log(`Fetching playlist from: ${playlistUrl}`);
        const response = await fetch(playlistUrl, { cache: "no-store" }); // Avoid aggressive caching during development

        if (!response.ok) {
          throw new Error(`Failed to fetch playlist: ${response.status} ${response.statusText}`);
        }

        const playlistData: PlaylistJson = await response.json();

        if (!playlistData || !playlistData.tracks || playlistData.tracks.length === 0) {
            throw new Error("Playlist data is empty or invalid.");
        }

        // Sort tracks by track_number just in case json isn't ordered
        playlistData.tracks.sort((a, b) => a.track_number - b.track_number);

        // Transform fetched data into Track interface format
        const loadedTracks: Track[] = playlistData.tracks.map(track => {
            // Construct full URLs for audio and cover art
            const trackSrc = `${GITHUB_PAGES_BASE_URL}${MUSIC_BASE_PATH}${track.file}`;
            const coverArtSrc = track.cover_art ? `${GITHUB_PAGES_BASE_URL}${MUSIC_BASE_PATH}${track.cover_art}` : null;

            // Basic validation for paths (optional but good)
            if (!track.file) console.warn(`Track "${track.title}" has missing 'file' path.`);
             if (!track.cover_art) console.warn(`Track "${track.title}" has missing 'cover_art' path.`);

            return {
                title: track.title,
                artist: playlistData.artist,
                album: playlistData.album,
                year: playlistData.year,
                src: trackSrc,
                coverArt: coverArtSrc,
            };
        });

        console.log("Playlist loaded successfully:", loadedTracks);
        setTracks(loadedTracks);
        setOriginalTracks([...loadedTracks]); // Set original order based on fetched data
        setCurrentTrackIndex(0); // Ensure index is valid for the new list
        setIsPlaylistLoading(false);

      } catch (error) {
        console.error("Error loading playlist:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while loading the playlist.";
        setPlaylistError(`Failed to load playlist '${ALBUM_TO_LOAD}'. ${errorMessage}`);
        setTracks([]); // Ensure tracks are empty on error
        setOriginalTracks([]);
        setIsPlaylistLoading(false);
      }
    };

    fetchPlaylist();
    // Intentionally empty dependency array to run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Add ALBUM_TO_LOAD if you want to refetch when it changes (not needed for now)

  // --- Play/Pause ---
  const handlePlayPause = useCallback(() => {
    if (!audioRef.current || !currentTrack) return; // Need a track to play/pause
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
        setPlaybackError("Playback failed. Check console/network or browser permissions.");
        setIsPlaying(false); // Ensure state is correct on error
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentTrack]);

  // --- Change Track (Internal Helper) ---
  const changeTrack = useCallback((newIndex: number) => {
      setCurrentTrackIndex(newIndex);
      setIsPlaying(true); // Auto-play next/prev/selected track
      setPlaybackError(null); // Clear previous playback errors
      setCurrentTime(0); // Reset time
      setDuration(0); // Reset duration display
      setIsLoadingTrack(true); // Set loading state for the new track
      if (audioRef.current) {
          // audioRef.current.src = tracks[newIndex].src; // React handles src update via prop
          audioRef.current.currentTime = 0; // Reset time explicitly
          // load() and play() are handled by the useEffect below based on src/isPlaying change
      }
      if (progressBarRef.current) {
          progressBarRef.current.value = '0'; // Reset progress bar visual
      }
  }, []); // Removed `tracks` dependency as it might cause issues if list updates mid-operation


  // --- Next Track ---
  const handleNext = useCallback(() => {
    if (tracks.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    changeTrack(nextIndex);
  }, [currentTrackIndex, tracks.length, changeTrack]);

  // --- Previous Track ---
  const handlePrevious = useCallback(() => {
    if (tracks.length === 0) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0); // Update state too
    } else {
      const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
      changeTrack(prevIndex);
    }
  }, [currentTrackIndex, tracks.length, changeTrack]);

  // --- Handle Audio Events (Track Loading, Playback, Errors) ---
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || !currentTrack) return; // Only run if we have an audio element AND a track selected

    // Reset state for the new track about to load
    setIsLoadingTrack(true);
    setCurrentTime(0);
    // Don't reset duration immediately, wait for loadedmetadata
    if (progressBarRef.current) progressBarRef.current.value = '0';


    const handleTimeUpdate = () => setCurrentTime(audioElement.currentTime);
    const handleLoadedMetadata = () => {
      const newDuration = audioElement.duration;
      // console.log("Loaded metadata, duration:", newDuration);
      if (!isNaN(newDuration) && isFinite(newDuration)) {
        setDuration(newDuration);
        if (progressBarRef.current) {
            progressBarRef.current.max = String(newDuration);
        }
      } else {
          console.warn("Invalid duration received:", newDuration);
          setDuration(0); // Set to 0 if invalid
          if (progressBarRef.current) progressBarRef.current.max = "1"; // Fallback max
      }
      setIsLoadingTrack(false); // Loading finished when metadata is loaded
    };
    const handleEnded = () => {
      if (isRepeat) {
        audioElement.currentTime = 0;
        audioElement.play().catch(e => {
          console.error("Repeat playback failed:", e);
          setPlaybackError("Repeat failed.");
          setIsPlaying(false);
        });
      } else {
        handleNext();
      }
    };
    const handleError = (e: Event) => {
      console.error("Audio Element Error Event:", e);
      const trackTitle = currentTrack?.title || 'the track';
      setPlaybackError(`Error loading ${trackTitle}. Check URL/Network/CORS.`);
      setIsPlaying(false);
      setIsLoadingTrack(false);
      setDuration(0); // Reset duration on error
      setCurrentTime(0);
    };
    const handleWaiting = () => {
        // console.log("Audio waiting (buffering)...");
        setIsLoadingTrack(true);
    }
    const handlePlaying = () => {
      // console.log("Audio playing.");
      setIsLoadingTrack(false); // Should be playing now
      setPlaybackError(null); // Clear errors once playing starts successfully
    };
    const handleCanPlay = () => {
        // console.log("Audio can play.");
        setIsLoadingTrack(false); // Ready to play, hide loader
    }
     const handleStalled = () => {
        console.warn("Audio stalled.");
        // Maybe set loading state? Depends on how long it stalls.
        // setIsLoadingTrack(true); // Could cause flickering if stall is brief
    }
     const handleSuspend = () => {
        // console.log("Audio suspended (e.g., download stopped).");
        // May not require UI change unless it leads to an error or long wait.
    }

    // Add listeners
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('error', handleError);
    audioElement.addEventListener('waiting', handleWaiting);
    audioElement.addEventListener('playing', handlePlaying);
    audioElement.addEventListener('canplay', handleCanPlay);
    audioElement.addEventListener('stalled', handleStalled);
    audioElement.addEventListener('suspend', handleSuspend);


    // --- Autoplay Logic ---
    // This effect runs when currentTrackIndex changes *or* isPlaying is toggled externally
    // We need to ensure the audio element tries to play if isPlaying is true
    if (isPlaying) {
        // audioElement.load(); // Ensure data loading is triggered if needed (often implicit with src change)
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Playback started successfully (or was already playing)
                setIsLoadingTrack(false); // Ensure loader is off
                setPlaybackError(null); // Clear any previous errors
            }).catch(error => {
                // Autoplay was prevented or another error occurred
                console.warn("Autoplay/Play attempt failed:", error);
                // Don't automatically set error unless it's persistent
                // Browsers often block autoplay until user interaction
                setIsPlaying(false); // Correct the state if play() failed
                // If it's an actual loading error, the 'error' event handler above should catch it.
                // setPlaybackError("Playback blocked or failed. Click play."); // Optional more direct message
            });
        }
    } else {
        // If isPlaying is false, ensure the audio is paused
        audioElement.pause();
    }


    return () => {
      // Cleanup listeners
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('error', handleError);
      audioElement.removeEventListener('waiting', handleWaiting);
      audioElement.removeEventListener('playing', handlePlaying);
      audioElement.removeEventListener('canplay', handleCanPlay);
      audioElement.removeEventListener('stalled', handleStalled);
      audioElement.removeEventListener('suspend', handleSuspend);

       // Optional: Pause audio when component unmounts or track changes significantly?
       // Usually not needed as the src change handles this, but can prevent leaks.
       // audioElement.pause();
    };
    // Re-run effect when the current track's SRC changes, or when isPlaying status flips
  }, [currentTrack?.src, isPlaying, isRepeat, handleNext]); // Key dependencies: track src, play state, repeat state, next handler


  // --- Update Audio Element Volume ---
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // --- Shuffle Functionality ---
  const handleShuffle = useCallback(() => {
    if (tracks.length < 2) return; // Can't shuffle 0 or 1 tracks

    setIsShuffled(prev => {
      const shuffling = !prev;
      if (shuffling) {
        // Important: originalTracks should already be set correctly when the playlist loads
        // We shuffle the *current* `tracks` state
        const current = tracks[currentTrackIndex]; // Keep the currently playing track
        const rest = tracks.filter((_, i) => i !== currentTrackIndex);

        // Fisher-Yates shuffle
        for (let i = rest.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [rest[i], rest[j]] = [rest[j], rest[i]];
        }

        const shuffledTracks = [current, ...rest];
        setTracks(shuffledTracks);
        setCurrentTrackIndex(0); // Current track is now at the start of the shuffled list
      } else {
        // Restore original order - find where the current track was in the original list
         const currentTrackSrc = tracks[currentTrackIndex]?.src; // Safely get src
         setTracks([...originalTracks]); // Restore from the saved original order
         const newIndex = originalTracks.findIndex(t => t.src === currentTrackSrc);
         setCurrentTrackIndex(newIndex >= 0 ? newIndex : 0); // Set index in the original list
      }
      return shuffling;
    });
  }, [tracks, currentTrackIndex, originalTracks]);


  // --- Repeat Functionality ---
  const handleRepeat = useCallback(() => {
    setIsRepeat(!isRepeat);
  }, [isRepeat]);

  // --- Keyboard Shortcuts ---
   useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
       // Allow shortcuts if focus is on body, the player container, or elements INSIDE the player (excluding inputs potentially)
      const isFocusInsidePlayer = playerRef.current?.contains(document.activeElement);
      const isFocusOnBody = document.activeElement === document.body;
      const isFocusOnPlayer = document.activeElement === playerRef.current;

       // Don't interfere if focus is on an input element *unless* it's the player itself or body
       // Exception for space bar when focus is on buttons inside the player (let button handle it)
       if (document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement || document.activeElement instanceof HTMLButtonElement) {
            if (e.key === ' ' && !isFocusOnBody && !isFocusOnPlayer) { // Let buttons handle space
                 return;
            }
            if (!(e.key === ' ' && isFocusOnPlayer) && !(e.key === ' ' && isFocusOnBody) && !(e.key !== ' ' && (isFocusInsidePlayer || isFocusOnPlayer || isFocusOnBody)) ) {
                 // If not spacebar or focus is on input/textarea/button (and not body/player), ignore most keys
                 return;
            }
       } else if (!isFocusInsidePlayer && !isFocusOnBody && !isFocusOnPlayer) {
            // If focus is outside player completely, ignore
            return;
       }

      // If we reach here, the event is likely safe to handle globally for the player

      switch (e.key) {
        case ' ': // Play/Pause
            if (currentTrack) { // Only if a track is loaded
                e.preventDefault();
                handlePlayPause();
            }
          break;
        case 'ArrowRight': // Next or Seek Forward
           if (e.ctrlKey || e.metaKey) { // Use Ctrl or Cmd + Arrow for Next
               e.preventDefault();
                handleNext();
           } else if (audioRef.current && duration > 0) { // Seek Forward 5s
               e.preventDefault();
               const newTime = Math.min(audioRef.current.currentTime + 5, duration);
               audioRef.current.currentTime = newTime;
               setCurrentTime(newTime); // Update UI immediately
                if (progressBarRef.current) progressBarRef.current.value = String(newTime); // Update slider visual
           }
          break;
        case 'ArrowLeft': // Previous or Seek Backward
            if (e.ctrlKey || e.metaKey) { // Use Ctrl or Cmd + Arrow for Previous
               e.preventDefault();
                handlePrevious();
            } else if (audioRef.current && duration > 0) { // Seek Backward 5s
               e.preventDefault();
               const newTime = Math.max(audioRef.current.currentTime - 5, 0);
               audioRef.current.currentTime = newTime;
               setCurrentTime(newTime); // Update UI immediately
               if (progressBarRef.current) progressBarRef.current.value = String(newTime); // Update slider visual
            }
          break;
        case 'ArrowUp': // Volume Up
          e.preventDefault();
          setVolume(prev => Math.min(prev + 0.1, 1));
          break;
        case 'ArrowDown': // Volume Down
          e.preventDefault();
          setVolume(prev => Math.max(prev - 0.1, 0));
          break;
        case 'm': // Mute toggle
        case 'M':
            e.preventDefault();
            setVolume(prev => prev > 0 ? 0 : 0.7); // Toggle between 0 and default 0.7
            break;
        case 's': // Shuffle
        case 'S':
            e.preventDefault();
            handleShuffle();
            break;
        case 'r': // Repeat
        case 'R':
            e.preventDefault();
            handleRepeat();
            break;
        case 'l': // Toggle Playlist
        case 'L':
            e.preventDefault();
            setShowPlaylist(prev => !prev);
            break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // Dependencies ensure handlers always have latest state/values
   }, [handlePlayPause, handleNext, handlePrevious, handleShuffle, handleRepeat, duration, currentTrack, volume]);


  // --- Seek Functionality ---
  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current && duration > 0) { // Ensure track is loaded and seekable
      const newTime = Number(event.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime); // Update state immediately for responsiveness
    }
  };

  // --- Volume Change ---
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(event.target.value);
    setVolume(newVolume);
  };

  // --- Select Track from Playlist ---
  const handleSelectTrack = (index: number) => {
    if (index >= 0 && index < tracks.length) {
        if (index !== currentTrackIndex) {
          changeTrack(index); // Use the helper to change track and start playing
        } else {
          // If clicking the currently playing track, toggle play/pause
          handlePlayPause();
        }
        // setShowPlaylist(false); // Optionally hide playlist after selection
    } else {
        console.warn("Attempted to select invalid track index:", index);
    }
  };

  // --- Playlist Drag and Drop ---
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
      dragItem.current = index;
      e.dataTransfer.effectAllowed = 'move';
      // Optional: Add styling for dragged item
       e.currentTarget.classList.add('opacity-50', 'bg-cyan-700/30');
  };

   const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, index: number) => {
       e.preventDefault(); // Necessary to allow drop
       dragOverItem.current = index;
       // Optional: Add visual cue for drop target (only if different from dragged item)
       if (dragItem.current !== index) {
            // Clear previous targets
             playlistRef.current?.querySelectorAll('.drag-over-target').forEach(el => el.classList.remove('drag-over-target', 'bg-cyan-700/50'));
            // Mark new target
            e.currentTarget.classList.add('drag-over-target', 'bg-cyan-700/50');
       }
   };

   const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
       // Optional: Remove visual cue if leaving a potential drop target
       e.currentTarget.classList.remove('drag-over-target', 'bg-cyan-700/50');
       // Maybe check if leaving towards parent and dragOverItem.current is this index, then reset dragOverItem? Less critical.
   };

   const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
       e.preventDefault(); // Necessary to allow drop
       e.dataTransfer.dropEffect = 'move';
   };

   const handleDrop = (e: React.DragEvent<HTMLElement>) => {
       e.preventDefault();
       const sourceIndex = dragItem.current;
       const targetIndex = dragOverItem.current;

       // Reset visual styles first
       playlistRef.current?.querySelectorAll('.opacity-50').forEach(el => el.classList.remove('opacity-50', 'bg-cyan-700/30'));
       playlistRef.current?.querySelectorAll('.drag-over-target').forEach(el => el.classList.remove('drag-over-target', 'bg-cyan-700/50'));


       if (sourceIndex === null || targetIndex === null || sourceIndex === targetIndex) {
           dragItem.current = null;
           dragOverItem.current = null;
           return;
       }

       const reorderedTracks = [...tracks];
       const [draggedItemContent] = reorderedTracks.splice(sourceIndex, 1);
       reorderedTracks.splice(targetIndex, 0, draggedItemContent);

       const currentTrackSrc = tracks[currentTrackIndex]?.src; // Get src before reordering state
       setTracks(reorderedTracks); // Update the displayed list

       // Update currentTrackIndex to follow the track that was playing
       const newCurrentIndex = reorderedTracks.findIndex(t => t.src === currentTrackSrc);
       setCurrentTrackIndex(newCurrentIndex >= 0 ? newCurrentIndex : 0);

       // If shuffled, drag/drop essentially creates a new custom order.
       // The user would need to toggle shuffle off/on again to get a *new* random shuffle.
       // The `originalTracks` state remains the initial loaded order unless shuffle is turned off.
       if (!isShuffled) {
            // If NOT shuffled, the drag-drop modifies the *original* order as well
            setOriginalTracks(reorderedTracks);
       }


       // Reset refs
       dragItem.current = null;
       dragOverItem.current = null;
   };


  // --- Render Logic ---

  // Loading state for the initial playlist fetch
  if (isPlaylistLoading) {
    return (
      <div className="min-h-screen bg-black text-cyan-500 flex flex-col items-center justify-center font-mono p-4 space-y-4">
        <svg className="w-12 h-12 animate-spin text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className='animate-pulse-text'>Loading playlist: {ALBUM_TO_LOAD}...</p>
      </div>
    );
  }

  // Error state for the initial playlist fetch
  if (playlistError) {
     return (
      <div className="min-h-screen bg-black text-red-500 flex flex-col items-center justify-center font-mono p-4 space-y-2 text-center">
         <svg className="w-10 h-10 text-red-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <p className="font-bold">Error Loading Playlist</p>
        <p className="text-sm text-red-400">{playlistError}</p>
         <p className="text-xs text-gray-500 mt-4">Check the console for more details and verify the playlist URL/content.</p>
      </div>
    );
  }

  // Check if tracks array is populated but somehow currentTrack is null (shouldn't happen with checks, but safety)
   if (!currentTrack && tracks.length > 0) {
     // This might happen briefly during state updates, or if index is invalid.
     console.warn("State inconsistency: Tracks exist, but currentTrack is null. Resetting index.");
     // Attempt to recover by setting index to 0. This might cause a re-render.
     setCurrentTrackIndex(0); // This is risky inside render - prefer useEffect if possible
     return <div className="min-h-screen bg-black text-pink-500 flex items-center justify-center font-mono p-4">Recovering player state...</div>;
   }

   // Main Player Render (only if playlist loaded and currentTrack is valid or track list is empty)
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-gray-300 font-mono flex flex-col items-center justify-center p-4">
       <style>{glitchStyles}</style> {/* Inject glitch styles */}
      <div
        ref={playerRef}
        className="w-full max-w-md bg-gray-900/80 backdrop-blur-sm shadow-2xl shadow-cyan-900/30 rounded-lg overflow-visible border border-cyan-500/30 p-5 sm:p-6 relative"
        tabIndex={0} // Make the player focusable for keyboard events
        aria-label="NullPtr.rs MP3 Player"
        aria-busy={isLoadingTrack || isPlaylistLoading} // Indicate busy state
      >
        {/* Playback Error Display */}
        {playbackError && (
          <div className="absolute -top-5 left-2 right-2 bg-red-900 border border-red-600 text-white p-2 rounded shadow-lg z-20 flex justify-between items-center text-xs">
            <span className='mr-2 break-words'>{playbackError}</span>
            <button onClick={() => setPlaybackError(null)} className="ml-auto text-red-300 hover:text-white font-bold text-sm flex-shrink-0 p-1" aria-label="Dismiss error">×</button>
          </div>
        )}

        {/* Header */}
         <div className="text-center mb-6">
          <div className="glitch-container inline-block">
            <h1 className="glitch-text text-3xl sm:text-4xl font-bold mb-1">
              NullPtr.rs
            </h1>
            {/* ... glitch layers ... */}
            <div className="glitch-layer glitch-1 text-3xl sm:text-4xl font-bold">NullPtr.rs</div>
            <div className="glitch-layer glitch-2 text-3xl sm:text-4xl font-bold">NullPtr.rs</div>
            <div className="glitch-layer glitch-3 text-3xl sm:text-4xl font-bold">NullPtr.rs</div>
            <div className="glitch-scanline" />
            <div className="glitch-flicker" />
          </div>
          <p className="text-xs text-pink-500 mt-2">
            // Now infiltrating your audio buffer..._
          </p>
        </div>

        {/* Render Player UI only if a track is potentially available */}
        {currentTrack ? (
            <>
                 {/* Album Art & Track Info */}
                <div className="flex flex-col items-center mb-6">
                    {currentTrack.coverArt ? (
                        <img
                        key={currentTrack.coverArt} // Key helps React differentiate when art changes
                        src={currentTrack.coverArt}
                        alt={`${currentTrack.album} Cover`}
                        className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-md shadow-lg border-2 border-pink-600/70 mb-4 transition-all duration-300 ease-in-out"
                        loading="lazy"
                        onError={(e) => {
                            console.warn(`Failed to load cover art: ${currentTrack.coverArt}`);
                            e.currentTarget.style.display = 'none'; // Hide broken image
                            // Optionally show a fallback div here instead
                        }}
                        />
                    ) : (
                        // Placeholder if no cover art URL provided
                        <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-md w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-4 text-gray-700">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                        </div>
                    )}

                    <h2 className="text-lg sm:text-xl font-semibold text-lime-400 truncate max-w-full px-2 text-center" title={currentTrack.title}>{currentTrack.title}</h2>
                    <p className="text-sm text-gray-400 truncate max-w-full px-2 text-center">{currentTrack.artist}</p>
                    <p className="text-xs text-gray-500 truncate max-w-full px-2 text-center">{currentTrack.album} ({currentTrack.year})</p>
                </div>

                {/* Audio Element (Hidden but controls linked) */}
                {/* Use key to force re-render/reload when src changes */}
                 <audio
                    ref={audioRef}
                    key={currentTrack.src}
                    src={currentTrack.src}
                    preload="metadata" // Let browser decide best strategy, often metadata is good
                    aria-hidden="true"
                    // Event listeners are attached in useEffect
                 />


                {/* Progress Bar */}
                <div className="mb-4 px-2 relative">
                <input
                    type="range"
                    ref={progressBarRef}
                    min="0"
                    max={duration || 1} // Use duration, fallback to 1
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                    aria-label="Seek track progress"
                    disabled={!duration || isLoadingTrack || isPlaylistLoading} // Disable if no duration or loading
                    title={duration ? `Seek: ${formatTime(currentTime)} / ${formatTime(duration)}` : "Loading track..."}
                />
                {/* Loading Indicator over progress bar */}
                {isLoadingTrack && (
                    <div className="absolute top-0 left-0 w-full h-2 flex items-center justify-center pointer-events-none rounded-lg overflow-hidden">
                        <div className="w-full h-full bg-cyan-600/30 animate-pulse-bg rounded-lg"></div>
                    </div>
                )}
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    {/* Show duration only if it's valid */}
                    <span>{duration && isFinite(duration) ? formatTime(duration) : '--:--'}</span>
                </div>
                </div>

                {/* Main Controls */}
                <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4">
                     {/* Repeat Button */}
                    <button
                        onClick={handleRepeat}
                         className={`p-2 rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${isRepeat ? 'bg-cyan-900 text-cyan-300 ring-1 ring-cyan-400' : 'bg-gray-800 text-gray-400 hover:bg-cyan-800/70 hover:text-cyan-300'}`}
                         aria-pressed={isRepeat}
                         aria-label={isRepeat ? 'Disable repeat' : 'Enable repeat'}
                         title={isRepeat ? 'Repeat On (R)' : 'Repeat Off (R)'}
                    >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            {/* Visual indication for repeat one vs all (if needed later) */}
                            {isRepeat && <text x="12" y="17" textAnchor="middle" fontSize="9" fill="currentColor">1</text>}
                        </svg>
                    </button>
                    {/* Previous Button */}
                    <button
                        onClick={handlePrevious}
                        className="p-2 rounded-full bg-gray-800 text-pink-500 hover:bg-pink-900/70 hover:text-pink-300 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                        aria-label="Previous track"
                        title="Previous (Ctrl+Left) / Restart"
                        disabled={tracks.length < 2 && (!audioRef.current || audioRef.current.currentTime <= 3)} // Disable if only one track and at start
                    >
                        {/* Skip Previous Icon */}
                        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20"> <path d="M8.445 14.832A1 1 0 0010 14.136V5.864a1 1 0 00-1.555-.832L4 8.168V5.864a1 1 0 00-2 0v8.272a1 1 0 002 0v-2.305l4.445 3.001zM17 5.864a1 1 0 00-2 0v8.272a1 1 0 002 0V5.864z"/> </svg>
                    </button>
                    {/* Play/Pause Button */}
                    <button
                        onClick={handlePlayPause}
                        className="p-3 rounded-full bg-cyan-500 text-black hover:bg-cyan-400 active:bg-cyan-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                        disabled={isLoadingTrack || !duration || playlistError != null} // Disable while loading track, if duration is invalid, or if playlist failed
                    >
                        {isLoadingTrack ? ( // Show spinner only for track loading, not playlist loading
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : isPlaying ? (
                            <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd"/></svg>
                        ) : (
                            <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.188v3.624a1 1 0 001.555.832l3.6-2.16a1 1 0 000-1.664l-3.6-2.16z" clipRule="evenodd"/></svg>
                        )}
                    </button>
                    {/* Next Button */}
                    <button
                        onClick={handleNext}
                        className="p-2 rounded-full bg-gray-800 text-pink-500 hover:bg-pink-900/70 hover:text-pink-300 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                        aria-label="Next track"
                        title="Next (Ctrl+Right)"
                        disabled={tracks.length < 2} // Disable if only one track
                    >
                         {/* Skip Next Icon */}
                         <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20"> <path d="M11.555 5.168A1 1 0 0010 5.864v8.272a1 1 0 001.555.832l4.445-3.001v2.305a1 1 0 002 0V5.864a1 1 0 00-2 0v2.305l-4.445-3.001zM4 5.864a1 1 0 00-2 0v8.272a1 1 0 002 0V5.864z"/> </svg>
                    </button>
                    {/* Shuffle Button */}
                    <button
                        onClick={handleShuffle}
                        className={`p-2 rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${isShuffled ? 'bg-cyan-900 text-cyan-300 ring-1 ring-cyan-400' : 'bg-gray-800 text-gray-400 hover:bg-cyan-800/70 hover:text-cyan-300'}`}
                        aria-pressed={isShuffled}
                        aria-label={isShuffled ? 'Disable shuffle' : 'Enable shuffle'}
                        title={isShuffled ? 'Shuffle On (S)' : 'Shuffle Off (S)'}
                        disabled={tracks.length < 2} // Disable if not enough tracks to shuffle
                    >
                         {/* Shuffle Icon */}
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1zM3 6a1 1 0 011-1h2.155a1 1 0 01.832 1.555L4.832 9.707a1 1 0 01-1.555.832L1 8.832A1 1 0 011 7.168l1.168-1.168A1 1 0 013 6zm14 0a1 1 0 011-1h2.155a1 1 0 01.832 1.555L18.832 9.707a1 1 0 01-1.555.832L15 8.832A1 1 0 0115 7.168l1.168-1.168A1 1 0 0117 6zM3 14a1 1 0 011-1h2.155a1 1 0 01.832 1.555l-2.155 3.148a1 1 0 01-1.555.832L1 16.832A1 1 0 011 15.168l1.168-1.168A1 1 0 013 14zm14 0a1 1 0 011-1h2.155a1 1 0 01.832 1.555l-2.155 3.148a1 1 0 01-1.555.832L15 16.832a1 1 0 010-1.664l1.168-1.168A1 1 0 0117 14z" clipRule="evenodd"/> </svg>
                    </button>
                </div>

                 {/* Volume Control & Playlist Toggle */}
                 <div className="flex items-center justify-between space-x-3 sm:space-x-4 mb-4 px-2">
                    {/* Volume Slider */}
                    <div className="flex items-center space-x-2 flex-1">
                       <button onClick={() => setVolume(prev => prev > 0 ? 0 : 0.7)} title="Mute/Unmute (M)" aria-label="Mute/Unmute Volume" className="text-gray-500 hover:text-pink-400 focus:outline-none focus:text-pink-400">
                           {/* Volume Icons */}
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                {volume === 0 ? (
                                <path d="M7.21 1.17a1 1 0 00-1.063.04L1.21 4.958A1 1 0 001 5.79v8.42a1 1 0 00.21.628l4.938 3.742a1 1 0 001.062.04 1 1 0 00.572-.909V2.08a1 1 0 00-.572-.909zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" />
                                ) : volume < 0.5 ? (
                                <path d="M7.21 1.17a1 1 0 00-1.063.04L1.21 4.958A1 1 0 001 5.79v8.42a1 1 0 00.21.628l4.938 3.742a1 1 0 001.062.04 1 1 0 00.572-.909V2.08a1 1 0 00-.572-.909zM13 9a1 1 0 100 2h1a1 1 0 100-2h-1z" />
                                ) : (
                                <path d="M7.21 1.17a1 1 0 00-1.063.04L1.21 4.958A1 1 0 001 5.79v8.42a1 1 0 00.21.628l4.938 3.742a1 1 0 001.062.04 1 1 0 00.572-.909V2.08a1 1 0 00-.572-.909zM15.657 5.757a1 1 0 011.414-1.414 8 8 0 010 11.314 1 1 0 01-1.414-1.414 6 6 0 000-8.486zM13.536 7.879a1 1 0 011.414-1.414 4 4 0 010 5.657 1 1 0 01-1.414-1.414 2 2 0 000-2.829z" />
                                )}
                            </svg>
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-400 focus:ring-offset-1 focus:ring-offset-gray-900"
                            aria-label="Volume control"
                            title={`Volume: ${Math.round(volume * 100)}% (Up/Down Arrows)`}
                        />
                    </div>

                    {/* Playlist Toggle Button */}
                    <button
                        onClick={() => setShowPlaylist(!showPlaylist)}
                         className="text-sm text-lime-400 hover:text-lime-300 border border-lime-600/50 px-3 py-1 rounded hover:bg-lime-900/50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center space-x-1 flex-shrink-0"
                         aria-expanded={showPlaylist}
                         aria-controls="playlist-container"
                         title={showPlaylist ? 'Hide Playlist (L)' : 'Show Playlist (L)'}
                         disabled={tracks.length === 0} // Disable if no tracks
                    >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                        <span>List</span> ({tracks.length})
                    </button>
                </div>


                {/* Playlist Container */}
                <div
                    ref={playlistRef}
                    id="playlist-container"
                     className={`absolute bottom-full left-0 right-0 mb-2 max-h-64 overflow-y-auto bg-gray-800/95 backdrop-blur-sm border border-cyan-700/50 rounded-t-lg shadow-2xl z-10 scrollbar-thin transition-all duration-300 ease-in-out ${showPlaylist ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
                     onDragOver={handleDragOver}
                     onDrop={handleDrop} // Handle drop on container (if not on specific item)
                >
                <h3 className="text-sm font-semibold text-cyan-400 p-2 sticky top-0 bg-gray-800/95 backdrop-blur-sm z-10 border-b border-cyan-900/50 flex justify-between items-center">
                    <span>Tracklist</span>
                    {tracks.length > 1 && <span className="text-xs text-gray-500 font-normal">(Drag to reorder)</span>}
                </h3>
                <ul role="listbox" aria-label="Tracklist">
                    {tracks.map((track, index) => (
                    <li
                        key={`${track.src}-${index}`} // Use src and index for key stability during reorder
                        role="option"
                        aria-selected={index === currentTrackIndex}
                        draggable={tracks.length > 1} // Only allow dragging if more than one track
                        onDragStart={(e) => tracks.length > 1 && handleDragStart(e, index)}
                        onDragEnter={(e) => tracks.length > 1 && handleDragEnter(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop} // Handle drop on item itself
                        onDragOver={handleDragOver} // Allow dropping ON this item
                        className={`border-b border-gray-700/50 last:border-b-0 ${tracks.length > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'} ${index === currentTrackIndex ? 'bg-cyan-900/60' : 'hover:bg-gray-700/70'}`}
                        style={{ outlineOffset: '-1px' }} // Keep focus outline inside item
                    >
                        <button
                        onClick={() => handleSelectTrack(index)}
                        className={`w-full text-left p-2.5 flex items-center justify-between text-sm rounded-none transition-colors duration-100 ${index === currentTrackIndex ? 'text-white' : 'text-gray-300'}`}
                        // Focus managed globally or by list item focus-visible
                        >
                        <span className={`font-medium ${index === currentTrackIndex ? 'text-cyan-300' : 'text-lime-400'} truncate flex-1 mr-2`}>
                            {index + 1}. {track.title}
                        </span>
                        {/* Playing indicator */}
                        {index === currentTrackIndex && isPlaying && (
                            <svg className="w-4 h-4 text-cyan-400 animate-pulse flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 3a1 1 0 00-1.447-.894L4 8.447V4a1 1 0 00-2 0v12a1 1 0 002 0v-4.447l12.553 6.341A1 1 0 0018 17V3z"></path>
                           </svg>
                        )}
                         {/* Loading indicator for current track */}
                         {index === currentTrackIndex && isLoadingTrack && !isPlaying && (
                            <svg className="w-4 h-4 text-cyan-600 animate-spin flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                         )}
                        </button>
                    </li>
                    ))}
                </ul>
                </div>
            </>
        ) : (
            // Render this part if playlist loaded successfully but is empty
            <div className="text-center py-10 text-gray-500">
                <p>No tracks found in the playlist.</p>
                <p className="text-xs mt-2">({ALBUM_TO_LOAD}/{PLAYLIST_FILENAME})</p>
            </div>
        )}


      </div> {/* End Player Container */}


        {/* Keyboard Shortcuts Help Text */}
       <div className="mt-5 text-xs text-gray-500 text-center px-4 max-w-md leading-relaxed">
            <p>
                <strong className='text-gray-400'>Shortcuts:</strong> 
                <kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">Space</kbd>=<span className='text-cyan-400'>Play/Pause</span>, 
                <kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">←</kbd>/<kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">→</kbd>=<span className='text-cyan-400'>Seek</span>, 
                <kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">Ctrl</kbd>+<kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">←</kbd>/<kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">→</kbd>=<span className='text-pink-500'>Prev/Next</span>, 
                <kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">↑</kbd>/<kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">↓</kbd>=<span className='text-pink-500'>Volume</span>, 
                <kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">M</kbd>=<span className='text-pink-500'>Mute</span>, 
                <kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">S</kbd>=<span className='text-cyan-400'>Shuffle</span>, 
                <kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">R</kbd>=<span className='text-cyan-400'>Repeat</span>, 
                <kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">L</kbd>=<span className='text-lime-400'>Playlist</span>
            </p>
        </div>


      {/* Glitchy Footer */}
      <div className="mt-8 text-center text-xs text-gray-600">
        <p>panic!("Playback subsystem online.");_</p>
         <p className={`mt-1 ${playlistError ? 'text-red-700' : 'text-pink-700'}`}>
             {playlistError ? "// System fault detected during boot sequence._" : "// NullPtr.rs is live. Resistance is futile._"}
         </p>
      </div>

    </div>
  );
};

export default NullPtrMp3Player;
