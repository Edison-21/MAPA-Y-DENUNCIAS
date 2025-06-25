<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <p>Bienvenido al panel de control de IoT Water</p>
      <!-- Botón de logout de prueba -->
      <button class="logout-test-btn" @click="testLogout">
        🚪 Probar Logout
      </button>
    </div>

    <div class="dashboard-grid">
      <!-- Tarjeta de estadísticas -->
      <div class="dashboard-card">
        <div class="card-header">
          <h3>Dispositivos Activos</h3>
          <span class="card-icon">📱</span>
        </div>
        <div class="card-content">
          <div class="stat-number">24</div>
          <div class="stat-label">Dispositivos en línea</div>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="card-header">
          <h3>Incidentes</h3>
          <span class="card-icon">⚠️</span>
        </div>
        <div class="card-content">
          <div class="stat-number">3</div>
          <div class="stat-label">Incidentes activos</div>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="card-header">
          <h3>Clientes</h3>
          <span class="card-icon">👥</span>
        </div>
        <div class="card-content">
          <div class="stat-number">156</div>
          <div class="stat-label">Clientes registrados</div>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="card-header">
          <h3>Quejas</h3>
          <span class="card-icon">📋</span>
        </div>
        <div class="card-content">
          <div class="stat-number">8</div>
          <div class="stat-label">Quejas pendientes</div>
        </div>
      </div>
    </div>

    <div class="dashboard-section">
      <h2>Actividad Reciente</h2>
      <div class="activity-list">
        <div class="activity-item">
          <span class="activity-icon">📱</span>
          <div class="activity-content">
            <div class="activity-title">Nuevo dispositivo conectado</div>
            <div class="activity-time">Hace 5 minutos</div>
          </div>
        </div>
        <div class="activity-item">
          <span class="activity-icon">⚠️</span>
          <div class="activity-content">
            <div class="activity-title">Incidente reportado en Zona A</div>
            <div class="activity-time">Hace 15 minutos</div>
          </div>
        </div>
        <div class="activity-item">
          <span class="activity-icon">👥</span>
          <div class="activity-content">
            <div class="activity-title">Nuevo cliente registrado</div>
            <div class="activity-time">Hace 1 hora</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useLogout } from '@/utils/navigation.js';

export default {
  name: 'DashboardOverview',
  setup() {
    const { logout } = useLogout();

    const testLogout = async () => {
      console.log('Probando logout desde dashboard...');
      try {
        await logout();
      } catch (error) {
        console.error('Error en testLogout:', error);
      }
    };

    return {
      testLogout
    };
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
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
    margin-bottom: 1rem;
  }

  .logout-test-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      background: #c82333;
    }
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.dashboard-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
    }

    .card-icon {
      font-size: 1.5rem;
    }
  }

  .card-content {
    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: #007bff;
      line-height: 1;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }
  }
}

.dashboard-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1rem;
  }
}

.activity-list {
  .activity-item {
    display: flex;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .activity-icon {
      font-size: 1.2rem;
      margin-right: 1rem;
      width: 24px;
      text-align: center;
    }

    .activity-content {
      flex: 1;

      .activity-title {
        font-weight: 500;
        color: #333;
        margin-bottom: 0.25rem;
      }

      .activity-time {
        font-size: 0.9rem;
        color: #666;
      }
    }
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
