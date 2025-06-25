<template>
  <header class="navbar" :class="{
    'sidebar-collapsed': isSidebarCollapsed,
    'sidebar-expanded': !isSidebarCollapsed
  }">
    <div class="navbar-container">
      <!-- Lado izquierdo -->
      <div class="navbar-left">
        <!-- Logo/Brand -->
        <router-link to="/app/dashboard" class="navbar-brand">
          <span class="brand-logo">💧</span>
          <span class="brand-text">IoT Water</span>
        </router-link>

        <!-- Breadcrumbs -->
        <nav class="navbar-breadcrumb">
          <router-link v-for="(crumb, index) in breadcrumbs" :key="index" :to="crumb.route || '#'"
            class="breadcrumb-item" :class="{ 'active': index === breadcrumbs.length - 1 }">
            {{ crumb.title }}
          </router-link>
          <span v-if="breadcrumbs.length > 1" class="breadcrumb-separator">
            /
          </span>
        </nav>
      </div>

      <!-- Lado derecho -->
      <div class="navbar-right">
        <!-- Acciones del navbar -->
        <div class="navbar-actions">
          <!-- Botón de notificaciones -->
          <button class="navbar-button" @click="toggleNotifications">
            <span class="button-icon">🔔</span>
            <span v-if="notificationCount > 0" class="button-badge">
              {{ notificationCount }}
            </span>
          </button>

          <!-- Botón de configuración -->
          <button class="navbar-button" @click="toggleSettings">
            <span class="button-icon">⚙️</span>
          </button>
        </div>

        <!-- Separador -->
        <div class="navbar-divider"></div>

        <!-- Usuario con dropdown -->
        <div class="navbar-user-container">
          <div class="navbar-user" @click="toggleUserDropdown">
            <div class="user-avatar">
              {{ userInitials }}
            </div>
            <div class="user-info">
              <div class="user-name">{{ userName }}</div>
              <div class="user-role">{{ userRole }}</div>
            </div>
            <span class="user-dropdown-arrow" :class="{ 'expanded': isUserDropdownOpen }">
              ▼
            </span>
          </div>

          <!-- Dropdown del usuario -->
          <div v-if="isUserDropdownOpen" class="navbar-user-dropdown" v-click-outside="closeUserDropdown">
            <div class="dropdown-header">
              <div class="dropdown-user-name">{{ userName }}</div>
              <div class="dropdown-user-email">{{ userEmail }}</div>
            </div>
            <div class="dropdown-menu">
              <a href="#" class="dropdown-item" @click="goToProfile">
                <span class="dropdown-icon">👤</span>
                <span class="dropdown-text">Mi Perfil</span>
              </a>
              <a href="#" class="dropdown-item" @click="goToSettings">
                <span class="dropdown-icon">⚙️</span>
                <span class="dropdown-text">Configuración</span>
              </a>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout-button" @click="handleLogout">
                <span class="dropdown-icon">🚪</span>
                <span class="dropdown-text">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNavigation, useLogout, getBreadcrumbs } from '@/utils/navigation.js';

export default {
  name: 'TopNavbar',
  props: {
    isSidebarCollapsed: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { navigateTo } = useNavigation();
    const { logout } = useLogout();

    // Estado del componente
    const isUserDropdownOpen = ref(false);
    const notificationCount = ref(3); // Ejemplo: 3 notificaciones

    // Datos del usuario (esto vendría de tu store de autenticación)
    const userData = ref({
      name: 'Juan Pérez',
      email: 'juan.perez@iotwater.com',
      role: 'Administrador'
    });

    // Computed properties
    const userName = computed(() => userData.value.name);
    const userEmail = computed(() => userData.value.email);
    const userRole = computed(() => userData.value.role);
    const userInitials = computed(() => {
      return userName.value
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase();
    });

    const breadcrumbs = computed(() => {
      const routePath = route.path;
      const breadcrumbData = getBreadcrumbs(routePath);

      return breadcrumbData.map((title, index) => ({
        title,
        route: index === 0 ? '/app/dashboard' : null
      }));
    });

    // Métodos
    const toggleUserDropdown = () => {
      console.log('🔄 Toggle dropdown clickeado');
      console.log('Estado actual:', isUserDropdownOpen.value);
      isUserDropdownOpen.value = !isUserDropdownOpen.value;
      console.log('Nuevo estado:', isUserDropdownOpen.value);
      console.log('Dropdown debería estar:', isUserDropdownOpen.value ? 'ABIERTO' : 'CERRADO');
    };

    const closeUserDropdown = () => {
      console.log('❌ Cerrando dropdown');
      isUserDropdownOpen.value = false;
    };

    const toggleNotifications = () => {
      // Implementar lógica de notificaciones
      console.log('Toggle notifications');
    };

    const toggleSettings = () => {
      // Implementar lógica de configuración
      console.log('Toggle settings');
    };

    const goToProfile = () => {
      closeUserDropdown();
      // Navegar al perfil del usuario
      console.log('Go to profile');
    };

    const goToSettings = () => {
      closeUserDropdown();
      // Navegar a configuración
      console.log('Go to settings');
    };

    const handleLogout = async () => {
      try {
        console.log('Botón de logout clickeado');
        closeUserDropdown();
        await logout();
      } catch (error) {
        console.error('Error en handleLogout:', error);
        // Si hay error, intentar redirigir manualmente
        try {
          await router.push('/auth/login');
        } catch (redirectError) {
          console.error('Error al redirigir manualmente:', redirectError);
        }
      }
    };

    // Cerrar dropdown cuando cambie la ruta
    watch(() => route.path, () => {
      closeUserDropdown();
    });

    return {
      isUserDropdownOpen,
      notificationCount,
      userName,
      userEmail,
      userRole,
      userInitials,
      breadcrumbs,
      toggleUserDropdown,
      closeUserDropdown,
      toggleNotifications,
      toggleSettings,
      goToProfile,
      goToSettings,
      handleLogout
    };
  }
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_navbar.scss';

// Estilos adicionales específicos para el logout button
.logout-button {
  color: #dc3545 !important;
  font-weight: 500 !important;

  &:hover {
    background: #fff5f5 !important;
  }
}

.dropdown-divider {
  height: 1px;
  background: #e9ecef;
  margin: 0.5rem 0;
}
</style>
