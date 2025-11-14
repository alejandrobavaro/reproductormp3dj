// src/componentes/MusicaCancionItem.jsx
import React, { useState, useEffect } from 'react';

function MusicaCancionItem({ song, index, isCurrent, onPlay }) {
  const [duration, setDuration] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!song.url) {
      setDuration(null);
      return;
    }

    const loadTimer = setTimeout(() => {
      const audio = new Audio();
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };

      const handleError = () => {
        setDuration(null);
        audio.removeEventListener('error', handleError);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('error', handleError);
      audio.src = song.url;

      const timeoutId = setTimeout(() => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('error', handleError);
        setDuration(null);
      }, 5000);

      return () => {
        clearTimeout(timeoutId);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('error', handleError);
      };
    }, 100);

    return () => clearTimeout(loadTimer);
  }, [song.url]);

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = (e) => {
    e.target.src = '/img/default-cover.png';
    setImageLoaded(true);
  };

  return (
    <li 
      className={`song-item ${isCurrent ? 'current' : ''}`}
      onClick={onPlay}
      aria-current={isCurrent ? 'true' : 'false'}
      title={`Reproducir: ${song.nombre} - ${song.artista}`}
    >
      {/* Número y portada en misma celda */}
      <div className="song-start">
        <span className="song-index">{index + 1}</span>
        <div className="song-cover-container">
          <img 
            src={song.imagen || '/img/default-cover.png'} 
            alt=""
            className={`song-cover-mini ${imageLoaded ? 'loaded' : 'loading'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          {!imageLoaded && <div className="cover-placeholder"></div>}
        </div>
      </div>
      
      {/* Información en línea continua */}
      <div className="song-main-line">
        <span className="song-name">{song.nombre}</span>
        <span className="song-artist-separator">•</span>
        <span className="song-artist">{song.artista}</span>
      </div>
      
      {/* Duración alineada a la derecha */}
      <span className="song-duration">
        {formatDuration(duration)}
      </span>
    </li>
  );
}

export default MusicaCancionItem;