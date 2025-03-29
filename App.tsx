import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Track {
  title: string;
  artist: string;
  album: string;
  year: number;
  src: string;
  coverArt: string | null; // Allow null for placeholder
}

// --- Placeholder Data ---
// IMPORTANT: Replace 'your-github-username/your-repo-name/main' with your actual GitHub username, repo name, and branch (usually main or master)
// IMPORTANT: Ensure your GitHub repo is configured for CORS if serving audio directly, or use GitHub Pages/RawGit service properly. Direct raw links might face issues.
const placeholderTracks: Track[] = [
  {
    title: "Memory Leak",
    artist: "NullPtr.rs",
    album: "SEGFAULT SERENADE",
    year: 2023,
    src: "https://raw.githubusercontent.com/your-github-username/your-repo-name/main/audio/segfault_serenade/memory_leak.mp3",
    coverArt: "https://raw.githubusercontent.com/your-github-username/your-repo-name/main/images/segfault_serenade_cover.jpg", // Example placeholder - replace
  },
  {
    title: "Panic Attack",
    artist: "NullPtr.rs",
    album: "SEGFAULT SERENADE",
    year: 2023,
    src: "https://raw.githubusercontent.com/your-github-username/your-repo-name/main/audio/segfault_serenade/panic_attack.mp3",
    coverArt: "https://raw.githubusercontent.com/your-github-username/your-repo-name/main/images/segfault_serenade_cover.jpg", // Example placeholder - replace
  },
  {
    title: "Kernel Panic",
    artist: "NullPtr.rs",
    album: "SYSTEM CRASH",
    year: 2022,
    src: "https://raw.githubusercontent.com/your-github-username/your-repo-name/main/audio/system_crash/kernel_panic.mp3",
    coverArt: "https://raw.githubusercontent.com/your-github-username/your-repo-name/main/images/system_crash_cover.jpg", // Example placeholder - replace
  },
  {
    title: "Blue Screen Ballad",
    artist: "NullPtr.rs",
    album: "SYSTEM CRASH",
    year: 2022,
    src: "https://raw.githubusercontent.com/your-github-username/your-repo-name/main/audio/system_crash/blue_screen_ballad.mp3",
    coverArt: "https://raw.githubusercontent.com/your-github-username/your-repo-name/main/images/system_crash_cover.jpg", // Example placeholder - replace
  },
  {
    title: "Heapsort Requiem",
    artist: "NullPtr.rs",
    album: "GLITCH GOSPEL",
    year: 2021,
    src: "https://raw.githubusercontent.com/your-github-username/your-repo-name/main/audio/glitch_gospel/heapsort_requiem.mp3",
    coverArt: "https://raw.githubusercontent.com/your-github-username/your-repo-name/main/images/glitch_gospel_cover.jpg", // Example placeholder - replace
  },
  {
    title: "Undefined Behavior",
    artist: "NullPtr.rs",
    album: "GLITCH GOSPEL",
    year: 2021,
    src: "https://raw.githubusercontent.com/your-github-username/your-repo-name/main/audio/glitch_gospel/undefined_behavior.mp3",
    coverArt: "https://raw.githubusercontent.com/your-github-username/your-repo-name/main/images/glitch_gospel_cover.jpg", // Example placeholder - replace
  },
];
// --- End Placeholder Data ---

// Add this to your CSS/stylesheet or in a style tag
const glitchStyles = `
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
  const [tracks, setTracks] = useState<Track[]>(placeholderTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [originalTracks, setOriginalTracks] = useState<Track[]>([...placeholderTracks]); // Store original order for unshuffling
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);
  const playerRef = useRef<HTMLDivElement>(null); // Ref for the main player container for keyboard scope
  const playlistRef = useRef<HTMLDivElement>(null); // Ref for playlist container

  const currentTrack = tracks[currentTrackIndex];

  // --- Play/Pause ---
  const handlePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
        setError("Playback failed. Check audio URL/CORS or browser permissions.");
        setIsPlaying(false); // Ensure state is correct on error
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // --- Next Track ---
  const handleNext = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true); // Auto-play next track
    setError(null); // Clear previous errors
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset time for the new track
    }
  }, [currentTrackIndex, tracks.length]);

  // --- Previous Track ---
  const handlePrevious = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      // If track played for more than 3 seconds, restart it
      audioRef.current.currentTime = 0;
    } else {
      // Otherwise, go to the previous track
      const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
      setCurrentTrackIndex(prevIndex);
      setIsPlaying(true); // Auto-play previous track
      setError(null); // Clear previous errors
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Ensure time is reset even when restarting
    }
  }, [currentTrackIndex, tracks.length]);

  // --- Handle Audio Events ---
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleTimeUpdate = () => setCurrentTime(audioElement.currentTime);
    const handleLoadedMetadata = () => {
      const newDuration = audioElement.duration;
      if (!isNaN(newDuration)) {
        setDuration(newDuration);
        if (progressBarRef.current) {
            progressBarRef.current.max = String(newDuration);
        }
      }
      setIsLoading(false); // Loading finished when metadata is loaded
    };
    const handleEnded = () => {
      if (isRepeat) {
        audioElement.currentTime = 0;
        audioElement.play().catch(e => {
          console.error("Repeat failed:", e);
          setError("Repeat playback failed.");
          setIsPlaying(false);
        });
      } else {
        handleNext();
      }
    };
    const handleError = (e: Event) => {
      console.error("Audio Error Event:", e);
      const trackTitle = currentTrack?.title || 'track';
      setError(`Error loading: ${trackTitle}. Check URL/Network/CORS.`);
      setIsPlaying(false);
      setIsLoading(false);
      setDuration(0); // Reset duration on error
      setCurrentTime(0);
    };
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsLoading(false);
      setError(null); // Clear errors once playing starts
    };
    const handleCanPlay = () => setIsLoading(false); // Also hide loader when ready

    // Add listeners
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('error', handleError);
    audioElement.addEventListener('waiting', handleWaiting);
    audioElement.addEventListener('playing', handlePlaying);
    audioElement.addEventListener('canplay', handleCanPlay);

    // Set initial loading state and reset times when src changes
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(0); // Reset duration display initially
    if (progressBarRef.current) progressBarRef.current.value = '0'; // Reset progress bar visual

    // Trigger load explicitly
    audioElement.load();

    // Attempt to play if isPlaying is true (e.g., after next/prev or track selection)
    if (isPlaying) {
      audioElement.play().catch(err => {
        // Autoplay might be blocked by the browser initially
        console.warn("Autoplay attempt failed:", err);
        setIsPlaying(false); // Update state if autoplay fails immediately
        // Don't set an error here, let the user click play
      });
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
    };
    // Re-run effect when currentTrackIndex changes, or if tracks array itself changes
  }, [currentTrackIndex, tracks, isRepeat, handleNext, currentTrack?.title, isPlaying]); // isPlaying is needed here to trigger play attempt

  // --- Update Audio Element Volume ---
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // --- Shuffle Functionality ---
  const handleShuffle = useCallback(() => {
    setIsShuffled(prev => {
      const shuffling = !prev;
      if (shuffling) {
        setOriginalTracks([...tracks]); // Store current order
        const current = tracks[currentTrackIndex];
        const rest = tracks.filter((_, i) => i !== currentTrackIndex);
        for (let i = rest.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [rest[i], rest[j]] = [rest[j], rest[i]];
        }
        setTracks([current, ...rest]);
        setCurrentTrackIndex(0); // Current track is now at the start
      } else {
        const currentTrackSrc = tracks[currentTrackIndex].src;
        // Restore original order *before* shuffling started
        setTracks(originalTracks);
        const newIndex = originalTracks.findIndex(t => t.src === currentTrackSrc);
        setCurrentTrackIndex(newIndex >= 0 ? newIndex : 0);
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
       if (document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement) {
           // Allow space if focus is explicitly on the player div (not a button inside it)
           if (!(e.key === ' ' && isFocusOnPlayer) && !isFocusOnBody) {
               return;
           }
       } else if (!isFocusInsidePlayer && !isFocusOnBody && !isFocusOnPlayer) {
            // If focus is outside player completely, ignore most keys
            return;
       }


      switch (e.key) {
        case ' ': // Play/Pause
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowRight': // Next or Seek Forward
           if (e.ctrlKey || e.metaKey) { // Use Ctrl or Cmd + Arrow for Next
               e.preventDefault();
                handleNext();
           } else if (audioRef.current && duration > 0) { // Seek Forward 5s
               e.preventDefault();
               const newTime = Math.min(audioRef.current.currentTime + 5, duration);
               audioRef.current.currentTime = newTime;
               setCurrentTime(newTime);
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
               setCurrentTime(newTime);
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
  }, [handlePlayPause, handleNext, handlePrevious, handleShuffle, handleRepeat, duration]); // Add duration dependency for seek shortcuts


  // --- Seek Functionality ---
  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
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
    if (index !== currentTrackIndex) {
      setCurrentTrackIndex(index);
      setIsPlaying(true); // Start playing the selected track
      setError(null); // Clear previous errors
    } else {
      // If clicking the currently playing track, toggle play/pause
      handlePlayPause();
    }
    setShowPlaylist(false); // Optionally hide playlist after selection
  };

  // --- Playlist Drag and Drop ---
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
      dragItem.current = index;
      // Optional: Add styling for dragged item via data attribute or class
      e.dataTransfer.effectAllowed = 'move';
      // e.dataTransfer.setData('text/plain', index.toString()); // Optional data transfer
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, index: number) => {
      e.preventDefault(); // Necessary to allow drop
      dragOverItem.current = index;
      // Optional: Add visual cue for drop target
      // e.currentTarget.classList.add('bg-cyan-700/50'); // Example visual cue
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    // Optional: Remove visual cue if leaving a potential drop target
    // e.currentTarget.classList.remove('bg-cyan-700/50');
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault(); // Necessary to allow drop
      e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
        dragItem.current = null;
        dragOverItem.current = null;
        // Remove any temporary drag-over styling
        // document.querySelectorAll('.bg-cyan-700\\/50').forEach(el => el.classList.remove('bg-cyan-700/50'));
        return;
    }

    const sourceIndex = dragItem.current;
    const targetIndex = dragOverItem.current;

    const reorderedTracks = [...tracks];
    const [draggedItem] = reorderedTracks.splice(sourceIndex, 1);
    reorderedTracks.splice(targetIndex, 0, draggedItem);

    const currentTrackSrc = tracks[currentTrackIndex].src;
    setTracks(reorderedTracks);

    const newCurrentIndex = reorderedTracks.findIndex(t => t.src === currentTrackSrc);
    setCurrentTrackIndex(newCurrentIndex >= 0 ? newCurrentIndex : 0);

    // If shuffled, the drag/drop effectively creates a new "shuffled" order.
    // The `originalTracks` still holds the order *before* the shuffle was initially turned on.
    // If the user unshuffles later, it will revert to that pre-shuffle state.

    // Reset refs and remove visual cues
    dragItem.current = null;
    dragOverItem.current = null;
    // document.querySelectorAll('.bg-cyan-700\\/50').forEach(el => el.classList.remove('bg-cyan-700/50'));
  };


  // --- Render ---
  if (!currentTrack && tracks.length > 0) {
    // Handle case where index might be out of bounds briefly during shuffle/reorder
     setCurrentTrackIndex(0); // Reset to first track
     return <div className="min-h-screen bg-black text-pink-500 flex items-center justify-center font-mono p-4">Resetting track...</div>;
  } else if (tracks.length === 0) {
     return <div className="min-h-screen bg-black text-pink-500 flex items-center justify-center font-mono p-4">Error: No tracks loaded. Check configuration.</div>;
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-gray-300 font-mono flex flex-col items-center justify-center p-4">
       <style>{glitchStyles}</style> {/* Inject glitch styles */}
      <div
        ref={playerRef}
        className="w-full max-w-md bg-gray-900/80 backdrop-blur-sm shadow-2xl shadow-cyan-900/30 rounded-lg overflow-visible border border-cyan-500/30 p-5 sm:p-6 relative"
        tabIndex={0} // Make the player focusable for keyboard events
        aria-label="NullPtr.rs MP3 Player"
      >
        {/* Error Display */}
        {error && (
          <div className="absolute -top-5 left-2 right-2 bg-red-900 border border-red-600 text-white p-2 rounded shadow-lg z-20 flex justify-between items-center text-xs">
            <span className='mr-2 break-words'>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-300 hover:text-white font-bold text-sm flex-shrink-0 p-1" aria-label="Dismiss error">×</button>
          </div>
        )}

        {/* Header */}
         <div className="text-center mb-6">
          <div className="glitch-container inline-block">
            {/* Apply text-center to the outer div, keep container inline-block */}
            <h1 className="glitch-text text-3xl sm:text-4xl font-bold mb-1">
              NullPtr.rs
            </h1>
            <div className="glitch-layer glitch-1 text-3xl sm:text-4xl font-bold">
              NullPtr.rs
            </div>
            <div className="glitch-layer glitch-2 text-3xl sm:text-4xl font-bold">
              NullPtr.rs
            </div>
            <div className="glitch-layer glitch-3 text-3xl sm:text-4xl font-bold">
              NullPtr.rs
            </div>
            <div className="glitch-scanline" />
            <div className="glitch-flicker" />
          </div>
          <p className="text-xs text-pink-500 mt-2">
            // Now infiltrating your audio buffer..._
          </p>
        </div>

        {/* Album Art & Track Info */}
        <div className="flex flex-col items-center mb-6">
          {currentTrack.coverArt ? (
            <img
              key={currentTrack.coverArt} // Add key to force re-render on change
              src={currentTrack.coverArt}
              alt={`${currentTrack.album} Cover`}
              className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-md shadow-lg border-2 border-pink-600/70 mb-4 transition-all duration-300 ease-in-out"
              loading="lazy" // Lazy load images
              onError={(e) => { e.currentTarget.src = ''; e.currentTarget.style.display='none'; /* Hide if fails */ }}
            />
          ) : (
             // Placeholder div if no cover art
            <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-md w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-4 text-gray-700">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
            </div>
          )}

          <h2 className="text-lg sm:text-xl font-semibold text-lime-400 truncate max-w-full px-2 text-center" title={currentTrack.title}>{currentTrack.title || "Loading..."}</h2>
          <p className="text-sm text-gray-400 truncate max-w-full px-2 text-center">{currentTrack.artist}</p>
          <p className="text-xs text-gray-500 truncate max-w-full px-2 text-center">{currentTrack.album} ({currentTrack.year})</p>
        </div>

        {/* Audio Element (Hidden but controls linked) */}
        <audio
            ref={audioRef}
            src={currentTrack.src}
            preload="metadata" // Start loading metadata asap
            aria-hidden="true" // Hide from assistive tech as controls are provided
             onLoadedMetadata={() => { // Ensure duration updates state
                 if (audioRef.current && !isNaN(audioRef.current.duration)) {
                     setDuration(audioRef.current.duration);
                     if (progressBarRef.current) progressBarRef.current.max = String(audioRef.current.duration);
                     setIsLoading(false);
                 }
             }}
             onError={(e) => { // Basic logging for audio element specific errors
                 console.error("Direct Audio Element Error:", e);
                 // More specific error handling might already be covered by the 'error' event listener in useEffect
             }}
        />

        {/* Progress Bar */}
        <div className="mb-4 px-2 relative">
          <input
            type="range"
            ref={progressBarRef}
            min="0"
            max={duration || 1} // Use 1 as max if duration is 0 to prevent errors, disable below
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Seek track progress"
            disabled={!duration || isLoading} // Disable if no duration or loading
            title={duration ? `Seek: ${formatTime(currentTime)} / ${formatTime(duration)}` : "Loading track..."}
          />
          {/* Loading Indicator over progress bar */}
          {isLoading && (
            <div className="absolute top-0 left-0 w-full h-2 flex items-center justify-center pointer-events-none rounded-lg overflow-hidden">
                <div className="w-full h-full bg-cyan-600/30 animate-pulse-bg rounded-lg"></div>
            </div>
          )}
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
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
  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 9a7 7 0 0112 5h4M20 15a7 7 0 01-12-5H4" />
  <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor">1</text>
</svg>
          </button>
           {/* Previous Button */}
          <button
            onClick={handlePrevious}
            className="p-2 rounded-full bg-gray-800 text-pink-500 hover:bg-pink-900/70 hover:text-pink-300 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Previous track"
            title="Previous (Ctrl+Left) / Restart"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 transform -scale-x-100" fill="currentColor" viewBox="0 0 20 20"><path d="M11.555 5.168A1 1 0 0010 5.864v8.272a1 1 0 001.555.832L16 11.83v2.305a1 1 0 002 0V5.864a1 1 0 00-2 0v2.305l-4.445-3.001zm-7 0A1 1 0 003 5.864v8.272a1 1 0 001.555.832L9 11.83v2.305a1 1 0 102 0V5.864a1 1 0 10-2 0v2.305l-4.445-3.001z"/></svg>
          </button>
           {/* Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            className="p-3 rounded-full bg-cyan-500 text-black hover:bg-cyan-400 active:bg-cyan-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            disabled={isLoading || !duration} // Disable while loading or if track failed
          >
            {isLoading ? (
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
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M11.555 5.168A1 1 0 0010 5.864v8.272a1 1 0 001.555.832L16 11.83v2.305a1 1 0 002 0V5.864a1 1 0 00-2 0v2.305l-4.445-3.001zm-7 0A1 1 0 003 5.864v8.272a1 1 0 001.555.832L9 11.83v2.305a1 1 0 102 0V5.864a1 1 0 10-2 0v2.305l-4.445-3.001z"/></svg>
          </button>
           {/* Shuffle Button */}
          <button
            onClick={handleShuffle}
             className={`p-2 rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${isShuffled ? 'bg-cyan-900 text-cyan-300 ring-1 ring-cyan-400' : 'bg-gray-800 text-gray-400 hover:bg-cyan-800/70 hover:text-cyan-300'}`}
             aria-pressed={isShuffled}
             aria-label={isShuffled ? 'Disable shuffle' : 'Enable shuffle'}
             title={isShuffled ? 'Shuffle On (S)' : 'Shuffle Off (S)'}
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l6 6m0 0l6-6m-6 6v6a4 4 0 004 4h4" />
</svg>
          </button>
        </div>

        {/* Volume Control & Playlist Toggle */}
        <div className="flex items-center justify-between space-x-3 sm:space-x-4 mb-4 px-2">
            {/* Volume Slider */}
            <div className="flex items-center space-x-2 flex-1">
               <button onClick={() => setVolume(prev => prev > 0 ? 0 : 0.7)} title="Mute/Unmute (M)" aria-label="Mute/Unmute Volume" className="text-gray-500 hover:text-pink-400 focus:outline-none focus:text-pink-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        {volume === 0 ? (
                        <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" />
                        ) : volume < 0.5 ? (
                        <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12 9a1 1 0 100 2h1a1 1 0 100-2h-1z" />
                        ) : (
                        <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 5.757a1 1 0 011.414-1.414 8 8 0 010 11.314 1 1 0 01-1.414-1.414 6 6 0 000-8.486zM13.536 7.879a1 1 0 011.414-1.414 4 4 0 010 5.657 1 1 0 01-1.414-1.414 2 2 0 000-2.829z" />
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
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                <span>List</span>
            </button>
        </div>


        {/* Playlist Container */}
        {/* Positioned absolutely relative to the main player div */}
        <div
            ref={playlistRef}
            id="playlist-container"
            className={`absolute bottom-full left-0 right-0 mb-2 max-h-64 overflow-y-auto bg-gray-800/95 backdrop-blur-sm border border-cyan-700/50 rounded-t-lg shadow-2xl z-10 scrollbar-thin transition-all duration-300 ease-in-out ${showPlaylist ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
            onDragOver={handleDragOver} // Allow dropping anywhere within the list container
            onDrop={handleDrop} // Handle drop event on the container itself if not dropped on an item
        >
          <h3 className="text-sm font-semibold text-cyan-400 p-2 sticky top-0 bg-gray-800/95 backdrop-blur-sm z-10 border-b border-cyan-900/50 flex justify-between items-center">
              <span>Tracklist</span>
              <span className="text-xs text-gray-500 font-normal">(Drag to reorder)</span>
          </h3>
          <ul role="listbox" aria-label="Tracklist">
            {tracks.map((track, index) => (
              <li
                key={`${track.src}-${index}`} // Key needs to be stable for drag/drop identity
                role="option"
                aria-selected={index === currentTrackIndex}
                draggable // Make item draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragLeave={handleDragLeave} // Added drag leave handler
                onDrop={handleDrop} // Handle drop specifically on this item
                onDragOver={handleDragOver} // NEEDED on each item to allow dropping ON it
                className={`cursor-grab active:cursor-grabbing border-b border-gray-700/50 last:border-b-0 ${index === currentTrackIndex ? 'bg-cyan-900/60' : 'hover:bg-gray-700/70'}`} // Style for draggable items
              >
                <button
                  onClick={() => handleSelectTrack(index)}
                  className={`w-full text-left p-2.5 flex items-center justify-between text-sm rounded-none transition-colors duration-100 ${index === currentTrackIndex ? 'text-white' : 'text-gray-300'}`}
                  // Apply focus styles directly for clarity within list items
                  // style={{ outlineOffset: '-2px' }} // Adjust outline offset if needed
                >
                  <span className={`font-medium ${index === currentTrackIndex ? 'text-cyan-300' : 'text-lime-400'} truncate flex-1 mr-2`}>
                    {index + 1}. {track.title}
                  </span>
                  {/* Optional: Add visual indicator for currently playing */}
                  {index === currentTrackIndex && isPlaying && (
                     <svg className="w-4 h-4 text-cyan-400 animate-pulse flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                         <path d="M18 3a1 1 0 00-1.447-.894L4 8.447V4a1 1 0 00-2 0v12a1 1 0 002 0v-4.447l12.553 6.341A1 1 0 0018 17V3z"></path>
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div> {/* End Player Container */}


        {/* Keyboard Shortcuts Help Text */}
       <div className="mt-5 text-xs text-gray-500 text-center px-4 max-w-md leading-relaxed">
            <p>
                <strong className='text-gray-400'>Shortcuts:</strong>&nbsp;
                <kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">Space</kbd>=<span className='text-cyan-400'>Play/Pause</span>,&nbsp;
                <kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">←</kbd>/<kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">→</kbd>=<span className='text-cyan-400'>Seek</span>,&nbsp;
                <kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">Ctrl</kbd>+<kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">←</kbd>/<kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">→</kbd>=<span className='text-pink-500'>Prev/Next</span>,&nbsp;
                <kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">↑</kbd>/<kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">↓</kbd>=<span className='text-pink-500'>Volume</span>,&nbsp;
                <kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">M</kbd>=<span className='text-pink-500'>Mute</span>,&nbsp;
                <kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">S</kbd>=<span className='text-cyan-400'>Shuffle</span>,&nbsp;
                <kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">R</kbd>=<span className='text-cyan-400'>Repeat</span>,&nbsp;
                <kbd className="px-1.5 py-0.5 border border-gray-600 rounded bg-gray-800 text-gray-300">L</kbd>=<span className='text-lime-400'>Playlist</span>
            </p>
        </div>


      {/* Glitchy Footer */}
      <div className="mt-8 text-center text-xs text-gray-600">
        <p>panic!("Playback initialized.");_</p>
        <p className="mt-1 text-pink-700">// NullPtr.rs is live. Resistance is futile._</p>
      </div>

    </div>
  );
};

export default NullPtrMp3Player;
