<template>
  <div class="register-page">
    <h2>Crear Cuenta</h2>
    <p class="register-subtitle">Únete a IoT Water</p>

    <form class="register-form" @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="name">Nombre Completo</label>
        <input type="text" id="name" v-model="name" required placeholder="Tu nombre completo" />
      </div>

      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input type="email" id="email" v-model="email" required placeholder="tu@email.com" />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" v-model="password" required placeholder="Tu contraseña" />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmar Contraseña</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required
          placeholder="Confirma tu contraseña" />
      </div>

      <button type="submit" class="register-button">
        Crear Cuenta
      </button>
    </form>

    <div class="register-links">
      <router-link to="/auth/login">¿Ya tienes cuenta? Inicia sesión</router-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'RegisterPage',
  setup() {
    const router = useRouter();
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');

    const handleRegister = () => {
      if (password.value !== confirmPassword.value) {
        alert('Las contraseñas no coinciden');
        return;
      }

      // Aquí iría la lógica de registro
      console.log('Register:', {
        name: name.value,
        email: email.value,
        password: password.value
      });

      // Por ahora, redirigir al login
      router.push('/auth/login');
    };

    return {
      name,
      email,
      password,
      confirmPassword,
      handleRegister
    };
  }
};
</script>

<style lang="scss" scoped>
.register-page {
  h2 {
    font-size: 1.75rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .register-subtitle {
    color: #666;
    margin-bottom: 2rem;
  }
}

.register-form {
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

.register-button {
  width: 100%;
  padding: 0.75rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #218838;
  }
}

.register-links {
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
