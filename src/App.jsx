// src/App.jsx
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './componentes/Header';
import Footer from './componentes/Footer';
import Musica from './componentes/Musica';
import './assets/scss/estilo.scss';
import "../src/assets/scss/_01-General/_App.scss";

/**
 * COMPONENTE PRINCIPAL: App - VERSIÓN OPTIMIZADA
 * 
 * OPTIMIZACIONES:
 * - ✅ Reproductor integrado en header (ahorra espacio vertical)
 * - ✅ Estados compartidos con Header para funcionalidad completa
 * - ✅ Máximo aprovechamiento del área de contenido
 */

function App() {
  // ████████████████████████████████████████████
  // ███ 1. ESTADOS GLOBALES - COMPARTIDOS CON HEADER ███
  // ████████████████████████████████████████████
  
  // Estados del reproductor de audio - PERSISTENTES
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  
  // Estados para funcionalidades del header
  const [guionActivo, setGuionActivo] = useState("completo");
  const [bloqueActual, setBloqueActual] = useState("todo");
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [bloques, setBloques] = useState({});

  // ████████████████████████████████████████████
  // ███ 2. REFERENCIA DE AUDIO - UNA SOLA INSTANCIA ███
  // ████████████████████████████████████████████
  const audioRef = useRef(null);

  // ████████████████████████████████████████████
  // ███ 3. FUNCIONES DE NAVEGACIÓN DE CANCIONES ███
  // ████████████████████████████████████████████

  /**
   * FUNCIÓN: Avanzar a la siguiente canción
   */
  const avanzarSiguienteCancion = () => {
    if (filteredSongs.length === 0 || !currentTrack) return;
    
    const currentIndex = filteredSongs.findIndex(s => s.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % filteredSongs.length;
    const nextSong = filteredSongs[nextIndex];
    
    setCurrentTrack(nextSong);
    setIsPlaying(true);
  };

  /**
   * FUNCIÓN: Retroceder a la canción anterior
   */
  const retrocederCancionAnterior = () => {
    if (filteredSongs.length === 0 || !currentTrack) return;
    
    const currentIndex = filteredSongs.findIndex(s => s.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
    const prevSong = filteredSongs[prevIndex];
    
    setCurrentTrack(prevSong);
    setIsPlaying(true);
  };

  // ████████████████████████████████████████████
  // ███ 4. EFECTOS DE AUDIO ███
  // ████████████████████████████████████████████

  /**
   * EFECTO: Inicializar el elemento de audio UNA sola vez
   */
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  /**
   * EFECTO: Controlar reproducción cuando cambia el track
   */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrack) {
      audio.src = currentTrack.url;
      audio.volume = volume;
      
      if (isPlaying) {
        audio.play().catch(e => {
          console.error("Error al reproducir:", e);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack]);

  /**
   * EFECTO: Controlar play/pause
   */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.play().catch(e => {
        console.error("Error al reproducir:", e);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  /**
   * EFECTO: Controlar volumen
   */
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  // ████████████████████████████████████████████
  // ███ 5. MANEJADORES DE NAVEGACIÓN ███
  // ████████████████████████████████████████████

  /**
   * MANEJADOR: Cambiar guion activo
   */
  const handleCambiarGuion = (nuevoGuion) => {
    setGuionActivo(nuevoGuion);
  };

  // ████████████████████████████████████████████
  // ███ 6. RENDERIZADO PRINCIPAL - OPTIMIZADO ███
  // ████████████████████████████████████████████
  return (
    <Router>
      <div className="spotify-app">
        
        {/* HEADER: Con reproductor integrado y funcionalidades completas */}
        <Header 
          onCambiarGuion={handleCambiarGuion}
          guionActivo={guionActivo}
          // Props del reproductor integrado
          currentTrack={currentTrack}
          setCurrentTrack={setCurrentTrack}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          volume={volume}
          setVolume={setVolume}
          audioRef={audioRef}
          // Props para funcionalidades de navegación
          bloques={bloques}
          bloqueActual={bloqueActual}
          filteredSongs={filteredSongs}
          onNextSong={avanzarSiguienteCancion}
          onPrevSong={retrocederCancionAnterior}
        />
        
        {/* CONTENIDO PRINCIPAL - MÁXIMO APROVECHAMIENTO DEL ESPACIO */}
        <div className="spotify-content">
          <Routes>
            <Route path="/" element={
              <Musica 
                // Estados de audio
                currentTrack={currentTrack}
                setCurrentTrack={setCurrentTrack}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                volume={volume}
                setVolume={setVolume}
                audioRef={audioRef}
                // Guion activo actual
                guionActivo={guionActivo}
                // Estados para sincronización con header
                setBloqueActual={setBloqueActual}
                setFilteredSongs={setFilteredSongs}
                setBloques={setBloques}
              />
            } />
            
            {/* Ruta de fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        
        {/* FOOTER - Compacto */}
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;