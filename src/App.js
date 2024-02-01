import React, { useState, useEffect } from 'react';
import AudioPlayer from './components/AudioPlayer';
import Playlist from './components/Playlist';
import './styles.css';
import ParticleBackground from './components/ParticleBackground';

const App = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [fileInput, setFileInput] = useState(null);

  const loadPlaylistFromLocalStorage = () => {
    const savedPlaylist = localStorage.getItem('playlist');
    if (savedPlaylist) {
      setPlaylist(JSON.parse(savedPlaylist));
    }
  };

  useEffect(() => {
    loadPlaylistFromLocalStorage();
  }, []);

  const savePlaylistToLocalStorage = () => {
    localStorage.setItem('playlist', JSON.stringify(playlist));
  };

  useEffect(() => {
    savePlaylistToLocalStorage();
  }, [playlist]);

  const playNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const handlePlaylistItemClick = (index) => {
    setCurrentTrackIndex(index);
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const newAudios = Array.from(files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setPlaylist((prevPlaylist) => [...prevPlaylist, ...newAudios]);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const files = event.dataTransfer.files;
    handleFiles(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDeleteTrack = (index) => {
    setPlaylist((prevPlaylist) => {
      const newPlaylist = [...prevPlaylist];
      const deletedTrack = newPlaylist.splice(index, 1)[0];

      // Remove the deleted track from the playback state
      const playbackState = JSON.parse(localStorage.getItem('playbackState')) || {};
      delete playbackState[deletedTrack.name];
      localStorage.setItem('playbackState', JSON.stringify(playbackState));

      // If the deleted track is the currently playing one, stop playback
      if (index === currentTrackIndex) {
        setCurrentTrackIndex(0);
      }

      return newPlaylist;
    });
  };

  return (
    <div className="app" onDrop={handleDrop} onDragOver={handleDragOver}>
      <ParticleBackground/>
      <div className="audio_player">
        <h1>Audio Player</h1>
      <input
        type="file"
        accept="audio/mp3"
        onChange={handleFileChange}
        ref={(input) => setFileInput(input)}
      />
      <AudioPlayer
        key={currentTrackIndex}
        playlist={playlist}
        currentTrackIndex={currentTrackIndex}
        onEnded={playNextTrack}
      />
      <div className="playlist">
        <h2>Playlists</h2>
      <Playlist
        playlist={playlist}
        onPlay={handlePlaylistItemClick}
        onDelete={handleDeleteTrack}
      />
      </div>
      
      </div>
    </div>
  );
};

export default App;
