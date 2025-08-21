// import React, { useState, useEffect, useRef } from "react";
// import { MusicaProvider } from "./MusicaContexto";
// import MusicaCancionesLista from "./MusicaCancionesLista";
// import MusicaReproductor from "./MusicaReproductor";
// import MusicaFiltros from "./MusicaFiltros";
// import EventoGuion from "./EventoGuion";
// import "../assets/scss/_03-Componentes/_Musica.scss";

// /**
//  * COMPONENTE PRINCIPAL MUSICA
//  * 
//  * Propósito: Gestiona el reproductor musical y su sincronización con el itinerario del evento
//  * 
//  * Flujo mejorado:
//  * 1. Carga inicial de datos (música + guión)
//  * 2. Configuración del reproductor
//  * 3. Sincronización con EventoGuion
//  * 4. Diseño compacto para escritorio
//  */
// function Musica({ setCart, cart, searchQuery, setSearchQuery }) {
//   // ████████████████████████████████████████████
//   // ███ 1. ESTADOS DEL COMPONENTE ███
//   // ████████████████████████████████████████████
  
//   // [Estado] Almacena todos los bloques musicales (cargados desde bodalistacompleta.json)
//   const [bloques, setBloques] = useState({});
  
//   // [Estado] Bloque musical actual seleccionado ("todo" o ID específico)
//   const [bloqueActual, setBloqueActual] = useState("todo");
  
//   // [Estado] Canciones filtradas según el bloque seleccionado
//   const [filteredSongs, setFilteredSongs] = useState([]);
  
//   // [Estado] Canción actualmente en reproducción
//   const [currentSong, setCurrentSong] = useState(null);
  
//   // [Estado] Control de reproducción (true = play, false = pause)
//   const [isPlaying, setIsPlaying] = useState(false);
  
//   // [Estado] Nivel de volumen (0 a 1)
//   const [volume, setVolume] = useState(0.7);
  
//   // [Ref] Referencia al elemento de audio HTML
//   const audioRef = useRef(null);
  
//   // [Estado] Control de alertas temporales
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
  
//   // [Estado] Datos del guión del evento (cargados desde guionBoda.json)
//   const [guionEvento, setGuionEvento] = useState(null);
  
//   // [Estado] Estados de completado de los bloques del evento
//   const [estadosEvento, setEstadosEvento] = useState({});

//   // █████████████████████████████████████████████████████████████████████
//   // ███ 2. EFECTOS SECUNDARIOS ███
//   // █████████████████████████████████████████████████████████████████████

//   // [Efecto] Carga inicial de datos al montar el componente
//   useEffect(() => {
//     const cargarDatos = async () => {
//       try {
//         // Carga en paralelo ambos archivos JSON
//         const [musicaRes, guionRes] = await Promise.all([
//           fetch('/bodalistacompleta.json'),
//           fetch('/guionBoda.json')
//         ]);
        
//         if (!musicaRes.ok || !guionRes.ok) throw new Error('Error al cargar datos');
        
//         const [musicaData, guionData] = await Promise.all([
//           musicaRes.json(),
//           guionRes.json()
//         ]);
        
//         setBloques(musicaData);
//         setGuionEvento(guionData);
//         setFilteredSongs(Object.values(musicaData).flatMap(bloque => bloque.canciones));
//       } catch (err) {
//         console.error("Error cargando datos:", err);
//         mostrarAlerta("Error cargando datos");
//       }
//     };

//     cargarDatos();
    
//     // Cargar estado guardado del localStorage
//     const savedState = localStorage.getItem('musicaState');
//     if (savedState) {
//       const { bloqueActual, currentSong, isPlaying, volume } = JSON.parse(savedState);
//       setBloqueActual(bloqueActual);
//       setCurrentSong(currentSong);
//       setIsPlaying(isPlaying);
//       setVolume(volume);
//     }
//   }, []);

//   // [Efecto] Filtra canciones cuando cambia el bloque actual
//   useEffect(() => {
//     if (!bloqueActual || !bloques) return;
    
//     setFilteredSongs(
//       bloqueActual === "todo" 
//         ? Object.values(bloques).flatMap(bloque => bloque.canciones)
//         : bloques[bloqueActual]?.canciones || []
//     );
//   }, [bloqueActual, bloques]);

//   // [Efecto] Persiste el estado importante
//   useEffect(() => {
//     const state = { bloqueActual, currentSong, isPlaying, volume };
//     localStorage.setItem('musicaState', JSON.stringify(state));
//   }, [bloqueActual, currentSong, isPlaying, volume]);

//   // █████████████████████████████████████████████████████████████████████
//   // ███ 3. FUNCIONES PRINCIPALES ███
//   // █████████████████████████████████████████████████████████████████████

//   /**
//    * Muestra una alerta temporal al usuario
//    * @param {string} mensaje - Texto a mostrar
//    */
//   const mostrarAlerta = (mensaje) => {
//     setAlertMessage(mensaje);
//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 3000);
//   };

//   /**
//    * Reproduce una canción específica
//    * @param {Object} song - Canción a reproducir
//    */
//   const handlePlaySong = (song) => {
//     if (currentSong && isPlaying) mostrarAlerta("Cambiando de canción...");
    
//     setCurrentSong(song);
//     setIsPlaying(true);
    
//     if (audioRef.current) {
//       audioRef.current.src = song.url;
//       audioRef.current.volume = volume;
//       audioRef.current.play().catch(e => console.error("Error al reproducir:", e));
//     }
//   };

//   /**
//    * Alterna entre play/pause
//    */
//   const handlePlayPause = () => {
//     if (!currentSong) return;
    
//     if (isPlaying) {
//       audioRef.current?.pause();
//     } else {
//       audioRef.current?.play().catch(e => console.error("Error al reproducir:", e));
//     }
//     setIsPlaying(!isPlaying);
//   };

//   /**
//    * Avanza a la siguiente canción
//    */
//   const handleNext = () => {
//     if (!currentSong || filteredSongs.length === 0) return;
    
//     const nextIndex = (filteredSongs.findIndex(s => s.id === currentSong.id) + 1) % filteredSongs.length;
//     handlePlaySong(filteredSongs[nextIndex]);
//   };

//   /**
//    * Retrocede a la canción anterior
//    */
//   const handlePrev = () => {
//     if (!currentSong || filteredSongs.length === 0) return;
    
//     const prevIndex = (filteredSongs.findIndex(s => s.id === currentSong.id) - 1 + filteredSongs.length) % filteredSongs.length;
//     handlePlaySong(filteredSongs[prevIndex]);
//   };

//   /**
//    * Maneja cambios en el volumen
//    * @param {Object} e - Evento del input
//    */
//   const handleVolumeChange = (e) => {
//     const newVolume = parseFloat(e.target.value);
//     setVolume(newVolume);
//     if (audioRef.current) audioRef.current.volume = newVolume;
//   };

//   /**
//    * Alterna entre silenciar/desilenciar
//    */
//   const handleMute = () => {
//     if (audioRef.current) audioRef.current.muted = !audioRef.current.muted;
//   };

//   /**
//    * Maneja cambios en el estado de los bloques
//    * @param {string} bloqueId - ID del bloque
//    * @param {string} nuevoEstado - "completado" o "pendiente"
//    */
//   const handleEstadoChange = (bloqueId, nuevoEstado) => {
//     setEstadosEvento(prev => ({ ...prev, [bloqueId]: nuevoEstado }));
    
//     if (nuevoEstado === 'completado' && bloqueId === bloqueActual) {
//       const bloquesIds = guionEvento?.bloques?.map(b => b.id) || [];
//       const nextIndex = bloquesIds.indexOf(bloqueId) + 1;
//       if (nextIndex > 0 && nextIndex < bloquesIds.length) {
//         setBloqueActual(bloquesIds[nextIndex]);
//         mostrarAlerta(`Avanzando a ${guionEvento.bloques[nextIndex].nombre}`);
//       }
//     }
//   };

//   // █████████████████████████████████████████████████████████████████████
//   // ███ 4. RENDERIZADO ███
//   // █████████████████████████████████████████████████████████████████████
//   return (
//     <MusicaProvider>
//       <div className="music-page">

//       <MusicaFiltros 
//   bloques={bloques}
//   bloqueActual={bloqueActual}
//   setBloqueActual={setBloqueActual}
//   currentSong={currentSong}
//   setCurrentSong={setCurrentSong}
//   estadosEvento={estadosEvento}
// />
//         {/* Diseño para escritorio (1024px+) */}
//         <div className="music-desktop-layout">
//           {/* Sección superior compacta (reproductor + filtros) */}
//           <div className="music-controls-section">
//             <MusicaReproductor 
//               currentSong={currentSong}
//               isPlaying={isPlaying}
//               volume={volume}
//               onPlayPause={handlePlayPause}
//               onNext={handleNext}
//               onPrev={handlePrev}
//               onVolumeChange={handleVolumeChange}
//               onMute={handleMute}
//               bloqueActual={bloqueActual}
//               bloques={bloques}
//               audioRef={audioRef}
//             />
            
      
//           </div>

//           {/* Sección principal dividida en dos columnas */}
//           <div className="music-content-section">
//             {/* Columna izquierda: Lista de canciones (30% ancho) */}
//             <div className="music-songs-column">
//               <MusicaCancionesLista 
//                 songs={filteredSongs}
//                 currentSong={currentSong}
//                 onPlaySong={handlePlaySong}
//               />
//             </div>
            
//             {/* Columna derecha: Itinerario del evento (70% ancho) */}
//             <div className="evento-guion-column">
//               <EventoGuion 
//                 onBloqueChange={setBloqueActual}
//                 bloqueActual={bloqueActual}
//                 guionEvento={guionEvento}
//                 onEstadoChange={handleEstadoChange}
//               />
//             </div>
            
//           </div>
//         </div>

//         {/* Diseño para móvil (<1024px) */}
//         <div className="music-mobile-layout">
//           {/* Contenedor principal móvil */}
//           <div className="music-container">
//             <audio ref={audioRef} onEnded={handleNext} hidden />
            
//             <MusicaReproductor 
//               currentSong={currentSong}
//               isPlaying={isPlaying}
//               volume={volume}
//               onPlayPause={handlePlayPause}
//               onNext={handleNext}
//               onPrev={handlePrev}
//               onVolumeChange={handleVolumeChange}
//               onMute={handleMute}
//               bloqueActual={bloqueActual}
//               bloques={bloques}
//               audioRef={audioRef}
//             />
            
//             <MusicaFiltros 
//               bloques={bloques}
//               bloqueActual={bloqueActual}
//               setBloqueActual={setBloqueActual}
//             />
            
//             <MusicaCancionesLista 
//               songs={filteredSongs}
//               currentSong={currentSong}
//               onPlaySong={handlePlaySong}
//             />
//           </div>
          
//           <EventoGuion 
//             onBloqueChange={setBloqueActual}
//             bloqueActual={bloqueActual}
//             guionEvento={guionEvento}
//             onEstadoChange={handleEstadoChange}
//           />
//         </div>

//         {/* Alertas temporales (común a ambos diseños) */}
//         {showAlert && (
//           <div className="alert-message">
//             {alertMessage}
//           </div>
//         )}
//       </div>
//     </MusicaProvider>
//   );
// }

// export default Musica;



import React, { useState, useEffect, useRef } from "react";
import { MusicaProvider } from "./MusicaContexto";
import MusicaCancionesLista from "./MusicaCancionesLista";
import MusicaReproductor from "./MusicaReproductor";
import MusicaFiltros from "./MusicaFiltros";
import EventoGuion from "./EventoGuion";
import "../assets/scss/_03-Componentes/_Musica.scss";
/**
 * COMPONENTE PRINCIPAL: Musica
 * 
 * Propósito: 
 * - Gestiona el reproductor musical completo
 * - Sincroniza la música con el itinerario del evento
 * - Coordina todos los subcomponentes del reproductor
 * 
 * Comunicación:
 * - Recibe estados del reproductor desde App.js (currentTrack, isPlaying, volume)
 * - Envía actualizaciones de estados a App.js (setCurrentTrack, setIsPlaying, setVolume)
 * - Controla los componentes hijos: Reproductor, Filtros, Lista de canciones, Guion
 */
function Musica({ 
  setCart,          // [Prop] Función para actualizar carrito (no usado actualmente)
  cart,             // [Prop] Estado del carrito (no usado actualmente)
  searchQuery,      // [Prop] Query de búsqueda (no usado actualmente)
  setSearchQuery,   // [Prop] Función para actualizar búsqueda (no usado actualmente)
  currentTrack,     // [Prop] Canción actual en reproducción (desde App.js)
  setCurrentTrack,  // [Prop] Función para cambiar canción (hacia App.js)
  isPlaying,        // [Prop] Estado de reproducción (desde App.js)
  setIsPlaying,     // [Prop] Función para play/pause (hacia App.js)
  volume,           // [Prop] Nivel de volumen (desde App.js)
  setVolume         // [Prop] Función para ajustar volumen (hacia App.js)
}) {
  // ████████████████████████████████████████████
  // ███ 1. ESTADOS LOCALES ███
  // ████████████████████████████████████████████
  const [bloques, setBloques] = useState({});          // Todos los bloques musicales
  const [bloqueActual, setBloqueActual] = useState("todo"); // Bloque seleccionado
  const [filteredSongs, setFilteredSongs] = useState([]); // Canciones filtradas
  const [showAlert, setShowAlert] = useState(false);   // Control de alertas
  const [alertMessage, setAlertMessage] = useState(''); // Mensaje de alerta
  const [guionEvento, setGuionEvento] = useState(null); // Datos del guion del evento
  const [estadosEvento, setEstadosEvento] = useState({}); // Estados de los bloques

  // ████████████████████████████████████████████
  // ███ 2. EFECTOS SECUNDARIOS ███
  // ████████████████████████████████████████████
  
  // [Efecto 1] Carga inicial de datos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [musicaRes, guionRes] = await Promise.all([
          fetch('/bodalistacompleta.json'),
          fetch('/guionBoda.json')
        ]);
        
        if (!musicaRes.ok || !guionRes.ok) throw new Error('Error al cargar datos');
        
        const [musicaData, guionData] = await Promise.all([
          musicaRes.json(),
          guionRes.json()
        ]);
        
        setBloques(musicaData);
        setGuionEvento(guionData);
        setFilteredSongs(Object.values(musicaData).flatMap(bloque => bloque.canciones));
      } catch (err) {
        console.error("Error cargando datos:", err);
        mostrarAlerta("Error cargando datos");
      }
    };

    cargarDatos();
    
    // Cargar estado guardado
    const savedState = localStorage.getItem('musicaState');
    if (savedState) {
      const { bloqueActual, currentSong, isPlaying, volume } = JSON.parse(savedState);
      setBloqueActual(bloqueActual);
      setCurrentTrack(currentSong);
      setIsPlaying(isPlaying);
      setVolume(volume);
    }
  }, []);

  // [Efecto 2] Filtra canciones cuando cambia el bloque
  useEffect(() => {
    if (!bloqueActual || !bloques) return;
    
    setFilteredSongs(
      bloqueActual === "todo" 
        ? Object.values(bloques).flatMap(bloque => bloque.canciones)
        : bloques[bloqueActual]?.canciones || []
    );
  }, [bloqueActual, bloques]);

  // [Efecto 3] Persiste el estado importante
  useEffect(() => {
    const state = { bloqueActual, currentSong: currentTrack, isPlaying, volume };
    localStorage.setItem('musicaState', JSON.stringify(state));
  }, [bloqueActual, currentTrack, isPlaying, volume]);

  // ████████████████████████████████████████████
  // ███ 3. FUNCIONES PRINCIPALES ███
  // ████████████████████████████████████████████
  
  /**
   * Muestra una alerta temporal
   * @param {string} mensaje - Texto a mostrar
   */
  const mostrarAlerta = (mensaje) => {
    setAlertMessage(mensaje);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  /**
   * Reproduce una canción específica
   * @param {Object} song - Canción a reproducir
   */
  const handlePlaySong = (song) => {
    if (currentTrack && isPlaying) mostrarAlerta("Cambiando de canción...");
    setCurrentTrack(song);
    setIsPlaying(true);
  };

  /**
   * Maneja cambios en el estado de los bloques
   * @param {string} bloqueId - ID del bloque
   * @param {string} nuevoEstado - "completado" o "pendiente"
   */
  const handleEstadoChange = (bloqueId, nuevoEstado) => {
    setEstadosEvento(prev => ({ ...prev, [bloqueId]: nuevoEstado }));
    
    if (nuevoEstado === 'completado' && bloqueId === bloqueActual) {
      const bloquesIds = guionEvento?.bloques?.map(b => b.id) || [];
      const nextIndex = bloquesIds.indexOf(bloqueId) + 1;
      if (nextIndex > 0 && nextIndex < bloquesIds.length) {
        setBloqueActual(bloquesIds[nextIndex]);
        mostrarAlerta(`Avanzando a ${guionEvento.bloques[nextIndex].nombre}`);
      }
    }
  };

  // ████████████████████████████████████████████
  // ███ 4. RENDERIZADO ███
  // ████████████████████████████████████████████
  return (
    <div className="music-page">
      {/* DISEÑO PARA ESCRITORIO */}
      <div className="music-desktop-layout">
        {/* SECCIÓN DE REPRODUCTOR */}
        <div className="music-controls-section">
          <MusicaReproductor 
            currentSong={currentTrack}
            isPlaying={isPlaying}
            volume={volume}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onNext={() => {
              const nextIndex = (filteredSongs.findIndex(s => s.id === currentTrack?.id) + 1) % filteredSongs.length;
              handlePlaySong(filteredSongs[nextIndex]);
            }}
            onPrev={() => {
              const prevIndex = (filteredSongs.findIndex(s => s.id === currentTrack?.id) - 1 + filteredSongs.length) % filteredSongs.length;
              handlePlaySong(filteredSongs[prevIndex]);
            }}
            onVolumeChange={(e) => setVolume(parseFloat(e.target.value))}
            onMute={() => {
              if (audioRef.current) audioRef.current.muted = !audioRef.current.muted;
            }}
            bloqueActual={bloqueActual}
            bloques={bloques}
          />
        </div>

        {/* SECCIÓN PRINCIPAL (2 COLUMNAS) */}
        <div className="music-content-section">
          {/* COLUMNA IZQUIERDA: LISTA DE CANCIONES */}
          <div className="music-songs-column">
            <MusicaFiltros 
              bloques={bloques}
              bloqueActual={bloqueActual}
              setBloqueActual={setBloqueActual}
            />
            <MusicaCancionesLista 
              songs={filteredSongs}
              currentSong={currentTrack}
              onPlaySong={handlePlaySong}
            />
          </div>
          
          {/* COLUMNA DERECHA: GUION DEL EVENTO */}
          <div className="evento-guion-column">
            <EventoGuion 
              onBloqueChange={setBloqueActual}
              bloqueActual={bloqueActual}
              guionEvento={guionEvento}
              onEstadoChange={handleEstadoChange}
            />
          </div>
        </div>
      </div>

      {/* DISEÑO PARA MÓVIL */}
      <div className="music-mobile-layout">
        <div className="music-container">
          <MusicaReproductor 
            currentSong={currentTrack}
            isPlaying={isPlaying}
            volume={volume}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onNext={() => {
              const nextIndex = (filteredSongs.findIndex(s => s.id === currentTrack?.id) + 1) % filteredSongs.length;
              handlePlaySong(filteredSongs[nextIndex]);
            }}
            onPrev={() => {
              const prevIndex = (filteredSongs.findIndex(s => s.id === currentTrack?.id) - 1 + filteredSongs.length) % filteredSongs.length;
              handlePlaySong(filteredSongs[prevIndex]);
            }}
            onVolumeChange={(e) => setVolume(parseFloat(e.target.value))}
            onMute={() => {
              if (audioRef.current) audioRef.current.muted = !audioRef.current.muted;
            }}
            bloqueActual={bloqueActual}
            bloques={bloques}
          />
          
          <MusicaFiltros 
            bloques={bloques}
            bloqueActual={bloqueActual}
            setBloqueActual={setBloqueActual}
          />
          
          <MusicaCancionesLista 
            songs={filteredSongs}
            currentSong={currentTrack}
            onPlaySong={handlePlaySong}
          />
        </div>
        
        <EventoGuion 
          onBloqueChange={setBloqueActual}
          bloqueActual={bloqueActual}
          guionEvento={guionEvento}
          onEstadoChange={handleEstadoChange}
        />
      </div>

      {/* ALERTAS TEMPORALES */}
      {showAlert && (
        <div className="alert-message">
          {alertMessage}
        </div>
      )}
    </div>
  );
}

export default Musica;