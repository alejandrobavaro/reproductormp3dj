// src/componentes/GuionManager.jsx - VERSIÓN MEJORADA
import React, { useState, useEffect } from 'react';
import '../assets/scss/_03-Componentes/_GuionManager.scss';

function GuionManager({ guionActivo, estaDentroDeReproductor = true }) {
  
  const [guionData, setGuionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);

  // CONFIGURACIÓN ACTUALIZADA
  const archivosGuiones = {
    dj: "/dataGuiones/guionDj.json",
    animador: "/dataGuiones/guionAnimador.json", 
    novios: "/dataGuiones/guionNovios.json",
    gastronomico: "/dataGuiones/guionGastronomico.json",
    decoracion: "/dataGuiones/guionDecoracion.json",
    fotografos: "/dataGuiones/guionFotografos.json",
    videoman: "/dataGuiones/guionVideoman.json",
    salon: "/dataGuiones/guionSalon.json"
  };

  useEffect(() => {
    const cargarGuion = async () => {
      if (!guionActivo || guionActivo === "completo") return;
      
      try {
        setLoading(true);
        const response = await fetch(archivosGuiones[guionActivo]);
        const data = await response.json();
        setGuionData(data);
        setBloqueSeleccionado(data.bloques?.[0] || null);
      } catch (err) {
        console.error("Error cargando guión:", err);
      } finally {
        setLoading(false);
      }
    };
    
    cargarGuion();
  }, [guionActivo]);

  // ███ FUNCIÓN DE EXPORTACIÓN MEJORADA - USA TODA LA INFORMACIÓN ███
  const generarContenidoTXT = () => {
    if (!guionData) return '';
    
    let contenido = `🎉 ${guionData.rol?.toUpperCase() || 'GUION ESPECIALIZADO'}\n`;
    contenido += `📋 ${guionData.evento}\n`;
    contenido += `📅 ${guionData.fecha} | ⏰ ${guionData.horario}\n`;
    if (guionData.lugar) contenido += `📍 ${guionData.lugar}\n`;
    if (guionData.responsable) contenido += `👤 ${guionData.responsable}\n`;
    if (guionData.contacto) contenido += `📞 ${guionData.contacto}\n`;
    if (guionData.objetivo) contenido += `🎯 ${guionData.objetivo}\n`;
    contenido += `${'='.repeat(60)}\n\n`;
    
    // INFORMACIÓN GENERAL SI EXISTE
    if (guionData.serviciosIncluidos?.length > 0) {
      contenido += `✅ SERVICIOS INCLUÍDOS:\n`;
      guionData.serviciosIncluidos.forEach(servicio => {
        contenido += `  • ${servicio}\n`;
      });
      contenido += `\n`;
    }

    if (guionData.equipamientoRequerido?.length > 0) {
      contenido += `🎒 EQUIPAMIENTO REQUERIDO:\n`;
      guionData.equipamientoRequerido.forEach(equipo => {
        contenido += `  • ${equipo}\n`;
      });
      contenido += `\n`;
    }

    // BLOQUES PRINCIPALES
    if (guionData.bloques?.length > 0) {
      contenido += `📋 BLOQUES PRINCIPALES:\n${'-'.repeat(40)}\n`;
      
      guionData.bloques.forEach((bloque, index) => {
        contenido += `\n${bloque.id?.toUpperCase() || `BLOQUE ${index + 1}`} - ${bloque.nombre}\n`;
        contenido += `⏰ ${bloque.horaInicio}-${bloque.horaFin}\n`;
        
        // INFORMACIÓN ESPECÍFICA POR TIPO DE GUION
        if (guionActivo === 'dj') {
          if (bloque.estilo_musical) contenido += `🎵 Estilo: ${bloque.estilo_musical}\n`;
          if (bloque.volumen) contenido += `🔊 Volumen: ${bloque.volumen}\n`;
          if (bloque.canciones_especificas?.length) {
            contenido += '🎶 Canciones específicas:\n';
            bloque.canciones_especificas.forEach(c => contenido += `  • ${c}\n`);
          }
          if (bloque.canciones_sugeridas?.length) {
            contenido += '💡 Canciones sugeridas:\n';
            bloque.canciones_sugeridas.forEach(c => contenido += `  • ${c}\n`);
          }
          if (bloque.coordinacion) contenido += `🤝 ${bloque.coordinacion}\n`;
        }
        else if (guionActivo === 'animador') {
          if (bloque.anuncios?.length) {
            contenido += '📢 Anuncios:\n';
            bloque.anuncios.forEach(a => contenido += `  • ${a}\n`);
          }
          if (bloque.acciones) contenido += `✅ Acciones: ${bloque.acciones}\n`;
        }
        else if (guionActivo === 'fotografos' || guionActivo === 'videoman') {
          if (bloque.momentos_clave?.length) {
            contenido += '📸 Momentos clave:\n';
            bloque.momentos_clave.forEach(m => contenido += `  • ${m}\n`);
          }
          if (bloque.plan_grabacion?.length) {
            contenido += '🎥 Plan grabación:\n';
            bloque.plan_grabacion.forEach(p => contenido += `  • ${p}\n`);
          }
          if (bloque.equipamiento) contenido += `🎒 Equipamiento: ${bloque.equipamiento}\n`;
          if (bloque.posiciones) contenido += `📐 Posiciones: ${bloque.posiciones}\n`;
        }
        else if (guionActivo === 'gastronomico') {
          if (bloque.menu?.length) {
            contenido += '🍽️ Menú:\n';
            bloque.menu.forEach(m => contenido += `  • ${m}\n`);
          }
          if (bloque.menuPrincipal) contenido += `🍴 Principal: ${bloque.menuPrincipal}\n`;
          if (bloque.bebidas?.length) {
            contenido += '🍹 Bebidas:\n';
            bloque.bebidas.forEach(b => contenido += `  • ${b}\n`);
          }
          if (bloque.personal_requerido) contenido += `👥 Personal: ${bloque.personal_requerido}\n`;
        }
        else if (guionActivo === 'decoracion') {
          if (bloque.areas_trabajo?.length) {
            contenido += '🎨 Áreas trabajo:\n';
            bloque.areas_trabajo.forEach(a => contenido += `  • ${a}\n`);
          }
          if (bloque.preparacion?.length) {
            contenido += '🛠️ Preparación:\n';
            bloque.preparacion.forEach(p => contenido += `  • ${p}\n`);
          }
        }
        else if (guionActivo === 'novios') {
          if (bloque.tareas_ambos?.length) {
            contenido += '💑 Tareas ambos:\n';
            bloque.tareas_ambos.forEach(t => contenido += `  • ${t}\n`);
          }
          if (bloque.tareas_alejandro?.length) {
            contenido += '👨‍💼 Alejandro:\n';
            bloque.tareas_alejandro.forEach(t => contenido += `  • ${t}\n`);
          }
          if (bloque.tareas_fabiola?.length) {
            contenido += '👰‍♀️ Fabiola:\n';
            bloque.tareas_fabiola.forEach(t => contenido += `  • ${t}\n`);
          }
        }
        else if (guionActivo === 'salon') {
          if (bloque.areas_operativas?.length) {
            contenido += '🏨 Áreas operativas:\n';
            bloque.areas_operativas.forEach(a => contenido += `  • ${a}\n`);
          }
          if (bloque.tareas?.length) {
            contenido += '📋 Tareas:\n';
            bloque.tareas.forEach(t => contenido += `  • ${t}\n`);
          }
        }

        // INFORMACIÓN GENERAL DE BLOQUE
        if (bloque.detalles) contenido += `💡 ${bloque.detalles}\n`;
        if (bloque.notas) contenido += `📝 ${bloque.notas}\n`;
        if (bloque.notas_tecnicas) contenido += `🔧 ${bloque.notas_tecnicas}\n`;
        if (bloque.verificaciones) contenido += `✅ ${bloque.verificaciones}\n`;
        if (bloque.coordinacion) contenido += `🤝 ${bloque.coordinacion}\n`;
        if (bloque.recordatorios) contenido += `💭 ${bloque.recordatorios}\n`;
        
        contenido += `${'-'.repeat(35)}\n`;
      });
    }

    // INFORMACIÓN ADICIONAL ESPECÍFICA
    if (guionData.momentosClave) {
      contenido += `\n🎯 MOMENTOS CLAVE:\n${'-'.repeat(25)}\n`;
      Object.entries(guionData.momentosClave).forEach(([tipo, momentos]) => {
        contenido += `\n${tipo.toUpperCase()}:\n`;
        momentos.forEach(momento => contenido += `  • ${momento}\n`);
      });
    }

    if (guionData.coordinacionCon?.length > 0) {
      contenido += `\n🤝 COORDINACIÓN CON:\n`;
      guionData.coordinacionCon.forEach(coordinacion => {
        contenido += `  • ${coordinacion}\n`;
      });
    }

    if (guionData.notasEspecificas?.length > 0) {
      contenido += `\n📝 NOTAS ESPECÍFICAS:\n`;
      guionData.notasEspecificas.forEach(nota => {
        contenido += `  • ${nota}\n`;
      });
    }

    if (guionData.entregables?.length > 0) {
      contenido += `\n📦 ENTREGABLES:\n`;
      guionData.entregables.forEach(entregable => {
        contenido += `  • ${entregable}\n`;
      });
    }

    // PIE DE PÁGINA
    const totalBloques = guionData.bloques?.length || 0;
    contenido += `\n${'='.repeat(60)}\n`;
    contenido += `📊 RESUMEN: ${totalBloques} bloques | ${guionData.rol}\n`;
    contenido += `📄 Generado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}\n`;
    
    return contenido;
  };

  const descargarGuionTXT = () => {
    if (!guionData) return;
    const contenido = generarContenidoTXT();
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Guion_${guionActivo}_${guionData.evento?.replace(/\s+/g, '_') || 'Evento'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ███ COMPONENTE PARA RENDERIZAR DETALLES ESPECÍFICOS ███
  const RenderDetallesEspecificos = ({ bloque }) => {
    switch (guionActivo) {
      case 'dj':
        return (
          <>
            {bloque.estilo_musical && (
              <div className="detalle-seccion">
                <h5>🎵 Estilo Musical</h5>
                <p>{bloque.estilo_musical}</p>
                {bloque.volumen && <p><strong>Volumen:</strong> {bloque.volumen}</p>}
              </div>
            )}
            {bloque.canciones_especificas?.length > 0 && (
              <div className="detalle-seccion">
                <h5>🎶 Canciones Específicas</h5>
                <ul>
                  {bloque.canciones_especificas.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
            {bloque.canciones_sugeridas?.length > 0 && (
              <div className="detalle-seccion">
                <h5>💡 Canciones Sugeridas</h5>
                <ul>
                  {bloque.canciones_sugeridas.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
            {bloque.coordinacion && (
              <div className="detalle-seccion">
                <h5>🤝 Coordinación</h5>
                <p>{bloque.coordinacion}</p>
              </div>
            )}
          </>
        );

      case 'animador':
        return (
          <>
            {bloque.anuncios?.length > 0 && (
              <div className="detalle-seccion">
                <h5>📢 Anuncios</h5>
                <ul>
                  {bloque.anuncios.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
            {bloque.acciones && (
              <div className="detalle-seccion">
                <h5>✅ Acciones</h5>
                <p>{bloque.acciones}</p>
              </div>
            )}
          </>
        );

      case 'fotografos':
      case 'videoman':
        return (
          <>
            {bloque.momentos_clave?.length > 0 && (
              <div className="detalle-seccion">
                <h5>📸 Momentos Clave</h5>
                <ul>
                  {bloque.momentos_clave.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
            {bloque.plan_grabacion?.length > 0 && (
              <div className="detalle-seccion">
                <h5>🎥 Plan de Grabación</h5>
                <ul>
                  {bloque.plan_grabacion.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
            {bloque.equipamiento && (
              <div className="detalle-seccion">
                <h5>🎒 Equipamiento</h5>
                <p>{bloque.equipamiento}</p>
              </div>
            )}
            {bloque.posiciones && (
              <div className="detalle-seccion">
                <h5>📐 Posiciones</h5>
                <p>{bloque.posiciones}</p>
              </div>
            )}
          </>
        );

      case 'gastronomico':
        return (
          <>
            {bloque.menuPrincipal && (
              <div className="detalle-seccion">
                <h5>🍴 Plato Principal</h5>
                <p>{bloque.menuPrincipal}</p>
              </div>
            )}
            {bloque.menu?.length > 0 && (
              <div className="detalle-seccion">
                <h5>🍽️ Menú</h5>
                <ul>
                  {bloque.menu.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
            {bloque.bebidas?.length > 0 && (
              <div className="detalle-seccion">
                <h5>🍹 Bebidas</h5>
                <ul>
                  {bloque.bebidas.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
            {bloque.personal_requerido && (
              <div className="detalle-seccion">
                <h5>👥 Personal Requerido</h5>
                <p>{bloque.personal_requerido}</p>
              </div>
            )}
          </>
        );

      case 'decoracion':
        return (
          <>
            {bloque.areas_trabajo?.length > 0 && (
              <div className="detalle-seccion">
                <h5>🎨 Áreas de Trabajo</h5>
                <ul>
                  {bloque.areas_trabajo.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
            {bloque.preparacion?.length > 0 && (
              <div className="detalle-seccion">
                <h5>🛠️ Preparación</h5>
                <ul>
                  {bloque.preparacion.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        );

      case 'novios':
        return (
          <>
            {bloque.tareas_ambos?.length > 0 && (
              <div className="detalle-seccion">
                <h5>💑 Tareas para Ambos</h5>
                <ul>
                  {bloque.tareas_ambos.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
            {bloque.tareas_alejandro?.length > 0 && (
              <div className="detalle-seccion">
                <h5>👨‍💼 Tareas de Alejandro</h5>
                <ul>
                  {bloque.tareas_alejandro.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
            {bloque.tareas_fabiola?.length > 0 && (
              <div className="detalle-seccion">
                <h5>👰‍♀️ Tareas de Fabiola</h5>
                <ul>
                  {bloque.tareas_fabiola.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        );

      case 'salon':
        return (
          <>
            {bloque.areas_operativas?.length > 0 && (
              <div className="detalle-seccion">
                <h5>🏨 Áreas Operativas</h5>
                <ul>
                  {bloque.areas_operativas.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
            {bloque.tareas?.length > 0 && (
              <div className="detalle-seccion">
                <h5>📋 Tareas</h5>
                <ul>
                  {bloque.tareas.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  // ███ RENDERIZADO CONDICIONAL ███
  if (loading) {
    return (
      <div className="guion-manager-loading">
        <div className="loading-spinner"></div>
        <p>Cargando {guionActivo}...</p>
      </div>
    );
  }

  if (!guionData) {
    return (
      <div className="guion-manager-empty">
        <p>Selecciona un guión especializado</p>
        <small>DJ, Animador, Fotógrafos, Novios, etc.</small>
      </div>
    );
  }

  // ███ RENDERIZADO PRINCIPAL MEJORADO ███
  return (
    <div className={`guion-manager-container ${estaDentroDeReproductor ? 'inside-player' : 'full-view'}`}>
      
      {/* CABECERA MEJORADA */}
      <div className="guion-manager-header">
        <div className="guion-header-info">
          <h3 className="guion-titulo">
            {guionData.evento}
            {guionData.rol && <span className="guion-rol"> - {guionData.rol}</span>}
          </h3>
          <div className="guion-meta-info">
            <span>{guionData.fecha}</span>
            <span>{guionData.horario}</span>
            {guionData.lugar && <span>{guionData.lugar}</span>}
            {guionData.responsable && <span>{guionData.responsable}</span>}
          </div>
          {guionData.objetivo && (
            <div className="guion-objetivo">
              <strong>Objetivo:</strong> {guionData.objetivo}
            </div>
          )}
        </div>
        
        <div className="guion-export-buttons">
          <button className="export-btn" onClick={descargarGuionTXT} title="Descargar TXT completo">
            📥 TXT
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="guion-manager-content">
        
        {/* LISTA DE BLOQUES */}
        {guionData.bloques && (
          <div className="guion-lista-bloques">
            <h4 className="guion-lista-titulo">
              Bloques ({guionData.bloques.length})
              {guionData.coordinacionCon && (
                <span className="guion-coordinacion">
                  🤝 {guionData.coordinacionCon.join(', ')}
                </span>
              )}
            </h4>
            <div className="guion-bloques-container">
              {guionData.bloques.map((bloque, index) => (
                <div
                  key={bloque.id || index}
                  className={`guion-bloque-item ${bloqueSeleccionado === bloque ? 'active' : ''}`}
                  onClick={() => setBloqueSeleccionado(bloque)}
                >
                  <div className="bloque-hora">{bloque.horaInicio}-{bloque.horaFin}</div>
                  <div className="bloque-nombre">
                    {bloque.id && <span className="bloque-id">{bloque.id}</span>}
                    {bloque.nombre}
                  </div>
                  {bloqueSeleccionado === bloque && <div className="bloque-indicator">▶</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DETALLE DEL BLOQUE SELECCIONADO */}
        <div className="guion-detalle-bloque">
          {bloqueSeleccionado ? (
            <div className="detalle-content">
              <div className="detalle-header">
                <h4>
                  {bloqueSeleccionado.id && `${bloqueSeleccionado.id} - `}
                  {bloqueSeleccionado.nombre}
                </h4>
                <div className="detalle-horario">
                  {bloqueSeleccionado.horaInicio} - {bloqueSeleccionado.horaFin}
                </div>
              </div>

              <div className="detalle-secciones">
                {/* DETALLES ESPECÍFICOS POR TIPO DE GUION */}
                <RenderDetallesEspecificos bloque={bloqueSeleccionado} />

                {/* INFORMACIÓN GENERAL DEL BLOQUE */}
                {bloqueSeleccionado.detalles && (
                  <div className="detalle-seccion">
                    <h5>💡 Detalles</h5>
                    <p>{bloqueSeleccionado.detalles}</p>
                  </div>
                )}

                {bloqueSeleccionado.notas && (
                  <div className="detalle-seccion">
                    <h5>📝 Notas</h5>
                    <p>{bloqueSeleccionado.notas}</p>
                  </div>
                )}

                {bloqueSeleccionado.notas_tecnicas && (
                  <div className="detalle-seccion">
                    <h5>🔧 Notas Técnicas</h5>
                    <p>{bloqueSeleccionado.notas_tecnicas}</p>
                  </div>
                )}

                {bloqueSeleccionado.verificaciones && (
                  <div className="detalle-seccion">
                    <h5>✅ Verificaciones</h5>
                    <p>{bloqueSeleccionado.verificaciones}</p>
                  </div>
                )}

                {bloqueSeleccionado.coordinacion && (
                  <div className="detalle-seccion">
                    <h5>🤝 Coordinación</h5>
                    <p>{bloqueSeleccionado.coordinacion}</p>
                  </div>
                )}

                {bloqueSeleccionado.recordatorios && (
                  <div className="detalle-seccion">
                    <h5>💭 Recordatorios</h5>
                    <p>{bloqueSeleccionado.recordatorios}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="detalle-vacio">
              <p>Selecciona un bloque para ver los detalles</p>
              <small>La información se muestra según el tipo de guión seleccionado</small>
            </div>
          )}
        </div>
      </div>

      {/* INFORMACIÓN ADICIONAL GLOBAL */}
      {(guionData.notasEspecificas?.length > 0 || guionData.equipamientoRequerido?.length > 0) && (
        <div className="guion-info-adicional">
          {guionData.notasEspecificas?.length > 0 && (
            <div className="info-seccion">
              <h5>📝 Notas Específicas</h5>
              <ul>
                {guionData.notasEspecificas.map((nota, i) => (
                  <li key={i}>{nota}</li>
                ))}
              </ul>
            </div>
          )}
          {guionData.equipamientoRequerido?.length > 0 && (
            <div className="info-seccion">
              <h5>🎒 Equipamiento Requerido</h5>
              <ul>
                {guionData.equipamientoRequerido.map((equipo, i) => (
                  <li key={i}>{equipo}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GuionManager;