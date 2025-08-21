import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../assets/scss/_03-Componentes/_HomePublicidadSlider.scss';

const HomePublicidadSlider = () => {
  const [canciones, setCanciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchCanciones = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("/canciones.json");
        
        if (!response.ok) {
          throw new Error(`Error HTTP! estado: ${response.status}`);
        }

        // Verificar si la respuesta es JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('La respuesta no es JSON válido');
        }

        const data = await response.json();
        setCanciones(data);
      } catch (err) {
        console.error("Error al cargar canciones:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCanciones();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    fade: true,
    beforeChange: (current, next) => setActiveSlide(next),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false
        }
      }
    ]
  };

  const handleImageError = (e) => {
    e.target.src = '/img/placeholder-music.jpg';
    e.target.alt = 'Imagen no disponible';
  };

  if (loading) {
    return (
      <div className="publicidad-loading">
        <div className="loading-spinner"></div>
        <p>CARGANDO CANCIONES DESTACADAS...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="publicidad-error">
        <p>ERROR AL CARGAR CANCIONES</p>
        <p className="error-detail">{error}</p>
      </div>
    );
  }

  if (canciones.length === 0) {
    return (
      <div className="publicidad-empty">
        <p>NO HAY CANCIONES DISPONIBLES</p>
      </div>
    );
  }

  return (
    <section className="publicidad-container">
      <div className="publicidad-header">
        <h2 className="section-title">CANCIONES DESTACADAS</h2>
        <div className="slider-indicator">
          {activeSlide + 1} / {canciones.length}
        </div>
      </div>

      <div className="main-slider-container">
        <Slider {...settings}>
          {canciones.map((cancion) => (
            <div key={cancion.id} className="music-slide">
              <div className="slide-image-container">
                <img
                  src={cancion.imagen}
                  alt={`Portada de ${cancion.nombre}`}
                  className="music-image"
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
              
              <div className="music-info">
                <h3 className="music-name">{cancion.nombre}</h3>
                <p className="music-artist">{cancion.artista}</p>
                
                <div className="music-meta">
                  <span className="music-id">ID: {cancion.id}</span>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className="thumbnails-container">
        <h3 className="thumbnails-title">EXPLORAR MÁS CANCIONES</h3>
        <div className="thumbnails-grid">
          {canciones.map((cancion, index) => (
            <div 
              key={cancion.id} 
              className={`thumbnail-item ${index === activeSlide ? 'active' : ''}`}
              onClick={() => setActiveSlide(index)}
            >
              <img
                src={cancion.imagen}
                alt={`Miniatura de ${cancion.nombre}`}
                className="thumbnail-image"
                onError={handleImageError}
                loading="lazy"
              />
              <span className="thumbnail-label">
                {cancion.nombre.substring(0, 15)}...
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePublicidadSlider;