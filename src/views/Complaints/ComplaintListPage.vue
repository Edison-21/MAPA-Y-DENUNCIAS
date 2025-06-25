<template>
  <div class="complaint-list-page">
    <!-- Header con KPIs y gráficos -->
    <header class="gradient-header">
      <div class="header-content">
        <div>
          <h1>Denuncias Administrativas - Sistema de Agua e IoT</h1>
          <div class="subtitle">Gestión interna de incidencias relacionadas con el sistema de agua, dispositivos IoT o problemas de medición.</div>
        </div>
        <div class="header-kpis">
          <div class="kpi-card">
            <span class="kpi-label">Totales</span>
            <span class="kpi-value">{{ kpiTotals.total }}</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Abiertas</span>
            <span class="kpi-value">{{ kpiTotals.open }}</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Cerradas</span>
            <span class="kpi-value">{{ kpiTotals.closed }}</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Tiempo Promedio</span>
            <span class="kpi-value">{{ kpiTotals.avgTime }}h</span>
          </div>
        </div>
      </div>
      <div class="header-graphs">
        <div class="graph-card">
          <h4>Tipos de Incidencias</h4>
          <canvas id="typeChart"></canvas>
        </div>
        <div class="graph-card">
          <h4>Estado de Incidencias</h4>
          <canvas id="statusChart"></canvas>
        </div>
      </div>
    </header>

    <!-- Filtros avanzados -->
    <section class="toolbar-section modern-toolbar">
      <div class="toolbar-content" style="display:flex; align-items:center; justify-content:space-between; gap:2rem;">
        <div class="search-section">
          <div class="search-container">
            <span class="search-icon">🔍</span>
            <input v-model="searchQuery" class="search-input" type="text" placeholder="Buscar denuncia..." @input="handleSearch" />
            <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">✕</button>
          </div>
        </div>
        <div class="filters-section">
          <div class="filter-group">
            <label>Estado</label>
            <select v-model="selectedStatus" class="filter-select">
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="in-progress">En Proceso</option>
              <option value="resolved">Resuelta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Prioridad</label>
            <select v-model="selectedPriority" class="filter-select">
              <option value="">Todas</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Categoría</label>
            <select v-model="selectedCategory" class="filter-select">
              <option value="">Todas</option>
              <option v-for="category in categories" :key="category.value" :value="category.value">{{ category.label }}</option>
            </select>
          </div>
        </div>
        <button class="glass-button primary big-new-complaint-btn" @click="showCreateModal = true">+ Nueva Denuncia</button>
      </div>
    </section>

    <!-- Alternancia tabla/tarjetas y paginación -->
    <section class="complaints-table-section">
      <div class="view-toggle">
        <button :class="{active: viewMode==='table'}" @click="viewMode='table'">Tabla</button>
        <button :class="{active: viewMode==='cards'}" @click="viewMode='cards'">Tarjetas</button>
      </div>
      <table v-if="viewMode==='table'" class="complaints-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Categoría</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Reportado por</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="complaint in paginatedComplaints" :key="complaint.id">
            <td>#{{ complaint.id }}</td>
            <td>{{ complaint.title }}</td>
            <td>{{ getCategoryText(complaint.category) }}</td>
            <td><span :class="'priority-badge ' + complaint.priority">{{ getPriorityText(complaint.priority) }}</span></td>
            <td><span :class="'status-badge ' + complaint.status">{{ getStatusText(complaint.status) }}</span></td>
            <td>{{ complaint.reporter }}</td>
            <td>{{ formatDate(complaint.createdAt) }}</td>
            <td>
              <button class="action-btn" @click.stop="viewComplaint(complaint)">Ver</button>
            </td>
          </tr>
          <tr v-if="!paginatedComplaints.length">
            <td colspan="8" class="no-complaints">No hay denuncias para mostrar.</td>
          </tr>
        </tbody>
      </table>
      <div v-if="viewMode==='cards'" class="complaints-cards">
        <div v-for="complaint in paginatedComplaints" :key="complaint.id" class="complaint-card glass-card">
          <div class="card-header">
            <span class="card-id">#{{ complaint.id }}</span>
            <span class="status-badge" :class="complaint.status">{{ getStatusText(complaint.status) }}</span>
          </div>
          <div class="card-title">{{ complaint.title }}</div>
          <div class="card-meta">
            <span class="category-badge">{{ getCategoryText(complaint.category) }}</span>
            <span class="priority-badge" :class="complaint.priority">{{ getPriorityText(complaint.priority) }}</span>
          </div>
          <div class="card-footer">
            <span>{{ complaint.reporter }}</span>
            <span>{{ formatDate(complaint.createdAt) }}</span>
            <button class="action-btn" @click.stop="viewComplaint(complaint)">Ver</button>
          </div>
        </div>
        <div v-if="!paginatedComplaints.length" class="no-complaints">No hay denuncias para mostrar.</div>
      </div>
      <div class="pagination-bar">
        <button :disabled="currentPage===1" @click="currentPage--">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button :disabled="currentPage===totalPages" @click="currentPage++">Siguiente</button>
      </div>
    </section>

    <!-- Modal de nueva denuncia -->
    <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="modal-title-wrapper">
            <h2 class="modal-main-title">Nueva Denuncia</h2>
          </div>
          <button class="close-btn" @click="showCreateModal = false">×</button>
        </div>
        <div style="height: 0.7rem;"></div>
        <div class="modal-body">
          <form @submit.prevent="createComplaint" class="complaint-form">
            <div class="form-group">
              <label>Título</label>
              <input v-model="newComplaint.title" type="text" required />
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="newComplaint.description" rows="4" required></textarea>
            </div>
            <div class="form-row responsive-row">
              <div class="form-group">
                <label>Categoría</label>
                <select v-model="newComplaint.category" required>
                  <option value="">Seleccionar categoría</option>
                  <option v-for="category in categories" :key="category.value" :value="category.value">{{ category.label }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Prioridad</label>
                <select v-model="newComplaint.priority" required>
                  <option value="">Seleccionar prioridad</option>
                  <option value="critical">Crítica</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Ubicación (selecciona en el mapa)</label>
              <div id="complaintMap" class="complaint-map"></div>
              <input v-model="newComplaint.location" type="text" placeholder="Coordenadas" readonly />
            </div>
            <div class="form-group file-upload-group">
              <label>Subir evidencia (opcional)</label>
              <div class="custom-file-input-wrapper">
                <label class="custom-file-label" for="evidence-upload">Examinar</label>
                <input id="evidence-upload" type="file" multiple @change="handleFileUpload" />
                <span class="file-upload-info">
                  {{ newComplaint.files && newComplaint.files.length ? newComplaint.files.map(f => f.name).join(', ') : 'No se han seleccionado archivos.' }}
                </span>
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="showCreateModal = false">Cancelar</button>
              <button type="submit" class="btn-primary">Crear Denuncia</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Chart from 'chart.js/auto'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()

// Mock data para KPIs y gráficos
const kpiTotals = ref({ total: 18, open: 12, closed: 6, avgTime: 36 })
const typeChartData = [6, 4, 3, 3, 2]
const statusChartData = [2, 3, 4, 7, 2]

const categories = [
  { label: 'Fuga de Agua', value: 'water-leak' },
  { label: 'Contaminación', value: 'contamination' },
  { label: 'Problema de Medidor', value: 'meter-issue' },
  { label: 'Presión', value: 'pressure' },
  { label: 'Facturación', value: 'billing' },
  { label: 'Otros', value: 'other' }
]

const complaints = ref([
  { id: 1, title: 'Fuga en medidor', category: 'meter-issue', priority: 'high', status: 'pending', reporter: 'Juan Pérez', createdAt: '2024-06-20', location: '-0.18,-78.47' },
  { id: 2, title: 'Fuga de agua en calle', category: 'water-leak', priority: 'critical', status: 'urgent', reporter: 'Ana Gómez', createdAt: '2024-06-19', location: '-0.19,-78.46' },
  { id: 3, title: 'Problema App', category: 'other', priority: 'medium', status: 'resolved', reporter: 'Carlos Ruiz', createdAt: '2024-06-18', location: '-0.17,-78.45' },
  { id: 4, title: 'Desconexión IoT', category: 'other', priority: 'low', status: 'in-progress', reporter: 'María León', createdAt: '2024-06-17', location: '-0.16,-78.44' },
  { id: 5, title: 'Fuga de agua', category: 'water-leak', priority: 'high', status: 'pending', reporter: 'Pedro Díaz', createdAt: '2024-06-16', location: '-0.15,-78.43' },
  // ...más mock data
])

const searchQuery = ref('')
const selectedStatus = ref('')
const selectedPriority = ref('')
const selectedCategory = ref('')
const showCreateModal = ref(false)
const viewMode = ref('table')
const currentPage = ref(1)
const pageSize = 5
const newComplaint = ref({
  title: '',
  description: '',
  category: '',
  priority: '',
  location: '',
  files: []
})

const paginatedComplaints = computed(() => {
  let filtered = complaints.value.filter(c => {
    return (
      (!searchQuery.value || c.title.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
      (!selectedStatus.value || c.status === selectedStatus.value) &&
      (!selectedPriority.value || c.priority === selectedPriority.value) &&
      (!selectedCategory.value || c.category === selectedCategory.value)
    )
  })
  totalPages.value = Math.ceil(filtered.length / pageSize)
  return filtered.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
})
const totalPages = ref(1)

function handleSearch() {
  currentPage.value = 1
}
function viewComplaint(complaint) {
  router.push(`/app/complaints/${complaint.id}`)
}
function createComplaint() {
  // Aquí se agregaría la denuncia a la lista (mock)
  complaints.value.unshift({
    ...newComplaint.value,
    id: complaints.value.length + 1,
    reporter: 'Usuario Actual',
    createdAt: new Date().toISOString().slice(0, 10)
  })
  showCreateModal.value = false
  Object.assign(newComplaint.value, { title: '', description: '', category: '', priority: '', location: '', files: [] })
}
function getStatusText(status) {
  const statusMap = {
    pending: 'Pendiente',
    'in-progress': 'En proceso',
    resolved: 'Resuelta',
    urgent: 'Urgente'
  }
  return statusMap[status] || status
}
function getPriorityText(priority) {
  const priorityMap = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    critical: 'Crítica'
  }
  return priorityMap[priority] || priority
}
function getCategoryText(category) {
  const categoryMap = {
    'water-leak': 'Fuga de Agua',
    contamination: 'Contaminación',
    'meter-issue': 'Problema de Medidor',
    pressure: 'Presión',
    billing: 'Facturación',
    other: 'Otros'
  }
  return categoryMap[category] || category
}
function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
}
function handleFileUpload(e) {
  newComplaint.value.files = Array.from(e.target.files)
}
function initComplaintMap() {
  const map = L.map('complaintMap').setView([-0.18, -78.47], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)
  let marker = null
  map.on('click', function (e) {
    if (marker) map.removeLayer(marker)
    marker = L.marker(e.latlng).addTo(map)
    newComplaint.value.location = `${e.latlng.lat.toFixed(5)},${e.latlng.lng.toFixed(5)}`
  })
}
onMounted(() => {
  // Gráficos de tipos y estados
  new Chart(document.getElementById('typeChart'), {
    type: 'doughnut',
    data: {
      labels: ['Falla en medidor', 'Fuga de agua', 'Problema App', 'Desconexión IoT', 'Otros'],
      datasets: [{
        data: typeChartData,
        backgroundColor: ['#0ea5e9', '#ef4444', '#f59e0b', '#06b6d4', '#64748b']
      }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  })
  new Chart(document.getElementById('statusChart'), {
    type: 'bar',
    data: {
      labels: ['Recibidas', 'Asignadas', 'En solución', 'Cerradas', 'Urgentes'],
      datasets: [{
        data: statusChartData,
        backgroundColor: '#0ea5e9'
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  })
  watch(showCreateModal, (val) => {
    if (val) setTimeout(initComplaintMap, 300)
  })
})
watch([searchQuery, selectedStatus, selectedPriority, selectedCategory], () => { currentPage.value = 1 })
</script>

<style scoped>
.complaint-list-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #e0f2fe 100%);
  position: relative;
}
.gradient-header {
  /* Usa los estilos de _complaints.scss */
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
  padding: 2rem 2.5rem 1rem 2.5rem;
}
.header-kpis {
  display: flex;
  gap: 1.5rem;
}
.kpi-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.08);
  padding: 1rem 1.5rem;
  text-align: center;
}
.kpi-label {
  font-size: 0.95rem;
  color: #64748b;
}
.kpi-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0ea5e9;
}
.header-graphs {
  display: flex;
  gap: 2rem;
  margin: 2rem 0 0 2.5rem;
}
.graph-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.08);
  padding: 1rem 1.5rem;
  min-width: 320px;
  min-height: 260px;
}
.toolbar-section {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.toolbar-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}
.search-section {
  flex: 1;
}
.search-container {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.04);
  padding: 0.5rem 1rem;
}
.search-input {
  border: none;
  outline: none;
  font-size: 1rem;
  flex: 1;
  background: transparent;
}
.clear-search {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 1.2rem;
}
.filters-section {
  display: flex;
  gap: 1.2rem;
}
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.complaints-table-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.04);
  padding: 2rem 1.5rem;
  margin-top: 2rem;
}
.view-toggle {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.view-toggle button {
  background: #e0f2fe;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.view-toggle button.active {
  background: #0ea5e9;
  color: #fff;
}
.complaints-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
}
.complaints-table th, .complaints-table td {
  padding: 0.8rem 0.7rem;
  text-align: left;
}
.complaints-table th {
  background: #e0f2fe;
  color: #0ea5e9;
  font-weight: 700;
}
.complaints-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}
.complaint-card {
  min-width: 320px;
  max-width: 350px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 1.2rem 1rem;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-id {
  font-weight: 700;
  color: #0ea5e9;
}
.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
}
.card-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.category-badge {
  background: #0ea5e9;
  color: #fff;
  border-radius: 8px;
  padding: 0.2rem 0.7rem;
  font-size: 0.95rem;
}
.priority-badge {
  border-radius: 8px;
  padding: 0.2rem 0.7rem;
  font-size: 0.95rem;
  color: #fff;
}
.priority-badge.low { background: #10b981; }
.priority-badge.medium { background: #0891b2; }
.priority-badge.high { background: #f59e0b; }
.priority-badge.critical { background: #ef4444; }
.status-badge {
  border-radius: 8px;
  padding: 0.2rem 0.7rem;
  font-size: 0.95rem;
  color: #fff;
}
.status-badge.pending { background: #f59e0b; }
.status-badge.in-progress { background: #0891b2; }
.status-badge.resolved { background: #10b981; }
.status-badge.urgent { background: #ef4444; }
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.action-btn {
  background: #0ea5e9;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 1rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}
.action-btn:hover {
  background: #0369a1;
}
.pagination-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
}
.pagination-bar button {
  background: #e0f2fe;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.pagination-bar button:disabled {
  background: #f4f8fb;
  color: #64748b;
  cursor: not-allowed;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(31,38,135,0.15);
  padding: 2.2rem 3.2rem;
  min-width: 520px;
  max-width: 98vw;
  position: relative;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
}
.complaint-form .form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}
.complaint-form .form-row {
  display: flex;
  gap: 2rem;
}
.complaint-form .form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
.btn-primary {
  background: #0ea5e9;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: #0369a1;
}
.btn-secondary {
  background: #e0f2fe;
  color: #0ea5e9;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.complaint-map {
  width: 100%;
  height: 220px;
  border-radius: 12px;
  margin-bottom: 0.7rem;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.08);
}
.filter-select {
  background: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #0ea5e9;
  outline: none;
}
.file-upload-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}
.custom-file-input-wrapper {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.04);
  padding: 0.5rem 1rem;
}
.custom-file-label {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 1rem;
}
.file-upload-info {
  font-size: 0.95rem;
  color: #64748b;
}
</style>
