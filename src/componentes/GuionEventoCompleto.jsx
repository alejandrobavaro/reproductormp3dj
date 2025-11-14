// src/componentes/GuionEventoCompleto.jsx
import React, { useState, useEffect } from 'react';
import '../assets/scss/_03-Componentes/_GuionEventoCompleto.scss';

function GuionEventoCompleto({ 
  onBloqueChange, 
  bloqueActual, 
  guionEvento,
  onEstadoChange, 
  estadosEvento = {} 
}) {
  
  const [bloqueExpandido, setBloqueExpandido] = useState(null);
  const [mostrarPreBoda, setMostrarPreBoda] = useState(true);

  useEffect(() => {
    if (bloqueActual && guionEvento?.bloques) {
      const bloque = guionEvento.bloques.find(b => b.id === bloqueActual);
      setBloqueExpandido(bloque);
    }
  }, [bloqueActual, guionEvento]);
// ███ FUNCIONES MEJORADAS PARA EXPORTACIÓN - CONTRATO AL FINAL ███
const generarContenidoTXT = () => {
  if (!guionEvento) return '';
  
  let contenido = `🎉 ${guionEvento.evento?.toUpperCase() || 'GUION DEL EVENTO'}\n`;
  contenido += `📅 ${guionEvento.fecha || 'Fecha no disponible'} | ⏰ ${guionEvento.horario || 'Horario no disponible'}\n`;
  contenido += `📍 ${guionEvento.lugar || ''} | 📞 ${guionEvento.contacto || ''}\n`;
  contenido += `${'='.repeat(60)}\n\n`;

  // BLOQUES PRE-BODA
  const bloquesPreBoda = guionEvento.bloques?.filter(b => b.id.startsWith('bloque-0')) || [];
  if (bloquesPreBoda.length > 0) {
    contenido += `🕒 PRE-BODA - PREPARATIVOS:\n${'-'.repeat(40)}\n`;
    bloquesPreBoda.forEach((bloque, index) => {
      contenido += `\n${bloque.id.toUpperCase()} - ${bloque.nombre}\n`;
      contenido += `⏰ ${bloque.horaInicio}-${bloque.horaFin} | 📊 ${estadosEvento[bloque.id] || 'PENDIENTE'}\n`;
      
      if (bloque.actividades?.length > 0) {
        contenido += '📋 ACTIVIDADES:\n';
        bloque.actividades.forEach((act, i) => contenido += `   ${i + 1}. ${act}\n`);
      }
      if (bloque.detalles) contenido += `💡 ${bloque.detalles}\n`;
      if (bloque.responsable) contenido += `👤 Responsable: ${bloque.responsable}\n`;
      if (bloque.notasContrato) contenido += `📝 Nota: ${bloque.notasContrato}\n`;
    });
    contenido += `\n`;
  }

  // BLOQUES PRINCIPALES (CON EL HORARIO QUE VOS QUERÉS)
  const bloquesPrincipales = guionEvento.bloques?.filter(b => !b.id.startsWith('bloque-0')) || [];
  if (bloquesPrincipales.length > 0) {
    contenido += `🎊 BODA - EVENTO PRINCIPAL:\n${'-'.repeat(40)}\n`;
    bloquesPrincipales.forEach((bloque, index) => {
      contenido += `\n${bloque.id.toUpperCase()} - ${bloque.nombre}\n`;
      contenido += `⏰ ${bloque.horaInicio}-${bloque.horaFin} | 📊 ${estadosEvento[bloque.id] || 'PENDIENTE'}\n`;
      
      // MENÚ Y BEBIDAS
      if (bloque.menuPrincipal) contenido += `🍽️ Principal: ${bloque.menuPrincipal}\n`;
      if (bloque.menu?.length > 0) contenido += `🍴 Welcome: ${bloque.menu.slice(0, 3).join(', ')}${bloque.menu.length > 3 ? ` +${bloque.menu.length - 3} más` : ''}\n`;
      if (bloque.postreIncluido) contenido += `🍦 Postre: ${bloque.postreIncluido}\n`;
      if (bloque.bebidas?.length > 0) contenido += `🍹 Bebidas: ${bloque.bebidas.slice(0, 3).join(', ')}${bloque.bebidas.length > 3 ? ` +${bloque.bebidas.length - 3} más` : ''}\n`;
      
      if (bloque.actividades?.length > 0) {
        contenido += '📋 ACTIVIDADES:\n';
        bloque.actividades.forEach((act, i) => contenido += `   ${i + 1}. ${act}\n`);
      }
      if (bloque.detalles) contenido += `💡 ${bloque.detalles}\n`;
      if (bloque.responsable) contenido += `👤 Responsable: ${bloque.responsable}\n`;
      if (bloque.notasContrato) contenido += `📝 Nota contrato: ${bloque.notasContrato}\n`;
    });
  }

  // NOTAS IMPORTANTES DEL EVENTO
  if (guionEvento.notasImportantes?.length > 0) {
    contenido += `\n⚠️ NOTAS IMPORTANTES DEL EVENTO:\n${'-'.repeat(45)}\n`;
    guionEvento.notasImportantes.forEach((nota, index) => {
      contenido += `• ${nota}\n`;
    });
  }

  // RESUMEN FINAL DEL EVENTO
  const completados = Object.values(estadosEvento).filter(e => e === 'completado').length;
  const total = guionEvento.bloques?.length || 0;
  contenido += `\n${'='.repeat(60)}\n`;
  contenido += `📊 RESUMEN EVENTO: ${completados}/${total} bloques completados\n`;
  contenido += `🎯 Horario planeado: 14:00 a 04:15 (Evento completo)\n`;
  contenido += `📄 Guion generado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}\n`;

  // =========================================================================
  // SECCIÓN SEPARADA - INFORMACIÓN CONTRACTUAL Y NEGOCIACIONES
  // =========================================================================
  contenido += `\n\n${'█'.repeat(60)}\n`;
  contenido += `📋 INFORMACIÓN CONTRACTUAL Y PENDIENTES\n`;
  contenido += `${'█'.repeat(60)}\n\n`;

  // INFORMACIÓN ACTUAL DEL CONTRATO
  if (guionEvento.contrato) {
    contenido += `📄 CONTRATO ACTUAL (Casa del Mar):\n`;
    contenido += `   • Fecha contrato: ${guionEvento.contrato.fechaContrato || '05/04/2025'}\n`;
    contenido += `   • Personas contratadas: ${guionEvento.contrato.cantidadPersonas || ''}\n`;
    contenido += `   • Valor tarjeta: ${guionEvento.contrato.valorTarjeta || ''}\n`;
    contenido += `   • Seña abonada: ${guionEvento.contrato.seña || ''}\n`;
    contenido += `   • Menores 11 años: ${guionEvento.contrato.menores11 || ''}\n`;
    contenido += `   • Horario CONTRATADO: ${guionEvento.contrato.horarioContrato || '19:00 a 03:00'}\n`;
    contenido += `   • SADAIC: ${guionEvento.contrato.incluyeSadic ? 'Incluido' : 'NO INCLUIDO - Gestionar'}\n\n`;
  }

  // SERVICIOS INCLUIDOS ACTUALES
  if (guionEvento.serviciosIncluidos?.length > 0) {
    contenido += `✅ SERVICIOS INCLUÍDOS EN CONTRATO:\n`;
    guionEvento.serviciosIncluidos.forEach(servicio => {
      contenido += `   • ${servicio}\n`;
    });
    contenido += `\n`;
  }

  // =========================================================================
  // PENDIENTES Y NEGOCIACIONES
  // =========================================================================
  contenido += `🎯 PENDIENTES POR GESTIONAR:\n`;
  contenido += `${'-'.repeat(35)}\n`;
  
  // EXTENSIÓN DE HORARIO
  contenido += `\n🕒 EXTENSIÓN DE HORARIO (CRÍTICO):\n`;
  contenido += `   • ACTUAL: Hasta 03:00 am (contrato)\n`;
  contenido += `   • NECESARIO: Hasta 04:00 am + 15 min cortesía\n`;
  contenido += `   • ESTRATEGIA: Pedir como cortesía por ser boda\n`;
  contenido += `   • BACKUP: Presupuestar costo extra si no hay cortesía\n`;
  contenido += `   • CONTACTO: Hablar con [Nombre del contacto] en Casa del Mar\n\n`;

  // OTROS PENDIENTES
  contenido += `📝 OTROS PENDIENTES:\n`;
  contenido += `   • Confirmar SADAIC si no está incluido\n`;
  contenido += `   • Verificar capacidad real para 80 personas\n`;
  contenido += `   • Coordinar entrada temprana para preparativos (14:00)\n`;
  contenido += `   • Confirmar estacionamiento para invitados\n`;
  contenido += `   • Verificar protocolo para menores con alcohol\n\n`;

  // CHECKLIST FINAL
  contenido += `✅ CHECKLIST PRE-BODA:\n`;
  contenido += `   [ ] Confirmar extensión horario hasta 04:00 am\n`;
  contenido += `   [ ] Gestionar SADAIC si es necesario\n`;
  contenido += `   [ ] Confirmar número final de invitados (72h antes)\n`;
  contenido += `   [ ] Coordinar con todos los proveedores externos\n`;
  contenido += `   [ ] Verificar seguros y responsabilidades\n`;
  contenido += `   [ ] Confirmar menú especial para alergias/intolerancias\n`;

  // CONTACTOS IMPORTANTES
  contenido += `\n📞 CONTACTOS CLAVE:\n`;
  contenido += `   • Casa del Mar: ${guionEvento.contacto || '2235208386 / 2234545451'}\n`;
  contenido += `   • Coordinador: [Nombre y teléfono del coordinador]\n`;
  contenido += `   • Dj/Música: [Contacto DJ]\n`;
  contenido += `   • Fotógrafo: [Contacto fotógrafo]\n`;
  contenido += `   • Banda: [Contacto banda]\n`;

  contenido += `\n${'█'.repeat(60)}\n`;
  contenido += `💡 Recordatorio: Este guion refleja el evento IDEAL planeado.\n`;
  contenido += `   Los horarios extendidos y detalles adicionales están sujetos a confirmación.\n`;
  contenido += `${'█'.repeat(60)}\n`;

  return contenido;
};
    


  const descargarGuionTXT = () => {
    const contenido = generarContenidoTXT();
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Guion_Completo_${guionEvento.evento?.replace(/\s+/g, '_') || 'Evento'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copiarGuionPortapapeles = async () => {
    try {
      await navigator.clipboard.writeText(generarContenidoTXT());
      alert('✅ Guion completo copiado al portapapeles');
    } catch (err) {
      alert('❌ Error al copiar el guion');
    }
  };

  const toggleEstadoBloque = (bloqueId, e) => {
    e.stopPropagation();
    onEstadoChange?.(bloqueId, estadosEvento[bloqueId] === 'completado' ? 'pendiente' : 'completado');
  };

  // ███ FILTRAR BLOQUES POR TIPO ███
  const bloquesPreBoda = guionEvento?.bloques?.filter(b => b.id.startsWith('bloque-0')) || [];
  const bloquesBoda = guionEvento?.bloques?.filter(b => !b.id.startsWith('bloque-0')) || [];

  if (!guionEvento) {
    return (
      <div className="evento-guion-loading">
        <div className="loading-spinner"></div>
        <p>Cargando guión del evento...</p>
      </div>
    );
  }

  if (!guionEvento.bloques || guionEvento.bloques.length === 0) {
    return (
      <div className="evento-guion-empty">
        <p>⚠️ No hay bloques disponibles en el guión</p>
      </div>
    );
  }

  // ███ COMPONENTE PARA RENDERIZAR FILA DE BLOQUE ███
  const RenderFilaBloque = ({ bloque }) => (
    <div 
      key={bloque.id}
      className={`evento-guion-fila ${bloqueActual === bloque.id ? 'active' : ''} ${estadosEvento[bloque.id] || ''}`}
      onClick={() => onBloqueChange?.(bloque.id)}
    >
      <div className="evento-guion-col-hora">
        {bloque.horaInicio}-{bloque.horaFin}
      </div>
      
      <div className="evento-guion-col-bloque">
        <div className="evento-guion-bloque-nombre">
          <span className="evento-guion-bloque-id">{bloque.id}</span>
          {bloque.nombre}
        </div>
        {bloqueActual === bloque.id && <div className="evento-guion-bloque-indicator">▶</div>}
      </div>
      
      <div className="evento-guion-col-actividades">
        {bloque.actividades && (
          <ul>
            {bloque.actividades.slice(0, 2).map((act, i) => (
              <li key={i}>{act}</li>
            ))}
            {bloque.actividades.length > 2 && (
              <li className="evento-guion-mas-actividades">+{bloque.actividades.length - 2} más</li>
            )}
          </ul>
        )}
        {/* Mostrar info de menú/bebidas si existe */}
        {(bloque.menuPrincipal || bloque.bebidas) && (
          <div className="evento-guion-bloque-extra">
            {bloque.menuPrincipal && <span>🍽️</span>}
            {bloque.bebidas && <span>🍹</span>}
          </div>
        )}
      </div>
      
      <div className="evento-guion-col-estado">
        <label className="evento-guion-switch">
          <input 
            type="checkbox" 
            checked={estadosEvento[bloque.id] === 'completado'}
            onChange={(e) => toggleEstadoBloque(bloque.id, e)}
          />
          <span className="evento-guion-slider"></span>
        </label>
        <span className="evento-guion-estado-texto">
          {estadosEvento[bloque.id] === 'completado' ? '✓' : 
           estadosEvento[bloque.id] === 'en-progreso' ? '▶' : '⏳'}
        </span>
      </div>
    </div>
  );

  // ███ RENDERIZADO PRINCIPAL MEJORADO ███
  return (
    <div className="evento-guion-container">
      
      {/* CABECERA MEJORADA CON INFO COMPLETA */}
      <div className="evento-guion-header">
        <div className="evento-guion-header-info">
          <h3 className="evento-guion-title">
            {guionEvento.evento || 'Guion del Evento'}
            {guionEvento.contrato && (
              <span className="evento-guion-contrato-info">
                | {guionEvento.contrato.cantidadPersonas} | {guionEvento.contrato.horarioContrato}
              </span>
            )}
          </h3>
          <div className="evento-guion-meta">
            <span>{guionEvento.fecha || 'Fecha no disponible'}</span>
            <span>{guionEvento.lugar || 'Lugar no disponible'}</span>
            <span>{guionEvento.horario || 'Horario no disponible'}</span>
          </div>
        </div>
        
        <div className="evento-guion-export-buttons">
          <button className="export-btn" onClick={descargarGuionTXT} title="Descargar TXT completo">📥 TXT</button>
          <button className="export-btn" onClick={copiarGuionPortapapeles} title="Copiar guion completo">📋</button>
        </div>
      </div>

      {/* CONTROLES DE FILTRADO */}
      <div className="evento-guion-filtros">
        <button 
          className={`filtro-btn ${mostrarPreBoda ? 'active' : ''}`}
          onClick={() => setMostrarPreBoda(true)}
        >
          🕒 Pre-Boda ({bloquesPreBoda.length})
        </button>
        <button 
          className={`filtro-btn ${!mostrarPreBoda ? 'active' : ''}`}
          onClick={() => setMostrarPreBoda(false)}
        >
          🎊 Boda ({bloquesBoda.length})
        </button>
      </div>

      {/* TABLA MEJORADA */}
      <div className="evento-guion-tabla">
        <div className="evento-guion-tabla-header">
          <div>Hora</div>
          <div>Bloque</div>
          <div>Actividades + Detalles</div>
          <div>Estado</div>
        </div>

        <div className="evento-guion-tabla-body">
          {/* BLOQUES PRE-BODA */}
          {mostrarPreBoda && bloquesPreBoda.map(bloque => (
            <RenderFilaBloque key={bloque.id} bloque={bloque} />
          ))}
          
          {/* BLOQUES BODA */}
          {!mostrarPreBoda && bloquesBoda.map(bloque => (
            <RenderFilaBloque key={bloque.id} bloque={bloque} />
          ))}
        </div>
      </div>

      {/* DETALLE MEJORADO CON INFORMACIÓN COMPLETA */}
      {bloqueExpandido && (
        <div className="evento-guion-detalle">
          <div className="evento-guion-detalle-header">
            <h4>
              {bloqueExpandido.id} - {bloqueExpandido.nombre}
              <span className="evento-guion-detalle-hora">
                {bloqueExpandido.horaInicio} - {bloqueExpandido.horaFin}
              </span>
            </h4>
            <div className={`evento-guion-detalle-estado ${estadosEvento[bloqueExpandido.id] || 'pendiente'}`}>
              {estadosEvento[bloqueExpandido.id] === 'completado' ? '✅ COMPLETADO' : 
               estadosEvento[bloqueExpandido.id] === 'en-progreso' ? '▶ EN PROGRESO' : '⏳ PENDIENTE'}
            </div>
          </div>
          
          <div className="evento-guion-detalle-content">
            {/* INFORMACIÓN DE MENÚ Y BEBIDAS */}
            {(bloqueExpandido.menu || bloqueExpandido.menuPrincipal || bloqueExpandido.bebidas) && (
              <div className="evento-guion-detalle-menu">
                <h5>🍽️ Menú y Bebidas:</h5>
                {bloqueExpandido.menuPrincipal && (
                  <p><strong>Principal:</strong> {bloqueExpandido.menuPrincipal}</p>
                )}
                {bloqueExpandido.menu && (
                  <p><strong>Welcome:</strong> {bloqueExpandido.menu.join(', ')}</p>
                )}
                {bloqueExpandido.postreIncluido && (
                  <p><strong>Postre:</strong> {bloqueExpandido.postreIncluido}</p>
                )}
                {bloqueExpandido.bebidas && (
                  <p><strong>Bebidas:</strong> {bloqueExpandido.bebidas.join(', ')}</p>
                )}
              </div>
            )}

            {/* ACTIVIDADES */}
            {bloqueExpandido.actividades && (
              <div className="evento-guion-detalle-actividades">
                <h5>📋 Actividades:</h5>
                <ul>
                  {bloqueExpandido.actividades.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* DETALLES */}
            {bloqueExpandido.detalles && (
              <div className="evento-guion-detalle-extra">
                <h5>💡 Detalles:</h5>
                <p>{bloqueExpandido.detalles}</p>
              </div>
            )}

            {/* RESPONSABLE */}
            {bloqueExpandido.responsable && (
              <div className="evento-guion-detalle-responsable">
                <h5>👤 Responsable:</h5>
                <p>{bloqueExpandido.responsable}</p>
              </div>
            )}

            {/* NOTAS CONTRATO */}
            {bloqueExpandido.notasContrato && (
              <div className="evento-guion-detalle-notas">
                <h5>📝 Notas del Contrato:</h5>
                <p>{bloqueExpandido.notasContrato}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INFORMACIÓN GENERAL DEL CONTRATO */}
      <div className="evento-guion-info-contrato">
        <h5>📄 Información del Contrato:</h5>
        <div className="evento-guion-contrato-details">
          {guionEvento.contrato && (
            <>
              <span><strong>Personas:</strong> {guionEvento.contrato.cantidadPersonas}</span>
              <span><strong>Valor:</strong> {guionEvento.contrato.valorTarjeta}</span>
              <span><strong>Seña:</strong> {guionEvento.contrato.seña}</span>
              <span><strong>Horario:</strong> {guionEvento.contrato.horarioContrato}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default GuionEventoCompleto;