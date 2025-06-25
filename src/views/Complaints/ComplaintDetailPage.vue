<template>
  <div class="complaint-detail-page">
    <!-- Header con acciones flotantes -->
    <header class="gradient-header">
      <div class="header-content">
        <div>
          <h1>Detalle de Denuncia <span class="badge-id">#{{ complaint.id }}</span></h1>
          <div class="subtitle">{{ complaint.title }}</div>
        </div>
        <div class="header-actions">
          <button class="action-btn" @click="editComplaint">Editar</button>
          <button class="action-btn assign" @click="assignComplaint">Asignar</button>
          <button class="action-btn status" @click="updateStatus">Cambiar Estado</button>
          <button class="action-btn back" @click="goBack">Volver</button>
        </div>
      </div>
    </header>
    <main class="detail-main">
      <section class="main-info-panel">
        <div class="info-block">
          <h2>Información General</h2>
          <ul class="info-list">
            <li><span class="info-label">ID:</span> <span class="info-value">{{ complaint.id }}</span></li>
            <li><span class="info-label">Título:</span> <span class="info-value">{{ complaint.title }}</span></li>
            <li><span class="info-label">Descripción:</span> <span class="info-value">{{ complaint.description }}</span></li>
            <li><span class="info-label">Denunciante:</span> <span class="info-value">{{ complaint.reporter }}</span></li>
            <li><span class="info-label">Ubicación:</span> <span class="info-value">{{ complaint.location }}</span></li>
            <li><span class="info-label">Fecha:</span> <span class="info-value">{{ formatDate(complaint.createdAt) }}</span></li>
            <li><span class="info-label">Categoría:</span> <span class="info-value"><span class="category-badge">{{ getCategoryText(complaint.category) }}</span></span></li>
            <li><span class="info-label">Prioridad:</span> <span class="info-value"><span class="priority-badge" :class="complaint.priority">{{ getPriorityText(complaint.priority) }}</span></span></li>
            <li><span class="info-label">Estado:</span> <span class="info-value"><span class="status-badge" :class="complaint.status">{{ getStatusText(complaint.status) }}</span></span></li>
          </ul>
        </div>
        <div class="info-block">
          <h2>Ubicación en el Mapa</h2>
          <div id="complaintDetailMap" class="complaint-detail-map"></div>
        </div>
        <div class="info-block">
          <h2>Historial de Cambios</h2>
          <ul class="timeline-list">
            <li v-for="(change, index) in complaint.history" :key="index">
              <span class="timeline-title">{{ change.title }}</span>
              <span class="timeline-date">{{ formatDateTime(change.date) }}</span>
              <span class="timeline-user">Por: {{ change.user }}</span>
              <p class="timeline-description">{{ change.description }}</p>
            </li>
            <li v-if="!complaint.history.length" class="no-history">Sin historial.</li>
          </ul>
        </div>
        <div class="info-block">
          <h2>Comentarios</h2>
          <div class="comments-section">
            <div v-for="(comment, idx) in complaint.comments" :key="idx" class="comment-bubble" :class="{mine: comment.mine}">
              <div class="comment-user">{{ comment.user }}</div>
              <div class="comment-text">{{ comment.text }}</div>
              <div class="comment-date">{{ formatDateTime(comment.date) }}</div>
            </div>
            <form class="comment-form" @submit.prevent="addComment">
              <input v-model="newComment" type="text" placeholder="Escribe un comentario..." required />
              <button type="submit">Enviar</button>
            </form>
          </div>
        </div>
      </section>
      <aside class="sidebar-panel">
        <div class="sidebar-block">
          <h3>Archivos Adjuntos</h3>
          <ul class="files-list">
            <li v-for="file in complaint.attachments" :key="file.id">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
              <button class="file-action" @click="downloadFile(file.id)">Descargar</button>
              <button class="file-action danger" @click="deleteFile(file.id)">Eliminar</button>
            </li>
            <li v-if="!complaint.attachments.length" class="no-files">Sin archivos adjuntos.</li>
          </ul>
        </div>
        <div class="sidebar-block">
          <h3>Contacto</h3>
          <ul class="contact-list">
            <li><span class="contact-label">Teléfono:</span> <span class="contact-value">{{ complaint.contact.phone || 'No disponible' }}</span></li>
            <li><span class="contact-label">Email:</span> <span class="contact-value">{{ complaint.contact.email || 'No disponible' }}</span></li>
            <li><span class="contact-label">Horario:</span> <span class="contact-value">{{ complaint.contact.schedule || 'No especificado' }}</span></li>
          </ul>
        </div>
        <div class="sidebar-block">
          <h3>Estado y Acciones</h3>
          <ul class="status-list">
            <li><span class="status-label">Estado:</span> <span class="status-value" :class="complaint.status">{{ getStatusText(complaint.status) }}</span></li>
            <li><span class="status-label">Asignado a:</span> <span class="status-value">{{ complaint.assignedTo || 'Sin asignar' }}</span></li>
            <li><span class="status-label">Última actualización:</span> <span class="status-value">{{ formatDateTime(complaint.lastUpdate) }}</span></li>
          </ul>
        </div>
      </aside>
    </main>
    <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
      <div class="modal-content" @click.stop>
        <h3>Editar Denuncia</h3>
        <input v-model="editTitle" placeholder="Título" />
        <textarea v-model="editDescription" placeholder="Descripción"></textarea>
        <div class="modal-actions">
          <button @click="saveEdit">Guardar</button>
          <button @click="showEditModal = false">Cancelar</button>
        </div>
      </div>
    </div>
    <div v-if="showAssignModal" class="modal-overlay" @click="showAssignModal = false">
      <div class="modal-content" @click.stop>
        <h3>Asignar Denuncia</h3>
        <input v-model="assignTo" placeholder="Asignar a..." />
        <div class="modal-actions">
          <button @click="saveAssign">Asignar</button>
          <button @click="showAssignModal = false">Cancelar</button>
        </div>
      </div>
    </div>
    <div v-if="showStatusModal" class="modal-overlay" @click="showStatusModal = false">
      <div class="modal-content" @click.stop>
        <h3>Cambiar Estado</h3>
        <select v-model="newStatus">
          <option value="pending">Pendiente</option>
          <option value="in-progress">En proceso</option>
          <option value="resolved">Resuelta</option>
          <option value="urgent">Urgente</option>
        </select>
        <div class="modal-actions">
          <button @click="saveStatus">Cambiar</button>
          <button @click="showStatusModal = false">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const route = useRoute()

// Mock de denuncia
const complaint = ref({
  id: route.params.id || 1,
  title: 'Fuga en medidor',
  description: 'Se detectó una fuga en el medidor de la calle principal.',
  reporter: 'Juan Pérez',
  location: '-0.18,-78.47',
  createdAt: '2024-06-20',
  category: 'meter-issue',
  priority: 'high',
  status: 'pending',
  assignedTo: 'Equipo Técnico',
  lastUpdate: '2024-06-21T10:30:00',
  contact: {
    phone: '0999999999',
    email: 'juan.perez@email.com',
    schedule: '08:00-17:00'
  },
  history: [
    { title: 'Creada', date: '2024-06-20T08:00:00', user: 'Juan Pérez', description: 'Denuncia registrada.' },
    { title: 'Asignada', date: '2024-06-20T09:00:00', user: 'Admin', description: 'Asignada a Equipo Técnico.' },
    { title: 'En proceso', date: '2024-06-20T10:00:00', user: 'Técnico', description: 'Se inició la revisión.' }
  ],
  comments: [
    { user: 'Juan Pérez', text: 'Por favor atender urgente.', date: '2024-06-20T08:10:00', mine: false },
    { user: 'Técnico', text: 'Estamos en camino.', date: '2024-06-20T10:05:00', mine: true }
  ],
  attachments: [
    { id: 1, name: 'foto1.jpg', size: 204800 },
    { id: 2, name: 'reporte.pdf', size: 102400 }
  ]
})
const newComment = ref('')
const showEditModal = ref(false)
const showAssignModal = ref(false)
const showStatusModal = ref(false)
const editTitle = ref(complaint.value.title)
const editDescription = ref(complaint.value.description)
const assignTo = ref(complaint.value.assignedTo)
const newStatus = ref(complaint.value.status)

function goBack() { router.push('/app/complaints') }
function editComplaint() { showEditModal.value = true }
function assignComplaint() { showAssignModal.value = true }
function updateStatus() { showStatusModal.value = true }
function downloadFile(id) {}
function deleteFile(id) {}
function addComment() {
  if (newComment.value.trim()) {
    complaint.value.comments.push({
      user: 'Usuario Actual',
      text: newComment.value,
      date: new Date().toISOString(),
      mine: true
    })
    newComment.value = ''
  }
}
function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
}
function formatDateTime(date) {
  if (!date) return ''
  return new Date(date).toLocaleString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function getStatusText(status) {
  const statusMap = {
    pending: 'Pendiente',
    'in-progress': 'En proceso',
    resolved: 'Resuelta',
    closed: 'Cerrada',
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
function formatFileSize(size) {
  if (!size) return ''
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB'
  return (size / (1024 * 1024)).toFixed(1) + ' MB'
}
function saveEdit() {
  complaint.value.title = editTitle.value
  complaint.value.description = editDescription.value
  showEditModal.value = false
}
function saveAssign() {
  complaint.value.assignedTo = assignTo.value
  showAssignModal.value = false
}
function saveStatus() {
  complaint.value.status = newStatus.value
  showStatusModal.value = false
}
onMounted(() => {
  // Mapa de ubicación de la denuncia
  if (complaint.value.location) {
    const [lat, lng] = complaint.value.location.split(',').map(Number)
    const map = L.map('complaintDetailMap').setView([lat, lng], 15)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)
    L.marker([lat, lng]).addTo(map)
  }
})
</script>

<style scoped>
.complaint-detail-page {
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
.badge-id {
  background: #0ea5e9;
  color: #fff;
  border-radius: 8px;
  padding: 0.2rem 0.7rem;
  font-size: 1rem;
  margin-left: 0.7rem;
}
.header-actions {
  display: flex;
  gap: 1.1rem;
}
.action-btn {
  background: #0ea5e9;
  color: #fff;
  border: none;
  border-radius: 1.2rem;
  padding: 0.55rem 1.6rem;
  font-weight: 700;
  font-size: 1.08rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(14,165,233,0.10);
  transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
  outline: none;
}
.action-btn:hover {
  background: #0369a1;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 6px 18px rgba(14,165,233,0.13);
}
.action-btn.assign {
  background: linear-gradient(90deg, #0ea5e9 0%, #06b6d4 100%);
  color: #fff;
}
.action-btn.status {
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
  color: #fff;
}
.action-btn.back {
  background: #64748b;
  color: #fff;
}
.detail-main {
  display: flex;
  gap: 2.5rem;
  margin-top: 2rem;
}
.main-info-panel {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
.info-block {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.04);
  padding: 2rem 1.5rem;
}
.info-block h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  color: #0ea5e9;
}
.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.info-label {
  font-weight: 600;
  color: #64748b;
  margin-right: 0.5rem;
}
.info-value {
  color: #0f172a;
  font-weight: 500;
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
.timeline-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.timeline-title {
  font-weight: 700;
  color: #0ea5e9;
}
.timeline-date {
  font-size: 0.95rem;
  color: #64748b;
  margin-left: 0.7rem;
}
.timeline-user {
  font-size: 0.95rem;
  color: #0891b2;
  margin-left: 0.7rem;
}
.timeline-description {
  margin: 0.5rem 0 0 0;
  color: #0f172a;
}
.no-history {
  color: #64748b;
  font-style: italic;
}
.comments-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.comment-bubble {
  background: #e0f2fe;
  border-radius: 12px;
  padding: 0.7rem 1rem;
  max-width: 70%;
  margin-bottom: 0.5rem;
  align-self: flex-start;
}
.comment-bubble.mine {
  background: #0ea5e9;
  color: #fff;
  align-self: flex-end;
}
.comment-user {
  font-weight: 700;
  margin-bottom: 0.2rem;
}
.comment-text {
  margin-bottom: 0.2rem;
}
.comment-date {
  font-size: 0.9rem;
  color: #64748b;
}
.comment-form {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.comment-form input {
  flex: 1;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;
  font-size: 1rem;
}
.comment-form button {
  background: #0ea5e9;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.comment-form button:hover {
  background: #0369a1;
}
.complaint-detail-map {
  width: 100%;
  height: 220px;
  border-radius: 12px;
  margin-bottom: 0.7rem;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.08);
}
.sidebar-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.sidebar-block {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.04);
  padding: 1.5rem 1.2rem;
}
.files-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.file-name {
  font-weight: 600;
  color: #0ea5e9;
}
.file-size {
  font-size: 0.95rem;
  color: #64748b;
  margin-left: 0.7rem;
}
.file-action {
  background: #e0f2fe;
  color: #0ea5e9;
  border: none;
  border-radius: 6px;
  padding: 0.3rem 1rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: background 0.2s;
}
.file-action.danger {
  background: #ef4444;
  color: #fff;
}
.contact-list, .status-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.contact-label, .status-label {
  font-weight: 600;
  color: #64748b;
  margin-right: 0.5rem;
}
.contact-value, .status-value {
  color: #0f172a;
  font-weight: 500;
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
  background: rgba(255,255,255,0.97);
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px rgba(14,165,233,0.13), 0 1.5px 8px rgba(31,38,135,0.07);
  padding: 2.2rem 2rem 1.7rem 2rem;
  min-width: 340px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.2rem;
}
.modal-content h3 {
  font-size: 1.18rem;
  font-weight: 800;
  color: #0ea5e9;
  margin-bottom: 1.2rem;
}
.modal-content input {
  border: 1.2px solid #d1e7f7;
  border-radius: 0.7rem;
  background: rgba(240,249,255,0.85);
  padding: 0.7rem 1rem;
  font-size: 1rem;
  color: #334155;
  margin-bottom: 1.2rem;
  box-shadow: 0 1px 4px rgba(14,165,233,0.04);
  transition: border 0.2s, box-shadow 0.2s, background 0.2s;
}
.modal-content input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 2px 8px rgba(14,165,233,0.10);
  outline: none;
}
.modal-content select {
  border: 1.2px solid #d1e7f7;
  border-radius: 0.7rem;
  background: rgba(240,249,255,0.85);
  padding: 0.7rem 1rem;
  font-size: 1rem;
  color: #334155;
  margin-bottom: 1.2rem;
  box-shadow: 0 1px 4px rgba(14,165,233,0.04);
  transition: border 0.2s, box-shadow 0.2s, background 0.2s;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}
.modal-content select:focus {
  border-color: #0ea5e9;
  box-shadow: 0 2px 8px rgba(14,165,233,0.10);
  outline: none;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.5rem;
}
.modal-actions button {
  background: #0ea5e9;
  color: #fff;
  border: none;
  border-radius: 1.1rem;
  padding: 0.5rem 1.5rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
}
.modal-actions button:hover {
  background: #0369a1;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 6px 18px rgba(14,165,233,0.13);
}
.modal-actions button:last-child {
  background: #e5e7eb;
  color: #64748b;
}
.modal-actions button:last-child:hover {
  background: #cbd5e1;
  color: #0ea5e9;
}
.modal-content textarea {
  border: 1.2px solid #d1e7f7;
  border-radius: 0.7rem;
  background: rgba(240,249,255,0.85);
  padding: 0.7rem 1rem;
  font-size: 1rem;
  color: #334155;
  margin-bottom: 1.2rem;
  box-shadow: 0 1px 4px rgba(14,165,233,0.04);
  transition: border 0.2s, box-shadow 0.2s, background 0.2s;
  min-height: 60px;
  resize: vertical;
}
.modal-content textarea:focus {
  border-color: #0ea5e9;
  box-shadow: 0 2px 8px rgba(14,165,233,0.10);
  outline: none;
}
</style>
