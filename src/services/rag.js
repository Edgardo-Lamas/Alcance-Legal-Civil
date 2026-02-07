/**
 * Servicio RAG Local para Alcance Legal
 * 
 * Implementación simple de RAG sin dependencias externas.
 * Carga criterios desde archivos JSON locales.
 * 
 * VERSIÓN 0.1 - Solo criterios RC-EXT-001 a RC-EXT-004
 */

// Criterios cargados en memoria (elementos constitutivos)
const CRITERIOS_V01 = {
    'RC-EXT-001': {
        id: 'RC-EXT-001',
        criterio: 'Antijuridicidad como presupuesto de responsabilidad',
        regla_general: 'Cualquier acción u omisión que causa un daño a otro es antijurídica si no está justificada.',
        fuentes: {
            normativas: [{ cuerpo: 'CCyC', articulos: ['1717', '1718'] }],
            jurisprudenciales: [{ tribunal: 'CNCiv', caracter: 'unanime' }]
        },
        condiciones_aplicacion: [
            'Existencia de acción u omisión imputable al agente',
            'Ausencia de causa de justificación legal'
        ],
        exclusiones_comunes: [
            'Ejercicio regular de un derecho propio (art. 1718 inc. a)',
            'Legítima defensa propia o de terceros (art. 1718 inc. b)',
            'Estado de necesidad justificante (art. 1718 inc. c)'
        ],
        riesgos_procesales: [
            'No distinguir antijuridicidad formal de material',
            'No invocar causa de justificación en tiempo procesal oportuno'
        ],
        tags: ['antijuridicidad', 'presupuesto', 'justificacion']
    },
    'RC-EXT-002': {
        id: 'RC-EXT-002',
        criterio: 'Daño resarcible como requisito esencial',
        regla_general: 'Hay daño cuando se lesiona un derecho o un interés no reprobado por el ordenamiento jurídico, que tenga por objeto la persona, el patrimonio, o un derecho de incidencia colectiva.',
        fuentes: {
            normativas: [{ cuerpo: 'CCyC', articulos: ['1737', '1738', '1739'] }],
            jurisprudenciales: [{ tribunal: 'CNCiv', caracter: 'unanime' }]
        },
        condiciones_aplicacion: [
            'Lesión a un derecho o interés lícito',
            'Carácter cierto del daño (no hipotético)',
            'Carácter personal del daño (afectación al reclamante)',
            'Subsistencia del daño al momento del reclamo'
        ],
        exclusiones_comunes: [
            'Daños hipotéticos o eventuales',
            'Intereses no tutelados por el ordenamiento',
            'Daños ya reparados integralmente'
        ],
        riesgos_procesales: [
            'No acreditar certeza del daño',
            'Confundir daño patrimonial con extrapatrimonial'
        ],
        tags: ['dano', 'dano_resarcible', 'certeza']
    },
    'RC-EXT-003': {
        id: 'RC-EXT-003',
        criterio: 'Teoría de la causalidad adecuada',
        regla_general: 'Son reparables las consecuencias dañosas que acostumbran suceder según el curso natural y ordinario de las cosas.',
        fuentes: {
            normativas: [{ cuerpo: 'CCyC', articulos: ['1726', '1727'] }],
            jurisprudenciales: [
                { tribunal: 'CSJN', caracter: 'unanime' },
                { tribunal: 'CNCiv', caracter: 'unanime' }
            ]
        },
        condiciones_aplicacion: [
            'Nexo fáctico entre el hecho y el daño',
            'Previsibilidad objetiva de la consecuencia dañosa',
            'Ausencia de interrupción del nexo causal'
        ],
        exclusiones_comunes: [
            'Consecuencias extraordinarias o imprevisibles',
            'Daños remotos sin conexión directa con el hecho',
            'Concausas que absorben la relación causal'
        ],
        riesgos_procesales: [
            'No distinguir causalidad de culpabilidad',
            'Falta de prueba específica del nexo causal'
        ],
        tags: ['causalidad', 'nexo_causal', 'previsibilidad']
    },
    'RC-EXT-004': {
        id: 'RC-EXT-004',
        criterio: 'Factor de atribución de responsabilidad',
        regla_general: 'La atribución de un daño al responsable puede basarse en factores subjetivos (dolo o culpa) u objetivos (riesgo creado, garantía, equidad).',
        fuentes: {
            normativas: [{ cuerpo: 'CCyC', articulos: ['1721', '1722', '1723', '1724', '1725'] }],
            jurisprudenciales: [{ tribunal: 'CNCiv', caracter: 'unanime' }]
        },
        condiciones_aplicacion: [
            'Identificación del factor aplicable al caso (subjetivo u objetivo)',
            'Para factores subjetivos: acreditación de dolo o culpa',
            'Para factores objetivos: encuadramiento en supuesto legal específico'
        ],
        exclusiones_comunes: [
            'Responsabilidad sin factor de atribución identificable',
            'Pretensión de aplicar factor objetivo sin base normativa'
        ],
        riesgos_procesales: [
            'Error en la invocación del factor de atribución',
            'No distinguir carga probatoria según tipo de factor'
        ],
        tags: ['factor_atribucion', 'culpa', 'dolo', 'riesgo_creado']
    }
}

// Importar advertencias del disclaimer institucional centralizado
import {
    ADVERTENCIAS_OBLIGATORIAS,
    DISCLAIMER_RAG,
    DISCLAIMER_API
} from '../constants/disclaimer.js'

/**
 * Analiza un caso usando los 4 criterios base
 */
function analizarConCriterios(datosCaso) {
    const analisis = {
        elementos_evaluados: [],
        elementos_faltantes: [],
        riesgos_detectados: [],
        viabilidad: { valor: 0, clasificacion: '', explicacion: '' },
        advertencias: ADVERTENCIAS_OBLIGATORIAS,
        disclaimer_institucional: DISCLAIMER_API,
        nota_rag: DISCLAIMER_RAG
    }

    // 1. Evaluar antijuridicidad (RC-EXT-001)
    const evalAntijuridicidad = evaluarAntijuridicidad(datosCaso)
    analisis.elementos_evaluados.push(evalAntijuridicidad)

    // 2. Evaluar daño (RC-EXT-002)
    const evalDano = evaluarDano(datosCaso)
    analisis.elementos_evaluados.push(evalDano)

    // 3. Evaluar causalidad (RC-EXT-003)
    const evalCausalidad = evaluarCausalidad(datosCaso)
    analisis.elementos_evaluados.push(evalCausalidad)

    // 4. Evaluar factor de atribución (RC-EXT-004)
    const evalFactor = evaluarFactorAtribucion(datosCaso)
    analisis.elementos_evaluados.push(evalFactor)

    // Calcular viabilidad general
    analisis.viabilidad = calcularViabilidad(analisis.elementos_evaluados)

    // Identificar elementos faltantes
    analisis.elementos_faltantes = identificarFaltantes(analisis.elementos_evaluados)

    // Consolidar riesgos
    analisis.riesgos_detectados = consolidarRiesgos(analisis.elementos_evaluados)

    return analisis
}

/**
 * Evalúa presencia de antijuridicidad
 */
function evaluarAntijuridicidad(datos) {
    const criterio = CRITERIOS_V01['RC-EXT-001']
    const resultado = {
        id: criterio.id,
        elemento: 'Antijuridicidad',
        presente: false,
        confianza: 'baja',
        observaciones: [],
        riesgos: []
    }

    // Análisis básico de palabras clave
    const texto = (datos.situacion_factica || '').toLowerCase()

    // Indicadores positivos de antijuridicidad
    const indicadoresPositivos = [
        'incumplimiento', 'daño', 'perjuicio', 'negligencia', 'omisión',
        'violación', 'ilícito', 'responsable', 'culpa'
    ]

    // Indicadores de causas de justificación (incluye variantes sin acentos)
    const indicadoresJustificacion = [
        'legítima defensa', 'legitima defensa',
        'estado de necesidad', 'ejercicio regular',
        'derecho propio', 'autorización', 'autorizacion',
        'defensa propia', 'se defendio', 'se defendió',
        'actuó en defensa', 'actuo en defensa'
    ]

    const tieneIndicadoresPositivos = indicadoresPositivos.some(i => texto.includes(i))
    const tieneJustificacion = indicadoresJustificacion.some(i => texto.includes(i))

    if (tieneIndicadoresPositivos && !tieneJustificacion) {
        resultado.presente = true
        resultado.confianza = 'media'
        resultado.observaciones.push(
            'El relato sugiere acción u omisión potencialmente antijurídica.'
        )
    } else if (tieneJustificacion) {
        resultado.presente = false
        resultado.confianza = 'media'
        resultado.observaciones.push(
            'Se detectan posibles causas de justificación que deben ser evaluadas.'
        )
        resultado.riesgos.push({
            nivel: 'alto',
            descripcion: 'Posible causa de justificación alegable por demandado',
            fuente: criterio.id
        })
    } else {
        resultado.observaciones.push(
            'Información insuficiente para evaluar antijuridicidad con precisión.'
        )
        resultado.riesgos.push({
            nivel: 'medio',
            descripcion: 'Falta desarrollo del hecho generador',
            fuente: criterio.id
        })
    }

    resultado.fundamento = {
        normativo: criterio.fuentes.normativas,
        criterio: criterio.regla_general
    }

    return resultado
}

/**
 * Evalúa presencia de daño resarcible
 */
function evaluarDano(datos) {
    const criterio = CRITERIOS_V01['RC-EXT-002']
    const resultado = {
        id: criterio.id,
        elemento: 'Daño resarcible',
        presente: false,
        confianza: 'baja',
        observaciones: [],
        riesgos: []
    }

    const texto = (datos.situacion_factica || '' + datos.pretension_cliente || '').toLowerCase()

    // Indicadores de daño patrimonial
    const indicadoresPatrimoniales = [
        'pérdida', 'gasto', 'costo', 'pago', 'dinero', 'monto',
        'factura', 'contrato', 'deuda', 'incumplimiento'
    ]

    // Indicadores de daño extrapatrimonial
    const indicadoresExtrapatrimoniales = [
        'sufrimiento', 'angustia', 'moral', 'dolor', 'afección',
        'dignidad', 'honor', 'imagen'
    ]

    const tienePatrimonial = indicadoresPatrimoniales.some(i => texto.includes(i))
    const tieneExtrapatrimonial = indicadoresExtrapatrimoniales.some(i => texto.includes(i))

    if (tienePatrimonial || tieneExtrapatrimonial) {
        resultado.presente = true
        resultado.confianza = tienePatrimonial && datos.documentacion_disponible?.length > 0 ? 'media' : 'baja'

        if (tienePatrimonial) {
            resultado.observaciones.push('Se identifican elementos de daño patrimonial.')
        }
        if (tieneExtrapatrimonial) {
            resultado.observaciones.push('Se identifican elementos de daño extrapatrimonial.')
        }

        // Verificar certeza
        if (!texto.includes('efectivo') && !texto.includes('real') && !texto.includes('concreto')) {
            resultado.riesgos.push({
                nivel: 'medio',
                descripcion: 'Verificar certeza del daño (no hipotético)',
                fuente: criterio.id
            })
        }
    } else {
        resultado.observaciones.push('No se identifican claramente los daños alegados.')
        resultado.riesgos.push({
            nivel: 'alto',
            descripcion: 'Falta descripción del daño sufrido',
            fuente: criterio.id
        })
    }

    resultado.fundamento = {
        normativo: criterio.fuentes.normativas,
        criterio: criterio.regla_general
    }

    return resultado
}

/**
 * Evalúa nexo causal
 */
function evaluarCausalidad(datos) {
    const criterio = CRITERIOS_V01['RC-EXT-003']
    const resultado = {
        id: criterio.id,
        elemento: 'Relación causal',
        presente: false,
        confianza: 'baja',
        observaciones: [],
        riesgos: []
    }

    const texto = (datos.situacion_factica || '').toLowerCase()

    // Indicadores de nexo causal
    const indicadoresCausales = [
        'por eso', 'en consecuencia', 'como resultado', 'debido a',
        'a raíz de', 'provocó', 'causó', 'generó', 'derivado de'
    ]

    // Indicadores de posible ruptura
    const indicadoresRuptura = [
        'tercero', 'caso fortuito', 'fuerza mayor', 'imprevisible',
        'ajeno', 'víctima'
    ]

    const tieneNexo = indicadoresCausales.some(i => texto.includes(i))
    const tieneRuptura = indicadoresRuptura.some(i => texto.includes(i))

    if (tieneNexo) {
        resultado.presente = true
        resultado.confianza = 'media'
        resultado.observaciones.push(
            'El relato sugiere conexión causal entre hecho y daño.'
        )

        if (tieneRuptura) {
            resultado.riesgos.push({
                nivel: 'alto',
                descripcion: 'Posible alegación de ruptura del nexo causal por demandado',
                fuente: criterio.id
            })
        }
    } else {
        resultado.observaciones.push(
            'El nexo causal no está claramente establecido en el relato.'
        )
        resultado.riesgos.push({
            nivel: 'alto',
            descripcion: 'Desarrollar conexión entre hecho y daño',
            fuente: criterio.id
        })
    }

    resultado.fundamento = {
        normativo: criterio.fuentes.normativas,
        criterio: criterio.regla_general
    }

    return resultado
}

/**
 * Evalúa factor de atribución
 */
function evaluarFactorAtribucion(datos) {
    const criterio = CRITERIOS_V01['RC-EXT-004']
    const resultado = {
        id: criterio.id,
        elemento: 'Factor de atribución',
        presente: false,
        confianza: 'baja',
        factor_identificado: null,
        observaciones: [],
        riesgos: []
    }

    const texto = (datos.situacion_factica || '').toLowerCase()
    const tipoCaso = datos.tipo_consulta || ''

    // Indicadores de factor subjetivo
    const indicadoresCulpa = ['negligencia', 'imprudencia', 'impericia', 'culpa', 'descuido']
    const indicadoresDolo = ['intencional', 'deliberado', 'a propósito', 'dolo', 'malicia']

    // Indicadores de factor objetivo
    const indicadoresRiesgo = ['vehículo', 'máquina', 'actividad peligrosa', 'cosa riesgosa']

    const tieneCulpa = indicadoresCulpa.some(i => texto.includes(i))
    const tieneDolo = indicadoresDolo.some(i => texto.includes(i))
    const tieneRiesgo = indicadoresRiesgo.some(i => texto.includes(i))

    if (tieneDolo) {
        resultado.presente = true
        resultado.factor_identificado = 'dolo'
        resultado.confianza = 'media'
        resultado.observaciones.push('Se identifican elementos de conducta dolosa.')
    } else if (tieneCulpa) {
        resultado.presente = true
        resultado.factor_identificado = 'culpa'
        resultado.confianza = 'media'
        resultado.observaciones.push('Se identifican elementos de conducta culposa.')
    } else if (tieneRiesgo) {
        resultado.presente = true
        resultado.factor_identificado = 'riesgo_creado'
        resultado.confianza = 'media'
        resultado.observaciones.push('Posible aplicación de responsabilidad objetiva por riesgo.')
    } else {
        resultado.observaciones.push(
            'No se identifica claramente el factor de atribución.'
        )
        resultado.riesgos.push({
            nivel: 'medio',
            descripcion: 'Definir factor de atribución (subjetivo u objetivo)',
            fuente: criterio.id
        })
    }

    resultado.fundamento = {
        normativo: criterio.fuentes.normativas,
        criterio: criterio.regla_general
    }

    return resultado
}

/**
 * Calcula viabilidad general
 */
function calcularViabilidad(elementos) {
    const presentes = elementos.filter(e => e.presente).length
    const total = elementos.length
    const porcentaje = Math.round((presentes / total) * 100)

    let clasificacion, explicacion

    if (presentes === 4) {
        clasificacion = 'ALTA'
        explicacion = 'Se identifican los cuatro elementos constitutivos de responsabilidad civil.'
    } else if (presentes >= 3) {
        clasificacion = 'MEDIA-ALTA'
        explicacion = 'Se identifican la mayoría de los elementos, con aspectos a desarrollar.'
    } else if (presentes >= 2) {
        clasificacion = 'MEDIA'
        explicacion = 'Se identifican algunos elementos, pero requiere mayor desarrollo.'
    } else if (presentes >= 1) {
        clasificacion = 'MEDIA-BAJA'
        explicacion = 'Elementos insuficientes. Requiere análisis más detallado.'
    } else {
        clasificacion = 'BAJA'
        explicacion = 'No se identifican claramente los elementos de responsabilidad.'
    }

    return {
        valor: porcentaje,
        clasificacion,
        explicacion,
        elementos_presentes: presentes,
        elementos_totales: total
    }
}

/**
 * Identifica elementos faltantes
 */
function identificarFaltantes(elementos) {
    return elementos
        .filter(e => !e.presente)
        .map(e => ({
            elemento: e.elemento,
            motivo: e.observaciones[0] || 'Información insuficiente',
            criticidad: 'alta'
        }))
}

/**
 * Consolida riesgos de todos los elementos
 */
function consolidarRiesgos(elementos) {
    const riesgos = []
    elementos.forEach(elem => {
        if (elem.riesgos) {
            elem.riesgos.forEach(r => {
                riesgos.push(r)
            })
        }
    })

    // Ordenar por nivel
    const orden = { alto: 0, medio: 1, bajo: 2 }
    return riesgos.sort((a, b) => orden[a.nivel] - orden[b.nivel])
}

/**
 * Obtener criterios cargados
 */
function getCriteriosActivos() {
    return Object.values(CRITERIOS_V01)
}

/**
 * Obtener versión del RAG
 */
function getVersion() {
    return {
        version: '0.1.0',
        criterios_activos: Object.keys(CRITERIOS_V01),
        estado: 'congelado',
        fecha: '2026-02-06'
    }
}

export {
    analizarConCriterios,
    getCriteriosActivos,
    getVersion,
    CRITERIOS_V01,
    ADVERTENCIAS_OBLIGATORIAS
}
