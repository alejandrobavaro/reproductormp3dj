// src/componentes/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaMusic, FaCalendarAlt, FaUtensils, FaPhotoVideo, FaVideo, FaCamera } from "react-icons/fa";

/**
 * COMPONENTE: Header - CON REPRODUCTOR INTEGRADO Y FUNCIONALIDADES COMPLETAS
 * 
 * MEJORAS:
 * - ✅ Funcionalidades next/prev completas
 * - ✅ Sincronización con filteredSongs
 * - ✅ Lógica de navegación entre canciones
 */

const Header = ({ 
  onCambiarGuion, 
  guionActivo,
  // Props del reproductor integrado
  currentTrack, 
  setCurrentTrack,
  isPlaying, 
  setIsPlaying,
  volume, 
  setVolume,
  audioRef,
  bloques,
  bloqueActual,
  // NUEVAS PROPS para funcionalidades completas
  filteredSongs = [],
  onNextSong,
  onPrevSong
}) => {
  // ████████████████████████████████████████████
  // ███ 1. ESTADOS Y REFERENCIAS LOCALES ███
  // ████████████████████████████████████████████
  const [menuActive, setMenuActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const headerRef = useRef(null);
  const navRef = useRef(null);

  // ████████████████████████████████████████████
  // ███ 2. CONFIGURACIÓN DE MENÚ - SOLO GUIÓN ███
  // ████████████████████████████████████████████
  const menuGuiones = [
    {
      title: "Guión Evento Completo",
      path: "#guion-completo",
      icon: <FaCalendarAlt />,
      tipo: "completo",
      descripcion: "Guión Evento Completo de la boda"
    },
    {
      title: "Guión DJ",
      path: "#guion-dj",
      icon: <FaMusic />,
      tipo: "dj",
      descripcion: "Guion para DJ"
    },
    {
      title: "Guión Animador",
      path: "#guion-animador",
      icon: <FaCalendarAlt />,
      tipo: "animador",
      descripcion: "Guion para animador"
    },
    {
      title: "Guión Novios",
      path: "#guion-novios",
      icon: <FaCalendarAlt />,
      tipo: "novios",
      descripcion: "Guion para novios"
    },
    {
      title: "Guión Gastronómico",
      path: "#guion-gastronomico",
      icon: <FaUtensils />,
      tipo: "gastronomico",
      descripcion: "Guion gastronómico"
    },
    {
      title: "Guión Decoración",
      path: "#guion-decoracion",
      icon: <FaPhotoVideo />,
      tipo: "decoracion",
      descripcion: "Guion de decoración"
    },
    {
      title: "Guión Fotógrafos",
      path: "#guion-fotografos",
      icon: <FaCamera />,
      tipo: "fotografos",
      descripcion: "Guion para fotógrafos"
    },
    {
      title: "Guión Videoman",
      path: "#guion-videoman",
      icon: <FaVideo />,
      tipo: "videoman",
      descripcion: "Guion para videoman"
    },
    {
      title: "Guión Salón",
      path: "#guion-salon",
      icon: <FaCalendarAlt />,
      tipo: "salon",
      descripcion: "Guion del salón"
    }
  ];

  // ████████████████████████████████████████████
  // ███ 3. EFECTOS DEL REPRODUCTOR INTEGRADO ███
  // ████████████████████████████████████████████

  // Efecto: Sincronizar tiempo actual con el audio
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

  // Efecto: Actualizar duración cuando cambia la canción
  useEffect(() => {
    if (currentTrack) {
      setCurrentTime(0);
    }
  }, [currentTrack]);

  // ████████████████████████████████████████████
  // ███ 4. FUNCIONES DEL REPRODUCTOR INTEGRADO ███
  // ████████████████████████████████████████████

  /**
   * FUNCIÓN: Formatea segundos a formato MM:SS
   */
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  /**
   * FUNCIÓN: Obtiene el nombre del bloque actual
   */
  const getBlockName = () => {
    if (bloqueActual === "todo") return "Todos los bloques";
    return bloques[bloqueActual]?.bloque_musical || "Bloque actual";
  };

  /**
   * MANEJADOR: Cambiar posición en la timeline
   */
  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    const audio = audioRef?.current;
    if (audio && !isNaN(newTime)) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  /**
   * MANEJADOR: Cambiar volumen
   */
  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  /**
   * MANEJADOR: Alternar mute/desmute
   */
  const handleToggleMute = () => {
    setVolume(volume === 0 ? 0.7 : 0);
  };

  /**
   * FUNCIÓN: Canción anterior - COMPLETA
   */
  const handlePrevSong = () => {
    if (filteredSongs.length === 0 || !currentTrack) return;
    
    const currentIndex = filteredSongs.findIndex(s => s.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
    const prevSong = filteredSongs[prevIndex];
    
    setCurrentTrack(prevSong);
    setIsPlaying(true);
    
    // Si hay función externa, ejecutarla también
    if (onPrevSong) onPrevSong();
  };

  /**
   * FUNCIÓN: Siguiente canción - COMPLETA
   */
  const handleNextSong = () => {
    if (filteredSongs.length === 0 || !currentTrack) return;
    
    const currentIndex = filteredSongs.findIndex(s => s.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % filteredSongs.length;
    const nextSong = filteredSongs[nextIndex];
    
    setCurrentTrack(nextSong);
    setIsPlaying(true);
    
    // Si hay función externa, ejecutarla también
    if (onNextSong) onNextSong();
  };

  /**
   * FUNCIÓN: Reproducir canción específica
   */
  const handlePlaySong = (song) => {
    setCurrentTrack(song);
    setIsPlaying(true);
  };

  // ████████████████████████████████████████████
  // ███ 5. MANEJADORES DEL HEADER ███
  // ████████████████████████████████████████████

  /**
   * MANEJADOR: Cambiar guion activo
   */
  const handleCambiarGuion = (tipoGuion) => {
    console.log(`🎯 Cambiando a guion: ${tipoGuion}`);
    setMenuActive(false);
    window.scrollTo(0, 0);

    if (onCambiarGuion) {
      onCambiarGuion(tipoGuion);
    }
  };

  /**
   * MANEJADOR: Cerrar menú al hacer click fuera
   */
  const handleClickOutside = (event) => {
    if (headerRef.current && !headerRef.current.contains(event.target) &&
        navRef.current && !navRef.current.contains(event.target)) {
      setMenuActive(false);
    }
  };

  // ████████████████████████████████████████████
  // ███ 6. EFECTOS SECUNDARIOS ███
  // ████████████████████████████████████████████
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ████████████████████████████████████████████
  // ███ 7. RENDERIZADO PRINCIPAL - CON FUNCIONALIDADES COMPLETAS ███
  // ████████████████████████████████████████████
  return (
    <>
      {/* HEADER PRINCIPAL CON REPRODUCTOR */}
      <header className="app-header" ref={headerRef}>
        <div className="header-wrapper">
          
          {/* LOGO PRINCIPAL */}
          <div className="logo-container">
            <Link to="/" className="logo-link">
              <img
                src="/img/02-logos/logoreproductordemusicamp32222.png"
                alt="Reproductor de Música"
                className="logo-image"
              />
            </Link>
          </div>

          {/* REPRODUCTOR INTEGRADO - CON FUNCIONALIDADES COMPLETAS */}
          <div className="header-player">
            {/* INFORMACIÓN DE LA CANCIÓN */}
            <div className="now-playing">
              {currentTrack ? (
                <>
                  <img 
                    src={currentTrack.imagen || '/img/default-cover.png'} 
                    alt="Portada" 
                    className="now-playing-cover"
                    onError={(e) => e.target.src = '/img/default-cover.png'}
                  />
                  <div className="now-playing-info">
                    <div className="now-playing-name">{currentTrack.nombre}</div>
                    <div className="now-playing-artist">{currentTrack.artista}</div>
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
            
            {/* BARRA DE PROGRESO */}
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
            
            {/* CONTROLES DE REPRODUCCIÓN - CON FUNCIONALIDADES COMPLETAS */}
            <div className="player-controls">
              <button 
                className="control-btn prev-btn" 
                onClick={handlePrevSong}
                disabled={!currentTrack || filteredSongs.length === 0}
                title="Canción anterior"
              >
                ⏮
              </button>
              <button 
                className="control-btn play-btn" 
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={!currentTrack}
                title={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button 
                className="control-btn next-btn" 
                onClick={handleNextSong}
                disabled={!currentTrack || filteredSongs.length === 0}
                title="Siguiente canción"
              >
                ⏭
              </button>
            </div>
            
            {/* CONTROL DE VOLUMEN */}
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

          {/* BOTÓN MENÚ MÓVIL */}
          <div className="mobile-controls">
            <button
              className="menu-toggle"
              onClick={() => setMenuActive(!menuActive)}
              aria-label={menuActive ? "Cerrar menú" : "Abrir menú"}
            >
              <div className={`toggle-bar ${menuActive ? "open" : ""}`}></div>
              <div className={`toggle-bar ${menuActive ? "open" : ""}`}></div>
              <div className={`toggle-bar ${menuActive ? "open" : ""}`}></div>
            </button>
          </div>
        </div>
      </header>

      {/* BARRA DE NAVEGACIÓN CON BOTONES DE GUIÓN */}
      <nav className={`nav-bar ${menuActive ? "active" : ""}`} ref={navRef}>
        <div className="nav-wrapper">
          {menuGuiones.map((item, index) => (
            <button
              key={index}
              className={`nav-link ${guionActivo === item.tipo ? "active" : ""}`}
              onClick={() => handleCambiarGuion(item.tipo)}
              title={item.descripcion}
              type="button"
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.title}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Header;