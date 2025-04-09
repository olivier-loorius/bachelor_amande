<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-logo">
        <router-link to="/">
          <img src="../assets/images/logo-footer.png" alt="Amande Pâtisserie" class="logo-rounded">
        </router-link>
      </div>

      <div class="footer-section">
        <h3>Horaires</h3>
        <p>Lun - Ven: 9h - 19h</p>
        <p>Sam: 9h - 18h</p>
        <p>Dim: Fermé</p>
      </div>

      <div class="footer-section">
        <h3>Contact</h3>
        <p>12 Rue des Délices</p>
        <p>75000 Paris</p>
        <p>01 23 45 67 89</p>
      </div>

      <div class="footer-section">
        <h3>Réseaux sociaux</h3>
        <div class="social-icons">
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-facebook"></i></a>
          <a href="#"><i class="fab fa-pinterest"></i></a>
        </div>
      </div>

      <div class="footer-legal">
        <router-link to="/mentions-legales">Mentions légales</router-link>
        <router-link to="/cgv">CGV</router-link>
        <router-link to="/contact">Contact</router-link>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2025 Amande Pâtisserie</p>
      <button @click="scrollToTop" class="back-to-top">
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
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.footer {
  background: var(--primary-color);
  color: var(--secondary-color);
  padding: 2rem 1rem 0;
  position: relative;
  z-index: 50;

  &-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
  }

  &-section, &-legal {
    padding: 0 1rem;
    
    h3 {
      color: var(--accent-color);
      margin-bottom: 1rem;
      font-family: var(--font-family-title);
    }
  }

  &-legal {
    grid-column: 1 / -1;
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    padding: 1rem 0;
    border-top: 1px solid rgba(255,255,255,0.1);

    a {
      color: var(--secondary-color);
      text-decoration: none;
      
      &:hover {
        color: var(--accent-color);
      }
    }
  }

  .logo-rounded {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--accent-color);
  }

  .social-icons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    
    a {
      color: var(--secondary-color);
      font-size: 1.5rem;
    }
  }

  &-bottom {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  .back-to-top {
    background: var(--accent-color);
    color: white;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: grid;
    place-items: center;
    
    &:hover {
      filter: brightness(0.9);
    }
  }
}

@media (max-width: 768px) {
  .footer {
    padding-bottom: 2rem;
    
    &-content {
      grid-template-columns: 1fr;
      text-align: center;
    }

    &-section, &-legal {
      padding: 0;
    }

    &-legal {
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
    }

    .logo-rounded {
      margin: 0 auto;
    }

    .social-icons {
      justify-content: center;
    }
  }
}
</style>