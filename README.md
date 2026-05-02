# PROYECTO ATHENA

### Multi-Domain Fusion System · Node: National City / San Diego

```
32.67°N 117.10°W · Fase 0 Operativa · REV 3.0
```

-----

## Descripción

Proyecto Athena es un sistema de fusión de inteligencia multi-dominio de código abierto, diseñado para operar desde un nodo único en National City / San Diego. Agrega, correlaciona y visualiza en tiempo real datos de fuentes públicas en cinco dominios: meteorología, clima espacial, astronomía, sismología y aeroespacial.

La arquitectura sigue el modelo de un sistema tipo Gotham — no un agregador de paneles, sino una red de entidades donde la anomalía significativa emerge como correlación inusual entre múltiples fuentes simultáneas.

La interfaz replica el lenguaje visual de estaciones de trabajo de grado profesional (Baselight / FilmLight): tipografía funcional, paleta de grises cálidos, scopes oscuros con traza coloreada, y densidad de información calibrada para operación continua.

-----

## Dominios activos (Fase 0)

|Dominio              |Fuente                     |Actualización|
|---------------------|---------------------------|-------------|
|Meteorología local   |Open-Meteo (GFS/ECMWF)     |Continua     |
|Viento solar / IMF Bz|NOAA SWPC · DSCOVR/ACE L1  |1 min        |
|Índices geomagnéticos|NOAA SWPC · Kp / F10.7     |3h / diario  |
|NEO / Asteroides     |NASA CNEOS · NeoWs API     |Diario       |
|Sismología regional  |USGS FDSN · r=500km SD     |1 min        |
|Lanzamientos globales|Launch Library 2           |Continua     |
|Imagen solar         |NASA SDO · AIA 193Å        |~12s         |
|Imagen satelital     |NOAA GOES-18 · GeoColor PSW|5–10 min     |

-----

## Stack técnico

```
React 18        UI framework
Vite 5          Build tool
IBM Plex Mono   Tipografía valores / datos
Barlow          Tipografía etiquetas / interfaz
Vercel          Deploy · HTTPS · auto-redeploy
```

Sin backend. Sin base de datos. Sin dependencias de pago.
Todas las fuentes de datos son APIs públicas y gratuitas.

-----

## Arquitectura de fases

El sistema se despliega en capas escalonadas, cada una condicionada a 30 días de estabilidad de la fase anterior.

```
Fase 0  Infraestructura base + fuentes remotas     Activa
Fase 1  RTL-SDR ADS-B local · ~$30 USD             Pendiente
Fase 2  Expansión RF · línea hidrógeno 1420 MHz    Pendiente
Fase 3  Estación meteorológica local               Pendiente
Fase 4  Sensor infrasónico · RME Fireface UCX II   Pendiente
```

Hardware objetivo al completar Fase 4: Mac Mini M5 + RME UCX II + 3–4× RTL-SDR + Estación Davis Vantage Pro + Geófono. Costo estimado total: ~$445–705 USD.

-----

## Instalación local

```bash
git clone https://github.com/[tu-usuario]/athena-dashboard
cd athena-dashboard
npm install
npm run dev
```

Requiere Node.js 18+. No requiere variables de entorno ni API keys para operación básica.

Para aumentar el límite de la NASA API (NEO Watch), registra una key gratuita en [api.nasa.gov](https://api.nasa.gov) y reemplaza `DEMO_KEY` en `src/App.jsx`.

-----

## Deploy

El proyecto está configurado para deploy directo en Vercel desde GitHub. Ver [`DEPLOY_INSTRUCTIONS.md`](./DEPLOY_INSTRUCTIONS.md) para el proceso completo desde navegador / iPad, sin terminal.

```
Build command:   npm run build
Output dir:      dist
Node version:    18.x
```

-----

## Fuentes de datos

Todas las fuentes son públicas, gratuitas y no requieren acuerdo comercial:

- [Open-Meteo](https://open-meteo.com) — CC BY 4.0
- [NOAA SWPC](https://www.swpc.noaa.gov) — Dominio público (U.S. Government)
- [NASA APIs](https://api.nasa.gov) — Dominio público (U.S. Government)
- [USGS Earthquake Hazards](https://earthquake.usgs.gov) — Dominio público (U.S. Government)
- [Launch Library 2](https://thespacedevs.com) — API pública
- [NASA SDO](https://sdo.gsfc.nasa.gov) — Dominio público (U.S. Government)
- [NOAA NESDIS / GOES](https://www.nesdis.noaa.gov) — Dominio público (U.S. Government)

-----

## Principios de diseño

1. **Estabilidad antes que expansión** — cada fase valida 30 días antes de avanzar
1. **Código diferido hasta hardware confirmado** — el plano no se ejecuta en el vacío
1. **El sistema registra, el operador interpreta** — separación entre correlación e hipótesis
1. **Escala regional como estado permanente** — National City / SD como nodo central
1. **Fusión, no agregación** — la anomalía emerge de la correlación entre fuentes
1. **Costo por capacidad** — funcionalidad equivalente a sistemas institucionales a fracción del costo

-----

## Licencia

MIT License — ver [LICENSE](./LICENSE)

-----

## Estado

```
REV      3.0
Estado   Pre-despliegue · Fase 0 operativa
Nodo     32.67°N 117.10°W · National City / San Diego
```
