<template>
  <div class="forgot-password-page">
    <h2>Recuperar Contraseña</h2>
    <p class="forgot-subtitle">Ingresa tu correo electrónico para recibir instrucciones</p>

    <form class="forgot-form" @submit.prevent="handleForgotPassword">
      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input type="email" id="email" v-model="email" required placeholder="tu@email.com" />
      </div>

      <button type="submit" class="forgot-button">
        Enviar Instrucciones
      </button>
    </form>

    <div class="forgot-links">
      <router-link to="/auth/login">Volver al inicio de sesión</router-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'ForgotPasswordPage',
  setup() {
    const router = useRouter();
    const email = ref('');

    const handleForgotPassword = () => {
      // Aquí iría la lógica de recuperación de contraseña
      console.log('Forgot password:', { email: email.value });

      alert('Se han enviado las instrucciones a tu correo electrónico');

      // Redirigir al login
      router.push('/auth/login');
    };

    return {
      email,
      handleForgotPassword
    };
  }
};
</script>

<style lang="scss" scoped>
.forgot-password-page {
  h2 {
    font-size: 1.75rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .forgot-subtitle {
    color: #666;
    margin-bottom: 2rem;
  }
}

.forgot-form {
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

.forgot-button {
  width: 100%;
  padding: 0.75rem;
  background: #ffc107;
  color: #333;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #e0a800;
  }
}

.forgot-links {
  margin-top: 1.5rem;

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
