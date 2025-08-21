/**
 * COMPONENTE: MusicaCancionItem
 * 
 * Propósito:
 * - Mostrar una canción individual en la lista
 * - Cargar y mostrar la duración del MP3 dinámicamente
 * - Permitir la reproducción al hacer clic
 * 
 * Comunicación:
 * - Recibe datos de la canción desde MusicaCancionesLista
 * - Notifica al padre cuando se hace clic (onPlay)
 * - No modifica estados externos directamente
 */

import React, { useState, useEffect } from 'react';

function MusicaCancionItem({ song, index, isCurrent, onPlay }) {
  // ████████████████████████████████████████████
  // ███ 1. ESTADOS LOCALES ███
  // ████████████████████████████████████████████
  const [duration, setDuration] = useState(null); // Almacena la duración en segundos

  // ████████████████████████████████████████████
  // ███ 2. EFECTOS SECUNDARIOS ███
  // ████████████████████████████████████████████
  
  // [Efecto] Carga la duración del MP3 cuando el componente se monta o cambia la URL
  useEffect(() => {
    if (!song.url) {
      setDuration(null);
      return;
    }

    // Crear elemento de audio para leer metadatos
    const audio = new Audio(song.url);
    
    // Handler para cuando se cargan los metadatos
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    // Handler para errores
    const handleError = () => {
      setDuration(null);
    };

    // Agregar event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);

    // Limpieza al desmontar
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
    };
  }, [song.url]);

  // ████████████████████████████████████████████
  // ███ 3. FUNCIONES AUXILIARES ███
  // ████████████████████████████████████████████
  
  /**
   * Formatea segundos a MM:SS
   * @param {number} seconds - Duración en segundos
   * @returns {string} Tiempo formateado
   */
  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ████████████████████████████████████████████
  // ███ 4. RENDERIZADO ███
  // ████████████████████████████████████████████
  return (
    <li 
      className={`song-item ${isCurrent ? 'current' : ''}`}
      onClick={onPlay}
      aria-current={isCurrent ? 'true' : 'false'}
    >
      {/* Número de pista */}
      <span className="song-index">{index + 1}</span>
      
      {/* Contenedor de información principal */}
      <div className="song-info">
        {/* Portada del álbum */}
        <img 
          src={song.imagen || '/img/default-cover.png'} 
          alt={`Portada de ${song.nombre}`}
          className="song-cover"
          onError={(e) => e.target.src = '/img/default-cover.png'}
        />
        
        {/* Detalles de la canción */}
        <div className="song-details">
          <span className="song-name">{song.nombre}</span>
          <span className="song-artist">{song.artista}</span>
        </div>
      </div>
      
      {/* Duración formateada */}
      <span className="song-duration">
        {formatDuration(duration)}
      </span>
    </li>
  );
}

export default MusicaCancionItem;