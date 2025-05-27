<template>
    <div class="cgv-page">
      <div class="legal-container">
        <h1 class="legal-title">Conditions Générales de Vente</h1>
        
        <div class="legal-section">
          <h2>1. Objet</h2>
          <p>Les présentes conditions régissent les ventes de pâtisseries réalisées par <strong>Amande Pâtisserie</strong>.</p>
        </div>
  
        <div class="legal-section">
          <h2>2. Commandes</h2>
          <h3>2.1. Disponibilité</h3>
          <p>Les produits sont proposés sous réserve des stocks disponibles. En cas d'indisponibilité, nous vous contacterons dans les 24h.</p>
          
          <h3>2.2. Commandes spéciales</h3>
          <p>Les gâteaux sur mesure nécessitent un préavis de 72h. Un acompte de 30% est requis.</p>
        </div>
  
        <div class="legal-section">
          <h2>3. Prix et Paiement</h2>
          <p>Les prix sont en euros TTC. Modes de paiement acceptés :</p>
          <ul>
            <li>Carte bancaire</li>
            <li>Espèces (jusqu'à 1000€)</li>
            <li>Virement (uniquement pour les professionnels)</li>
          </ul>
        </div>
  
        <div class="legal-section">
          <h2>4. Livraison</h2>
          <div class="legal-grid">
            <div>Paris intra-muros</div>
            <div>8€ - Livraison sous 2h</div>
            <div>Petite Couronne</div>
            <div>12€ - Livraison sous 4h</div>
            <div>Retrait en boutique</div>
            <div>Gratuit</div>
          </div>
          <p>Les créneaux de livraison sont à choisir lors de la commande.</p>
        </div>
  
        <div class="legal-section">
          <h2>5. Annulation</h2>
          <p>Toute annulation doit être notifiée par email :</p>
          <ul>
            <li>Plus de 48h à l'avance : remboursement intégral</li>
            <li>Moins de 48h : acompte conservé</li>
          </ul>
        </div>
  
        <div class="legal-section">
          <h2>6. Allergènes</h2>
          <p>Nos produits contiennent généralement : gluten, œufs, lait, fruits à coque. Une liste détaillée est disponible sur demande.</p>
        </div>
  
        <div class="legal-section">
          <h2>7. Réclamations</h2>
          <address>
            Amande Pâtisserie<br>
            12 Rue des Délices, 75000 Paris<br>
            contact@amande-patisserie.fr<br>
            01 23 45 67 89
          </address>
          <p>Toute réclamation doit être formulée sous 48h après réception.</p>
        </div>
  
        <p class="last-update">Dernière mise à jour : 01/06/2024</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    metaInfo() {
      return {
        title: 'CGV - Amande Pâtisserie'
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  @use "@/assets/styles/variables" as *;
  
  .cgv-page {
    padding: 2rem 1rem;
    background-color: #f5f5f5;
    min-height: calc(100vh - 80px);
    font-family: var(--font-family-text);
  }
  
  .legal-container {
    max-width: 900px;
    margin: 0 auto;
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }
  
  .legal-title {
    color: var(--primary-color);
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.8rem;
    font-family: var(--font-family-title);
  }
  
  .legal-section {
    margin-bottom: 2.5rem;
  
    h2 {
      color: var(--accent-color);
      font-size: 1.3rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;
      font-family: var(--font-family-title);
    }
  
    h3 {
      color: var(--primary-color);
      font-size: 1.1rem;
      margin: 1.5rem 0 0.8rem;
    }
  
    p, li {
      margin-bottom: 1rem;
      line-height: 1.6;
    }
  
    ul {
      padding-left: 1.5rem;
      margin-bottom: 1rem;
    }
  
    address {
      font-style: normal;
      background: #f9f9f9;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
    }
  }
  
  .legal-grid {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.5rem 1rem;
    margin: 1rem 0;
  
    div:nth-child(odd) {
      font-weight: bold;
    }
  }
  
  .last-update {
    text-align: right;
    font-style: italic;
    color: #666;
  }
  
  @media (max-width: 768px) {
    .cgv-page {
      padding: 1rem;
    }
  
    .legal-container {
      padding: 1.5rem;
    }
  
    .legal-title {
      font-size: 1.5rem;
    }
  
    .legal-grid {
      grid-template-columns: 1fr;
      
      div:nth-child(odd) {
        margin-top: 0.5rem;
      }
    }
  }
  </style>