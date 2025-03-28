<template>
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <router-link to="/">
            <div class="logo-wrapper">
              <img src="../assets/images/logo-footer.png" alt="Amande Pâtisserie" class="logo-rounded" />
            </div>
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
            <a href="#" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="Facebook">
              <i class="fab fa-facebook"></i>
            </a>
            <a href="#" aria-label="Pinterest">
              <i class="fab fa-pinterest"></i>
            </a>
          </div>
        </div>
  
        <div class="footer-section footer-legal">
          <ul class="footer-links">
            <li><router-link to="/mentions-legales">Mentions légales</router-link></li>
            <li><router-link to="/cgv">CGV</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
        </div>
      </div>
  
      <div class="footer-bottom">
      <div class="copyright">
        <p>&copy; 2025 Amande Pâtisserie - Tous droits réservés</p>
      </div>
      <button class="back-to-top" @click="scrollToTop" aria-label="Retour en haut">
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
};
</script>
  
  <style lang="scss" scoped>
  @use "@/assets/styles/variables" as *;
  
  .footer {
    background-color: var(--primary-color);
    color: var(--secondary-color);
    padding: 2rem 0 0;
    font-family: var(--font-family-text);
  }
  
  .footer-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    gap: 1rem;
  }
  
  /* Logo arrondi seulement */
  .footer-logo {
    flex: 0 0 200px;
    margin-bottom: 1.5rem;
  }
  
  .logo-wrapper {
    display: inline-block;
    overflow: hidden;
  }
  
  .logo-rounded {
    height: 100px;
    width: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--accent-color);
    display: block;
  }
  
  /* Sections restantes inchangées */
  .footer-section {
    flex: 1;
    min-width: 200px;
    padding: 0 0.8rem;
    margin-bottom: 2rem;
  }
  
  .footer h3 {
    font-family: var(--font-family-title);
    color: var(--accent-color);
    margin-bottom: 1rem;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .footer p {
    margin: 0.5rem 0;
    font-size: 0.9rem;
    line-height: 1.5;
  }
  
  .social-icons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .social-icons a {
    color: var(--secondary-color);
    font-size: 1.5rem;
    transition: color 0.3s ease;
  }
  
  .social-icons a:hover {
    color: var(--accent-color);
  }
  
  .footer-legal {
    opacity: 0.8;
    font-size: 0.9rem;
    margin-top: 1.8rem;
    
    .footer-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0;
      margin: 0;
      
      a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        transition: color 0.2s ease;
        font-weight: normal;
        font-size: 0.85rem;
        
        &:hover {
          color: var(--accent-color);
        }
      }
    }
  }
  .footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 1200px;
  margin: 0 auto;
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
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--secondary-color);
    color: var(--accent-color);
    transform: translateY(-3px);
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
      gap: 1.5rem;
    }
  
    .footer-section {
      min-width: 100%;
      margin-bottom: 1.5rem;
      padding: 0;
    }
  
    .footer-legal {
      order: 1;
      margin-top: 0;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 1.5rem;
      width: 100%;
    }
  
    .social-icons {
      justify-content: center;
    }
  
    .logo-rounded {
      height: 80px;
      width: 80px;
    }
    .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }

  .back-to-top {
    margin-top: 1rem;
  }
  }
  </style>