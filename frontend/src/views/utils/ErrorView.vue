<template>
  <div class="page-container">
    <main class="content-container">
      <div class="error-card card">
        <div class="error-content">
          <div class="error-header">
            <div class="error-icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h1 class="section-title">Page introuvable</h1>
            <p class="error-description">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <div class="error-code">
              <span>Erreur 404</span>
            </div>
          </div>

          <div class="error-actions">
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
// Page d'erreur 404 harmonisée avec le style du projet
</script>

<style scoped>


.error-card {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 3rem 2rem;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.error-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-icon {
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

.error-description {
  font-family: var(--font-family-text);
  font-size: 1.1rem;
  color: var(--text-color);
  line-height: 1.6;
  max-width: 500px;
  margin: 0;
  opacity: 0.8;
}

.error-code {
  font-family: var(--font-family-title);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--accent-color);
  line-height: 1;
  margin-top: 0.5rem;
}

.error-actions {
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
  .error-card {
    padding: 2rem 1rem;
  }

  .error-content h1 {
    font-size: 1.8rem;
  }

  .error-code {
    font-size: 2rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary, .btn-secondary {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
}
</style>

