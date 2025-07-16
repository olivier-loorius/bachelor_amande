<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Logo -->
      <div class="footer-logo">
        <router-link to="/">
          <div class="logo-wrapper">
            <img 
              src="../assets/images/logo-footer.png" 
              alt="Amande Pâtisserie" 
              class="logo-rounded"
            >
          </div>
        </router-link>
      </div>

      <!-- Sections -->
      <div class="footer-grid">
        <div class="footer-section">
          <h3>HORAIRES</h3>
          <p>Lun - Ven: 10h - 19h</p>
          <p>Sam: 9h - 17h</p>
          <p>Dim: Fermé</p>
        </div>

        <div class="footer-section">
          <h3>CONTACT</h3>
          <p>12 Rue des Délices</p>
          <p>75000 Paris</p>
          <p>01 23 45 67 89</p>
        </div>

        <div class="footer-section">
          <h3>RÉSEAUX SOCIAUX</h3>
          <div class="social-icons">
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="#"><i class="fab fa-tiktok"></i></a>
          </div>
        </div>
      </div>
    </div>

    <!-- Liens légaux -->
    <div class="footer-legal">
      <router-link to="/mentions-legales">Mentions légales</router-link>
      <router-link to="/cgv">CGV</router-link>
      <router-link to="/contact">Contact</router-link>
    </div>

    <!-- Copyright + Bouton -->
    <div class="footer-bottom">
      <p>&copy; 2025 Amande Pâtisserie - Tous droits réservés</p>
      <button @click="scrollToTop" class="back-to-top" aria-label="Retour en haut">
        <i class="fas fa-arrow-up"></i>
      </button>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.footer {
  background: var(--primary-color);
  color: var(--secondary-color);
  padding: 2rem 0 0;
  font-family: var(--font-family-text);
  position: relative;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-logo {
  flex: 0 0 200px;
  margin-bottom: 1.5rem;
}

.logo-wrapper {
  display: inline-block;
  overflow: hidden;
}

.logo-rounded {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent-color);
  display: block;
}

.footer-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.footer-section {
  h3 {
    color: var(--accent-color);
    font-family: var(--font-family-title);
    font-size: 1.1rem;
    letter-spacing: 1px;
    margin-bottom: 1rem;
    text-transform: uppercase;
  }

  p {
    margin: 0.5rem 0;
    line-height: 1.5;
    font-size: 0.95rem;
  }
}

.social-icons {
  display: flex;
  gap: 1.2rem;
  margin-top: 1rem;
  
  a {
    color: var(--secondary-color);
    font-size: 1.4rem;
    transition: color 0.3s;
    
    &:hover {
      color: var(--accent-color);
    }
  }
}

.footer-legal {
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);

  a {
    color: var(--secondary-color);
    text-decoration: none;
    font-size: 0.9rem;
    
    &:hover {
      color: var(--accent-color);
    }
  }
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.back-to-top {
  background: var(--accent-color);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.3s ease;
  
  &:hover {
    filter: brightness(0.9);
  }
  
  i {
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 1rem;
  }

  .footer-logo {
    margin-bottom: 2rem;
  }

  .footer-grid {
    width: 100%;
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .footer-section {
    text-align: center;
    
    .social-icons {
      justify-content: center;
    }
  }

  .footer-legal {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    padding: 1.5rem 1rem;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .back-to-top {
    margin-top: 1rem;
  }
}
</style>