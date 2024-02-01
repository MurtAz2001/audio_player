import React, { useRef, useEffect, useState } from 'react';
import play_btn from '../img/play.png';
import pause_btn from '../img/pause.png';

const AudioPlayer = ({ playlist, currentTrackIndex, onEnded }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState('');
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    return () => {
      // Component will unmount, set isMounted to false
      setIsMounted(false);
    };
  }, []);

  const handlePlay = () => {
    if (audioRef.current && isMounted) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Failed to play audio:', error);
      });
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const setPlaybackState = () => {
    const currentTrack = playlist[currentTrackIndex];

    // Check if the playlist and currentTrack are defined
    if (playlist && playlist.length > 0 && currentTrack) {
      const playbackState = JSON.parse(localStorage.getItem('playbackState')) || {};

      if (audioRef.current && playbackState[currentTrack.name]) {
        audioRef.current.addEventListener('loadedmetadata', () => {
          if (isMounted) {
            audioRef.current.currentTime = playbackState[currentTrack.name].currentTime;
            if (playbackState[currentTrack.name].isPlaying) {
              handlePlay();
            }
          }
        });
      }
    }
  };

  useEffect(() => {
    setPlaybackState();
  }, [currentTrackIndex, playlist]);

  useEffect(() => {
    if (isPlaying) {
      const currentTrack = playlist[currentTrackIndex];

      // Check if the playlist and currentTrack are defined
      if (playlist && playlist.length > 0 && currentTrack) {
        const playbackState = {
          [currentTrack.name]: {
            currentTime: audioRef.current.currentTime,
            isPlaying: true,
          },
        };
        localStorage.setItem('playbackState', JSON.stringify(playbackState));
      }
    } else {
      const currentTrack = playlist[currentTrackIndex];

      // Check if the playlist and currentTrack are defined
      if (playlist && playlist.length > 0 && currentTrack) {
        const playbackState = {
          [currentTrack.name]: {
            currentTime: audioRef.current.currentTime,
            isPlaying: false,
          },
        };
        localStorage.setItem('playbackState', JSON.stringify(playbackState));
      }
    }
  }, [isPlaying, currentTrackIndex, playlist]);

  useEffect(() => {
    setCurrentSong(playlist[currentTrackIndex]?.name || '');
  }, [playlist, currentTrackIndex]);

  return (
    <div>
      <div style={{ padding: 20 }}> Song Name: {currentSong.length > 10 ? `${currentSong.slice(0, 8)}...` : currentSong}</div>
      <button onClick={handlePlay} className='play_btn'> <img src={play_btn} alt="Play" /></button>
      <button onClick={handlePause} className='play_btn'><img src={pause_btn} alt="Pause" /></button>
      <audio ref={audioRef} onEnded={onEnded}>
        <source src={playlist[currentTrackIndex]?.url} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
