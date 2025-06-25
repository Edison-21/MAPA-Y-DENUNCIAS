<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <SidebarMenu :is-mobile-open="isMobileMenuOpen" @toggle-sidebar="handleSidebarToggle" />

    <!-- Navbar -->
    <TopNavbar :is-sidebar-collapsed="isSidebarCollapsed" />

    <!-- Contenido principal -->
    <main class="main-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <!-- Overlay para móvil -->
      <div v-if="isMobileMenuOpen" class="mobile-overlay" @click="closeMobileMenu"></div>

      <!-- Contenido de la vista -->
      <router-view />
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import SidebarMenu from '@/components/SidebarMenu.vue';
import TopNavbar from '@/components/TopNavbar.vue';
import { useSidebarState } from '@/utils/navigation.js';

export default {
  name: 'DefaultLayout',
  components: {
    SidebarMenu,
    TopNavbar
  },
  setup() {
    const { isCollapsed } = useSidebarState();
    const isMobileMenuOpen = ref(false);

    // Computed para el estado del sidebar
    const isSidebarCollapsed = computed(() => isCollapsed.value);

    // Manejar toggle del sidebar
    const handleSidebarToggle = () => {
      if (window.innerWidth <= 768) {
        closeMobileMenu();
      }
    };

    // Cerrar menú móvil
    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false;
    };

    // Manejar resize de ventana
    const handleResize = () => {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    };

    // Event listeners
    onMounted(() => {
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    return {
      isSidebarCollapsed,
      isMobileMenuOpen,
      handleSidebarToggle,
      closeMobileMenu
    };
  }
};
</script>

<style lang="scss" scoped>
// Overlay para móvil
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;

  @media (min-width: 769px) {
    display: none;
  }
}

// Ajustes responsive para el contenido principal
.main-content {
  @media (max-width: 768px) {
    margin-left: 0 !important;
    margin-top: 70px;
    padding: 1rem;
  }
}
</style>
