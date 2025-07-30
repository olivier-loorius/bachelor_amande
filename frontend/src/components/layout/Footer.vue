<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <div class="footer-logo">
            <img src="@/assets/images/logo-footer.png" alt="Amande Pâtisserie" />
          </div>
          <p class="footer-description">
            Découvrez nos délicieuses pâtisseries artisanales, 
            créées avec passion et des ingrédients de qualité.
          </p>
        </div>

        <div class="footer-section">
          <h3 class="footer-title">Liens rapides</h3>
          <ul class="footer-links">
            <li><router-link to="/" class="footer-link">Accueil</router-link></li>
            <li><router-link to="/catalogue" class="footer-link">Catalogue</router-link></li>
            <li><router-link to="/composer" class="footer-link">Composer</router-link></li>
            <li><router-link to="/actualite" class="footer-link">Actualités</router-link></li>
            <li><router-link to="/contact" class="footer-link">Contact</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3 class="footer-title">Informations</h3>
          <ul class="footer-links">
            <li><router-link to="/mentions-legales" class="footer-link">Mentions légales</router-link></li>
            <li><router-link to="/cgv" class="footer-link">CGV</router-link></li>
            <li><router-link to="/panier" class="footer-link">Mon panier</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3 class="footer-title">Contact</h3>
          <div class="contact-info">
            <p><i class="fas fa-map-marker-alt"></i> 123 Rue de la Pâtisserie, 75001 Paris</p>
            <p><i class="fas fa-phone"></i> +33 1 23 45 67 89</p>
            <p><i class="fas fa-envelope"></i> contact@amande-patisserie.fr</p>
          </div>
          <div class="social-links">
            <a href="#" class="social-link"><i class="fab fa-facebook"></i></a>
            <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
            <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Amande Pâtisserie. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: var(--secondary-color);
  color: var(--text-color);
  padding: 3rem 0 1rem;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-logo img {
  height: 60px;
  width: auto;
}

.footer-description {
  font-family: var(--font-family-text);
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-color-light);
  margin: 0;
}

.footer-title {
  font-family: var(--font-family-heading);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 1rem 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  color: var(--text-color-light);
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.9rem;
}

.footer-link:hover {
  color: var(--accent-color);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-color-light);
}

.contact-info i {
  color: var(--accent-color);
  width: 16px;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--accent-color);
  color: white;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
  text-align: center;
  color: var(--text-color-light);
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .footer {
    padding: 2rem 0 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .footer-logo img {
    height: 50px;
  }

  .social-links {
    justify-content: center;
  }
}
</style> 