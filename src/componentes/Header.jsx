import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaMusic, FaCalendarAlt } from "react-icons/fa";

/**
 * COMPONENTE: Header
 * 
 * Propósito: 
 * - Barra de navegación superior simplificada
 * - Muestra el logo y botón de inicio
 * - Alterna la vista del guión completo
 * 
 * Comunicación:
 * - Recibe la función onToggleGuion del padre (App)
 * - No modifica estados directamente, solo notifica al padre
 */
const Header = ({ onToggleGuion }) => {
  // ████████████████████████████████████████████
  // ███ 1. ESTADOS Y REFERENCIAS ███
  // ████████████████████████████████████████████
  const [menuActive, setMenuActive] = useState(false);
  const headerRef = useRef(null);

  // ████████████████████████████████████████████
  // ███ 2. CONFIGURACIÓN DE MENÚ ███
  // ████████████████████████████████████████████
  const menuItems = [
    { 
      title: "Inicio", 
      path: "/", 
      icon: <FaMusic /> 
    },
    { 
      title: "Guion", 
      path: "#guion",
      icon: <FaCalendarAlt />,
      action: onToggleGuion
    }
  ];

  // ████████████████████████████████████████████
  // ███ 3. MANEJADORES DE EVENTOS ███
  // ████████████████████████████████████████████
  const handleNavigation = (item) => {
    setMenuActive(false);
    window.scrollTo(0, 0);
    if (item.action) item.action();
  };

  const handleClickOutside = (event) => {
    if (headerRef.current && !headerRef.current.contains(event.target)) {
      setMenuActive(false);
    }
  };

  // ████████████████████████████████████████████
  // ███ 4. EFECTOS SECUNDARIOS ███
  // ████████████████████████████████████████████
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ████████████████████████████████████████████
  // ███ 5. RENDERIZADO ███
  // ████████████████████████████████████████████
  return (
    <header className="app-header" ref={headerRef}>
      <div className="header-wrapper">
        {/* LOGO PRINCIPAL */}
        <div className="logo-container">
          <Link to="/" className="logo-link" onClick={() => handleNavigation({})}>
            <img 
              src="/img/02-logos/logoreproductordemusicamp32222.png" 
              alt="Reproductor de Música" 
              className="logo-image"
            />
          </Link>
        </div>

        {/* MENÚ PRINCIPAL (solo 2 opciones) */}
        <nav className={`main-nav ${menuActive ? "active" : ""}`}>
          {menuItems.map((item, index) => (
            item.path === "#guion" ? (
              <button
                key={index}
                className="nav-link"
                onClick={() => handleNavigation(item)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.title}</span>
              </button>
            ) : (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                onClick={() => handleNavigation(item)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.title}</span>
              </NavLink>
            )
          ))}
        </nav>

        {/* BOTÓN MENÚ MÓVIL */}
        <div className="mobile-controls">
          <button
            className="menu-toggle"
            onClick={() => setMenuActive(!menuActive)}
          >
            <div className={`toggle-bar ${menuActive ? "open" : ""}`}></div>
            <div className={`toggle-bar ${menuActive ? "open" : ""}`}></div>
            <div className={`toggle-bar ${menuActive ? "open" : ""}`}></div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;