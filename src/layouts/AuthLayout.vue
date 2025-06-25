<template>
  <div class="auth-layout">
    <div class="auth-container">
      <!-- Logo -->
      <div class="auth-logo">
        <span class="logo-icon">💧</span>
        <h1 class="logo-text">IoT Water</h1>
      </div>

      <!-- Contenido de la vista de autenticación -->
      <div class="auth-content">
        <router-view />
      </div>

      <!-- Footer -->
      <div class="auth-footer">
        <p>&copy; 2024 IoT Water. Todos los derechos reservados.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout'
}
</script>

<style lang="scss" scoped>
.auth-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.auth-logo {
  margin-bottom: 2rem;

  .logo-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 1rem;
  }

  .logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
    margin: 0;
  }
}

.auth-content {
  margin-bottom: 2rem;
}

.auth-footer {
  color: #666;
  font-size: 0.9rem;

  p {
    margin: 0;
  }
}

@media (max-width: 768px) {
  .auth-layout {
    padding: 1rem;
  }

  .auth-container {
    padding: 2rem;
  }
}
</style>
