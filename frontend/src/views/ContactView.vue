<template>
  <div class="page-container">
    <main class="content-container">
      <div class="composer-card card">
        <h1 class="composer-title section-title">Contactez-nous</h1>
        
        <section class="composer-section">
          <div class="composer-step-desc">
            <p>Nous sommes là pour répondre à toutes vos questions et demandes. N'hésitez pas à nous contacter !</p>
          </div>
          
          <form @submit.prevent="submitForm" class="contact-form">
            <div class="form-group">
              <label for="name" class="form-label">Nom complet</label>
              <input 
                type="text" 
                id="name" 
                v-model="form.name" 
                required
                class="form-input"
                placeholder="Votre nom complet"
                aria-describedby="name-help"
              >
            </div>
            
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                required
                class="form-input"
                placeholder="votre.email@exemple.com"
                aria-describedby="email-help"
              >
            </div>
            
            <div class="form-group">
              <label for="subject" class="form-label">Sujet</label>
              <select id="subject" v-model="form.subject" class="form-input" required>
                <option value="">Sélectionnez un sujet</option>
                <option value="commande">Commande spéciale</option>
                <option value="question">Question</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="message" class="form-label">Message</label>
              <textarea 
                id="message" 
                v-model="form.message" 
                required
                class="form-input"
                rows="5"
                placeholder="Votre message..."
                aria-describedby="message-help"
              ></textarea>
            </div>
          </form>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Formulaire de contact harmonisé avec le style de ComposerView
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

function submitForm() {
  // Traitement du formulaire
  // Ici vous pouvez ajouter la logique d'envoi du formulaire
  alert('Merci pour votre message! Nous vous contacterons bientôt.')
  resetForm()
}

function resetForm() {
  form.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }
}
</script>

<style scoped>
@import '@/assets/styles/vues.scss';

.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: var(--secondary-color);
}

.content-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.composer-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(180, 138, 120, 0.07);
  padding: 2.5rem 2rem;
  max-width: 900px;
  width: 100%;
  margin: 2rem 0;
  scroll-margin-top: 120px;
}

.composer-title {
  font-family: var(--font-family-title);
  font-size: 2.3rem;
  color: #90aeb0;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: 1px;
}

.composer-section {
  margin-bottom: 2.2rem;
}

.composer-step-desc {
  font-family: var(--font-family-text);
  color: var(--text-color);
  font-size: 1rem;
  margin-bottom: 3.5rem;
  line-height: 1.6;
  text-align: center;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-family: var(--font-family-text);
  font-weight: 500;
  color: var(--text-color);
  font-size: 1rem;
  margin-bottom: 0.3rem;
}

.form-input {
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: var(--font-family-text);
  font-size: 1rem;
  background: #fff;
  transition: border 0.18s, box-shadow 0.18s;
  color: var(--text-color);
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(255, 111, 97, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(255, 111, 97, 0.1);
}

.form-input::placeholder {
  color: #999;
}

@media (max-width: 768px) {
  .composer-card {
    padding: 1.5rem;
    margin: 1rem;
  }

  .composer-title {
    font-size: 1.8rem;
  }

  .contact-form {
    gap: 1rem;
  }

  .form-input {
    padding: 0.8rem;
  }
}
</style>