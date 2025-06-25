// Directiva para detectar clics fuera de un elemento
export const clickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      // Verificar si el clic fue fuera del elemento
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };

    // Agregar el event listener
    document.addEventListener('click', el._clickOutside);
  },

  unmounted(el) {
    // Remover el event listener cuando el componente se destruya
    document.removeEventListener('click', el._clickOutside);
  }
};

// Instalar la directiva globalmente
export const installClickOutside = (app) => {
  app.directive('click-outside', clickOutside);
}; 