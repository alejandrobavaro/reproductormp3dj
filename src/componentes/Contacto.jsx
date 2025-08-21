import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaFacebook, 
  FaInstagram, 
  FaYoutube, 
  FaSpotify, 
  FaEnvelope, 
  FaPaypal 
} from "react-icons/fa";

import "../assets/scss/_03-Componentes/_Contacto.scss";

const Contacto = () => {
  const navigate = useNavigate();

  const contactItems = [
    {
      icon: <FaFacebook />,
      text: "FACEBOOK",
      url: "#",
      color: "#1877f2"
    },
    {
      icon: <FaInstagram />,
      text: "INSTAGRAM",
      url: "#",
      color: "#e1306c"
    },
    {
      icon: <FaYoutube />,
      text: "YOUTUBE",
      url: "#",
      color: "#ff0000"
    },
    {
      icon: <FaSpotify />,
      text: "SPOTIFY",
      url: "#",
      color: "#1db954"
    },
    {
      icon: <FaEnvelope />,
      text: "CORREO ELECTRÓNICO",
      url: "mailto:bavaroalejandro@gmail.com",
      color: "#00f0ff"
    }
  ];

  return (
    <section className="spotify-contact-section">
      <div className="contact-container">
        <h1 className="contact-title">
          CONTACTO
        </h1>
        
        <div className="contact-divider"></div>

        <div className="contact-content">
          <div className="logo-container">
            <img
           src="/img/02-logos/logoreproductordemusicamp3.png" 
              alt="Almango Pop Covers"
              className="contact-logo"
            />
          </div>

          <div className="contact-info">
            <h2 className="contact-subtitle">
              CANALES DE COMUNICACIÓN
            </h2>
            
            <div className="contact-items">
              {contactItems.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-item"
                  style={{ "--item-color": item.color }}
                >
                  <div className="item-icon" style={{ color: item.color }}>
                    {item.icon}
                  </div>
                  <span className="item-text">{item.text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;