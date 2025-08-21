// ████████████████████████████████████████████
// ███ IMPORTACIONES DE DEPENDENCIAS ███
// ████████████████████████████████████████████
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/scss/_03-Componentes/_GuionCompleto.scss";

// ████████████████████████████████████████████
// ███ COMPONENTE PRINCIPAL ███
// ████████████████████████████████████████████
function GuionCompleto() {
  // ███ HOOKS DE REACT ███
  const navigate = useNavigate(); // Para navegación programática

  // ███ ESTADOS DEL COMPONENTE ███
  const [guionEvento, setGuionEvento] = useState(null); // Almacena datos del guionBoda.json
  const [listaCanciones, setListaCanciones] = useState(null); // Almacena datos de bodalistacompleta.json
  const [bloqueExpandido, setBloqueExpandido] = useState(null); // Bloque actualmente expandido
  const [cancionesBloque, setCancionesBloque] = useState([]); // Canciones del bloque actual
  const [loading, setLoading] = useState(true); // Estado de carga

  // ███ EFECTO PARA CARGAR DATOS INICIALES ███
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // 1. Carga guionBoda.json (itinerario del evento)
        const responseGuion = await fetch('/guionBoda.json');
        const dataGuion = await responseGuion.json();
        setGuionEvento(dataGuion);
        setBloqueExpandido(dataGuion.bloques[0]); // Establece primer bloque como activo
        
        // 2. Carga bodalistacompleta.json (lista de canciones)
        const responseCanciones = await fetch('/bodalistacompleta.json');
        const dataCanciones = await responseCanciones.json();
        setListaCanciones(dataCanciones);
        
        // 3. Carga canciones del primer bloque
        if (dataCanciones[dataGuion.bloques[0].id]) {
          setCancionesBloque(dataCanciones[dataGuion.bloques[0].id].canciones);
        }
        
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  // ███ MANEJADOR PARA VOLVER AL REPRODUCTOR ███
  const handleVolver = () => {
    navigate("/musica"); // Navega a la ruta /musica
  };

  // ███ MANEJADOR PARA EXPANDIR BLOQUE ███
  const handleExpandirBloque = (bloque) => {
    setBloqueExpandido(bloque); // Actualiza bloque expandido
    
    // Actualiza canciones del bloque seleccionado
    if (listaCanciones && listaCanciones[bloque.id]) {
      setCancionesBloque(listaCanciones[bloque.id].canciones);
    } else {
      setCancionesBloque([]); // Si no hay canciones, array vacío
    }
  };

  // ███ RENDERIZADO CONDICIONAL - ESTADOS DE CARGA ███
  if (loading) return <div className="guion-loading">Cargando guión...</div>;
  if (!guionEvento) return <div className="guion-error">Error al cargar el guión</div>;

  // ███ ESTRUCTURA PRINCIPAL DEL COMPONENTE ███
  return (
    <div className="guion-completo-container">
   
      
      {/* CABECERA CON INFORMACIÓN DEL EVENTO */}
      <div className="guion-header">
        <h2 className="guion-titulo">{guionEvento.evento}</h2>
        <div className="guion-meta">
          <span className="guion-fecha">{guionEvento.fecha}</span>
          <span className="guion-horario">{guionEvento.horario}</span>
        </div>
      </div>
      
      {/* CONTENIDO PRINCIPAL (LISTA + DETALLE) */}
      <div className="guion-contenido">
        {/* COLUMNA IZQUIERDA - LISTA DE BLOQUES */}
        <div className="guion-lista">
          {guionEvento.bloques.map((bloque) => (
            <div 
              key={bloque.id}
              className={`guion-bloque ${bloqueExpandido?.id === bloque.id ? 'active' : ''}`}
              onClick={() => handleExpandirBloque(bloque)}
            >
              <div className="guion-bloque-hora">
                {bloque.horaInicio} - {bloque.horaFin}
              </div>
              <div className="guion-bloque-nombre">{bloque.nombre}</div>
              {bloqueExpandido?.id === bloque.id && (
                <div className="guion-bloque-indicator">ACTUAL</div>
              )}
            </div>
          ))}
        </div>
        
        {/* COLUMNA DERECHA - DETALLE DEL BLOQUE */}
        <div className="guion-detalle">
          {bloqueExpandido && (
            <>
              {/* CABECERA DEL DETALLE */}
              <div className="guion-detalle-header">
                <h3 className="guion-detalle-titulo">
                  {bloqueExpandido.nombre}
                </h3>
                <div className="guion-detalle-hora">
                  {bloqueExpandido.horaInicio} - {bloqueExpandido.horaFin}
                </div>
              </div>
              
              {/* CONTENIDO DEL DETALLE */}
              <div className="guion-detalle-content">
                {/* SECCIÓN DE ACTIVIDADES */}
                <div className="guion-detalle-seccion">
                  <h4 className="guion-detalle-subtitulo">Actividades</h4>
                  <ul className="guion-actividades">
                    {bloqueExpandido.actividades.map((actividad, index) => (
                      <li key={index} className="guion-actividad">
                        <span>•</span> {actividad}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* SECCIÓN DE DETALLES (SI EXISTEN) */}
                {bloqueExpandido.detalles && (
                  <div className="guion-detalle-seccion">
                    <h4 className="guion-detalle-subtitulo">Detalles</h4>
                    <p className="guion-detalle-texto">{bloqueExpandido.detalles}</p>
                  </div>
                )}
                
                {/* SECCIÓN DE CANCIONES (SI EXISTEN) */}
                {cancionesBloque.length > 0 && (
                  <div className="guion-detalle-seccion">
                    <h4 className="guion-detalle-subtitulo">Lista de Canciones ({cancionesBloque.length})</h4>
                    <div className="guion-canciones">
                      {cancionesBloque.map((cancion, index) => (
                        <div key={index} className="guion-cancion">
                          <div className="guion-cancion-numero">{index + 1}.</div>
                          <div className="guion-cancion-info">
                            <div className="guion-cancion-nombre">{cancion.nombre}</div>
                            <div className="guion-cancion-artista">{cancion.artista}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default GuionCompleto;