<template>
    <nav>
      <div class="logo">
        <router-link to="/">
          <img src="@/assets/images/logo-amande.png" alt="Amande Pâtisserie" />
        </router-link>
      </div>
      <div class="menu" @click="toggleMenu">
        <div :class="{ 'menu-icon': true, open: isMenuOpen }"></div>
      </div>
      <ul :class="{ open: isMenuOpen }" @click="closeMenu">
        <li class="actualite"><router-link to="/actualite">ACTUALITE</router-link></li>
        <li class="composer"><router-link to="/composer">COMPOSER</router-link></li>
        <li class="catalogue"><router-link to="/catalogue">CATALOGUE</router-link></li>
        <li class="connexion"><router-link to="/login">CONNEXION</router-link></li>
        <li class="panier">
          <router-link to="/panier">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count">0</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'AppNavbar',
    data() {
      return {
        isMenuOpen: false
      };
    },
    methods: {
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      },
      closeMenu() {
        this.isMenuOpen = false;
      }
    }
  };
  </script>
  
  <style lang="scss">
  @use "@/assets/styles/variables" as *;
  
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: var(--secondary-color);
    color: var(--text-color);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    height: 80px;
  }
  
  .logo {
    margin-left: 20px;
  }
  
  .logo img {
    height: 70px;
    transition: transform 0.3s ease;
  }
  
  .logo img:hover {
    transform: scale(1.05);
  }
  
  .menu {
    display: none;
    cursor: pointer;
    position: relative;
  }
  
  .menu-icon {
    width: 30px;
    height: 3px;
    background-color: var(--accent-color);
    transition: all 0.3s ease-in-out;
  }
  
  .menu-icon::before,
  .menu-icon::after {
    content: '';
    width: 30px;
    height: 3px;
    background-color: var(--accent-color);
    position: absolute;
    transition: all 0.3s ease-in-out;
  }
  
  .menu-icon::before {
    top: -10px;
  }
  
  .menu-icon::after {
    top: 10px;
  }
  
  .menu-icon.open {
    background-color: transparent;
  }
  
  .menu-icon.open::before {
    transform: rotate(45deg);
    top: 0;
  }
  
  .menu-icon.open::after {
    transform: rotate(-45deg);
    top: 0;
  }
  
  ul {
    list-style: none;
    display: flex;
    gap: 1.5rem;
    padding: 0;
    margin: 0;
    align-items: center;
  }
  
  li {
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 1px;
  }
  
  a {
    display: inline-block;
    padding: 0.5rem 0;
    color: var(--text-color);
    text-decoration: none;
    transition: all 0.3s ease;
    font-weight: bold;
    position: relative;
  }
  
  /* Soulignement uniquement pour actualite, composer et catalogue */
  .actualite a::after,
  .composer a::after,
  .catalogue a::after {
    content: '';
    display: block;
    width: 0;
    height: 2px;
    background: var(--accent-color);
    transition: width 0.3s;
    position: absolute;
    left: 0;
    bottom: -2px;
  }
  
  .actualite a:hover::after,
  .composer a:hover::after,
  .catalogue a:hover::after {
    width: 100%;
  }
  
  a:hover {
    color: var(--accent-color);
    transform: scale(1.05);
    transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;
  }
  
  .connexion a {
  background-color: #90aeb0;  
  color: white;               
  border: 2px solid #90aeb0;  
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.connexion a:hover {
  background-color: transparent;
  color: #90aeb0;            
  border-color: #90aeb0;      
}
  
  .panier a {
    padding: 0.5rem 1rem;
    background-color: var(--accent-color);
    color: var(--secondary-color);
    border-radius: 20px;
    display: inline-block;
    border: 2px solid var(--accent-color);
    text-decoration: none;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .panier a:hover {
    background-color: transparent;
    color: var(--accent-color);
  }
  
  .cart-count {
    background-color: var(--secondary-color);
    color: var(--accent-color);
    border-radius: 50%;
    padding: 0.2rem 0.5rem;
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 0.7rem;
    border: 1px solid var(--accent-color);
  }
  
  /* Mobile Styling */
  @media (max-width: 768px) {
    .menu {
      display: block;
    }
  
    ul {
      display: none;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--secondary-color);
      padding-top: 80px;
      z-index: 1;
      text-align: center;
      gap: 2rem;
    }
  
    ul.open {
      display: flex;
    }
  
    ul li {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }
  
    .logo img {
      height: 60px;
    }
  }
  </style>