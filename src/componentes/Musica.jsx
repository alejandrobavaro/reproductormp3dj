// src/componentes/Musica.jsx
import React, { useState, useEffect, useRef } from "react";
import { MusicaProvider } from "./MusicaContexto";
import MusicaCancionesLista from "./MusicaCancionesLista";
import MusicaReproductor from "./MusicaReproductor";
import MusicaFiltros from "./MusicaFiltros";
import GuionEventoCompleto from "./GuionEventoCompleto";
import GuionManager from "./GuionManager";
import "../assets/scss/_03-Componentes/_Musica.scss";

/**
 * COMPONENTE PADRE: Musica - VERSIÓN OPTIMIZADA CON SINCRONIZACIÓN HEADER
 * 
 * OPTIMIZACIONES:
 * - ✅ Sincronización con Header para estados compartidos
 * - ✅ Eliminado reproductor duplicado (ahora está en Header)
 * - ✅ Máximo aprovechamiento del espacio disponible
 * - ✅ Estados compartidos: filteredSongs, bloques, bloqueActual
 */

function Musica({ 
  currentTrack, 
  setCurrentTrack,
  isPlaying, 
  setIsPlaying,
  volume, 
  setVolume,
  audioRef,
  guionActivo = "completo",
  // NUEVAS PROPS para sincronización con Header
  setBloqueActual,
  setFilteredSongs,
  setBloques
}) {
  // ==============================================
  // 1. ESTADOS LOCALES OPTIMIZADOS
  // ==============================================
  const [bloques, setBloquesLocal] = useState({});
  const [bloqueActual, setBloqueActualLocal] = useState("todo");
  const [filteredSongs, setFilteredSongsLocal] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [guionEventoData, setGuionEventoData] = useState(null);
  const [estadosEvento, setEstadosEvento] = useState({});
  const [cargando, setCargando] = useState(true);
  const [bloquesCargados, setBloquesCargados] = useState(0);
  const [totalBloques] = useState(19);

  // ==============================================
  // 2. CONFIGURACIÓN OPTIMIZADA
  // ==============================================
  const bloquesMusicales = [
    "bloque-1-recepcion", "bloque-2-ceremonia", "bloque-3-felicitaciones",
    "bloque-4-fotosgrupales", "bloque-5-showmozos", "bloque-6-cena",
    "bloque-7A-brindisfamiliar", "bloque-7B-brindischampagne", "bloque-8A-coreografia",
    "bloque-8B-vals", "bloque-8C-aperturabaile", "bloque-9-postre",
    "bloque-10-video", "bloque-11-banda", "bloque-12-baile2",
    "bloque-13-juegos", "bloque-14-torta", "bloque-15-barralibre",
    "bloque-16-horaloca", "bloque-17-bailefinal", "bloque-18-desayuno",
    "bloque-19-despedida"
  ];
  
  // ==============================================
  // 3. MANEJADORES DE ESTADO SINCRONIZADOS
  // ==============================================

  /**
   * MANEJADOR: Sincronizar estado de bloques con Header
   */
  const handleSetBloques = (nuevosBloques) => {
    setBloquesLocal(nuevosBloques);
    if (setBloques) setBloques(nuevosBloques);
  };

  /**
   * MANEJADOR: Sincronizar bloque actual con Header
   */
  const handleSetBloqueActual = (nuevoBloque) => {
    setBloqueActualLocal(nuevoBloque);
    if (setBloqueActual) setBloqueActual(nuevoBloque);
  };

  /**
   * MANEJADOR: Sincronizar canciones filtradas con Header
   */
  const handleSetFilteredSongs = (nuevasCanciones) => {
    setFilteredSongsLocal(nuevasCanciones);
    if (setFilteredSongs) setFilteredSongs(nuevasCanciones);
  };

  // ==============================================
  // 4. REFERENCIAS OPTIMIZADAS
  // ==============================================
  const avanzarSiguienteCancion = useRef(() => {
    if (filteredSongs.length === 0) return;
    
    const currentIndex = filteredSongs.findIndex(s => s.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % filteredSongs.length;
    
    if (nextIndex === 0) {
      avanzarSiguienteBloque.current();
      return;
    }
    
    const nextSong = filteredSongs[nextIndex];
    setCurrentTrack(nextSong);
    setIsPlaying(true);
    mostrarAlerta(`▶ ${nextSong.nombre}`);
  });

  const avanzarSiguienteBloque = useRef(() => {
    if (!guionEventoData?.bloques) return;
    
    const bloquesIds = guionEventoData.bloques.map(b => b.id);
    const currentIndex = bloquesIds.indexOf(bloqueActual);
    const nextIndex = (currentIndex + 1) % bloquesIds.length;
    
    if (currentIndex < bloquesIds.length - 1) {
      const nextBlockId = bloquesIds[nextIndex];
      handleSetBloqueActual(nextBlockId);
      setEstadosEvento(prev => ({ 
        ...prev, 
        [bloqueActual]: 'completado',
        [nextBlockId]: 'en-progreso'
      }));
      mostrarAlerta(`🔄 ${guionEventoData.bloques[nextIndex].nombre}`);
    }
  });

  // ==============================================
  // 5. EFECTOS OPTIMIZADOS CON SINCRONIZACIÓN
  // ==============================================

  // [Efecto 1] Carga optimizada con sincronización
  useEffect(() => {
    const cargarDatosOptimizado = async () => {
      try {
        setCargando(true);
        console.log('🔄 Iniciando carga de datos...');
        
        // Cargar guion primero
        const guionPromise = fetch('/dataGuiones/guionEventoCompleto.json')
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP ${response.status} - No se pudo cargar guionEventoCompleto.json`);
            }
            return response.json();
          })
          .then(data => {
            console.log('✅ Guion cargado exitosamente:', data);
            setGuionEventoData(data);
            
            // Establecer primer bloque y sincronizar
            if (data.bloques?.[0]) {
              handleSetBloqueActual(data.bloques[0].id);
              setEstadosEvento({ [data.bloques[0].id]: 'en-progreso' });
            }
            return data;
          })
          .catch(error => {
            console.error('❌ Error cargando guionEventoCompleto.json:', error);
            const guionVacio = {
              evento: "Guion del Evento",
              fecha: "Fecha no disponible", 
              horario: "Horario no disponible",
              bloques: []
            };
            setGuionEventoData(guionVacio);
            return guionVacio;
          });

        // Cargar bloques en paralelo
        const bloquesPromises = bloquesMusicales.map(async (bloqueId, index) => {
          try {
            await new Promise(resolve => setTimeout(resolve, index * 50));
            
            const response = await fetch(`/dataMusical/${bloqueId}.json`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            
            // Actualizar estado incrementalmente y sincronizar
            handleSetBloques(prev => ({ ...prev, ...data }));
            setBloquesCargados(prev => prev + 1);
            
            return data;
          } catch (error) {
            console.warn(`⚠️ Falló ${bloqueId}:`, error);
            const bloqueVacio = { 
              [bloqueId]: { 
                bloque_musical: `${bloqueId}`, 
                canciones: [] 
              } 
            };
            handleSetBloques(prev => ({ ...prev, ...bloqueVacio }));
            setBloquesCargados(prev => prev + 1);
            return bloqueVacio;
          }
        });

        await Promise.all([guionPromise, ...bloquesPromises]);
        
        console.log('🎉 Carga completada - Datos sincronizados con Header');
        
      } catch (err) {
        console.error("❌ Error crítico:", err);
        mostrarAlerta("⚠️ Error cargando datos");
      } finally {
        setCargando(false);
      }
    };

    cargarDatosOptimizado();
    
    // Cargar estado guardado
    try {
      const savedState = localStorage.getItem('musicaState');
      if (savedState) {
        const { bloqueActual, currentSong, isPlaying, volume } = JSON.parse(savedState);
        if (bloqueActual) handleSetBloqueActual(bloqueActual);
        if (currentSong) setCurrentTrack(currentSong);
        if (isPlaying !== undefined) setIsPlaying(isPlaying);
        if (volume !== undefined) setVolume(volume);
      }
    } catch (e) {
      console.warn("⚠️ Error cargando estado guardado:", e);
    }
  }, []);

  // [Efecto 2] Filtrado optimizado con sincronización
  useEffect(() => {
    if (!bloqueActual || Object.keys(bloques).length === 0) return;
    
    const canciones = bloqueActual === "todo" 
      ? Object.values(bloques).flatMap(b => b.canciones || [])
      : bloques[bloqueActual]?.canciones || [];
    
    handleSetFilteredSongs(canciones);
  }, [bloqueActual, bloques]);

  // [Efecto 3] Persistencia optimizada
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const state = { 
        bloqueActual, 
        currentSong: currentTrack, 
        isPlaying, 
        volume 
      };
      localStorage.setItem('musicaState', JSON.stringify(state));
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [bloqueActual, currentTrack, isPlaying, volume]);

  // [Efecto 4] Manejo de fin de canción
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const handleEnded = () => isPlaying && avanzarSiguienteCancion.current();
    audio.addEventListener('ended', handleEnded);
    
    return () => audio.removeEventListener('ended', handleEnded);
  }, [isPlaying, currentTrack, filteredSongs, audioRef]);

  // ==============================================
  // 6. FUNCIONES AUXILIARES OPTIMIZADAS
  // ==============================================

  const mostrarAlerta = (mensaje) => {
    setAlertMessage(mensaje);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  const handlePlaySong = (song) => {
    setCurrentTrack(song);
    setIsPlaying(true);
  };

  const handleEstadoChange = (bloqueId, nuevoEstado) => {
    setEstadosEvento(prev => ({ ...prev, [bloqueId]: nuevoEstado }));
    if (nuevoEstado === 'completado' && bloqueId === bloqueActual) {
      avanzarSiguienteBloque.current();
    }
  };

  // ==============================================
  // 7. RENDERIZADO OPTIMIZADO - SIN REPRODUCTOR DUPLICADO
  // ==============================================
  
  if (cargando) {
    return (
      <div className="music-page loading">
        <div className="loading-progress">
          <div 
            className="loading-bar" 
            style={{ width: `${(bloquesCargados / totalBloques) * 100}%` }}
          ></div>
        </div>
        <p>Cargando música... ({bloquesCargados}/{totalBloques})</p>
        <small>Sincronizando con reproductor...</small>
      </div>
    );
  }

  return (
    <div className="music-page">
      
      {/* DISEÑO ESCRITORIO OPTIMIZADO - SIN SECCIÓN DE CONTROLES */}
      <div className="music-desktop-layout">
        <div className="music-content-section">
          <div className="music-songs-column">
            <MusicaFiltros 
              bloques={bloques}
              bloqueActual={bloqueActual}
              setBloqueActual={handleSetBloqueActual}
              currentSong={currentTrack}
              setCurrentSong={setCurrentTrack}
              estadosEvento={estadosEvento}
            />
            <MusicaCancionesLista 
              songs={filteredSongs}
              currentSong={currentTrack}
              onPlaySong={handlePlaySong}
            />
          </div>
          
          <div className="evento-guion-column">
            {guionActivo === "completo" ? (
              <GuionEventoCompleto 
                onBloqueChange={handleSetBloqueActual}
                bloqueActual={bloqueActual}
                guionEvento={guionEventoData}
                onEstadoChange={handleEstadoChange}
                estadosEvento={estadosEvento}
              />
            ) : (
              <GuionManager 
                guionActivo={guionActivo}
                estaDentroDeReproductor={true}
              />
            )}
          </div>
        </div>
      </div>

      {/* DISEÑO MÓVIL OPTIMIZADO - CON REPRODUCTOR (solo en móvil) */}
      <div className="music-mobile-layout">
        <div className="music-container">
          {/* SOLO EN MÓVIL: Mostrar reproductor aquí */}
          <MusicaReproductor 
            currentSong={currentTrack}
            isPlaying={isPlaying}
            volume={volume}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onNext={avanzarSiguienteCancion.current}
            onPrev={() => {
              const prevIndex = (filteredSongs.findIndex(s => s.id === currentTrack?.id) - 1 + filteredSongs.length) % filteredSongs.length;
              handlePlaySong(filteredSongs[prevIndex]);
            }}
            onVolumeChange={setVolume}
            bloqueActual={bloqueActual}
            bloques={bloques}
            audioRef={audioRef}
          />
          
          <MusicaFiltros 
            bloques={bloques}
            bloqueActual={bloqueActual}
            setBloqueActual={handleSetBloqueActual}
            currentSong={currentTrack}
            setCurrentSong={setCurrentTrack}
            estadosEvento={estadosEvento}
          />
          
          <MusicaCancionesLista 
            songs={filteredSongs}
            currentSong={currentTrack}
            onPlaySong={handlePlaySong}
          />
        </div>
        
        {guionActivo === "completo" ? (
          <GuionEventoCompleto 
            onBloqueChange={handleSetBloqueActual}
            bloqueActual={bloqueActual}
            guionEvento={guionEventoData}
            onEstadoChange={handleEstadoChange}
            estadosEvento={estadosEvento}
          />
        ) : (
          <GuionManager 
            guionActivo={guionActivo}
            estaDentroDeReproductor={true}
          />
        )}
      </div>

      {/* ALERTA OPTIMIZADA */}
      {showAlert && (
        <div className="alert-message">
          {alertMessage}
        </div>
      )}
    </div>
  );
}

export default Musica;