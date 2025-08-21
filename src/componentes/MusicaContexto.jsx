/**
 * CONTEXTO: MusicaContexto
 * 
 * Propósito:
 * - Gestionar el estado global del reproductor de música
 * - Manejar la lógica de reproducción (play, pause, next, prev)
 * - Administrar favoritos y persistencia en localStorage
 * - Controlar volumen, tiempo actual y mute
 * 
 * Comunicación:
 * - Provee estados y funciones a todos los componentes hijos
 * - Escucha cambios en los estados para actualizar la reproducción
 * - Persiste favoritos en localStorage
 */

import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';

// Creación del contexto
export const MusicaContexto = createContext();

/**
 * Componente Proveedor del Contexto
 * 
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 */
export function MusicaProvider({ children }) {
  // ████████████████████████████████████████████
  // ███ 1. ESTADOS GLOBALES ███
  // ████████████████████████████████████████████
  const [cart, setCart] = useState([]);           // Lista de canciones actual
  const [favorites, setFavorites] = useState([]); // IDs de canciones favoritas
  const [currentSongIndex, setCurrentSongIndex] = useState(0); // Índice canción actual
  const [isPlaying, setIsPlaying] = useState(false); // Estado de reproducción
  const [currentTime, setCurrentTime] = useState(0); // Tiempo actual de reproducción
  const [duration, setDuration] = useState(0);      // Duración total de la canción
  const [volume, setVolume] = useState(0.7);       // Nivel de volumen (0-1)
  const [isMuted, setIsMuted] = useState(false);   // Estado de mute
  const audioRef = useRef(null);                   // Referencia al elemento de audio

  // ████████████████████████████████████████████
  // ███ 2. EFECTOS SECUNDARIOS ███
  // ████████████████████████████████████████████

  // [Efecto 1] Cargar favoritos desde localStorage al montar
  useEffect(() => {
    const savedFavorites = localStorage.getItem('musicFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // [Efecto 2] Guardar favoritos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('musicFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // [Efecto 3] Manejar la lógica de reproducción
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || cart.length === 0) return;

    const currentSong = cart[currentSongIndex];
    if (!currentSong?.url) return;

    // Handlers para eventos de audio
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => skipNext();

    // Configurar audio
    audio.src = currentSong.url;
    audio.volume = isMuted ? 0 : volume;
    audio.load();

    // Agregar listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    // Manejar reproducción
    if (isPlaying) {
      audio.play().catch(err => {
        console.error("Error al reproducir:", err);
        setIsPlaying(false);
      });
    }

    // Limpieza
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [currentSongIndex, cart, isPlaying, volume, isMuted, skipNext]);

  // ████████████████████████████████████████████
  // ███ 3. FUNCIONES PRINCIPALES (useCallback) ███
  // ████████████████████████████████████████████

  /**
   * Reproduce una canción específica
   * @param {Object} song - Canción a reproducir
   */
  const playSong = useCallback((song) => {
    const songIndex = cart.findIndex(s => s.id === song.id);
    if (songIndex !== -1) {
      setCurrentSongIndex(songIndex);
      setIsPlaying(true);
    }
  }, [cart]);

  /**
   * Pausa la reproducción actual
   */
  const pauseSong = useCallback(() => {
    setIsPlaying(false);
  }, []);

  /**
   * Avanza a la siguiente canción
   */
  const skipNext = useCallback(() => {
    setCurrentSongIndex(prev => (prev + 1) % cart.length);
  }, [cart.length]);

  /**
   * Retrocede a la canción anterior
   */
  const skipPrev = useCallback(() => {
    setCurrentSongIndex(prev => (prev === 0 ? cart.length - 1 : prev - 1));
  }, [cart.length]);

  /**
   * Alterna el estado de mute
   */
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  /**
   * Maneja el cambio de volumen
   * @param {number} newVolume - Nuevo nivel de volumen (0-1)
   */
  const handleVolumeChange = useCallback((newVolume) => {
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  }, []);

  /**
   * Maneja el cambio de progreso (barra de tiempo)
   * @param {number} percent - Porcentaje de progreso (0-100)
   */
  const handleProgressChange = useCallback((percent) => {
    if (!audioRef.current) return;
    const newTime = (percent / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  /**
   * Añade una canción a favoritos
   * @param {string} songId - ID de la canción a añadir
   */
  const addToFavorites = useCallback((songId) => {
    setFavorites(prev => [...prev, songId]);
  }, []);

  /**
   * Elimina una canción de favoritos
   * @param {string} songId - ID de la canción a eliminar
   */
  const removeFromFavorites = useCallback((songId) => {
    setFavorites(prev => prev.filter(id => id !== songId));
  }, []);

  // ████████████████████████████████████████████
  // ███ 4. PROVEEDOR DEL CONTEXTO ███
  // ████████████████████████████████████████████
  return (
    <MusicaContexto.Provider value={{
      // Estados
      cart,
      setCart,
      favorites,
      currentSongIndex,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      
      // Funciones
      playSong,
      pauseSong,
      skipNext,
      skipPrev,
      toggleMute,
      setVolume: handleVolumeChange,
      handleProgressChange,
      addToFavorites,
      removeFromFavorites
    }}>
      {children}
      {/* Elemento de audio oculto */}
      <audio ref={audioRef} />
    </MusicaContexto.Provider>
  );
}