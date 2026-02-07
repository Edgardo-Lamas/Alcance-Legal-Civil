/**
 * Casos de Prueba Límite para RAG v0.1
 * 
 * Estos casos prueban el comportamiento del sistema con diferentes
 * escenarios para validar razonamiento y control de salida.
 */

export const CASOS_PRUEBA = {
    // CASO 1: Todos los elementos presentes - viabilidad alta esperada
    caso_completo: {
        nombre: 'Caso completo con todos los elementos',
        expectativa: 'Viabilidad ALTA (4/4 elementos)',
        datos: {
            tipo_consulta: 'daños',
            situacion_factica: `El 15 de enero de 2026, mi cliente sufrió un accidente de tránsito provocado 
            por la negligencia del conductor del vehículo demandado, quien cruzó un semáforo en rojo 
            a alta velocidad. Como resultado del impacto, mi cliente sufrió lesiones graves que 
            requirieron internación hospitalaria y generaron gastos médicos por $500.000. 
            El daño al vehículo fue total. Debido a las lesiones, mi cliente no pudo trabajar 
            durante 3 meses, perdiendo ingresos mensuales de $200.000. El accidente le causó 
            un profundo sufrimiento y angustia que afectó su vida familiar.`,
            pretension_cliente: 'Reclamo de daños y perjuicios incluyendo daño emergente, lucro cesante y daño moral.',
            documentacion_disponible: ['contrato_escrito', 'facturas', 'actuaciones'],
            jurisdiccion: 'CABA'
        }
    },

    // CASO 2: Sin nexo causal claro - viabilidad media esperada
    caso_sin_causalidad: {
        nombre: 'Caso sin nexo causal claro',
        expectativa: 'Viabilidad MEDIA-BAJA, riesgo alto en causalidad',
        datos: {
            tipo_consulta: 'daños',
            situacion_factica: `Mi cliente tiene una empresa de software. La empresa del demandado 
            también se dedica al software. Mi cliente perdió varios clientes importantes 
            en el último año. Sospechamos que el demandado está involucrado porque trabaja 
            en el mismo rubro. Los ingresos de mi cliente bajaron significativamente.`,
            pretension_cliente: 'Daños y perjuicios por pérdida de clientes.',
            documentacion_disponible: [],
            jurisdiccion: 'Buenos Aires'
        }
    },

    // CASO 3: Posible causa de justificación - advertencia alta
    caso_justificacion: {
        nombre: 'Caso con posible causa de justificación',
        expectativa: 'Riesgo ALTO por legítima defensa alegable',
        datos: {
            tipo_consulta: 'daños',
            situacion_factica: `Mi cliente fue golpeado por el demandado, sufriendo lesiones leves. 
            Sin embargo, el demandado alega que actuó en legítima defensa porque mi cliente 
            lo había amenazado previamente con un cuchillo. Hay testigos que presenciaron 
            la discusión previa pero no la supuesta amenaza. Mi cliente niega haber tenido 
            un cuchillo.`,
            pretension_cliente: 'Daños físicos y morales por la agresión sufrida.',
            documentacion_disponible: ['otros'],
            jurisdiccion: 'CABA'
        }
    },

    // CASO 4: Información mínima - viabilidad baja
    caso_minimo: {
        nombre: 'Caso con información mínima',
        expectativa: 'Viabilidad BAJA, múltiples riesgos',
        datos: {
            tipo_consulta: 'daños',
            situacion_factica: `Tengo un problema con un vecino que me causó perjuicios. 
            Quiero demandarlo.`,
            pretension_cliente: 'Que pague los daños.',
            documentacion_disponible: [],
            jurisdiccion: 'Córdoba'
        }
    },

    // CASO 5: Responsabilidad objetiva (riesgo creado)
    caso_riesgo_creado: {
        nombre: 'Caso de responsabilidad objetiva',
        expectativa: 'Factor de atribución: riesgo_creado',
        datos: {
            tipo_consulta: 'daños',
            situacion_factica: `Mi cliente trabajaba en una fábrica operando una máquina industrial. 
            La máquina presentó un desperfecto que provocó que una pieza saliera disparada, 
            causándole graves lesiones en el brazo. La empresa no realizaba el mantenimiento 
            adecuado según el manual del fabricante. Como consecuencia, mi cliente tiene 
            incapacidad parcial permanente y no puede continuar trabajando.`,
            pretension_cliente: 'Indemnización por daños derivados del accidente laboral.',
            documentacion_disponible: ['actuaciones', 'otros'],
            jurisdiccion: 'Buenos Aires'
        }
    },

    // CASO 6: Solo daño moral alegado
    caso_solo_moral: {
        nombre: 'Caso de daño moral puro',
        expectativa: 'Daño extrapatrimonial identificado, verificar certeza',
        datos: {
            tipo_consulta: 'daños',
            situacion_factica: `El demandado publicó en redes sociales acusaciones falsas contra mi cliente, 
            afirmando que era un estafador y ladrón. Estas publicaciones fueron vistas por 
            amigos, familiares y colegas de mi cliente, causándole un profundo sufrimiento, 
            angustia y afectando su honor y dignidad. Tuvo que recibir tratamiento psicológico 
            por el impacto emocional.`,
            pretension_cliente: 'Reparación del daño moral sufrido y retractación pública.',
            documentacion_disponible: ['otros'],
            jurisdiccion: 'CABA'
        }
    }
}

/**
 * Ejecuta todos los casos de prueba
 */
export async function ejecutarPruebas(api) {
    const resultados = []

    for (const [key, caso] of Object.entries(CASOS_PRUEBA)) {
        console.log(`\n=== Ejecutando: ${caso.nombre} ===`)
        console.log(`Expectativa: ${caso.expectativa}`)

        try {
            const response = await api.analizarCaso(caso.datos)

            if (response.success) {
                const data = response.data
                resultados.push({
                    caso: key,
                    nombre: caso.nombre,
                    expectativa: caso.expectativa,
                    resultado: {
                        viabilidad: data.viabilidad.clasificacion,
                        valor: data.viabilidad.valor,
                        elementos_presentes: data.elementos_evaluados.filter(e => e.presente).length,
                        riesgos_altos: data.riesgos.filter(r => r.nivel === 'alto').length
                    }
                })

                console.log(`Viabilidad: ${data.viabilidad.clasificacion} (${data.viabilidad.valor}%)`)
                console.log(`Elementos: ${data.elementos_evaluados.filter(e => e.presente).length}/4`)
                console.log(`Riesgos altos: ${data.riesgos.filter(r => r.nivel === 'alto').length}`)
            } else {
                console.log(`Error: ${response.error}`)
            }
        } catch (error) {
            console.error(`Error ejecutando caso ${key}:`, error)
        }
    }

    return resultados
}

export default CASOS_PRUEBA
