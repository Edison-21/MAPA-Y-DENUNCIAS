<template>
  <div class="device-list-page">
    <div class="page-header">
      <h1>Dispositivos</h1>
      <button class="btn-primary" @click="addDevice">
        <span>➕</span> Agregar Dispositivo
      </button>
    </div>

    <div class="page-content">
      <div class="filters">
        <input type="text" v-model="searchTerm" placeholder="Buscar dispositivos..." class="search-input" />
        <select v-model="statusFilter" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="online">En línea</option>
          <option value="offline">Desconectado</option>
          <option value="maintenance">En mantenimiento</option>
        </select>
      </div>

      <div class="device-grid">
        <div v-for="device in filteredDevices" :key="device.id" class="device-card" :class="device.status">
          <div class="device-header">
            <h3>{{ device.name }}</h3>
            <span class="status-badge" :class="device.status">
              {{ getStatusText(device.status) }}
            </span>
          </div>
          <div class="device-info">
            <p><strong>ID:</strong> {{ device.id }}</p>
            <p><strong>Ubicación:</strong> {{ device.location }}</p>
            <p><strong>Última lectura:</strong> {{ device.lastReading }}</p>
          </div>
          <div class="device-actions">
            <button class="btn-secondary" @click="viewDevice(device.id)">
              Ver Detalles
            </button>
            <button class="btn-secondary" @click="editDevice(device.id)">
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
  name: 'DeviceListPage',
  setup() {
    const router = useRouter();
    const searchTerm = ref('');
    const statusFilter = ref('');

    // Datos de ejemplo
    const devices = ref([
      {
        id: 'DEV001',
        name: 'Sensor de Agua Zona A',
        location: 'Edificio Principal',
        status: 'online',
        lastReading: '2024-01-15 14:30'
      },
      {
        id: 'DEV002',
        name: 'Válvula de Control B',
        location: 'Sector Industrial',
        status: 'offline',
        lastReading: '2024-01-15 12:15'
      },
      {
        id: 'DEV003',
        name: 'Medidor de Flujo C',
        location: 'Residencial Norte',
        status: 'maintenance',
        lastReading: '2024-01-15 10:45'
      }
    ]);

    const filteredDevices = computed(() => {
      return devices.value.filter(device => {
        const matchesSearch = device.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          device.id.toLowerCase().includes(searchTerm.value.toLowerCase());
        const matchesStatus = !statusFilter.value || device.status === statusFilter.value;
        return matchesSearch && matchesStatus;
      });
    });

    const getStatusText = (status) => {
      const statusMap = {
        online: 'En línea',
        offline: 'Desconectado',
        maintenance: 'Mantenimiento'
      };
      return statusMap[status] || status;
    };

    const addDevice = () => {
      console.log('Agregar dispositivo');
    };

    const viewDevice = (id) => {
      router.push(`/app/devices/${id}`);
    };

    const editDevice = (id) => {
      console.log('Editar dispositivo:', id);
    };

    return {
      searchTerm,
      statusFilter,
      devices,
      filteredDevices,
      getStatusText,
      addDevice,
      viewDevice,
      editDevice
    };
  }
};
</script>

<style lang="scss" scoped>
.device-list-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h1 {
      font-size: 2rem;
      font-weight: 600;
      color: #333;
    }
  }

  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;

    .search-input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
    }

    .filter-select {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      min-width: 150px;
    }
  }

  .device-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .device-card {
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

    &.online {
      border-left-color: #28a745;
    }

    &.offline {
      border-left-color: #dc3545;
    }

    &.maintenance {
      border-left-color: #ffc107;
    }

    .device-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      h3 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #333;
        margin: 0;
      }
    }

    .device-info {
      margin-bottom: 1rem;

      p {
        margin: 0.5rem 0;
        color: #666;
        font-size: 0.9rem;
      }
    }

    .device-actions {
      display: flex;
      gap: 0.5rem;
    }
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;

    &.online {
      background: #d4edda;
      color: #155724;
    }

    &.offline {
      background: #f8d7da;
      color: #721c24;
    }

    &.maintenance {
      background: #fff3cd;
      color: #856404;
    }
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
}

@media (max-width: 768px) {
  .device-list-page {
    .page-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .filters {
      flex-direction: column;
    }

    .device-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
