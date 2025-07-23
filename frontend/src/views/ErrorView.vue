<template>
  <div class="error-page">
    <main class="main-container">
      <div class="error-content">
        <div class="error-header">
          <div class="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1>Page introuvable</h1>
          <p class="error-description">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <div class="error-code">
            <span>Erreur 404</span>
          </div>
        </div>

        <div class="error-actions">
          <router-link to="/" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Retour à l'accueil
          </router-link>
          
          <router-link to="/actualites" class="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 9H9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Voir les actualités
          </router-link>
        </div>

        <div class="error-help">
          <h3>Que pouvez-vous faire ?</h3>
          <div class="error-help-grid">
            <div class="error-help-item">
              <div class="error-help-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L1 10L10 19M1 10H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <p>Vérifier l'URL dans la barre d'adresse</p>
            </div>
            <div class="error-help-item">
              <div class="error-help-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3L21 21M21 3L3 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <p>Utiliser la navigation du site</p>
            </div>
            <div class="error-help-item">
              <div class="error-help-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 3H22V21H2V3ZM4 5V19H20V5H4Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M6 7H18M6 9H14M6 11H12" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <p>Contacter notre équipe si le problème persiste</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Page d'erreur 404 stylée et pédagogique
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.main-container {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

.error-content {
  background: #fff;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.error-header {
  margin-bottom: 2.5rem;
}

.error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
  color: #fff;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.error-icon svg {
  width: 48px;
  height: 48px;
}

.error-content h1 {
  font-family: var(--font-family-title);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.error-description {
  font-family: var(--font-family-text);
  font-size: 1.1rem;
  color: var(--text-color);
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto;
}

.error-code {
  font-family: var(--font-family-title);
  font-size: 3rem;
  font-weight: 900;
  color: var(--accent-color);
  margin-top: 1rem;
  line-height: 1;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-family: var(--font-family-text);
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: var(--accent-color);
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary:hover {
  background: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: transparent;
  color: var(--text-color);
  border: 2px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--background-light);
  border-color: var(--accent-color);
  transform: translateY(-2px);
}

.btn svg {
  width: 16px;
  height: 16px;
}

.error-help {
  border-top: 1px solid var(--border-color);
  padding-top: 2rem;
}

.error-help h3 {
  font-family: var(--font-family-title);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1.5rem;
}

.error-help-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.error-help-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.error-help-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--accent-color);
  color: #fff;
  flex-shrink: 0;
}

.error-help-icon svg {
  width: 16px;
  height: 16px;
}

.error-help-item p {
  font-family: var(--font-family-text);
  font-size: 0.9rem;
  color: var(--text-color);
  margin: 0;
}

@media (max-width: 768px) {
  .error-content {
    padding: 2rem 1rem;
  }

  .error-content h1 {
    font-size: 2rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }

  .error-help-grid {
    grid-template-columns: 1fr;
  }
}
</style>

