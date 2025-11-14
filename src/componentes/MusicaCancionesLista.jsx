// src/componentes/MusicaCancionesLista.jsx
import React from 'react';
import MusicaCancionItem from './MusicaCancionItem';
import "../assets/scss/_03-Componentes/_MusicaCancionesLista.scss";

/**
 * COMPONENTE: MusicaCancionesLista - VERSIÓN ULTRA COMPACTA OPTIMIZADA
 * 
 * OPTIMIZACIONES:
 * - ✅ Máxima compacidad sin sacrificar legibilidad
 * - ✅ Scroll optimizado para listas largas
 * - ✅ Estados de carga y vacío mejorados
 * - ✅ Estructura semántica mejorada
 * 
 * PROPOSITO:
 * - Mostrar lista completa de canciones del bloque actual EN FORMATO ULTRA COMPACTO
 * - Contener los items individuales de canción con altura mínima
 * - Manejar estado cuando no hay canciones
 * - Proporcionar estructura para scroll de lista
 * 
 * COMUNICACIÓN:
 * - RECIBE desde Musica.jsx:
 *   • songs (lista de canciones filtradas)
 *   • currentSong (canción actual en reproducción)
 *   • onPlaySong (función para reproducir canción al hacer clic)
 * - ENVÍA a MusicaCancionItem:
 *   • Datos de cada canción individual
 */
function MusicaCancionesLista({ songs, currentSong, onPlaySong }) {
  return (
    <div className="songs-list-container">
      {/* [Estado] Cuando no hay canciones disponibles */}
      {songs.length === 0 ? (
        <div className="no-songs">
          <span className="no-songs-icon">🎵</span>
          <span className="no-songs-text">No hay canciones disponibles</span>
        </div>
      ) : (
        <>
          {/* [Cabecera] Columnas de la lista - ultra compacta */}
          <div className="songs-list-header">
            <span className="header-item header-number">#</span>
            <span className="header-item header-title">Canción</span>
            <span className="header-item header-duration">Duración</span>
          </div>
          
          {/* [Lista] Contenedor scrollable de canciones ultra compactas */}
          <div className="songs-list-scroll-container">
            <ul className="songs-list">
              {/* [Mapeo] Renderiza cada canción como item individual ultra compacto */}
              {songs.map((song, index) => (
                <MusicaCancionItem 
                  key={song.id} // [Key] Identificador único para React
                  song={song} // [Prop] Datos completos de la canción
                  index={index} // [Prop] Posición en la lista
                  isCurrent={currentSong?.id === song.id} // [Prop] Si es la canción actualmente reproduciéndose
                  onPlay={() => onPlaySong(song)} // [Prop] Función para reproducir al hacer clic
                />
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default MusicaCancionesLista;