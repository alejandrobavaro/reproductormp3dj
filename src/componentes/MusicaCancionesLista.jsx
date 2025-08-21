/**
 * COMPONENTE: MusicaCancionesLista
 * 
 * Propósito:
 * - Mostrar lista completa de canciones
 * - Contener los items individuales de canción
 * - Manejar estado cuando no hay canciones
 * 
 * Comunicación:
 * - Recibe lista de canciones desde Musica.jsx
 * - Notifica al padre cuando se selecciona una canción
 */

import React from 'react';
import MusicaCancionItem from './MusicaCancionItem';
import "../assets/scss/_03-Componentes/_MusicaCancionesLista.scss";

function MusicaCancionesLista({ songs, currentSong, onPlaySong }) {
  return (
    <div className="songs-list-container">
      {/* Estado cuando no hay canciones */}
      {songs.length === 0 ? (
        <div className="no-songs">No hay canciones disponibles</div>
      ) : (
        <>
          {/* Cabecera de columnas (fija al hacer scroll) */}
          <div className="songs-list-header">
            <span className="header-item">#</span>
            <span className="header-item">Canción</span>
            <span className="header-item">Duración</span>
          </div>
          
          {/* Lista de canciones */}
          <ul className="songs-list">
            {songs.map((song, index) => (
              <MusicaCancionItem 
                key={song.id} 
                song={song}
                index={index}
                isCurrent={currentSong?.id === song.id}
                onPlay={() => onPlaySong(song)}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default MusicaCancionesLista;