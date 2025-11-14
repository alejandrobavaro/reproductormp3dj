// // ████████████████████████████████████████████
// // ███ IMPORTACIONES ███
// // ████████████████████████████████████████████
// import React, { useState, useEffect } from "react";
// import "../assets/scss/_03-Componentes/_MusicaReproductor.scss";


// function MusicaReproductor({ 
//   currentSong,    // [Prop] Canción actual en reproducción
//   isPlaying,      // [Prop] Estado de reproducción (true/false)
//   volume,         // [Prop] Nivel de volumen (0-1)
//   onPlayPause,    // [Prop] Función para play/pause
//   onNext,         // [Prop] Función para siguiente canción
//   onPrev,         // [Prop] Función para canción anterior
//   onVolumeChange, // [Prop] Función para cambiar volumen
//   bloqueActual,   // [Prop] ID del bloque actual
//   bloques,        // [Prop] Objeto con todos los bloques
//   audioRef        // [Prop] Referencia al elemento de audio
// }) {
//   // ███ ESTADOS LOCALES ███
//   const [currentTime, setCurrentTime] = useState(0); // Tiempo actual de reproducción
//   const [duration, setDuration] = useState(0);       // Duración total de la canción

//   // ███ EFECTOS SECUNDARIOS ███

//   // Efecto 1: Sincronizar tiempo actual con el audio REAL
//   useEffect(() => {
//     const audio = audioRef?.current;
//     if (!audio) return;

//     const updateTime = () => {
//       setCurrentTime(audio.currentTime);
//       setDuration(audio.duration || 0);
//     };

//     audio.addEventListener('timeupdate', updateTime);
//     audio.addEventListener('loadedmetadata', updateTime);

//     return () => {
//       audio.removeEventListener('timeupdate', updateTime);
//       audio.removeEventListener('loadedmetadata', updateTime);
//     };
//   }, [audioRef]);

//   // Efecto 2: Actualizar duración cuando cambia la canción
//   useEffect(() => {
//     if (currentSong) {
//       setCurrentTime(0);
//     }
//   }, [currentSong]);

//   // ███ MANEJADORES DE EVENTOS ███

//   /**
//    * MANEJADOR: Cambiar posición en la timeline
//    * @param {Object} e - Evento del input range
//    */
//   const handleProgressChange = (e) => {
//     const newTime = parseFloat(e.target.value);
//     const audio = audioRef?.current;
    
//     if (audio && !isNaN(newTime)) {
//       audio.currentTime = newTime;
//       setCurrentTime(newTime);
//     }
//   };

//   /**
//    * MANEJADOR: Cambiar volumen - CORREGIDO
//    * @param {Object} e - Evento del input range
//    */
//   const handleVolumeChange = (e) => {
//     const newVolume = parseFloat(e.target.value);
    
//     // CORRECCIÓN: Pasar solo el nuevo volumen, no el evento completo
//     if (onVolumeChange) {
//       onVolumeChange(newVolume); // ← SOLO PASA EL VALOR NUMÉRICO
//     }
//   };

//   /**
//    * MANEJADOR: Alternar mute/desmute - CORREGIDO
//    */
//   const handleToggleMute = () => {
//     const newVolume = volume === 0 ? 0.7 : 0;
    
//     // CORRECCIÓN: Pasar solo el nuevo volumen
//     if (onVolumeChange) {
//       onVolumeChange(newVolume); // ← SOLO PASA EL VALOR NUMÉRICO
//     }
//   };

//   // ███ FUNCIONES AUXILIARES ███

//   /**
//    * FUNCIÓN: Formatea segundos a formato MM:SS
//    * @param {number} time - Tiempo en segundos
//    * @returns {string} Tiempo formateado
//    */
//   const formatTime = (time) => {
//     if (!time || isNaN(time)) return "0:00";
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   /**
//    * FUNCIÓN: Obtiene el nombre del bloque actual
//    * @returns {string} Nombre del bloque
//    */
//   const getBlockName = () => {
//     if (bloqueActual === "todo") return "Todo el evento";
//     return bloques[bloqueActual]?.bloque_musical || "";
//   };

//   // ███ RENDERIZADO ███
//   return (
//     <div className="player-container">
//       {/* SECCIÓN DE INFORMACIÓN DE LA CANCIÓN */}
//       <div className="now-playing">
//         {currentSong ? (
//           <>
//             <img 
//               src={currentSong.imagen || '/img/default-cover.png'} 
//               alt="Portada actual" 
//               className="now-playing-cover"
//               onError={(e) => e.target.src = '/img/default-cover.png'}
//             />
//             <div className="now-playing-info">
//               <div className="now-playing-name">{currentSong.nombre}</div>
//               <div className="now-playing-artist">{currentSong.artista}</div>
//               <div className="now-playing-block">{getBlockName()}</div>
//               <div className="now-playing-duration">
//                 {formatTime(currentTime)} / {formatTime(duration)}
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="no-song">Selecciona una canción</div>
//         )}
//       </div>
      
//       {/* BARRA DE PROGRESO - FUNCIONAL */}
//       <div className="progress-container">
//         <input 
//           type="range" 
//           min="0" 
//           max={duration || 100} 
//           value={currentTime} 
//           onChange={handleProgressChange}
//           className="progress-bar"
//           style={{"--progress": duration ? (currentTime / duration) : 0}}
//         />
//       </div>
      
//       {/* CONTROLES DE REPRODUCCIÓN */}
//       <div className="player-controls">
//         <button className="control-btn prev-btn" onClick={onPrev} aria-label="Canción anterior">
//           ⏮
//         </button>
//         <button 
//           className="control-btn play-btn" 
//           onClick={onPlayPause}
//           aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
//           disabled={!currentSong}
//         >
//           {isPlaying ? '⏸' : '▶'}
//         </button>
//         <button className="control-btn next-btn" onClick={onNext} aria-label="Siguiente canción">
//           ⏭
//         </button>
//       </div>
      
//       {/* CONTROL DE VOLUMEN - CORREGIDO */}
//       <div className="volume-controls">
//         <button 
//           className="volume-btn" 
//           onClick={handleToggleMute}
//           aria-label={volume === 0 ? 'Activar sonido' : 'Silenciar'}
//         >
//           {volume === 0 ? '🔇' : volume < 0.5 ? '🔈' : '🔊'}
//         </button>
//         <input 
//           type="range" 
//           min="0" 
//           max="1" 
//           step="0.01" 
//           value={volume}
//           onChange={handleVolumeChange}
//           className="volume-slider"
//           aria-label="Control de volumen"
//         />
//       </div>
//     </div>
//   );
// }

// export default MusicaReproductor;


// ████████████████████████████████████████████
// ███ IMPORTACIONES ███
// ████████████████████████████████████████████
import React, { useState, useEffect } from "react";
import "../assets/scss/_03-Componentes/_MusicaReproductor.scss";

/**
 * COMPONENTE: MusicaReproductor - VERSIÓN COMPACTADA
 * 
 * MEJORAS:
 * - ✅ Información más compacta
 * - ✅ Controles más pequeños pero funcionales
 * - ✅ Estados visuales optimizados
 */

function MusicaReproductor({ 
  currentSong, isPlaying, volume, onPlayPause, onNext, onPrev, 
  onVolumeChange, bloqueActual, bloques, audioRef 
}) {
  // ███ ESTADOS LOCALES COMPACTOS ███
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // ███ EFECTOS OPTIMIZADOS ███
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateTime);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateTime);
    };
  }, [audioRef]);

  useEffect(() => {
    if (currentSong) setCurrentTime(0);
  }, [currentSong]);

  // ███ FUNCIONES COMPACTAS ███
  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    const audio = audioRef?.current;
    if (audio && !isNaN(newTime)) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    onVolumeChange?.(parseFloat(e.target.value));
  };

  const handleToggleMute = () => {
    onVolumeChange?.(volume === 0 ? 0.7 : 0);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getBlockName = () => {
    if (bloqueActual === "todo") return "Todos los bloques";
    return bloques[bloqueActual]?.bloque_musical || "Bloque actual";
  };

  // ███ RENDERIZADO COMPACTO ███
  return (
    <div className="player-container">
      {/* INFORMACIÓN ULTRA COMPACTA */}
      <div className="now-playing">
        {currentSong ? (
          <>
            <img 
              src={currentSong.imagen || '/img/default-cover.png'} 
              alt="Portada" 
              className="now-playing-cover"
              onError={(e) => e.target.src = '/img/default-cover.png'}
            />
            <div className="now-playing-info">
              <div className="now-playing-name">{currentSong.nombre}</div>
              <div className="now-playing-artist">{currentSong.artista}</div>
              <div className="now-playing-meta">
                <span className="now-playing-block">{getBlockName()}</span>
                <span className="now-playing-duration">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="no-song">🎵 Selecciona una canción</div>
        )}
      </div>
      
      {/* BARRA DE PROGRESO COMPACTA */}
      <div className="progress-container">
        <input 
          type="range" 
          min="0" 
          max={duration || 100} 
          value={currentTime} 
          onChange={handleProgressChange}
          className="progress-bar"
          style={{"--progress": duration ? (currentTime / duration) : 0}}
        />
      </div>
      
      {/* CONTROLES COMPACTOS */}
      <div className="player-controls">
        <button className="control-btn prev-btn" onClick={onPrev} title="Anterior">
          ⏮
        </button>
        <button 
          className="control-btn play-btn" 
          onClick={onPlayPause}
          disabled={!currentSong}
          title={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="control-btn next-btn" onClick={onNext} title="Siguiente">
          ⏭
        </button>
      </div>
      
      {/* VOLUMEN COMPACTO */}
      <div className="volume-controls">
        <button 
          className="volume-btn" 
          onClick={handleToggleMute}
          title={volume === 0 ? 'Activar sonido' : 'Silenciar'}
        >
          {volume === 0 ? '🔇' : volume < 0.5 ? '🔈' : '🔊'}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
          title="Volumen"
        />
      </div>
    </div>
  );
}

export default MusicaReproductor;