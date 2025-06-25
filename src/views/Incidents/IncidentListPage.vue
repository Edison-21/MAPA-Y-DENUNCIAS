<template>
  <div class="incident-list-page">
    <div class="page-header">
      <h1>Gestión de Problemas</h1>
      <p>Gestión y seguimiento de problemas del sistema</p>
    </div>

    <div class="page-content">
      <div class="filters">
        <input type="text" v-model="searchTerm" placeholder="Buscar problemas..." class="search-input" />
        <select v-model="priorityFilter" class="filter-select">
          <option value="">Todas las prioridades</option>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
          <option value="critical">Crítica</option>
        </select>
        <select v-model="statusFilter" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="open">Abierto</option>
          <option value="in-progress">En proceso</option>
          <option value="resolved">Resuelto</option>
          <option value="closed">Cerrado</option>
        </select>
        <button class="btn-primary" @click="addIncident">
          <span>➕</span> Nuevo Problema
        </button>
      </div>

      <div class="incidents-grid">
        <div v-for="incident in filteredIncidents" :key="incident.id" class="incident-card"
          :class="[incident.status, incident.priority]">
          <div class="incident-header">
            <h3>{{ incident.title }}</h3>
            <div class="incident-badges">
              <span class="priority-badge" :class="incident.priority">
                {{ getPriorityText(incident.priority) }}
              </span>
              <span class="status-badge" :class="incident.status">
                {{ getStatusText(incident.status) }}
              </span>
            </div>
          </div>
          <div class="incident-info">
            <p><strong>ID:</strong> {{ incident.id }}</p>
            <p><strong>Reportado por:</strong> {{ incident.reporter }}</p>
            <p><strong>Dispositivo:</strong> {{ incident.device }}</p>
            <p><strong>Fecha:</strong> {{ incident.date }}</p>
            <p class="incident-description">{{ incident.description }}</p>
          </div>
          <div class="incident-actions">
            <button class="btn-secondary" @click="viewIncident(incident.id)">
              Ver Detalles
            </button>
            <button class="btn-secondary" @click="editIncident(incident.id)">
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'IncidentListPage',
  setup() {
    const router = useRouter();
    const searchTerm = ref('');
    const priorityFilter = ref('');
    const statusFilter = ref('');

    // Datos de ejemplo
    const incidents = ref([
      {
        id: 'INC001',
        title: 'Falla en sensor de presión',
        reporter: 'Sistema Automático',
        device: 'Sensor Zona A',
        status: 'open',
        priority: 'high',
        date: '2024-01-15 14:30',
        description: 'El sensor de presión ha dejado de enviar datos correctos.'
      },
      {
        id: 'INC002',
        title: 'Válvula de control bloqueada',
        reporter: 'Técnico Juan Pérez',
        device: 'Válvula Principal',
        status: 'in-progress',
        priority: 'critical',
        date: '2024-01-15 12:15',
        description: 'La válvula principal no responde a los comandos de control.'
      },
      {
        id: 'INC003',
        title: 'Batería baja en medidor',
        reporter: 'Sistema de Monitoreo',
        device: 'Medidor Residencial',
        status: 'resolved',
        priority: 'medium',
        date: '2024-01-15 10:45',
        description: 'Batería del medidor por debajo del 10%.'
      }
    ]);

    const filteredIncidents = computed(() => {
      return incidents.value.filter(incident => {
        const matchesSearch = incident.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          incident.id.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          incident.device.toLowerCase().includes(searchTerm.value.toLowerCase());
        const matchesPriority = !priorityFilter.value || incident.priority === priorityFilter.value;
        const matchesStatus = !statusFilter.value || incident.status === statusFilter.value;
        return matchesSearch && matchesPriority && matchesStatus;
      });
    });

    const getPriorityText = (priority) => {
      const priorityMap = {
        low: 'Baja',
        medium: 'Media',
        high: 'Alta',
        critical: 'Crítica'
      };
      return priorityMap[priority] || priority;
    };

    const getStatusText = (status) => {
      const statusMap = {
        open: 'Abierto',
        'in-progress': 'En proceso',
        resolved: 'Resuelto',
        closed: 'Cerrado'
      };
      return statusMap[status] || status;
    };

    const addIncident = () => {
      console.log('Agregar problema');
    };

    const viewIncident = (id) => {
      router.push(`/app/incidents/${id}`);
    };

    const editIncident = (id) => {
      console.log('Editar problema:', id);
    };

    return {
      searchTerm,
      priorityFilter,
      statusFilter,
      incidents,
      filteredIncidents,
      getPriorityText,
      getStatusText,
      addIncident,
      viewIncident,
      editIncident
    };
  }
};
</script>

<style lang="scss" scoped>
.incident-list-page {
  .page-header {
    margin-bottom: 2rem;

    h1 {
      font-size: 2rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
    }

    p {
      color: #666;
      font-size: 1.1rem;
    }
  }

  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;

    .search-input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      min-width: 200px;
    }

    .filter-select {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      min-width: 150px;
    }

    .btn-primary {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: background-color 0.3s ease;

      &:hover {
        background: #0056b3;
      }
    }
  }

  .incidents-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .incident-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #ddd;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    &.open {
      border-left-color: #ffc107;
    }

    &.in-progress {
      border-left-color: #007bff;
    }

    &.resolved {
      border-left-color: #28a745;
    }

    &.closed {
      border-left-color: #6c757d;
    }

    .incident-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 1rem;

      h3 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #333;
        margin: 0;
        flex: 1;
      }

      .incident-badges {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    }

    .incident-info {
      margin-bottom: 1rem;

      p {
        margin: 0.5rem 0;
        color: #666;
        font-size: 0.9rem;

        &.incident-description {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
          font-style: italic;
        }
      }
    }

    .incident-actions {
      display: flex;
      gap: 0.5rem;
    }
  }

  .priority-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;

    &.low {
      background: #d4edda;
      color: #155724;
    }

    &.medium {
      background: #fff3cd;
      color: #856404;
    }

    &.high {
      background: #f8d7da;
      color: #721c24;
    }

    &.critical {
      background: #721c24;
      color: white;
    }
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;

    &.open {
      background: #fff3cd;
      color: #856404;
    }

    &.in-progress {
      background: #d1ecf1;
      color: #0c5460;
    }

    &.resolved {
      background: #d4edda;
      color: #155724;
    }

    &.closed {
      background: #e2e3e5;
      color: #383d41;
    }
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background: #545b62;
    }
  }

  @media (max-width: 768px) {
    .filters {
      flex-direction: column;
    }

    .incidents-grid {
      grid-template-columns: 1fr;
    }

    .incident-header {
      flex-direction: column;
      align-items: flex-start;

      .incident-badges {
        flex-direction: row;
      }
    }
  }
}
</style>
