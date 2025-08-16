<template>
  <footer class="footer" role="contentinfo" aria-label="Pied de page">
    <div class="footer-content">
      <div class="footer-main">
        <div class="footer-logo">
          <router-link to="/" aria-label="Retour à l'accueil">
            <div class="logo-container">
              <img 
                src="@/assets/images/LogoAmande.png" 
                alt="Amande Pâtisserie" 
                class="footer-logo-img"
              >
            </div>
          </router-link>
        </div>

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
            <h3>RÉSEAUX<br>SOCIAUX</h3>
            <div class="social-icons">
              <router-link 
                :to="{ name: 'reseau-en-construction', params: { reseau: 'instagram' } }" 
                aria-label="Instagram"
              >
                <i class="fab fa-instagram"></i>
              </router-link>
              <router-link 
                :to="{ name: 'reseau-en-construction', params: { reseau: 'facebook' } }" 
                aria-label="Facebook"
              >
                <i class="fab fa-facebook"></i>
              </router-link>
              <router-link 
                :to="{ name: 'reseau-en-construction', params: { reseau: 'tiktok' } }" 
                aria-label="TikTok"
              >
                <i class="fab fa-tiktok"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-legal">
      <router-link to="/mentions-legales" @click="scrollToTop">Mentions légales</router-link>
      <router-link to="/cgv" @click="scrollToTop">CGV</router-link>
      <router-link to="/contact" @click="scrollToTop">Contact</router-link>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2025 Amande Pâtisserie - Tous droits réservés</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<style lang="scss" scoped>


$footer-padding-desktop: 2rem;
$footer-padding-mobile: 1rem;
$transition-duration: 0.3s;

.footer {
  background: var(--primary-color);
  color: var(--secondary-color);
  padding: $footer-padding-desktop 0 0;
  font-family: var(--font-family-text);
  position: relative;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $footer-padding-desktop;
}

.footer-main {
  display: flex;
  align-items: flex-start;
  gap: 0;
  margin-bottom: 2rem;
  justify-content: space-between;
  margin-left: 12%;
  margin-right: 12%;
}

.footer-logo {
  flex: 1;
  text-align: left;
  display: flex;
  justify-content: flex-start;
}

.logo-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--secondary-color);
  border: 2px solid #ff6f61;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all $transition-duration ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.logo-container:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border-color: var(--accent-color);
}

.footer-logo-img {
  height: 112px;
  width: 112px;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  transition: transform $transition-duration ease;
}

.footer-grid {
  flex: 3;
  display: flex;
  justify-content: space-between;
  gap: 0;
}

.footer-section {
  flex: 1;
  text-align: left;
  
  h3 {
    color: var(--accent-color);
    font-family: var(--font-family-title);
    font-size: 1.1rem;
    letter-spacing: 1px;
    margin-bottom: 1rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: left;
  }

  p {
    margin: 0.5rem 0;
    line-height: 1.5;
    font-size: 0.95rem;
    text-align: left;
  }
}

.social-icons {
  display: flex;
  gap: 1.2rem;
  margin-top: 1rem;
  
  a {
    color: var(--secondary-color);
    font-size: 1.1rem;
    transition: color $transition-duration ease;
    outline: none;
    
    &:hover {
      color: var(--accent-color);
    }
    
    &:focus {
      outline: none;
    }
  }
}

.footer-legal {
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 1.5rem $footer-padding-desktop;
  display: flex;
  justify-content: center;
  gap: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  a {
    color: var(--secondary-color);
    text-decoration: none;
    font-size: 0.9rem;
    transition: color $transition-duration ease;
    outline: none;
    
    &:hover {
      color: var(--accent-color);
    }
    
    &:focus {
      outline: none;
    }
  }
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem $footer-padding-desktop;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  p {
    font-size: 0.9rem;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: $footer-padding-mobile 0 0;
  }

  .footer-content {
    padding: 0 $footer-padding-mobile;
  }

  .footer-main {
    flex-direction: column;
    align-items: center;
    text-align: left;
    gap: 1.5rem;
    margin-left: 12%;
    margin-right: 12%;
  }

  .footer-logo {
    flex: none;
    margin-bottom: 0.5rem;
    justify-content: center;
  }

  .logo-container {
    width: 70px;
    height: 70px;
  }

  .footer-logo-img {
    height: 62px;
    width: 62px;
  }

  .footer-grid {
    width: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .footer-section {
    text-align: center;
    padding-left: 0;
    max-width: 260px;
    width: 100%;
    margin: 0 auto;
    
    h3 {
      font-size: 0.9rem;
      text-align: center;
      margin-bottom: 0.5rem;
    }
    
    p {
      font-size: 0.8rem;
      text-align: center;
      margin: 0.3rem 0;
    }
    
    .social-icons {
      justify-content: center;
      margin-top: 0.5rem;
      padding-left: 0;
      
      a {
        font-size: 0.9rem;
      }
    }
  }

  .footer-legal {
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    padding: 1rem $footer-padding-mobile;
    
    a {
      font-size: 0.75rem;
    }
  }

  .footer-bottom {
    flex-direction: row;
    gap: 0;
    text-align: center;
    padding: 1rem $footer-padding-mobile;
    
    p {
      font-size: 0.75rem;
    }
  }
}
</style>