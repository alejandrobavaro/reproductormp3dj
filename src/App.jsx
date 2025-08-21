import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './componentes/Header';
import Footer from './componentes/Footer';
import Musica from './componentes/Musica';
import GuionCompleto from './componentes/GuionCompleto';
import './assets/scss/estilo.scss';
import "../src/assets/scss/_01-General/_App.scss";


/**
 * COMPONENTE PRINCIPAL DE LA APLICACIÓN
 * 
 * Propósito: 
 * - Configura la estructura base de la aplicación
 * - Maneja el enrutamiento principal
 * - Controla el estado global del reproductor de audio
 * 
 * Comunicación:
 * - Provee estados y handlers a los componentes hijos
 * - Recibe interacciones del usuario desde Header
 * - Mantiene el elemento de audio persistente
 */
function App() {
  // ████████████████████████████████████████████
  // ███ 1. ESTADOS GLOBALES ███
  // ████████████████████████████████████████████
  
  // [Estado] Carrito de música (no usado actualmente)
  const [musicCart, setMusicCart] = useState([]);
  
  // [Estado] Query de búsqueda (no usado actualmente)
  const [searchQuery, setSearchQuery] = useState("");
  
  // [Estado] Controla si mostrar el guión completo
  const [showGuionCompleto, setShowGuionCompleto] = useState(false);
  
  // [Estado] Canción actualmente en reproducción
  const [currentTrack, setCurrentTrack] = useState(null);
  
  // [Estado] Control de reproducción (play/pause)
  const [isPlaying, setIsPlaying] = useState(false);
  
  // [Estado] Nivel de volumen (0-1)
  const [volume, setVolume] = useState(0.7);
  
  // [Ref] Referencia al elemento de audio HTML
  const audioRef = useRef(new Audio());

  // ████████████████████████████████████████████
  // ███ 2. EFECTOS SECUNDARIOS ███
  // ████████████████████████████████████████████
  
  // [Efecto] Controla la reproducción cuando cambian los estados
  useEffect(() => {
    const audio = audioRef.current;
    
    if (currentTrack) {
      audio.src = currentTrack.url;
      audio.volume = volume;
      
      if (isPlaying) {
        audio.play().catch(e => console.error("Error al reproducir:", e));
      } else {
        audio.pause();
      }
    }

    return () => {
      audio.pause();
    };
  }, [currentTrack, isPlaying, volume]);

  // [Efecto] Maneja el evento cuando termina una canción
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => setIsPlaying(false);
    
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  // ████████████████████████████████████████████
  // ███ 3. ESTRUCTURA PRINCIPAL ███
  // ████████████████████████████████████████████
  return (
    <Router>
      <div className="spotify-app">
        {/* HEADER: Solo logo y navegación básica */}
        <Header 
          onToggleGuion={() => setShowGuionCompleto(!showGuionCompleto)}
        />
        
        {/* CONTENIDO PRINCIPAL */}
        <div className="spotify-content">
          <Routes>
            <Route path="/" element={
              showGuionCompleto ? (
                <GuionCompleto />
              ) : (
                <Musica 
                  setCart={setMusicCart} 
                  cart={musicCart} 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  currentTrack={currentTrack}
                  setCurrentTrack={setCurrentTrack}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  volume={volume}
                  setVolume={setVolume}
                />
              )
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        
        {/* FOOTER: Se mantiene igual en todas las vistas */}
        <Footer />
        
        {/* ELEMENTO DE AUDIO OCULTO: Persiste entre navegaciones */}
        <audio 
          ref={audioRef}
          style={{ display: 'none' }}
        />
      </div>
    </Router>
  );
}

export default App;