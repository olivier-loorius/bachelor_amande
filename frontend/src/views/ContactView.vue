<template>
    <div class="contact-page">
      <div class="contact-container">
        <h1 class="contact-title">Contactez-nous</h1>
        
        <form @submit.prevent="submitForm" class="contact-form">
          <div class="form-group">
            <label for="name">Nom complet</label>
            <input 
              type="text" 
              id="name" 
              v-model="form.name" 
              required
              class="form-input"
            >
          </div>
  
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              required
              class="form-input"
            >
          </div>
  
          <div class="form-group">
            <label for="subject">Sujet</label>
            <select id="subject" v-model="form.subject" class="form-input">
              <option value="">Sélectionnez un sujet</option>
              <option value="commande">Commande spéciale</option>
              <option value="question">Question</option>
              <option value="autre">Autre</option>
            </select>
          </div>
  
          <div class="form-group">
            <label for="message">Message</label>
            <textarea 
              id="message" 
              v-model="form.message" 
              required
              class="form-input"
              rows="5"
            ></textarea>
          </div>
  
          <button type="submit" class="contact-button">
            Envoyer le message
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        form: {
          name: '',
          email: '',
          subject: '',
          message: ''
        }
      }
    },
    methods: {
      submitForm() {
        // Ici vous ajouterez la logique d'envoi du formulaire
        console.log('Formulaire soumis:', this.form)
        alert('Merci pour votre message! Nous vous contacterons bientôt.')
        this.resetForm()
      },
      resetForm() {
        this.form = {
          name: '',
          email: '',
          subject: '',
          message: ''
        }
      }
    },
    metaInfo() {
      return {
        title: 'Contact - Amande Pâtisserie'
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  @use "@/assets/styles/variables" as *;
  
  .contact-page {
    padding: 2rem 1rem;
    background-color: #f5f5f5;
    min-height: calc(100vh - 80px);
    font-family: var(--font-family-text);
  }
  
  .contact-container {
    max-width: 900px;
    margin: 0 auto;
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }
  
  .contact-title {
    color: var(--primary-color);
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.8rem;
    font-family: var(--font-family-title);
  }
  
  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-input {
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: var(--font-family-text);
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 2px rgba(255, 111, 97, 0.2);
    }
  }
  
  .contact-button {
  padding: 0.8rem 1.5rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: filter 0.3s ease; /* Changé de background-color à filter */
  font-family: var(--font-family-text);
  font-size: 1rem;
  margin-top: 1rem;
  align-self: center;

  &:hover {
    filter: brightness(0.9); /* Solution CSS pure */
  }
  }
  
  @media (max-width: 768px) {
    .contact-page {
      padding: 1rem;
    }
  
    .contact-container {
      padding: 1.5rem;
    }
  
    .contact-title {
      font-size: 1.5rem;
    }
  }
  </style>