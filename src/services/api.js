/**
 * Servicio de API para Alcance Legal
 * 
 * Maneja las comunicaciones con Supabase Edge Functions y n8n webhooks.
 * Usa Edge Function para análisis con RAG vectorial.
 */

// Configuración de Supabase Edge Functions
const SUPABASE_CONFIG = {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    functionsUrl: import.meta.env.VITE_SUPABASE_URL ?
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1` : null
}

// Configuración de endpoints n8n (legacy/fallback)
const N8N_CONFIG = {
    baseUrl: import.meta.env.VITE_N8N_BASE_URL || 'http://localhost:5678/webhook',
    endpoints: {
        analizar: '/analizar-caso',
        auditar: '/auditar-estrategia',
        redactar: '/redactar-escrito'
    },
    // Flag para usar mocks durante desarrollo
    useMocks: import.meta.env.VITE_USE_MOCKS !== 'false'
}

/**
 * Datos mockeados para desarrollo
 */
const MOCK_RESPONSES = {
    analizar: {
        numero_informe: `ALC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
        fecha_emision: new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }),
        estado: 'INFORME PRELIMINAR',
        estado_detalle: 'Pendiente de validación por el profesional actuante',
        viabilidad: {
            valor: 75,
            clasificacion: 'MEDIA-ALTA',
            explicacion: 'La pretensión presenta fundamentos jurídicos sustentables, aunque existen factores de riesgo que requieren atención estratégica antes de iniciar la acción.',
            advertencia_metodologica: 'Esta evaluación se basa exclusivamente en la información proporcionada. Factores no declarados pueden alterar sustancialmente el pronóstico.'
        },
        sintesis: `La pretensión del cliente presenta fundamentos jurídicos sólidos basados en el incumplimiento contractual documentado. La existencia de contrato escrito y la correspondencia que acredita el reclamo previo fortalecen significativamente la posición del actor.

Sin embargo, se identifican aspectos críticos que requieren atención inmediata antes de proceder con la demanda judicial, particularmente en lo relativo a la cuantificación del daño y la acreditación de la relación causal.`,
        fundamentos: [
            {
                tipo: 'jurisprudencia',
                fuente: 'CNCiv, Sala A, 15/03/2023 - "López c/ Gómez"',
                extracto: '"El incumplimiento parcial de las obligaciones contractuales no libera al deudor de responder por los daños derivados..."',
                relevancia: 'Aplicable al caso en análisis por tratarse de incumplimiento contractual con pretensión resarcitoria.'
            },
            {
                tipo: 'metodologia',
                fuente: 'Metodología de Análisis de Contratos Bilaterales',
                extracto: 'Aplicación del esquema de análisis según criterio metodológico adoptado por el sistema.',
                relevancia: 'Marco conceptual para la evaluación de las obligaciones recíprocas y sus consecuencias.'
            }
        ],
        riesgos: [
            {
                nivel: 'alto',
                codigo: 'R-001',
                descripcion: 'Prescripción cercana',
                detalle: 'El plazo de prescripción de la acción vence en aproximadamente 6 meses desde la fecha de este informe.',
                consecuencia: 'La inacción resultaría en la pérdida definitiva del derecho a reclamar judicialmente.',
                mitigacion: 'Interponer demanda judicial antes de la fecha límite o gestionar reconocimiento de deuda que interrumpa el curso de la prescripción.',
                urgencia: true
            },
            {
                nivel: 'medio',
                codigo: 'R-002',
                descripcion: 'Prueba documental incompleta',
                detalle: 'No se ha referido documentación que acredite los pagos parciales mencionados en el relato fáctico.',
                consecuencia: 'Dificultad para acreditar el monto exacto del reclamo en sede judicial.',
                mitigacion: 'Solicitar exhibición de documentos a la contraparte o producir prueba informativa a entidades bancarias.',
                urgencia: false
            }
        ],
        advertencias: {
            principal: 'Este informe NO constituye consejo legal definitivo. Es un insumo técnico que debe ser validado por el profesional actuante antes de tomar decisiones procesales.',
            items: [
                'La evaluación de viabilidad es probabilística, no determinante del resultado judicial.',
                'Verificar vigencia de jurisprudencia citada antes de su utilización en escritos.',
                'Los datos proporcionados por el usuario determinan el alcance y precisión del análisis.',
                'Factores procesales locales pueden afectar la estrategia recomendada.'
            ]
        }
    },

    auditar: {
        numero_informe: `ALC-AUD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
        fecha_emision: new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }),
        estado: 'DICTAMEN DE AUDITORÍA',
        estado_detalle: 'Requiere revisión de los puntos señalados',
        consistencia: {
            valor: 'PARCIAL',
            explicacion: 'La estrategia presenta líneas argumentales sólidas pero contiene supuestos implícitos no validados e inconsistencias que podrían afectar su efectividad.',
            advertencia: 'Se recomienda revisar los puntos señalados antes de avanzar con la ejecución de la estrategia.'
        },
        observaciones: [
            {
                tipo: 'supuesto_implicito',
                codigo: 'OBS-001',
                descripcion: 'Se asume que la contraparte no cuestionará la validez del contrato.',
                impacto: 'Si la validez del instrumento es cuestionada, la estrategia probatoria actual resultaría insuficiente para sostener la pretensión.',
                severidad: 'media'
            },
            {
                tipo: 'inconsistencia',
                codigo: 'OBS-002',
                descripcion: 'El objetivo de obtener daños punitivos contradice la etapa procesal declarada.',
                impacto: 'Los daños punitivos requieren fundamentación diferenciada (art. 52 bis LDC) no contemplada en la estrategia propuesta.',
                severidad: 'alta'
            }
        ],
        recomendaciones: [
            {
                prioridad: 'alta',
                accion: 'Incorporar línea argumental subsidiaria para el supuesto de cuestionamiento de validez contractual.'
            },
            {
                prioridad: 'alta',
                accion: 'Reformular pretensión de daños punitivos o desarrollar fundamentación normativa específica.'
            },
            {
                prioridad: 'media',
                accion: 'Considerar prueba pericial contable para acreditar cuantificación del daño con mayor precisión.'
            }
        ],
        advertencias: {
            principal: 'La auditoría detecta patrones potencialmente problemáticos. La decisión final sobre la estrategia corresponde al profesional actuante.',
            items: [
                'Este dictamen evalúa consistencia lógica, no garantiza resultados procesales.',
                'Supuestos no declarados pueden contener riesgos adicionales no identificados.',
                'La validación final de la estrategia requiere conocimiento del contexto judicial específico.'
            ]
        }
    },

    redactar: {
        numero_informe: `ALC-RED-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
        fecha_emision: new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }),
        estado: 'BORRADOR ASISTIDO',
        estado_detalle: 'Documento de trabajo - NO PRESENTAR sin revisión profesional',
        tipo_escrito: 'Demanda por Incumplimiento Contractual',
        contenido: `PROMUEVE DEMANDA POR INCUMPLIMIENTO CONTRACTUAL

Sr. Juez:

[Nombre del letrado], abogado, T° [...] F° [...] del C.P.A.C.F., constituyendo domicilio electrónico en [...] y domicilio procesal en [...], en representación de [NOMBRE DEL ACTOR], según poder que se adjunta, a V.S. respetuosamente digo:

I. OBJETO
Que vengo a promover formal demanda por incumplimiento contractual contra [NOMBRE DEL DEMANDADO], con domicilio en [...], por la suma de PESOS [MONTO] ($[...]) o lo que en más o en menos resulte de la prueba a producirse, con más sus intereses y costas.

II. HECHOS
[SECCIÓN PENDIENTE - Requiere desarrollo según cronología del caso]

III. DERECHO
[SECCIÓN PENDIENTE - Ajustar fundamentación a jurisdicción específica]

...`,
        secciones_pendientes: [
            {
                seccion: 'II. HECHOS',
                motivo: 'Requiere desarrollo detallado según cronología específica del caso',
                criticidad: 'alta'
            },
            {
                seccion: 'III. DERECHO',
                motivo: 'Ajustar citas normativas a la jurisdicción y fuero correspondiente',
                criticidad: 'alta'
            },
            {
                seccion: 'V. PRUEBA',
                motivo: 'Completar ofrecimiento según documentación efectivamente disponible',
                criticidad: 'media'
            },
            {
                seccion: 'PETITORIO',
                motivo: 'Verificar monto reclamado y accesorios solicitados',
                criticidad: 'alta'
            }
        ],
        advertencias: {
            principal: 'ADVERTENCIA CRÍTICA: Este documento es un BORRADOR DE TRABAJO generado por asistencia automatizada. Su presentación judicial sin revisión profesional completa constituye ejercicio inadecuado de la profesión.',
            items: [
                'El letrado firmante asume responsabilidad exclusiva por el contenido presentado.',
                'Verificar datos de las partes, montos y fechas antes de cualquier uso.',
                'Las citas legales deben ser validadas contra normativa vigente.',
                'El estilo y estructura pueden requerir ajustes según práctica del fuero.'
            ]
        }
    }
}

/**
 * Simula latencia de red para desarrollo
 */
const simulateLatency = () => new Promise(resolve =>
    setTimeout(resolve, 1500 + Math.random() * 1000)
)

/**
 * Clase de servicio API
 */
class AlcanceLegalAPI {
    constructor() {
        this.config = N8N_CONFIG
    }

    /**
     * Envía consulta de análisis
     * Flujo: Edge Function Supabase → (fallback) RAG local
     * @param {Object} data - Datos del formulario de análisis
     * @returns {Promise<Object>} - Respuesta del análisis
     */
    async analizarCaso(data) {
        // Intentar Edge Function de Supabase primero
        if (SUPABASE_CONFIG.functionsUrl && !this.config.useMocks) {
            try {
                console.log('[API] Llamando Edge Function analizar...')

                const response = await fetch(`${SUPABASE_CONFIG.functionsUrl}/analizar`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
                        'apikey': SUPABASE_CONFIG.anonKey
                    },
                    body: JSON.stringify(data)
                })

                if (!response.ok) {
                    throw new Error(`Edge Function error: ${response.status}`)
                }

                const result = await response.json()
                console.log('[API] Edge Function respondió correctamente')
                return result

            } catch (error) {
                console.warn('[API] Edge Function falló, usando RAG local:', error.message)
                // Continuar con fallback
            }
        }

        // Fallback: RAG local (modo desarrollo o si Edge Function falla)
        console.log('[API] Usando RAG local...')
        await simulateLatency()

        // Usar RAG local v0.1
        const { analizarConCriterios, getVersion, ADVERTENCIAS_OBLIGATORIAS } = await import('./rag.js')
        const analisis = analizarConCriterios(data)
        const ragVersion = getVersion()

        // Construir respuesta en formato de informe profesional
        const numeroInforme = `ALC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`

        // Generar síntesis basada en análisis
        const elementosPresentes = analisis.elementos_evaluados.filter(e => e.presente)
        const elementosFaltantes = analisis.elementos_faltantes

        let sintesis = ''
        if (elementosPresentes.length > 0) {
            sintesis = `Se identifican ${elementosPresentes.length} de 4 elementos constitutivos de responsabilidad civil: ${elementosPresentes.map(e => e.elemento).join(', ')}.\n\n`
        }
        if (elementosFaltantes.length > 0) {
            sintesis += `Requieren mayor desarrollo: ${elementosFaltantes.map(e => e.elemento).join(', ')}.`
        }

        // Construir fundamentos desde criterios utilizados
        const fundamentos = analisis.elementos_evaluados
            .filter(e => e.fundamento)
            .map(e => ({
                tipo: 'criterio_rag',
                fuente: `${e.fundamento.normativo?.[0]?.cuerpo || 'CCyC'} arts. ${e.fundamento.normativo?.[0]?.articulos?.join(', ') || ''}`,
                extracto: e.fundamento.criterio,
                relevancia: e.observaciones[0] || 'Aplicado al análisis del caso.'
            }))

        return {
            success: true,
            data: {
                numero_informe: numeroInforme,
                fecha_emision: new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }),
                estado: 'INFORME PRELIMINAR',
                estado_detalle: 'Pendiente de validación por el profesional actuante',
                version_rag: ragVersion.version,
                criterios_aplicados: ragVersion.criterios_activos,
                viabilidad: {
                    valor: analisis.viabilidad.valor,
                    clasificacion: analisis.viabilidad.clasificacion,
                    explicacion: analisis.viabilidad.explicacion,
                    advertencia_metodologica: 'Esta evaluación se basa exclusivamente en la información proporcionada y en los 4 elementos constitutivos de responsabilidad civil. Factores no declarados pueden alterar sustancialmente el pronóstico.'
                },
                sintesis,
                elementos_evaluados: analisis.elementos_evaluados.map(e => ({
                    elemento: e.elemento,
                    presente: e.presente,
                    confianza: e.confianza,
                    observaciones: e.observaciones
                })),
                fundamentos,
                riesgos: analisis.riesgos_detectados.map((r, idx) => ({
                    nivel: r.nivel,
                    codigo: `R-${String(idx + 1).padStart(3, '0')}`,
                    descripcion: r.descripcion,
                    fuente: r.fuente,
                    urgencia: r.nivel === 'alto'
                })),
                advertencias: {
                    principal: 'Este informe NO constituye consejo legal definitivo. Es un insumo técnico basado en criterios generales que debe ser validado por el profesional actuante.',
                    items: ADVERTENCIAS_OBLIGATORIAS
                },
                _meta: {
                    rag_version: ragVersion.version,
                    criterios_activos: ragVersion.criterios_activos.length,
                    estado_rag: ragVersion.estado,
                    source: 'local_fallback'
                }
            }
        }
    }

    /**
     * Envía consulta de auditoría
     * @param {Object} data - Datos del formulario de auditoría
     * @returns {Promise<Object>} - Respuesta de la auditoría
     */
    async auditarEstrategia(data) {
        if (this.config.useMocks) {
            await simulateLatency()
            return {
                success: true,
                data: {
                    ...MOCK_RESPONSES.auditar,
                    _input: {
                        etapa_procesal: data.etapa_procesal
                    }
                }
            }
        }

        return this._post(this.config.endpoints.auditar, data)
    }

    /**
     * Envía consulta de redacción
     * @param {Object} data - Datos del formulario de redacción
     * @returns {Promise<Object>} - Respuesta con borrador
     */
    async redactarEscrito(data) {
        if (this.config.useMocks) {
            await simulateLatency()
            return {
                success: true,
                data: {
                    ...MOCK_RESPONSES.redactar,
                    tipo_escrito: data.tipo_escrito || 'Demanda',
                    _input: {
                        tipo_escrito: data.tipo_escrito
                    }
                }
            }
        }

        return this._post(this.config.endpoints.redactar, data)
    }

    /**
     * Método interno para POST requests
     */
    async _post(endpoint, data) {
        try {
            const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            return { success: true, data: result }

        } catch (error) {
            console.error('API Error:', error)
            return {
                success: false,
                error: error.message || 'Error de conexión con el servidor'
            }
        }
    }
}

// Exportar instancia singleton
export const api = new AlcanceLegalAPI()
export default api
