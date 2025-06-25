<template>
  <aside class="sidebar" :class="{
    'collapsed': isCollapsed,
    'mobile-open': isMobileOpen
  }">
    <!-- Header del sidebar -->
    <div class="sidebar-header">
      <router-link to="/app/dashboard" class="logo">
        <span class="logo-icon">💧</span>
        <span class="logo-text">IoT Water</span>
      </router-link>
    </div>

    <!-- Botón para colapsar/expandir -->
    <button class="sidebar-toggle" @click="toggleSidebar">
      <span class="toggle-icon">{{ isCollapsed ? '→' : '←' }}</span>
    </button>

    <!-- Menú del sidebar -->
    <nav class="sidebar-menu">
      <div v-for="item in sidebarMenuItems" :key="item.id" class="menu-section">
        <!-- Elemento principal del menú -->
        <router-link v-if="!item.children || item.children.length === 0" :to="item.route" class="menu-item"
          :class="{ 'active': isActiveItem(item) }" @click="handleMenuClick(item)">
          <span class="menu-icon">{{ getMenuIcon(item.icon) }}</span>
          <span class="menu-title">{{ item.title }}</span>

          <!-- Badge para notificaciones -->
          <span v-if="item.badge" class="menu-badge">
            {{ item.badge }}
          </span>
        </router-link>

        <!-- Elemento con submenú -->
        <div v-else class="menu-item" :class="{
          'active': isActiveItem(item),
          'has-children': true
        }" @click="handleMenuClick(item)">
          <span class="menu-icon">{{ getMenuIcon(item.icon) }}</span>
          <span class="menu-title">{{ item.title }}</span>

          <!-- Badge para notificaciones -->
          <span v-if="item.badge" class="menu-badge">
            {{ item.badge }}
          </span>

          <!-- Flecha para submenús -->
          <span class="menu-arrow" :class="{ 'expanded': isSubmenuExpanded(item.id) }">
            ▶
          </span>
        </div>

        <!-- Submenú -->
        <div v-if="item.children && item.children.length > 0" class="submenu"
          :class="{ 'expanded': isSubmenuExpanded(item.id) }">
          <router-link v-for="child in item.children" :key="child.id" :to="child.route" class="submenu-item"
            :class="{ 'active': isCurrentRoute(child.route) }">
            {{ child.title }}
          </router-link>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  sidebarMenuItems,
  useSidebarState,
  useNavigation,
  getMenuIcon
} from '@/utils/navigation.js';

export default {
  name: 'SidebarMenu',
  props: {
    isMobileOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-sidebar'],
  setup(props, { emit }) {
    const route = useRoute();
    const { isCollapsed, activeItem, toggleSidebar, setActiveItem } = useSidebarState();
    const { isCurrentRoute, isRouteActive } = useNavigation();

    // Estado para submenús expandidos
    const expandedSubmenus = ref(new Set());

    // Determinar si un elemento del menú está activo
    const isActiveItem = (item) => {
      if (item.children && item.children.length > 0) {
        return item.children.some(child => isCurrentRoute(child.route));
      }
      return isCurrentRoute(item.route) || isRouteActive(item.route);
    };

    // Manejar clic en elementos del menú
    const handleMenuClick = (item) => {
      if (item.children && item.children.length > 0) {
        // Toggle submenú
        if (expandedSubmenus.value.has(item.id)) {
          expandedSubmenus.value.delete(item.id);
        } else {
          expandedSubmenus.value.add(item.id);
        }
      } else {
        // Navegar a la ruta
        setActiveItem(item.id);
        emit('toggle-sidebar');
      }
    };

    // Verificar si un submenú está expandido
    const isSubmenuExpanded = (itemId) => {
      return expandedSubmenus.value.has(itemId);
    };

    // Expandir automáticamente submenús cuando la ruta actual pertenece a ellos
    const autoExpandSubmenus = () => {
      sidebarMenuItems.forEach(item => {
        if (item.children && item.children.length > 0) {
          const hasActiveChild = item.children.some(child =>
            isCurrentRoute(child.route) || isRouteActive(child.route)
          );
          if (hasActiveChild) {
            expandedSubmenus.value.add(item.id);
          }
        }
      });
    };

    // Observar cambios en la ruta para actualizar el estado
    watch(() => route.path, () => {
      autoExpandSubmenus();
    }, { immediate: true });

    return {
      sidebarMenuItems,
      isCollapsed,
      activeItem,
      expandedSubmenus,
      toggleSidebar,
      isActiveItem,
      handleMenuClick,
      isSubmenuExpanded,
      isCurrentRoute,
      getMenuIcon
    };
  }
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_sidebar.scss';
</style>
