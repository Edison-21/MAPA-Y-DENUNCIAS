<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <div class="error-icon">404</div>
      <h1>Página no encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
      <div class="actions">
        <router-link to="/app/dashboard" class="btn-primary">
          Ir al Dashboard
        </router-link>
        <button class="btn-secondary" @click="goBack">
          Volver Atrás
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'NotFoundPage',
  setup() {
    const router = useRouter();

    const goBack = () => {
      router.go(-1);
    };

    return {
      goBack
    };
  }
};
</script>

<style lang="scss" scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.not-found-content {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.error-icon {
  font-size: 6rem;
  font-weight: 700;
  color: #dc3545;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;

  .btn-primary {
    background: #007bff;
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    transition: background-color 0.3s ease;

    &:hover {
      background: #0056b3;
    }
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background: #545b62;
    }
  }
}

@media (max-width: 768px) {
  .not-found-content {
    padding: 2rem;
  }

  .error-icon {
    font-size: 4rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
