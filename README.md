# Students Social Media Addiction — Serverless Dashboard

Aplicacion web serverless construida con Next.js 14 + Firebase Firestore para visualizar y gestionar el dataset **Students Social Media Addiction** de Kaggle (705 registros, 13 columnas).

## Arquitectura

```
CSV (705 rows)  ──►  firebase-import.js  ──►  Firestore (social_media_addiction)
                                                        │
                                                        ▼
                                              Next.js API Routes (serverless)
                                              /api/students       GET | POST
                                              /api/students/[id]  PUT | DELETE
                                              /api/students/import-csv  POST
                                                        │
                                                        ▼
                                              React + Recharts + Tailwind CSS
```

## Requisitos

- Node.js 18+
- pnpm
- Cuenta Firebase con proyecto configurado
- `serviceAccountKey.json` en la raiz del proyecto

## Instalacion

```bash
pnpm install
```

Colocar `serviceAccountKey.json` en la raiz (Firebase Console > Project Settings > Service Accounts).

```bash
# Cargar CSV a Firestore
node firebase-import.js

# Desarrollo
pnpm dev

# Build produccion
pnpm build
```

Abrir http://localhost:3000

## Estructura del Proyecto

```
repo/
├── app/
│   ├── api/students/
│   │   ├── route.ts              GET (filtros) + POST
│   │   ├── [id]/route.ts         PUT + DELETE
│   │   └── import-csv/route.ts   Importacion masiva
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  Dashboard principal
├── components/
│   ├── DashboardCharts.tsx       6 graficos Recharts
│   ├── CSVUploader.tsx           Importacion CSV desde UI
│   ├── ConfirmModal.tsx          Modal de confirmacion
│   ├── Pagination.tsx            Paginacion
│   ├── SearchBar.tsx             Busqueda + filtros
│   ├── StudentForm.tsx           Formulario CRUD (13 campos)
│   └── StudentTable.tsx          Tabla de datos
├── lib/
│   ├── firebase-admin.ts         Configuracion Firebase Admin
│   ├── types.ts                  Interface Student (13 campos)
│   └── utils.ts                  Validacion de datos
├── dbSet/
│   ├── Students Social Media Addiction.csv
│   ├── U4_Actividad_Sumativa.pdf
│   └── video-script.md           Guion para video
├── firebase-import.js            Script de carga a Firestore
└── serviceAccountKey.json        (gitignored)
```

## Dataset

| Campo | Tipo | Rango/Valores |
|-------|------|---------------|
| Student_ID | number | PK, entero unico |
| Age | number | 18-35 |
| Gender | string | Male, Female, Non-binary |
| Academic_Level | string | High School, Undergraduate, Graduate, PhD |
| Country | string | 10 paises |
| Avg_Daily_Usage_Hours | number | 0.5-12.0 |
| Most_Used_Platform | string | Instagram, TikTok, Twitter, Facebook, etc. |
| Affects_Academic_Performance | string | Yes, No |
| Sleep_Hours_Per_Night | number | 3-9 |
| Mental_Health_Score | number | 1-10 |
| Relationship_Status | string | Single, In a relationship, etc. |
| Conflicts_Over_Social_Media | number | 0-10 |
| Addicted_Score | number | 1-10 |

## Funcionalidades

**Visualizacion (6 graficos)**
- Distribucion de puntaje de adiccion (barras)
- Uso promedio diario por plataforma (barras horizontales)
- Puntaje de adiccion por nivel academico (barras)
- Distribucion por genero (donut)
- Afecta rendimiento academico (donut Yes/No)
- Salud mental vs adiccion (scatter)

**CRUD completo**
- Crear registros con formulario validado (13 campos)
- Leer con filtros por Country, Platform, Academic Level
- Busqueda por Student_ID
- Editar y eliminar con confirmacion
- Importacion masiva CSV (UI + script Node.js)

**UI**
- Paginacion configurable
- Toggle para mostrar/ocultar graficos
- Filtros reactivos que actualizan tabla y graficos
- Notificaciones toast

## Stack

| Capa | Tecnologia |
|------|-----------|
| Frontend | React 18, Tailwind CSS, Recharts |
| Framework | Next.js 14 (App Router) |
| Backend | Next.js API Routes (serverless) |
| Base de datos | Firebase Firestore |
| Lenguaje | TypeScript |
| CSV Parsing | PapaParse (client), manual (server) |

## Seguridad

- `serviceAccountKey.json` esta en `.gitignore`
- Usar variables de entorno en produccion
- Configurar reglas de seguridad en Firestore

## Actividad Academica

Actividad Sumativa Unidad 4 — Contenerizacion de Aplicaciones de Software.
Politecnico Grancolombiano, Maestria en Arquitectura Cloud.

**Criterios evaluados:**
- Carga de datos a base de datos serverless (100 pts)
- Aplicacion serverless desplegada (100 pts)
- Video explicativo de la arquitectura (50 pts)

## Licencia

ISC

