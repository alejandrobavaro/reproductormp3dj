import React from "react";
import "../assets/scss/_03-Componentes/_MusicaFiltros.scss";
/**
 * COMPONENTE: MusicaFiltros
 * 
 * Propósito:
 * - Mostrar y permitir seleccionar los bloques musicales del evento
 * - Filtrar las canciones según el bloque seleccionado
 * - Mostrar estado de completado de cada bloque
 * 
 * Comunicación:
 * - Recibe bloques musicales y estado actual desde Musica.jsx
 * - Notifica cambios de selección al componente padre (setBloqueActual)
 * - Maneja sincronización con la canción actual (setCurrentSong)
 */
function MusicaFiltros({ 
  bloques = {},                  // [Prop] Objeto con todos los bloques musicales
  bloqueActual = "bloque-1-recepcioninvitados", // [Prop] ID del bloque actual
  setBloqueActual,               // [Prop] Función para cambiar el bloque
  currentSong,                   // [Prop] Canción actual en reproducción
  setCurrentSong,                // [Prop] Función para cambiar canción
  estadosEvento = {}             // [Prop] Estados de completado de los bloques
}) {
  // ████████████████████████████████████████████
  // ███ 1. VALIDACIÓN INICIAL ███
  // ████████████████████████████████████████████
  if (!bloques || Object.keys(bloques).length === 0) {
    return <div className="filters-container">Cargando bloques...</div>;
  }

  // ████████████████████████████████████████████
  // ███ 2. MANEJADORES DE EVENTOS ███
  // ████████████████████████████████████████████
  
  /**
   * Maneja el cambio de selección en el dropdown
   * @param {Object} e - Evento del select
   */
  const handleSelectChange = (e) => {
    const nuevoBloque = e.target.value;
    setBloqueActual(nuevoBloque);
    
    // Si la canción actual no pertenece al nuevo bloque, la limpiamos
    if (currentSong) {
      const cancionesBloque = bloques[nuevoBloque]?.canciones || [];
      const cancionExiste = cancionesBloque.some(c => c.id === currentSong.id);
      if (!cancionExiste) {
        setCurrentSong(null);
      }
    }
  };

  // ████████████████████████████████████████████
  // ███ 3. PREPARACIÓN DE DATOS ███
  // ████████████████████████████████████████████
  
  // Ordena los bloques por su número (extraído del ID)
  const bloquesOrdenados = Object.keys(bloques).sort((a, b) => {
    const numA = parseInt(a.split('-')[1]);
    const numB = parseInt(b.split('-')[1]);
    return numA - numB;
  });

  // ████████████████████████████████████████████
  // ███ 4. RENDERIZADO ███
  // ████████████████████████████████████████████
  return (
    <div className="filters-container">
      {/* Título que muestra el bloque actual */}
      <h6>Bloque Actual: {bloqueActual.split('-')[1] || '1'}</h6>
      
      {/* Selector de bloques */}
      <select 
        className="filters-select"
        value={bloqueActual}
        onChange={handleSelectChange}
        aria-label="Seleccionar bloque del evento"
      >
        {bloquesOrdenados.map((bloqueKey) => {
          const bloque = bloques[bloqueKey];
          if (!bloque) return null;
          
          // Extrae información del ID del bloque (formato: bloque-N-hora-nombre)
          const [_, numBloque, hora, ...nombreParts] = bloqueKey.split('-');
          const nombreCorto = nombreParts.join(' ').trim();
          const estado = estadosEvento[bloqueKey];
          const completado = estado === 'completado';
          
          return (
            <option 
              key={bloqueKey} 
              value={bloqueKey}
              disabled={completado}
              className={completado ? 'completed-option' : ''}
            >
              {`${numBloque}. ${hora} - ${nombreCorto} ${completado ? '✓' : ''}`}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default MusicaFiltros;