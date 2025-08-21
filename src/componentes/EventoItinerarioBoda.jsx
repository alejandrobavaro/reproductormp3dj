// ████████████████████████████████████████████
// ███ IMPORTACIONES DE DEPENDENCIAS ███
// ████████████████████████████████████████████
import React, { useState, useEffect } from "react";
import "../assets/scss/_03-Componentes/_EventoItinerarioBoda.scss";

/**
 * COMPONENTE: EventoItinerarioBoda
 * 
 * Propósito: Muestra el itinerario completo del evento con capacidad de seleccionar bloques
 * 
 * Comunicación:
 * - Recibe props del componente padre (bloqueActual, onBloqueSeleccionado, guionEvento)
 * - Notifica al padre cuando se selecciona un nuevo bloque mediante onBloqueSeleccionado
 */
function EventoItinerarioBoda({ 
  bloqueActual,          // [Prop] ID del bloque actual seleccionado (viene del padre)
  onBloqueSeleccionado,  // [Prop] Función callback para notificar cambios al padre
  guionEvento            // [Prop] Datos completos del evento (viene del padre o se carga localmente)
}) {
  // ████████████████████████████████████████████
  // ███ 1. ESTADOS DEL COMPONENTE ███
  // ████████████████████████████████████████████
  
  // [Estado] Controla qué bloque está expandido para mostrar detalles
  const [bloqueExpandido, setBloqueExpandido] = useState(null);
  
  // [Estado] Almacena todos los bloques del evento (se carga desde JSON o props)
  const [bloquesEvento, setBloquesEvento] = useState([]);

  // █████████████████████████████████████████████████████████████████████
  // ███ 2. EFECTOS SECUNDARIOS (side effects) ███
  // █████████████████████████████████████████████████████████████████████

  // [Efecto 1] Carga inicial de datos - Se ejecuta solo al montar el componente
  useEffect(() => {
    const cargarGuionEvento = async () => {
      try {
        // Si no recibimos datos por props, los cargamos desde el JSON
        if (!guionEvento) {
          const response = await fetch('/guionBoda.json');
          if (!response.ok) throw new Error('Error al cargar el guión');
          const data = await response.json();
          setBloquesEvento(data.bloques);
        } else {
          // Si recibimos datos por props, los usamos directamente
          setBloquesEvento(guionEvento.bloques);
        }
      } catch (err) {
        console.error("Error cargando guión:", err);
      }
    };

    cargarGuionEvento();
  }, [guionEvento]); // Dependencia: si cambian los props de guionEvento

  // [Efecto 2] Sincroniza el bloque expandido cuando cambia la selección
  useEffect(() => {
    if (bloqueActual && bloquesEvento.length > 0) {
      const bloque = bloquesEvento.find(b => b.id === bloqueActual);
      setBloqueExpandido(bloque); // Actualiza el bloque expandido
    }
  }, [bloqueActual, bloquesEvento]); // Se ejecuta cuando cambian estas dependencias

  // █████████████████████████████████████████████████████████████████████
  // ███ 3. FUNCIONES AUXILIARES (handlers) ███
  // █████████████████████████████████████████████████████████████████████

  /**
   * Maneja el click en un bloque del itinerario
   * @param {string} bloqueId - ID del bloque seleccionado
   * Comunica al componente padre y actualiza el estado local
   */
  const handleClickBloque = (bloqueId) => {
    onBloqueSeleccionado(bloqueId); // Notifica al padre
    const bloque = bloquesEvento.find(b => b.id === bloqueId);
    setBloqueExpandido(bloque); // Actualiza estado local
  };

  /**
   * Formatea las horas para mostrar (elimina 'hs' del string)
   * @param {string} hora - Hora en formato "XXhs"
   * @return {string} Hora formateada
   */
  const formatHora = (hora) => {
    return hora.replace('hs', ''); // Ejemplo: "18hs" → "18"
  };

  // █████████████████████████████████████████████████████████████████████
  // ███ 4. RENDERIZADO PRINCIPAL ███
  // █████████████████████████████████████████████████████████████████████
  return (
    <div className="itinerario-container">
      {/* SECCIÓN 4.1 - LISTA DE BLOQUES DEL EVENTO */}
      <div className="timeline-bloques">
        <h3 className="timeline-title">Guión del Evento</h3>
        
        {/* Mapea todos los bloques del evento a elementos visuales */}
        {bloquesEvento.map((bloque) => (
          <div 
            key={bloque.id} // Key única requerida por React
            className={`bloque-item ${bloqueActual === bloque.id ? 'active' : ''}`} // Clase condicional
            onClick={() => handleClickBloque(bloque.id)} // Handler de click
          >
            {/* Muestra el rango horario del bloque */}
            <div className="bloque-hora">
              {formatHora(bloque.horaInicio)} - {formatHora(bloque.horaFin)}
            </div>
            {/* Muestra el nombre del bloque */}
            <div className="bloque-nombre">{bloque.nombre}</div>
          </div>
        ))}
      </div>

      {/* SECCIÓN 4.2 - DETALLE DEL BLOQUE SELECCIONADO (render condicional) */}
      {bloqueExpandido && (
        <div className="bloque-detalle">
          {/* Cabecera con nombre y horario del bloque */}
          <h4 className="detalle-title">
            {bloqueExpandido.nombre} ({formatHora(bloqueExpandido.horaInicio)} - {formatHora(bloqueExpandido.horaFin)})
          </h4>
          
          {/* Lista de actividades del bloque */}
          <ul className="actividades-list">
            {bloqueExpandido.actividades.map((actividad, index) => (
              <li key={index} className="actividad-item">
                <span className="actividad-icon">•</span>
                {actividad}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EventoItinerarioBoda;