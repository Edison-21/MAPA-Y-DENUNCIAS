#!/bin/bash

# Script para crear la estructura base del proyecto iot-water

mkdir -p public
echo "<!-- HTML principal -->" > public/index.html

mkdir -p src/assets/images
mkdir -p src/assets/fonts
mkdir -p src/assets/styles
echo "// Variables SCSS" > src/assets/styles/_variables.scss
echo "// Estilos principales" > src/assets/styles/main.scss

mkdir -p src/components
touch src/components/BaseButton.vue
touch src/components/AppLoader.vue
touch src/components/ConfirmationModal.vue

mkdir -p src/layouts
touch src/layouts/DefaultLayout.vue
touch src/layouts/AuthLayout.vue

mkdir -p src/mixins
touch src/mixins/formValidation.js

mkdir -p src/router
touch src/router/index.js

mkdir -p src/stores
touch src/stores/auth.js
touch src/stores/devices.js
touch src/stores/crm.js
touch src/stores/map.js
touch src/stores/complaints.js
touch src/stores/incidents.js

mkdir -p src/views/Auth
touch src/views/Auth/LoginPage.vue
touch src/views/Auth/RegisterPage.vue
touch src/views/Auth/ForgotPasswordPage.vue

mkdir -p src/views/Dashboard
touch src/views/Dashboard/DashboardOverview.vue

mkdir -p src/views/Devices
touch src/views/Devices/DeviceListPage.vue
touch src/views/Devices/DeviceDetailPage.vue
touch src/views/Devices/DeviceMaintenancePage.vue

mkdir -p src/views/CRM
touch src/views/CRM/ClientListPage.vue
touch src/views/CRM/ClientDetailPage.vue
touch src/views/CRM/ConversationListPage.vue
touch src/views/CRM/ConversationDetailPage.vue

mkdir -p src/views/Map
touch src/views/Map/MapPage.vue

mkdir -p src/views/Complaints
touch src/views/Complaints/ComplaintListPage.vue
touch src/views/Complaints/ComplaintDetailPage.vue

mkdir -p src/views/Incidents
touch src/views/Incidents/IncidentListPage.vue
touch src/views/Incidents/IncidentDetailPage.vue

mkdir -p src/views/Personnel
touch src/views/Personnel/PersonnelListPage.vue
touch src/views/Personnel/PersonnelDetailPage.vue

touch src/views/NotFoundPage.vue

mkdir -p src/services
touch src/services/auth.service.js
touch src/services/devices.service.js
touch src/services/crm.service.js
touch src/services/map.service.js
touch src/services/complaints.service.js
touch src/services/incidents.service.js
touch src/services/users.service.js
touch src/services/api.js

mkdir -p src/utils
touch src/utils/helpers.js
touch src/utils/constants.js
touch src/utils/date.js

touch src/App.vue
touch src/main.js

touch .env
touch .eslintrc.js
touch .prettierrc
touch package.json
touch vite.config.js

echo "Estructura creada correctamente en la carpeta " 