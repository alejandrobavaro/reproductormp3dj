import React, { useState, useEffect } from "react";
import "../assets/scss/_03-Componentes/_MusicaReproductor.scss";
/**
 * COMPONENTE: MusicaReproductor
 * 
 * Propósito: 
 * - Mostrar la interfaz visual del reproductor de música
 * - Controlar la reproducción (play/pause, siguiente/anterior, volumen)
 * - Mostrar información de la canción actual y progreso
 * 
 * Comunicación:
 * - Recibe estados y handlers desde Musica.jsx (currentSong, isPlaying, volume, etc.)
 * - Notifica acciones del usuario al componente padre (onPlayPause, onNext, etc.)
 * 
 * Nota: El audio real se maneja en App.js, este componente solo muestra la UI
 */
function MusicaReproductor({ 
  currentSong,    // [Prop] Canción actual en reproducción
  isPlaying,      // [Prop] Estado de reproducción (true/false)
  volume,         // [Prop] Nivel de volumen (0-1)
  onPlayPause,    // [Prop] Función para play/pause
  onNext,         // [Prop] Función para siguiente canción
  onPrev,         // [Prop] Función para canción anterior
  onVolumeChange, // [Prop] Función para cambiar volumen
  bloqueActual,   // [Prop] ID del bloque actual
  bloques         // [Prop] Objeto con todos los bloques musicales
}) {
  // ████████████████████████████████████████████
  // ███ 1. ESTADOS LOCALES ███
  // ████████████████████████████████████████████
  const [currentTime, setCurrentTime] = useState(0); // Tiempo actual de reproducción (simulado)
  const [duration, setDuration] = useState(0);       // Duración total (simulada)

  // ████████████████████████████████████████████
  // ███ 2. EFECTOS SECUNDARIOS ███
  // ████████████████████████████████████████████
  
  // [Efecto] Simula el progreso de reproducción para la UI
  useEffect(() => {
    let interval;
    if (isPlaying && currentSong) {
      // Establece una duración fija para la simulación (3 minutos)
      setDuration(180);
      
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 180) { // Si llega al final, reinicia
            clearInterval(interval);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong]);

  // ████████████████████████████████████████████
  // ███ 3. FUNCIONES AUXILIARES ███
  // ████████████████████████████████████████████
  
  /**
   * Formatea segundos a formato MM:SS
   * @param {number} time - Tiempo en segundos
   * @return {string} Tiempo formateado
   */
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  /**
   * Obtiene el nombre del bloque actual
   * @return {string} Nombre del bloque o "Todo el evento"
   */
  const getBlockName = () => {
    if (bloqueActual === "todo") return "Todo el evento";
    return bloques[bloqueActual]?.bloque_musical || "";
  };

  // ████████████████████████████████████████████
  // ███ 4. RENDERIZADO ███
  // ████████████████████████████████████████████
  return (
    <div className="player-container">
      {/* SECCIÓN DE INFORMACIÓN DE LA CANCIÓN */}
      <div className="now-playing">
        {currentSong ? (
          <>
            <img 
              src={currentSong.imagen || '/img/default-cover.png'} 
              alt="Portada actual" 
              className="now-playing-cover"
              onError={(e) => e.target.src = '/img/default-cover.png'}
            />
            <div className="now-playing-info">
              <div className="now-playing-name">{currentSong.nombre}</div>
              <div className="now-playing-artist">{currentSong.artista}</div>
              <div className="now-playing-block">{getBlockName()}</div>
              <div className="now-playing-duration">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </>
        ) : (
          <div className="no-song">Selecciona una canción</div>
        )}
      </div>
      
      {/* BARRA DE PROGRESO */}
      <div className="progress-container">
        <input 
          type="range" 
          min="0" 
          max={duration || 100} 
          value={currentTime} 
          onChange={(e) => setCurrentTime(parseInt(e.target.value))}
          className="progress-bar"
          style={{"--progress": currentTime / (duration || 100)}}
        />
      </div>
      
      {/* CONTROLES DE REPRODUCCIÓN */}
      <div className="player-controls">
        <button className="control-btn prev-btn" onClick={onPrev} aria-label="Canción anterior">
          ⏮
        </button>
        <button 
          className="control-btn play-btn" 
          onClick={onPlayPause}
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          disabled={!currentSong}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="control-btn next-btn" onClick={onNext} aria-label="Siguiente canción">
          ⏭
        </button>
      </div>
      
      {/* CONTROL DE VOLUMEN */}
      <div className="volume-controls">
        <button 
          className="volume-btn" 
          onClick={() => onVolumeChange({ target: { value: volume === 0 ? 0.7 : 0 }})}
          aria-label={volume === 0 ? 'Activar sonido' : 'Silenciar'}
        >
          {volume === 0 ? '🔇' : '🔊'}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={onVolumeChange}
          className="volume-slider"
          aria-label="Control de volumen"
        />
      </div>
    </div>
  );
}

export default MusicaReproductor;