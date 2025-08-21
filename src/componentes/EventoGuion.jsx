import React, { useState, useEffect } from 'react';
import '../assets/scss/_03-Componentes/_EventoGuion.scss';

function EventoGuion({ 
  onBloqueChange,
  bloqueActual,
  guionEvento,
  onEstadoChange 
}) {
  const [estadosBloques, setEstadosBloques] = useState({});
  const [mostrarDetallesCompletos, setMostrarDetallesCompletos] = useState(false);

  useEffect(() => {
    if (guionEvento?.bloques) {
      const inicialEstados = {};
      guionEvento.bloques.forEach(bloque => {
        inicialEstados[bloque.id] = estadosBloques[bloque.id] || 'pendiente';
      });
      setEstadosBloques(inicialEstados);
    }
  }, [guionEvento]);

  const toggleEstadoBloque = (bloqueId) => {
    const nuevoEstado = estadosBloques[bloqueId] === 'completado' ? 'pendiente' : 'completado';
    setEstadosBloques(prev => ({
      ...prev,
      [bloqueId]: nuevoEstado
    }));
    
    if (onEstadoChange) {
      onEstadoChange(bloqueId, nuevoEstado);
    }
  };

  if (!guionEvento) return <div className="evento-guion-loading">Cargando guión...</div>;

  const bloqueSeleccionado = guionEvento.bloques.find(b => b.id === bloqueActual);

  return (
    <div className="evento-guion-container">
      {/* Encabezado con información completa del evento */}
      <div className="evento-guion-header">
        <div>
          <h3 className="evento-guion-title">{guionEvento.evento}</h3>
          <div className="evento-guion-meta">
            <span className="evento-guion-fecha">{guionEvento.fecha}</span>
            <span className="evento-guion-horario">{guionEvento.horario}</span>
          </div>
        </div>
        {bloqueActual && (
          <div className="evento-guion-bloque-actual">
            <span>Bloque actual:</span>
            <strong>{bloqueSeleccionado?.nombre}</strong>
          </div>
        )}
      </div>

      {/* Tabla de bloques */}
      <div className="evento-guion-tabla">
        <div className="evento-guion-tabla-header">
          <div className="evento-guion-col-hora">Hora</div>
          <div className="evento-guion-col-bloque">Bloque</div>
          <div className="evento-guion-col-actividades">Actividades</div>
          <div className="evento-guion-col-estado">Estado</div>
        </div>

        {guionEvento.bloques.map((bloque) => (
          <div 
            key={bloque.id}
            className={`evento-guion-fila ${bloqueActual === bloque.id ? 'active' : ''}`}
            onClick={() => onBloqueChange && onBloqueChange(bloque.id)}
          >
            <div className="evento-guion-col-hora">
              {bloque.horaInicio} - {bloque.horaFin}
            </div>
            
            <div className="evento-guion-col-bloque">
              {bloque.nombre}
              {bloqueActual === bloque.id && (
                <div className="evento-guion-bloque-indicator">ACTUAL</div>
              )}
            </div>
            
            <div className="evento-guion-col-actividades">
              <ul>
                {bloque.actividades.slice(0, mostrarDetallesCompletos ? bloque.actividades.length : 2).map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
                {!mostrarDetallesCompletos && bloque.actividades.length > 2 && (
                  <li className="mas-actividades">+{bloque.actividades.length - 2} más</li>
                )}
              </ul>
            </div>
            
            <div className="evento-guion-col-estado">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={estadosBloques[bloque.id] === 'completado'}
                  onChange={() => toggleEstadoBloque(bloque.id)}
                  onClick={e => e.stopPropagation()}
                />
                <span className="slider round"></span>
              </label>
              <span className={`estado-texto ${estadosBloques[bloque.id]}`}>
                {estadosBloques[bloque.id] === 'completado' ? 'Completado' : 'Pendiente'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detalle expandido del bloque seleccionado */}
      {bloqueActual && (
        <div className="evento-guion-detalle">
          <div className="evento-guion-detalle-header">
            <h4>{bloqueSeleccionado?.nombre}</h4>
            <div className="evento-guion-detalle-hora">
              {bloqueSeleccionado?.horaInicio} - {bloqueSeleccionado?.horaFin}
            </div>
          </div>
          
          <div className="evento-guion-detalle-content">
            <div className="evento-guion-detalle-actividades">
              <h5>Actividades:</h5>
              <ul>
                {bloqueSeleccionado?.actividades?.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>
            
            {bloqueSeleccionado?.detalles && (
              <div className="evento-guion-detalle-extra">
                <h5>Detalles:</h5>
                <p>{bloqueSeleccionado.detalles}</p>
              </div>
            )}
          </div>
          
          <button 
            className="evento-guion-toggle-detalles"
            onClick={() => setMostrarDetallesCompletos(!mostrarDetallesCompletos)}
          >
            {mostrarDetallesCompletos ? 'Mostrar menos' : 'Mostrar más detalles'}
          </button>
        </div>
      )}
    </div>
  );
}

export default EventoGuion;