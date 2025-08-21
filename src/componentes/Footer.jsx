import React from "react";
import { FaInstagram, FaYoutube, FaFacebookF, FaTwitter, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../assets/scss/_03-Componentes/_Footer.scss";

// Componente Footer - Pie de página con redes sociales y contacto
function Footer() {
  return (
    <footer className="app-footer">
      {/* Contenedor principal con 3 columnas: logo | redes | logo */}
      <div className="footer-container">
        {/* Columna izquierda - Logo */}
        <div className="footer-logo-side">
          <div className="logo-wrapper">
            <img 
       src="/img/02-logos/logoreproductordemusicamp3.png" 
              alt="Logo Almango" 
              className="footer-logo"
            />
          </div>
        </div>

        {/* Columna central - Redes sociales y contacto */}
        <div className="footer-center">
          <h3 className="socials-title">CONÉCTATE CON NOSOTROS</h3>
          
          <div className="socials-container">
            {/* Ícono de Instagram */}
            <a href="#" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaInstagram className="social-icon" />
              <span className="social-label">Instagram</span>
            </a>
            
            {/* Ícono de YouTube */}
            <a href="#" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaYoutube className="social-icon" />
              <span className="social-label">YouTube</span>
            </a>
            
            {/* Ícono de Facebook */}
            <a href="#" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaFacebookF className="social-icon" />
              <span className="social-label">Facebook</span>
            </a>
            
            {/* Ícono de Twitter */}
            <a href="#" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaTwitter className="social-icon" />
              <span className="social-label">Twitter</span>
            </a>
            
            {/* Nuevo ícono de Contacto (antes estaba en el header) */}
            <Link to="/contactoredessociales" className="social-link">
              <FaEnvelope className="social-icon" />
              <span className="social-label">Contacto</span>
            </Link>
          </div>
        </div>

        {/* Columna derecha - Logo */}
        <div className="footer-logo-side">
          <div className="logo-wrapper">
            <img 
              src="/img/02-logos/logoreproductordemusicamp3.png" 
              alt="Logo Almango" 
              className="footer-logo"
            />
          </div>
        </div>
      </div>

      {/* Sección inferior - Copyright y créditos */}
      <div className="footer-bottom">
        <div className="copyright-container">
          <a href="https://alejandrobavaro.github.io/gondraworld-dev/" target="_blank" rel="noopener noreferrer" className="dev-link">
            GONDRA WORLD DEV
          </a>
          <span className="copyright-text">© {new Date().getFullYear()} Reproductor Eventos. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;