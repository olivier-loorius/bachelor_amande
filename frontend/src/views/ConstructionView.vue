<template>
  <div class="page-container">
    <main class="content-container">
      <div class="construction-card card">
        <div class="construction-content">
          <div class="construction-header">
            <div class="construction-icon">
              <i class="fas fa-tools"></i>
            </div>
            <h1 class="section-title">Page en construction</h1>
            <p class="construction-description">
              Cette page est actuellement en cours de développement pour notre projet scolaire.
            </p>
          </div>

          <div class="construction-actions">
            <router-link to="/" class="btn-primary">
              <i class="fas fa-home"></i>
              Retour à l'accueil
            </router-link>
            
            <router-link to="/catalogue" class="btn-secondary">
              <i class="fas fa-shopping-bag"></i>
              Voir le catalogue
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Page en construction pour le projet scolaire
</script>

<style scoped>
@import '@/assets/styles/vues.scss';

.construction-card {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 3rem 2rem;
}

.construction-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.construction-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.construction-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--accent-color);
  color: #fff;
  font-size: 2rem;
  box-shadow: 0 4px 16px rgba(255, 111, 97, 0.3);
}

.construction-description {
  font-family: var(--font-family-text);
  font-size: 1.1rem;
  color: var(--text-color);
  line-height: 1.6;
  max-width: 500px;
  margin: 0;
  opacity: 0.8;
}

.construction-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
}

.btn-primary {
  background: var(--accent-color);
  color: #fff;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-family: var(--font-family-text);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary:hover {
  background: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: #fff;
  color: #90aeb0;
  border: 1px solid #90aeb0;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-family: var(--font-family-text);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary:hover {
  background: #90aeb0;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .construction-card {
    padding: 2rem 1rem;
    margin: 1rem;
  }

  .construction-content {
    gap: 1.5rem;
  }

  .construction-content h1 {
    font-size: 1.8rem;
  }

  .construction-description {
    font-size: 1rem;
    padding: 0 0.5rem;
  }

  .construction-actions {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .btn-primary, .btn-secondary {
    width: 80%;
    max-width: 280px;
    justify-content: center;
    padding: 0.8rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .construction-card {
    padding: 1.5rem 1rem;
    margin: 0.5rem;
  }

  .construction-content h1 {
    font-size: 1.6rem;
  }

  .construction-description {
    font-size: 0.95rem;
  }

  .btn-primary, .btn-secondary {
    width: 75%;
    max-width: 250px;
    font-size: 0.9rem;
  }
}
</style> 