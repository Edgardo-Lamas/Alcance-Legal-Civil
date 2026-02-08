# Guía de Deploy de Edge Function

## Prerrequisitos

1. Supabase CLI instalado:
```bash
npm install -g supabase
```

2. Login a Supabase:
```bash
supabase login
```

## Configurar Secrets

La Edge Function necesita la API key de OpenAI. Configúrala como secret:

```bash
cd "/Users/edgardolamas/Desktop/Trabajos de edicion/WEBS/Alcance Legal"

# Configurar secret de OpenAI (usar tu propia key)
supabase secrets set OPENAI_API_KEY=sk-proj-YOUR_OPENAI_API_KEY_HERE
```

## Deploy de la Edge Function

```bash
# Vincular proyecto (primera vez)
supabase link --project-ref pjgvzgzzhthqlzzjeroo

# Deploy de la función
supabase functions deploy analizar
```

## Verificar

Una vez deployada, la función estará disponible en:
```
https://pjgvzgzzhthqlzzjeroo.supabase.co/functions/v1/analizar
```

Probar con curl:
```bash
curl -X POST "https://pjgvzgzzhthqlzzjeroo.supabase.co/functions/v1/analizar" \
  -H "Authorization: Bearer TU_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"situacion_factica": "Mi cliente sufrió un accidente de tránsito"}'
```
