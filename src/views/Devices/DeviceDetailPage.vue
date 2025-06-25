<template>
  <div class="device-detail-page">
    <div class="page-header">
      <div class="header-left">
        <button class="btn-back" @click="goBack">
          ← Volver
        </button>
        <h1>{{ device.name }}</h1>
      </div>
      <div class="header-actions">
        <button class="btn-secondary" @click="editDevice">Editar</button>
        <button class="btn-danger" @click="deleteDevice">Eliminar</button>
      </div>
    </div>

    <div class="device-content">
      <div class="device-overview">
        <div class="overview-card">
          <h3>Información General</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>ID del Dispositivo</label>
              <span>{{ device.id }}</span>
            </div>
            <div class="info-item">
              <label>Estado</label>
              <span class="status-badge" :class="device.status">
                {{ getStatusText(device.status) }}
              </span>
            </div>
            <div class="info-item">
              <label>Ubicación</label>
              <span>{{ device.location }}</span>
            </div>
            <div class="info-item">
              <label>Tipo</label>
              <span>{{ device.type }}</span>
            </div>
            <div class="info-item">
              <label>Última Lectura</label>
              <span>{{ device.lastReading }}</span>
            </div>
            <div class="info-item">
              <label>Batería</label>
              <span>{{ device.battery }}%</span>
            </div>
          </div>
        </div>

        <div class="overview-card">
          <h3>Lecturas Recientes</h3>
          <div class="readings-chart">
            <div class="chart-placeholder">
              📊 Gráfico de lecturas (se implementará con Chart.js)
            </div>
          </div>
        </div>
      </div>

      <div class="device-details">
        <div class="detail-card">
          <h3>Configuración</h3>
          <div class="config-list">
            <div class="config-item">
              <label>Frecuencia de lectura</label>
              <span>{{ device.config.readingFrequency }}</span>
            </div>
            <div class="config-item">
              <label>Umbral de alerta</label>
              <span>{{ device.config.alertThreshold }}</span>
            </div>
            <div class="config-item">
              <label>Modo de operación</label>
              <span>{{ device.config.operationMode }}</span>
            </div>
          </div>
        </div>

        <div class="detail-card">
          <h3>Historial de Eventos</h3>
          <div class="events-list">
            <div v-for="event in device.events" :key="event.id" class="event-item" :class="event.type">
              <div class="event-icon">{{ getEventIcon(event.type) }}</div>
              <div class="event-content">
                <div class="event-title">{{ event.title }}</div>
                <div class="event-time">{{ event.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'DeviceDetailPage',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const deviceId = route.params.id;

    const device = ref({
      id: deviceId,
      name: 'Sensor de Agua Zona A',
      status: 'online',
      location: 'Edificio Principal, Piso 3',
      type: 'Sensor de Presión',
      lastReading: '2024-01-15 14:30:25',
      battery: 85,
      config: {
        readingFrequency: 'Cada 5 minutos',
        alertThreshold: '2.5 bar',
        operationMode: 'Automático'
      },
      events: [
        {
          id: 1,
          type: 'info',
          title: 'Dispositivo conectado',
          time: '2024-01-15 14:30:25'
        },
        {
          id: 2,
          type: 'warning',
          title: 'Presión baja detectada',
          time: '2024-01-15 14:25:10'
        },
        {
          id: 3,
          type: 'success',
          title: 'Mantenimiento completado',
          time: '2024-01-15 10:15:30'
        }
      ]
    });

    const getStatusText = (status) => {
      const statusMap = {
        online: 'En línea',
        offline: 'Desconectado',
        maintenance: 'Mantenimiento'
      };
      return statusMap[status] || status;
    };

    const getEventIcon = (type) => {
      const iconMap = {
        info: 'ℹ️',
        warning: '⚠️',
        success: '✅',
        error: '❌'
      };
      return iconMap[type] || '📝';
    };

    const goBack = () => {
      router.push('/app/devices');
    };

    const editDevice = () => {
      console.log('Editar dispositivo:', deviceId);
    };

    const deleteDevice = () => {
      if (confirm('¿Estás seguro de que quieres eliminar este dispositivo?')) {
        console.log('Eliminar dispositivo:', deviceId);
        router.push('/app/devices');
      }
    };

    onMounted(() => {
      // Aquí cargarías los datos reales del dispositivo
      console.log('Cargando dispositivo:', deviceId);
    });

    return {
      device,
      getStatusText,
      getEventIcon,
      goBack,
      editDevice,
      deleteDevice
    };
  }
};
</script>

<style lang="scss" scoped>
.device-detail-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;

      .btn-back {
        background: none;
        border: none;
        color: #007bff;
        cursor: pointer;
        font-size: 1rem;
        padding: 0.5rem;
        border-radius: 6px;
        transition: background-color 0.3s ease;

        &:hover {
          background: #f8f9fa;
        }
      }

      h1 {
        font-size: 2rem;
        font-weight: 600;
        color: #333;
        margin: 0;
      }
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
    }
  }

  .device-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .overview-card,
  .detail-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 1rem;
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;

    .info-item {
      label {
        display: block;
        font-weight: 500;
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
      }

      span {
        color: #333;
        font-weight: 500;
      }
    }
  }

  .readings-chart {
    .chart-placeholder {
      height: 200px;
      background: #f8f9fa;
      border: 2px dashed #ddd;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      font-size: 1.1rem;
    }
  }

  .config-list {
    .config-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      label {
        font-weight: 500;
        color: #666;
      }

      span {
        color: #333;
        font-weight: 500;
      }
    }
  }

  .events-list {
    .event-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .event-icon {
        font-size: 1.2rem;
        width: 24px;
        text-align: center;
      }

      .event-content {
        flex: 1;

        .event-title {
          font-weight: 500;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .event-time {
          font-size: 0.85rem;
          color: #666;
        }
      }
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

  .btn-danger {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background: #c82333;
    }
  }
}
</style>
