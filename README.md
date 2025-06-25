# IoT Water - Sistema de Gestión de Agua Inteligente

Sistema de gestión integral para monitoreo y control de dispositivos IoT en redes de distribución de agua. Desarrollado con Vue 3, Vite y Vue Router.

## 🚀 Características

- **Dashboard interactivo** con métricas en tiempo real
- **Gestión de dispositivos IoT** (sensores, válvulas, medidores)
- **Sistema CRM** para gestión de clientes y conversaciones
- **Mapa geográfico** para visualización de dispositivos
- **Gestión de denuncias ciudadanas** y problemas del sistema
- **Administración de personal** y equipos de trabajo
- **Interfaz responsive** y moderna
- **Sistema de autenticación** con layouts separados

## 📁 Estructura del Proyecto

```
iot_water/
├── public/                          # Archivos públicos estáticos
│   ├── index.html                   # HTML principal
│   └── vite.svg                     # Logo de Vite
├── src/                             # Código fuente principal
│   ├── assets/                      # Recursos estáticos
│   │   ├── fonts/                   # Fuentes personalizadas
│   │   ├── images/                  # Imágenes del proyecto
│   │   └── styles/                  # Estilos SCSS
│   │       ├── _variables.scss      # Variables globales
│   │       ├── _navbar.scss         # Estilos del navbar
│   │       ├── _sidebar.scss        # Estilos del sidebar
│   │       └── main.scss            # Estilos principales
│   ├── components/                  # Componentes reutilizables
│   │   ├── SidebarMenu.vue          # Menú lateral
│   │   └── TopNavbar.vue            # Barra de navegación superior
│   ├── layouts/                     # Layouts de la aplicación
│   │   ├── AuthLayout.vue           # Layout para autenticación
│   │   └── DefaultLayout.vue        # Layout principal con sidebar
│   ├── router/                      # Configuración de rutas
│   │   └── index.js                 # Definición de rutas
│   ├── services/                    # Servicios de API
│   │   ├── api.js                   # Configuración base de API
│   │   ├── auth.service.js          # Servicios de autenticación
│   │   ├── devices.service.js       # Servicios de dispositivos
│   │   └── ...                      # Otros servicios
│   ├── stores/                      # Estado global (Pinia/Vuex)
│   │   ├── auth.js                  # Store de autenticación
│   │   ├── devices.js               # Store de dispositivos
│   │   └── ...                      # Otros stores
│   ├── utils/                       # Utilidades y helpers
│   │   ├── clickOutside.js          # Directiva click-outside
│   │   ├── constants.js             # Constantes globales
│   │   ├── date.js                  # Utilidades de fechas
│   │   ├── helpers.js               # Funciones helper
│   │   ├── navigation.js            # Lógica de navegación
│   │   └── formValidation.js        # Validaciones de formularios
│   ├── views/                       # Páginas/Vistas de la aplicación
│   │   ├── Auth/                    # Vistas de autenticación
│   │   │   ├── LoginPage.vue        # Página de login
│   │   │   ├── RegisterPage.vue     # Página de registro
│   │   │   └── ForgotPasswordPage.vue # Página de recuperación
│   │   ├── Dashboard/               # Vistas del dashboard
│   │   │   └── DashboardOverview.vue # Dashboard principal
│   │   ├── Devices/                 # Vistas de dispositivos
│   │   │   ├── DeviceListPage.vue   # Lista de dispositivos
│   │   │   ├── DeviceDetailPage.vue # Detalle de dispositivo
│   │   │   └── DeviceMaintenancePage.vue # Mantenimiento
│   │   ├── CRM/                     # Vistas del CRM
│   │   │   ├── ClientListPage.vue   # Lista de clientes
│   │   │   ├── ClientDetailPage.vue # Detalle de cliente
│   │   │   ├── ConversationListPage.vue # Lista de conversaciones
│   │   │   └── ConversationDetailPage.vue # Detalle de conversación
│   │   ├── Complaints/              # Vistas de denuncias
│   │   │   ├── ComplaintListPage.vue # Lista de denuncias
│   │   │   └── ComplaintDetailPage.vue # Detalle de denuncia
│   │   ├── Incidents/               # Vistas de problemas
│   │   │   ├── IncidentListPage.vue # Lista de problemas
│   │   │   └── IncidentDetailPage.vue # Detalle de problema
│   │   ├── Map/                     # Vistas del mapa
│   │   │   └── MapPage.vue          # Página del mapa
│   │   ├── Personnel/               # Vistas de personal
│   │   │   ├── PersonnelListPage.vue # Lista de personal
│   │   │   └── PersonnelDetailPage.vue # Detalle de personal
│   │   └── NotFoundPage.vue         # Página 404
│   ├── App.vue                      # Componente raíz
│   ├── main.js                      # Punto de entrada
│   └── style.css                    # Estilos globales
├── .gitignore                       # Archivos ignorados por Git
├── index.html                       # HTML de entrada
├── package.json                     # Dependencias y scripts
├── package-lock.json                # Lock de dependencias
├── vite.config.js                   # Configuración de Vite
└── README.md                        # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **Vue 3** - Framework de JavaScript progresivo
- **Vite** - Herramienta de construcción rápida
- **Vue Router** - Enrutamiento oficial de Vue
- **SCSS/Sass** - Preprocesador de CSS
- **JavaScript ES6+** - Sintaxis moderna de JavaScript

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
- **npm** (incluido con Node.js)

Para verificar las versiones:
```bash
node --version
npm --version
```

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd iot_water
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en modo desarrollo
```bash
npm run dev
```

El proyecto estará disponible en: `http://localhost:5173/`

### 4. Construir para producción
```bash
npm run build
```

### 5. Previsualizar la construcción
```bash
npm run preview
```

## 🗂️ Estructura de Navegación

### Rutas de Autenticación (`/auth/*`)
- `/auth/login` - Página de inicio de sesión
- `/auth/register` - Página de registro
- `/auth/forgot-password` - Recuperación de contraseña

### Rutas Principales (`/app/*`)
- `/app/dashboard` - Dashboard principal
- `/app/devices` - Gestión de dispositivos
- `/app/incidents` - Gestión de problemas
- `/app/crm/clients` - Gestión de clientes
- `/app/crm/conversations` - Conversaciones
- `/app/complaints` - Denuncias ciudadanas
- `/app/map` - Mapa geográfico
- `/app/personnel` - Gestión de personal

## 🎨 Convenciones de Estilo

### Nomenclatura de Archivos
- **Componentes**: PascalCase (ej: `SidebarMenu.vue`)
- **Vistas**: PascalCase (ej: `DashboardOverview.vue`)
- **Utilidades**: camelCase (ej: `clickOutside.js`)
- **Estilos**: kebab-case con underscore (ej: `_navbar.scss`)

### Estructura de Componentes
```vue
<template>
  <!-- Template aquí -->
</template>

<script>
export default {
  name: 'NombreComponente',
  // ...
}
</script>

<style lang="scss" scoped>
// Estilos aquí
</style>
```

### Organización de Estilos
- Usar **SCSS** para todos los estilos
- Mantener estilos **scoped** en componentes
- Variables globales en `_variables.scss`
- Estilos de layout en archivos separados (`_navbar.scss`, `_sidebar.scss`)

## 🔧 Configuración del Proyecto

### Alias de Importación
El proyecto usa alias para importaciones más limpias:
```javascript
// En lugar de:
import Component from '../../../components/Component.vue'

// Usar:
import Component from '@/components/Component.vue'
```

### Variables de Entorno
Crear archivo `.env.local` para variables locales:
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_TITLE=IoT Water
```

## 📝 Buenas Prácticas

### 1. **Estructura de Componentes**
- Mantener componentes pequeños y enfocados
- Usar composables para lógica reutilizable
- Separar lógica de presentación

### 2. **Navegación**
- Usar `useRouter()` para navegación programática
- Implementar breadcrumbs para mejor UX
- Manejar estados de carga y errores

### 3. **Estados**
- Usar `ref()` para estado local
- Usar `computed()` para valores derivados
- Implementar stores para estado global

### 4. **Estilos**
- Usar variables SCSS para consistencia
- Implementar diseño responsive
- Seguir metodología BEM para CSS

### 5. **Performance**
- Lazy loading para rutas
- Optimizar imágenes
- Minimizar re-renders innecesarios

## 🧪 Testing

### Ejecutar tests (cuando se implementen)
```bash
npm run test
```

### Ejecutar tests en modo watch
```bash
npm run test:watch
```

## 📦 Scripts Disponibles

```json
{
  "dev": "vite",                    // Servidor de desarrollo
  "build": "vite build",           // Construcción para producción
  "preview": "vite preview",       // Previsualizar build
  "lint": "eslint .",              // Linting del código
  "lint:fix": "eslint . --fix"     // Linting con auto-fix
}
```

## 🔍 Debugging

### Herramientas de Desarrollo
- **Vue DevTools** - Extensión del navegador para debugging
- **Console logs** - Usar `console.log()` para debugging
- **Network tab** - Monitorear llamadas a API

### Logs de Desarrollo
El proyecto incluye logs detallados para debugging:
```javascript
console.log('🔄 Toggle dropdown clickeado');
console.log('Estado actual:', isUserDropdownOpen.value);
```

## 🤝 Contribución

### Flujo de Trabajo
1. Crear una nueva rama desde `main`
2. Implementar cambios
3. Ejecutar tests y linting
4. Crear Pull Request
5. Revisión de código
6. Merge a `main`

### Commits
Usar convención de commits:
```
feat: agregar nueva funcionalidad
fix: corregir bug
docs: actualizar documentación
style: cambios de estilo
refactor: refactorizar código
test: agregar tests
```

## 📞 Soporte

Para dudas o problemas:
- Revisar la documentación
- Consultar issues existentes
- Crear nuevo issue con detalles completos

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

---

**Desarrollado con ❤️ para la gestión inteligente del agua**
