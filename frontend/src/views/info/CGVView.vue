<template>
  <div class="page-container">
    <main class="content-container">
      <div class="composer-card card">
        <h1 class="composer-title section-title">Conditions Générales de Vente</h1>
        
        <section class="composer-section">
          <h2 class="composer-step-title">1. Objet</h2>
          <div class="composer-step-desc">
            <p>Les présentes conditions régissent les ventes de pâtisseries réalisées par <strong>Amande Pâtisserie</strong>.</p>
          </div>
        </section>

        <section class="composer-section">
          <h2 class="composer-step-title">2. Commandes</h2>
          <div class="composer-step-desc">
            <h3>2.1. Disponibilité</h3>
            <p>Les produits sont proposés sous réserve des stocks disponibles. En cas d'indisponibilité, nous vous contacterons dans les 24h.</p>
            <h3>2.2. Commandes spéciales</h3>
            <p>Les gâteaux sur mesure nécessitent un préavis de 72h. Un acompte de 30% est requis.</p>
          </div>
        </section>

        <section class="composer-section">
          <h2 class="composer-step-title">3. Prix et Paiement</h2>
          <div class="composer-step-desc">
            <p>Les prix sont en euros TTC. Modes de paiement acceptés :</p>
            <ul>
              <li>Carte bancaire</li>
              <li>Espèces (jusqu'à 1000€)</li>
              <li>Virement (uniquement pour les professionnels)</li>
            </ul>
          </div>
        </section>

        <section class="composer-section">
          <h2 class="composer-step-title">4. Annulation</h2>
          <div class="composer-step-desc">
            <p>Toute annulation doit être notifiée par email :</p>
            <ul>
              <li>Plus de 48h à l'avance : remboursement intégral</li>
              <li>Moins de 48h : acompte conservé</li>
            </ul>
          </div>
        </section>

        <section class="composer-section">
          <h2 class="composer-step-title">5. Allergènes</h2>
          <div class="composer-step-desc">
            <p>Nos produits contiennent généralement : gluten, œufs, lait, fruits à coque. Une liste détaillée est disponible sur demande.</p>
          </div>
        </section>

        <section class="composer-section">
          <h2 class="composer-step-title">6. Réclamations</h2>
          <div class="composer-step-desc">
            <address>
              Amande Pâtisserie<br>
              12 Rue des Délices, 75000 Paris<br>
              contact@amande-patisserie.fr<br>
              01 23 45 67 89
            </address>
            <p>Toute réclamation doit être formulée sous 48h après réception.</p>
          </div>
        </section>

        <p class="last-update">Dernière mise à jour : 01/06/2024</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Page CGV harmonisée avec le style de ComposerView
</script>

<style scoped>


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

.composer-step-title {
  font-family: var(--font-family-title);
  font-size: 1.6rem;
  color: #90aeb0;
  margin-bottom: 0.2rem;
  margin-top: 4rem;
}

.composer-step-desc {
  font-family: var(--font-family-text);
  color: var(--text-color);
  font-size: 1rem;
  margin-bottom: 3.5rem;
  line-height: 1.6;
}

.composer-step-desc h3 {
  color: var(--primary-color);
  font-size: 1.1rem;
  margin: 1.5rem 0 0.8rem;
  font-family: var(--font-family-title);
}

.composer-step-desc ul {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.composer-step-desc address {
  font-style: normal;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border: 1px solid #e0e0e0;
}

.last-update {
  text-align: right;
  font-style: italic;
  color: #666;
  margin-top: 2rem;
  font-family: var(--font-family-text);
}

@media (max-width: 768px) {
  .composer-card {
    padding: 1.5rem;
    margin: 1rem;
  }

  .composer-title {
    font-size: 1.8rem;
  }

  .composer-step-title {
    font-size: 1.4rem;
  }
}
</style>