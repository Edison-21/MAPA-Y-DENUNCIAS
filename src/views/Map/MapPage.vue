<template>
  <div class="map-page glassmorphism">
    <!-- Header avanzado con gradiente, reloj y KPIs -->
    <header class="gradient-header">
      <div class="header-content">
        <div class="header-title-block">
          <h1>Visualización Territorial del Consumo Hídrico</h1>
          <div class="subtitle">Distrito Metropolitano de Quito - Monitoreo por zonas y parroquias</div>
          <div class="clock">{{ currentTime }}</div>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <span class="stat-icon online">💧</span>
            <div class="stat-info">
              <span class="stat-number">1,248,450</span>
              <span class="stat-label">m³ Consumidos</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon alert">⚠️</span>
            <div class="stat-info">
              <span class="stat-number">12</span>
              <span class="stat-label">Alertas Activas</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon offline">📡</span>
            <div class="stat-info">
              <span class="stat-number">32</span>
              <span class="stat-label">Dispositivos IoT</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon users">👥</span>
            <div class="stat-info">
              <span class="stat-number">5,200</span>
              <span class="stat-label">Usuarios Atendidos</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="map-dashboard-layout">
      <aside class="map-sidebar">
        <!-- Filtros y leyenda -->
        <div class="sidebar-section">
          <h2>Filtros y Controles</h2>
          <div class="filter-group">
            <label class="filter-label">ADMINISTRACIÓN ZONAL</label>
            <div class="input-icon-group">
              <span class="input-icon">🏢</span>
              <select v-model="selectedZone" class="filter-select">
                <option value="">Todas las zonas</option>
                <option v-for="zone in zones" :key="zone" :value="zone">{{ zone }}</option>
              </select>
            </div>
          </div>
          <div class="filter-group">
            <label class="filter-label">TIPO DE DISPOSITIVO</label>
            <div class="input-icon-group">
              <span class="input-icon">🔧</span>
              <select v-model="selectedType" class="filter-select">
                <option value="">Todos</option>
                <option value="sensor">Sensor</option>
                <option value="valve">Válvula</option>
                <option value="meter">Medidor</option>
                <option value="pump">Bomba</option>
              </select>
            </div>
          </div>
          <div class="filter-group">
            <label class="filter-label">ESTADO</label>
            <div class="input-icon-group">
              <span class="input-icon">📶</span>
              <select v-model="selectedStatus" class="filter-select">
                <option value="">Todos</option>
                <option value="online">En línea</option>
                <option value="offline">Desconectado</option>
                <option value="alert">Alerta</option>
                <option value="maintenance">Mantenimiento</option>
              </select>
            </div>
          </div>
          <div class="filter-group">
            <label class="filter-label">FECHA</label>
            <div class="input-icon-group">
              <span class="input-icon">📅</span>
              <input type="date" v-model="selectedDate" />
            </div>
          </div>
          <div class="filter-group">
            <label class="filter-label">TIPO DE MARCADOR</label>
            <div class="input-icon-group">
              <span class="input-icon">📍</span>
              <select v-model="selectedMarkerType" class="filter-select">
                <option value="all">Todos</option>
                <option value="devices">Dispositivos</option>
                <option value="complaints">Denuncias</option>
              </select>
            </div>
          </div>
          <button
            class="glass-button primary mt-2 map-refresh-btn"
            @click="refreshMap"
            title="Actualizar resultados del mapa"
          >
            <span class="btn-icon">🔄</span>
            Actualizar
          </button>
        </div>
        <div class="sidebar-section legend-section">
          <div class="legend-card-glass">
            <h3 class="legend-title"><span class="legend-icon-main">📊</span> Leyenda de Consumo</h3>
            <ul class="legend-list-modern">
              <li><span class="legend-dot legend-dot-bajo"></span><span class="legend-label">Bajo</span> <span class="legend-range">(0-5,000 m³)</span></li>
              <li><span class="legend-dot legend-dot-medio"></span><span class="legend-label">Medio</span> <span class="legend-range">(5,001-15,000 m³)</span></li>
              <li><span class="legend-dot legend-dot-alto"></span><span class="legend-label">Alto</span> <span class="legend-range">(15,001-30,000 m³)</span></li>
              <li><span class="legend-dot legend-dot-muyalto"></span><span class="legend-label">Muy Alto</span> <span class="legend-range">(&gt;30,000 m³)</span></li>
            </ul>
          </div>
        </div>
        <div class="sidebar-section">
          <h3>Dispositivos Cercanos</h3>
          <ul class="device-list">
            <li v-for="device in filteredDevices" :key="device.id" :class="['device-item', device.status]">
              <div class="device-info">
                <span class="device-type-icon">{{ getDeviceIcon(device.type) }}</span>
                <div>
                  <div class="device-name">{{ device.name }}</div>
                  <div class="device-status-label">{{ getStatusText(device.status) }}</div>
                </div>
              </div>
              <div class="device-meta">
                <span class="device-zone">{{ device.zone }}</span>
              </div>
            </li>
          </ul>
        </div>
      </aside>
      <section class="map-dashboard-main">
        <div id="map" class="map-leaflet map-leaflet-large"></div>
        <div class="map-panels-row">
          <div class="glass-card panel-graph">
            <h4>Consumo por Administración Zonal</h4>
            <canvas id="zoneChart"></canvas>
          </div>
          <div class="glass-card panel-graph">
            <h4>Variación Temporal</h4>
            <canvas id="timeChart"></canvas>
          </div>
          <div class="glass-card panel-graph panel-parish">
            <h4>Distribución por Parroquia</h4>
            <canvas id="parishChart"></canvas>
          </div>
        </div>
        <div class="map-bottom-fill">
          <div class="map-bottom-message">
            <span class="map-bottom-icon">🌊</span>
            <div class="map-bottom-text">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;">
                <ellipse cx="45" cy="70" rx="35" ry="12" fill="#bae6fd"/>
                <path d="M45 10C55 30 80 40 45 80C10 40 35 30 45 10Z" fill="#0ea5e9" fill-opacity="0.7"/>
                <path d="M45 20C52 32 70 38 45 70C20 38 38 32 45 20Z" fill="#38bdf8" fill-opacity="0.5"/>
              </svg>
              <br>
              <span>¡El agua es vida!<br>Monitorea, cuida y actúa por un futuro sostenible.</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-if="showAssignModal" class="modal-overlay" @click="showAssignModal = false">
      <div class="modal-content" @click.stop>
        <h3>Asignar Denuncia</h3>
        <p>¿A qué usuario o equipo deseas asignar la denuncia #{{ assignComplaintId }}?</p>
        <input placeholder="Equipo o usuario..." />
        <div class="modal-actions">
          <button @click="showAssignModal = false">Cancelar</button>
          <button @click="showAssignModal = false">Asignar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Chart from 'chart.js/auto'
import { useRouter } from 'vue-router'

const currentTime = ref('')
const selectedZone = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
const selectedDate = ref('')
const selectedMarkerType = ref('all') // 'all', 'devices', 'complaints'

const zones = [
  'Centro', 'Norte', 'Sur', 'Valle de Los Chillos', 'Tumbaco', 'Quitumbe', 'Cumbayá', 'Eloy Alfaro', 'Manuela Sáenz'
]

const devices = ref([
  { id: '1', name: 'Sensor de Presión Norte', type: 'sensor', status: 'online', location: { lat: -0.170653, lng: -78.467834 }, zone: 'Norte' },
  { id: '2', name: 'Válvula Principal Este', type: 'valve', status: 'online', location: { lat: -0.180653, lng: -78.457834 }, zone: 'Centro' },
  { id: '3', name: 'Medidor Residencial', type: 'meter', status: 'alert', location: { lat: -0.185653, lng: -78.477834 }, zone: 'Centro' },
  { id: '4', name: 'Bomba de Refuerzo', type: 'pump', status: 'offline', location: { lat: -0.190653, lng: -78.467834 }, zone: 'Sur' },
  { id: '5', name: 'Sensor de Caudal', type: 'sensor', status: 'maintenance', location: { lat: -0.175653, lng: -78.470834 }, zone: 'Norte' }
])

// Mock de denuncias con lat/lng y usuario
const complaints = ref([
  { id: 'd1', title: 'Fuga en medidor', status: 'pending', priority: 'high', user: 'Juan Pérez', lat: -0.172, lng: -78.468, zone: 'Norte' },
  { id: 'd2', title: 'Fuga de agua en calle', status: 'urgent', priority: 'critical', user: 'Ana Gómez', lat: -0.181, lng: -78.462, zone: 'Centro' },
  { id: 'd3', title: 'Problema App', status: 'resolved', priority: 'medium', user: 'Carlos Ruiz', lat: -0.186, lng: -78.478, zone: 'Centro' },
  { id: 'd4', title: 'Desconexión IoT', status: 'in-progress', priority: 'low', user: 'María León', lat: -0.191, lng: -78.469, zone: 'Sur' }
])

const filteredDevices = ref([])
const filteredComplaints = ref([])

const router = useRouter()
const showAssignModal = ref(false)
const assignComplaintId = ref(null)

function getDeviceIcon(type) {
  switch (type) {
    case 'sensor': return '📡'
    case 'valve': return '🔧'
    case 'meter': return '📈'
    case 'pump': return '⚡'
    default: return '📍'
  }
}
function getStatusText(status) {
  switch (status) {
    case 'online': return 'EN LÍNEA'
    case 'offline': return 'DESCONECTADO'
    case 'alert': return 'ALERTA'
    case 'maintenance': return 'MANTENIMIENTO'
    case 'pending': return 'Pendiente'
    case 'urgent': return 'Urgente'
    case 'resolved': return 'Resuelta'
    case 'in-progress': return 'En proceso'
    default: return status
  }
}
function getPriorityText(priority) {
  switch (priority) {
    case 'low': return 'Baja'
    case 'medium': return 'Media'
    case 'high': return 'Alta'
    case 'critical': return 'Crítica'
    default: return priority
  }
}
function getLeafletMarkerOptions(device) {
  let color = '#64748b';
  if (device.status === 'alert' || device.status === 'urgent') color = 'orange';
  else if (device.status === 'offline') color = '#e11d48';
  else if (device.type === 'sensor') color = '#0ea5e9';
  else if (device.type === 'valve') color = '#22c55e';
  else if (device.type === 'meter') color = '#a21caf';
  else if (device.type === 'pump') color = '#facc15';
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};width:22px;height:22px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 6px ${color};"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
    popupAnchor: [0, -22]
  })
}
function getComplaintMarkerOptions(complaint) {
  let color = '#64748b';
  if (complaint.status === 'urgent') color = '#ef4444';
  else if (complaint.status === 'pending') color = '#f59e0b';
  else if (complaint.status === 'resolved') color = '#10b981';
  else if (complaint.status === 'in-progress') color = '#0891b2';
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};width:22px;height:22px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 6px ${color};"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
    popupAnchor: [0, -22]
  })
}
function refreshMap() {
  filterDevices()
  filterComplaints()
  setTimeout(() => {
    renderMap()
  }, 100)
}
function filterDevices() {
  filteredDevices.value = devices.value.filter(d => {
    return (
      (!selectedZone.value || d.zone === selectedZone.value) &&
      (!selectedType.value || d.type === selectedType.value) &&
      (!selectedStatus.value || d.status === selectedStatus.value)
    )
  })
}
function filterComplaints() {
  filteredComplaints.value = complaints.value.filter(c => {
    return (
      (!selectedZone.value || c.zone === selectedZone.value) &&
      (!selectedStatus.value || c.status === selectedStatus.value)
    )
  })
}
let mapInstance = null
function renderMap() {
  if (mapInstance) {
    mapInstance.remove()
  }
  mapInstance = L.map('map').setView([-0.180653, -78.467834], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapInstance)
  if (selectedMarkerType.value === 'all' || selectedMarkerType.value === 'devices') {
    filteredDevices.value.forEach(device => {
      const marker = L.marker([device.location.lat, device.location.lng], {
        icon: getLeafletMarkerOptions(device)
      }).addTo(mapInstance)
      marker.bindPopup(`
        <div class='popup-glass popup-visual'>
          <div class='popup-header'>
            <span class='popup-icon popup-device'>${getDeviceIcon(device.type)}</span>
            <div class='popup-title-block'>
              <span class='popup-title'>${device.name}</span>
              <div class='popup-badges'>
                <span class='badge badge-status ${device.status}'>${getStatusText(device.status)}</span>
                <span class='badge badge-type'>${getDeviceIcon(device.type)} ${device.type.charAt(0).toUpperCase() + device.type.slice(1)}</span>
                <span class='badge badge-zone'>${device.zone}</span>
              </div>
            </div>
          </div>
        </div>
      `)
    })
  }
  if (selectedMarkerType.value === 'all' || selectedMarkerType.value === 'complaints') {
    filteredComplaints.value.forEach(complaint => {
      const statusColor = {
        'pending': '#f59e0b',
        'in-progress': '#0891b2',
        'resolved': '#10b981',
        'urgent': '#ef4444'
      }[complaint.status] || '#64748b';
      const marker = L.marker([complaint.lat, complaint.lng], {
        icon: getComplaintMarkerOptions(complaint)
      }).addTo(mapInstance)
      marker.bindPopup(`
        <div class='popup-glass popup-visual'>
          <div class='popup-header'>
            <span class='popup-icon popup-complaint'>🚨</span>
            <div class='popup-title-block'>
              <span class='popup-title'>${complaint.title}</span>
              <div class='popup-badges'>
                <span class='badge badge-status ${complaint.status}'>${getStatusText(complaint.status)}</span>
                <span class='badge badge-priority ${complaint.priority}'>${getPriorityText(complaint.priority)}</span>
              </div>
            </div>
          </div>
          <div class='popup-user-row'>
            <span class='popup-avatar'>👤</span>
            <span class='popup-user-name'>${complaint.user}</span>
          </div>
        </div>
      `)
    })
  }
}
function updateClock() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
    '  ' + now.toLocaleDateString('es-EC', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}
function renderCharts() {
  // Consumo por zona
  new Chart(document.getElementById('zoneChart'), {
    type: 'bar',
    data: {
      labels: ['Centro', 'Norte', 'Sur', 'Valle de Los Chillos', 'Tumbaco'],
      datasets: [{
        label: 'Consumo (m³)',
        data: [42780, 38450, 36120, 29500, 21000],
        backgroundColor: ['#0ea5e9', '#06b6d4', '#f59e0b', '#10b981', '#ef4444']
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  })
  // Variación temporal
  new Chart(document.getElementById('timeChart'), {
    type: 'line',
    data: {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [{
        label: 'Consumo Mensual',
        data: [20000, 22000, 21000, 25000, 24000, 24800],
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14,165,233,0.1)',
        fill: true
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  })
  // Distribución por parroquia
  new Chart(document.getElementById('parishChart'), {
    type: 'doughnut',
    data: {
      labels: ['Centro Histórico', 'Norte', 'Valle de Los Chillos', 'Tumbaco', 'Quitumbe'],
      datasets: [{
        label: 'Consumo',
        data: [42780, 38450, 36120, 29500, 21000],
        backgroundColor: ['#0ea5e9', '#06b6d4', '#f59e0b', '#10b981', '#ef4444']
      }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  })
}
onMounted(() => {
  updateClock()
  setInterval(updateClock, 1000)
  filterDevices()
  filterComplaints()
  renderMap()
  setTimeout(renderCharts, 500)
})
watch([selectedZone, selectedType, selectedStatus], () => {
  filterDevices()
  filterComplaints()
})
if (typeof window !== 'undefined') {
  window.__openComplaintDetailVue = (id) => {
    router.push(`/app/complaints/${id}`)
  }
  window.__openAssignComplaintVue = (id) => {
    assignComplaintId.value = id
    showAssignModal.value = true
  }
}
</script>

<style scoped>
.map-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #e0f2fe 100%);
  position: relative;
}
.gradient-header {
  /* Usa los estilos de _map.scss */
}
.header-content .clock {
  font-size: 1.1rem;
  color: #e0f2fe;
  margin-top: 0.5rem;
}
.map-dashboard-layout {
  display: flex;
  gap: 2rem;
  width: 100%;
  min-height: 70vh;
  align-items: flex-start;
}
.map-sidebar {
  width: 320px;
  min-width: 260px;
  background: rgba(255,255,255,0.85);
  border-right: 1px solid #e5e7eb;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: 2px 0 8px rgba(14, 165, 233, 0.04);
  overflow-y: auto;
  height: 100%;
}
.filters-section, .sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.filter-group, .sidebar-section .filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.input-icon-group, .filter-select, .input-icon-group input[type="date"] {
  width: 100%;
  min-width: 0;
  max-width: 260px;
  box-sizing: border-box;
}
.input-icon-group {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 8px rgba(14,165,233,0.07);
  padding: 0.3rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: 0.1rem;
}
.input-icon-group .input-icon {
  font-size: 1.25rem;
  color: #0ea5e9;
  min-width: 1.5rem;
  text-align: center;
}
.input-icon-group input[type="date"] {
  border: none;
  background: transparent;
  padding: 0.5rem 0.2rem;
  font-size: 1.08rem;
  color: #334155;
  box-shadow: none;
  outline: none;
  width: 100%;
  min-width: 190px;
  max-width: 270px;
}
.input-icon-group input[type="date"]:focus {
  background: #f0f9ff;
}
.filter-select {
  border: none;
  background: transparent;
  padding: 0.5rem 0.2rem;
  font-size: 1.08rem;
  color: #0ea5e9;
  outline: none;
  width: 100%;
}
.filter-select:focus {
  background: #f0f9ff;
}
.legend-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.legend-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  margin-right: 0.5rem;
}
.device-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.device-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  background: #f4f8fb;
  box-shadow: 0 1px 4px rgba(14, 165, 233, 0.04);
  font-size: 0.98rem;
}
.device-item.online { border-left: 4px solid #10b981; }
.device-item.offline { border-left: 4px solid #ef4444; }
.device-item.alert { border-left: 4px solid #f59e0b; }
.device-info {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.device-type-icon {
  font-size: 1.5rem;
}
.device-name {
  font-weight: 600;
  color: #0f172a;
}
.device-status-label {
  font-size: 0.85rem;
  color: #64748b;
}
.device-meta {
  font-size: 0.8rem;
  color: #64748b;
}
.map-dashboard-main {
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 0;
}
.map-leaflet {
  width: 100%;
  height: 60vh;
  min-height: 350px;
  max-height: 500px;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(31,38,135,0.15);
  margin-bottom: 1.5rem;
  max-width: 100%;
}
.map-leaflet-large {
  height: 60vh;
  min-height: 350px;
  max-height: 500px;
}
.map-panels-row {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  width: 100%;
}
.panel-graph {
  flex: 1 1 320px;
  min-width: 280px;
  max-width: 400px;
  min-height: 260px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.panel-parish {
  max-width: 340px;
}
.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 2px 2px 2px 0;
  background: #e0f2fe;
  color: #0ea5e9;
}
.badge-status {
  background: #f0f9ff;
  color: #0891b2;
}
.badge-priority {
  background: #f59e0b22;
  color: #f59e0b;
}
.badge-user {
  background: #e0f2fe;
  color: #0ea5e9;
}
.badge-type {
  background: #e0f2fe;
  color: #0ea5e9;
}
.map-kpi-row {
  display: flex;
  gap: 2.2rem;
  margin: 2.5rem 0 0 0;
  justify-content: center;
  flex-wrap: wrap;
}
.map-kpi-card {
  background: rgba(255,255,255,0.92);
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(14,165,233,0.08);
  padding: 1.2rem 2.2rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  min-width: 220px;
  min-height: 90px;
  transition: box-shadow 0.18s, transform 0.18s;
}
.map-kpi-card:hover {
  box-shadow: 0 6px 24px rgba(14,165,233,0.13);
  transform: translateY(-3px) scale(1.03);
}
.map-kpi-icon {
  font-size: 2.2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  width: 3.2rem;
  height: 3.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 6px rgba(14,165,233,0.08);
}
.map-kpi-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.map-kpi-value {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0ea5e9;
}
.map-kpi-label {
  font-size: 1rem;
  color: #64748b;
}
@media (max-width: 1200px) {
  .map-dashboard-layout {
    flex-direction: column;
    gap: 1.5rem;
  }
  .map-sidebar {
    width: 100%;
    min-width: 0;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1.2rem;
    padding: 1.2rem 1rem;
  }
  .map-dashboard-main {
    padding: 0;
  }
  .map-panels-row {
    flex-direction: column;
    align-items: stretch;
    gap: 1.2rem;
  }
  .panel-graph {
    max-width: 100%;
    min-width: 0;
  }
}
@media (max-width: 900px) {
  .map-dashboard-layout {
    flex-direction: column;
    gap: 1rem;
  }
  .map-sidebar {
    width: 100%;
    min-width: 0;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0.5rem;
  }
  .map-dashboard-main {
    padding: 0;
  }
  .map-leaflet, .map-leaflet-large {
    height: 40vh;
    min-height: 220px;
    max-height: 350px;
  }
  .map-panels-row {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .panel-graph {
    max-width: 100%;
    min-width: 0;
  }
}
body.sidebar-collapsed .map-dashboard-layout,
body.sidebar-collapsed .map-dashboard-main,
body.sidebar-collapsed .map-leaflet,
body.sidebar-collapsed .map-leaflet-large {
  width: 100vw !important;
  max-width: 100vw !important;
  padding-left: 0 !important;
}
.map-bottom-fill {
  width: 100%;
  min-height: 120px;
  margin-top: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #e0f2fe 60%, #bae6fd 100%);
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(14,165,233,0.06);
}
.map-bottom-message {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.map-bottom-icon {
  font-size: 3.2rem;
  color: #0ea5e9;
}
.map-bottom-text {
  font-size: 1.18rem;
  color: #0f172a;
  font-weight: 600;
  text-align: left;
}
.popup-glass.popup-visual {
  background: rgba(255,255,255,0.97);
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px rgba(14,165,233,0.13), 0 1.5px 8px rgba(31,38,135,0.07);
  padding: 1.3rem 1.7rem 1.2rem 1.7rem;
  min-width: 270px;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.8rem;
}
.popup-header {
  display: flex;
  align-items: flex-start;
  gap: 1.1rem;
  margin-bottom: 0.2rem;
}
.popup-icon.popup-device {
  font-size: 2.7rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #bae6fd 100%);
  border-radius: 50%;
  width: 3.3rem;
  height: 3.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 6px rgba(14,165,233,0.08);
  margin-top: 0.1rem;
}
.popup-title-block {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.popup-title {
  font-size: 1.18rem;
  font-weight: 800;
  color: #0ea5e9;
  margin-bottom: 0.1rem;
}
.popup-badges {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.1rem;
}
.popup-user-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.2rem;
  margin-top: 0.1rem;
}
.popup-avatar {
  font-size: 1.2rem;
  background: #e0f2fe;
  border-radius: 50%;
  width: 1.7rem;
  height: 1.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup-user-name {
  font-size: 1rem;
  color: #334155;
  font-weight: 600;
}
.popup-actions {
  display: flex;
  gap: 1.1rem;
  margin-top: 0.7rem;
  justify-content: flex-end;
}
.popup-btn {
  border-radius: 1.1rem;
  padding: 0.5rem 1.4rem;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 1px 4px rgba(14,165,233,0.04);
  min-width: 110px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.popup-btn.assign-btn {
  background: #e0f2fe;
  color: #0ea5e9;
  border: none;
}
.popup-btn.assign-btn:hover {
  background: #bae6fd;
  color: #0369a1;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 300px;
  width: 100%;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.modal-actions button {
  margin-left: 10px;
}
.badge-status.online { background: #10b981; color: #fff; }
.badge-status.offline { background: #ef4444; color: #fff; }
.badge-status.alert { background: #f59e0b; color: #fff; }
.badge-status.maintenance { background: #64748b; color: #fff; }
.badge-type { background: #e0f2fe; color: #0ea5e9; }
.badge-zone { background: #bae6fd; color: #0369a1; }
.popup-glass.popup-complaint-visual {
  background: rgba(255,255,255,0.97);
  border-radius: 1.3rem;
  box-shadow: 0 8px 32px rgba(14,165,233,0.13), 0 1.5px 8px rgba(31,38,135,0.07);
  padding: 1.5rem 1.7rem 1.3rem 1.7rem;
  min-width: 250px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
}
.popup-complaint-icon-outer {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 3.7rem;
  height: 3.7rem;
  background: #fff;
  margin-bottom: 0.2rem;
}
.popup-complaint-icon {
  font-size: 2.3rem;
  background: #fff;
  border-radius: 50%;
  width: 3.1rem;
  height: 3.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup-complaint-title {
  font-size: 1.22rem;
  font-weight: 900;
  color: #0ea5e9;
  text-align: center;
  margin-bottom: 0.1rem;
}
.popup-complaint-badges {
  display: flex;
  gap: 0.6rem;
  margin: 0.2rem 0 0.1rem 0;
  justify-content: center;
}
.popup-complaint-badge {
  border-radius: 1rem;
  padding: 0.22rem 0.95rem;
  font-size: 0.98rem;
  font-weight: 700;
  border: 1.5px solid #e0e7ef;
  box-shadow: 0 1px 4px rgba(14,165,233,0.04);
  background: #f8fafc;
}
.badge-status.pending { background: #f59e0b; color: #fff; border-color: #fbbf24; }
.badge-status.in-progress { background: #0891b2; color: #fff; border-color: #38bdf8; }
.badge-status.resolved { background: #10b981; color: #fff; border-color: #34d399; }
.badge-status.urgent { background: #ef4444; color: #fff; border-color: #fca5a5; }
.badge-priority.high { background: #f59e0b22; color: #f59e0b; border-color: #fbbf24; }
.badge-priority.critical { background: #ef444422; color: #ef4444; border-color: #fca5a5; }
.badge-priority.medium { background: #0891b222; color: #0891b2; border-color: #38bdf8; }
.badge-priority.low { background: #10b98122; color: #10b981; border-color: #34d399; }
.popup-complaint-user-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.2rem;
}
.popup-complaint-avatar {
  font-size: 1.2rem;
  background: #e0f2fe;
  border-radius: 50%;
  width: 1.7rem;
  height: 1.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup-complaint-user-name {
  font-size: 1rem;
  color: #334155;
  font-weight: 600;
}
.input-icon-group input[type="date"] {
  border: 1.5px solid #d1e7f7;
  border-radius: 0.8rem;
  background: #fff;
  padding: 0.5rem 1.1rem;
  font-size: 1rem;
  color: #334155;
  box-shadow: 0 1px 4px rgba(14,165,233,0.04);
  transition: border 0.2s, box-shadow 0.2s;
  outline: none;
  width: 160px;
}
.input-icon-group input[type="date"]:focus {
  border-color: #0ea5e9;
  box-shadow: 0 2px 8px rgba(14,165,233,0.10);
}
.input-icon-group {
  background: #fff;
  border-radius: 0.8rem;
  box-shadow: 0 1px 4px rgba(14,165,233,0.04);
  padding: 0.2rem 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.input-icon-group .input-icon {
  font-size: 1.2rem;
  color: #0ea5e9;
}
@media (max-width: 600px) {
  .input-icon-group, .filter-select, .input-icon-group input[type="date"] {
    max-width: 100%;
  }
}
</style>

