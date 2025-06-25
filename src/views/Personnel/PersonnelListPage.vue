<template>
  <div class="personnel-list-page">
    <div class="page-header">
      <h1>Personal</h1>
      <p>Gestión del personal y equipos de trabajo</p>
    </div>

    <div class="page-content">
      <div class="filters">
        <input type="text" v-model="searchTerm" placeholder="Buscar personal..." class="search-input" />
        <select v-model="departmentFilter" class="filter-select">
          <option value="">Todos los departamentos</option>
          <option value="technical">Técnico</option>
          <option value="maintenance">Mantenimiento</option>
          <option value="operations">Operaciones</option>
          <option value="management">Gerencia</option>
        </select>
        <select v-model="statusFilter" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
          <option value="vacation">Vacaciones</option>
        </select>
        <button class="btn-primary" @click="addPersonnel">
          <span>➕</span> Agregar Personal
        </button>
      </div>

      <div class="personnel-grid">
        <div v-for="person in filteredPersonnel" :key="person.id" class="personnel-card" :class="person.status">
          <div class="personnel-header">
            <div class="personnel-avatar">
              {{ person.initials }}
            </div>
            <div class="personnel-info">
              <h3>{{ person.name }}</h3>
              <p class="personnel-position">{{ person.position }}</p>
              <span class="status-badge" :class="person.status">
                {{ getStatusText(person.status) }}
              </span>
            </div>
          </div>
          <div class="personnel-details">
            <p><strong>ID:</strong> {{ person.id }}</p>
            <p><strong>Departamento:</strong> {{ person.department }}</p>
            <p><strong>Email:</strong> {{ person.email }}</p>
            <p><strong>Teléfono:</strong> {{ person.phone }}</p>
            <p><strong>Ubicación:</strong> {{ person.location }}</p>
          </div>
          <div class="personnel-actions">
            <button class="btn-secondary" @click="viewPersonnel(person.id)">
              Ver Perfil
            </button>
            <button class="btn-secondary" @click="editPersonnel(person.id)">
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
  name: 'PersonnelListPage',
  setup() {
    const router = useRouter();
    const searchTerm = ref('');
    const departmentFilter = ref('');
    const statusFilter = ref('');

    // Datos de ejemplo
    const personnel = ref([
      {
        id: 'PER001',
        name: 'Juan Pérez',
        position: 'Técnico Senior',
        department: 'Técnico',
        email: 'juan.perez@iotwater.com',
        phone: '+1 555-0123',
        location: 'Zona Norte',
        status: 'active',
        initials: 'JP'
      },
      {
        id: 'PER002',
        name: 'María González',
        position: 'Supervisora de Mantenimiento',
        department: 'Mantenimiento',
        email: 'maria.gonzalez@iotwater.com',
        phone: '+1 555-0124',
        location: 'Zona Central',
        status: 'active',
        initials: 'MG'
      },
      {
        id: 'PER003',
        name: 'Carlos Rodríguez',
        position: 'Operador de Sistemas',
        department: 'Operaciones',
        email: 'carlos.rodriguez@iotwater.com',
        phone: '+1 555-0125',
        location: 'Centro de Control',
        status: 'vacation',
        initials: 'CR'
      },
      {
        id: 'PER004',
        name: 'Ana López',
        position: 'Gerente de Operaciones',
        department: 'Gerencia',
        email: 'ana.lopez@iotwater.com',
        phone: '+1 555-0126',
        location: 'Oficina Principal',
        status: 'active',
        initials: 'AL'
      }
    ]);

    const filteredPersonnel = computed(() => {
      return personnel.value.filter(person => {
        const matchesSearch = person.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          person.id.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          person.position.toLowerCase().includes(searchTerm.value.toLowerCase());
        const matchesDepartment = !departmentFilter.value || person.department.toLowerCase() === departmentFilter.value;
        const matchesStatus = !statusFilter.value || person.status === statusFilter.value;
        return matchesSearch && matchesDepartment && matchesStatus;
      });
    });

    const getStatusText = (status) => {
      const statusMap = {
        active: 'Activo',
        inactive: 'Inactivo',
        vacation: 'Vacaciones'
      };
      return statusMap[status] || status;
    };

    const addPersonnel = () => {
      console.log('Agregar personal');
    };

    const viewPersonnel = (id) => {
      router.push(`/app/personnel/${id}`);
    };

    const editPersonnel = (id) => {
      console.log('Editar personal:', id);
    };

    return {
      searchTerm,
      departmentFilter,
      statusFilter,
      personnel,
      filteredPersonnel,
      getStatusText,
      addPersonnel,
      viewPersonnel,
      editPersonnel
    };
  }
};
</script>

<style lang="scss" scoped>
.personnel-list-page {
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

  .personnel-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .personnel-card {
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

    &.active {
      border-left-color: #28a745;
    }

    &.inactive {
      border-left-color: #6c757d;
    }

    &.vacation {
      border-left-color: #ffc107;
    }

    .personnel-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;

      .personnel-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #007bff;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 1.2rem;
      }

      .personnel-info {
        flex: 1;

        h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          margin: 0 0 0.25rem 0;
        }

        .personnel-position {
          color: #666;
          font-size: 0.9rem;
          margin: 0 0 0.5rem 0;
        }
      }
    }

    .personnel-details {
      margin-bottom: 1rem;

      p {
        margin: 0.5rem 0;
        color: #666;
        font-size: 0.9rem;
      }
    }

    .personnel-actions {
      display: flex;
      gap: 0.5rem;
    }
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;

    &.active {
      background: #d4edda;
      color: #155724;
    }

    &.inactive {
      background: #e2e3e5;
      color: #383d41;
    }

    &.vacation {
      background: #fff3cd;
      color: #856404;
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

    .personnel-grid {
      grid-template-columns: 1fr;
    }

    .personnel-header {
      flex-direction: column;
      text-align: center;

      .personnel-info {
        text-align: center;
      }
    }
  }
}
</style>
