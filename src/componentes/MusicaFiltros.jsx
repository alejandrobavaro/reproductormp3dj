// src/componentes/MusicaFiltros.jsx
import React from "react";
import "../assets/scss/_03-Componentes/_MusicaFiltros.scss";

function MusicaFiltros({ 
  bloques = {},                  
  bloqueActual = "todo",         
  setBloqueActual,               
  currentSong,                   
  setCurrentSong,                
  estadosEvento = {}             
}) {
  if (!bloques || Object.keys(bloques).length === 0) {
    return <div className="filters-container">Cargando bloques...</div>;
  }

  const handleSelectChange = (e) => {
    const nuevoBloque = e.target.value;
    setBloqueActual(nuevoBloque);
    
    if (currentSong && nuevoBloque !== "todo") {
      const cancionesBloque = bloques[nuevoBloque]?.canciones || [];
      const cancionExiste = cancionesBloque.some(c => c.id === currentSong.id);
      if (!cancionExiste) setCurrentSong(null);
    }
  };

  const bloquesOrdenados = Object.keys(bloques).sort((a, b) => {
    const numA = parseInt(a.split('-')[1]);
    const numB = parseInt(b.split('-')[1]);
    return numA - numB;
  });

  const formatearNombreBloque = (bloqueKey) => {
    const partes = bloqueKey.split('-');
    if (partes.length < 3) return bloqueKey;
    
    const numero = partes[1];
    const nombrePartes = partes.slice(2);
    const nombreFormateado = nombrePartes.map(palabra => 
      palabra.charAt(0).toUpperCase() + palabra.slice(1)
    ).join(' ');
    
    return `${numero}. ${nombreFormateado}`;
  };

  const getNombreBloqueActual = () => {
    if (bloqueActual === "todo") return "Todos los Bloques";
    const bloque = bloques[bloqueActual];
    return bloque ? formatearNombreBloque(bloqueActual) : "Bloque Desconocido";
  };

  const getNumeroCanciones = () => {
    if (bloqueActual === "todo") {
      return Object.values(bloques).reduce((total, bloque) => total + (bloque.canciones?.length || 0), 0);
    }
    return bloques[bloqueActual]?.canciones?.length || 0;
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <div className="bloque-actual-info">
          <h6>{getNombreBloqueActual()}</h6>
          <span className="canciones-count-badge">
            {getNumeroCanciones()} canción{getNumeroCanciones() !== 1 ? 'es' : ''}
          </span>
        </div>
      </div>
      
      <select 
        className="filters-select"
        value={bloqueActual}
        onChange={handleSelectChange}
        aria-label="Seleccionar bloque del evento"
      >
        <option value="todo">🎵 Todas las canciones del evento</option>
        
        {bloquesOrdenados.map((bloqueKey) => {
          const bloque = bloques[bloqueKey];
          if (!bloque) return null;
          
          const estado = estadosEvento[bloqueKey];
          const completado = estado === 'completado';
          const enProgreso = estado === 'en-progreso';
          const nombreFormateado = formatearNombreBloque(bloqueKey);
          
          return (
            <option 
              key={bloqueKey} 
              value={bloqueKey}
              className={completado ? 'completed-option' : enProgreso ? 'progress-option' : ''}
            >
              {nombreFormateado}
            </option>
          );
        })}
      </select>

      {bloqueActual !== "todo" && bloques[bloqueActual] && (
        <div className="bloque-detalle-info">
          <div className="bloque-meta">
            <span className="bloque-horario">{bloques[bloqueActual].bloque_musical}</span>
            <span className={`estado-badge ${estadosEvento[bloqueActual] || 'pendiente'}`}>
              {estadosEvento[bloqueActual] === 'completado' ? '✅ Completado' : 
               estadosEvento[bloqueActual] === 'en-progreso' ? '▶ En Progreso' : '⏳ Pendiente'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MusicaFiltros;