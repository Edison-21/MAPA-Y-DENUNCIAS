<template>
  <div class="login-page">
    <h2>Iniciar Sesión</h2>
    <p class="login-subtitle">Accede a tu cuenta de IoT Water</p>

    <form class="login-form" @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input type="email" id="email" v-model="email" required placeholder="tu@email.com" />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" v-model="password" required placeholder="Tu contraseña" />
      </div>

      <button type="submit" class="login-button">
        Iniciar Sesión
      </button>
    </form>

    <div class="login-links">
      <router-link to="/auth/forgot-password">¿Olvidaste tu contraseña?</router-link>
      <router-link to="/auth/register">¿No tienes cuenta? Regístrate</router-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');

    const handleLogin = () => {
      // Aquí iría la lógica de autenticación
      console.log('Login:', { email: email.value, password: password.value });

      // Por ahora, redirigir al dashboard
      router.push('/app/dashboard');
    };

    return {
      email,
      password,
      handleLogin
    };
  }
};
</script>

<style lang="scss" scoped>
.login-page {
  h2 {
    font-size: 1.75rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .login-subtitle {
    color: #666;
    margin-bottom: 2rem;
  }
}

.login-form {
  .form-group {
    margin-bottom: 1.5rem;
    text-align: left;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
      }
    }
  }
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #0056b3;
  }
}

.login-links {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  a {
    color: #007bff;
    text-decoration: none;
    font-size: 0.9rem;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
