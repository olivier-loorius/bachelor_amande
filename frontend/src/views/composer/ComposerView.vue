<template>
  <div class="page-container">
    <main class="content-container composer-content">
        <div class="composer-card card">
        <section v-if="currentStep === 1 || currentStep === 2">
            <h1 class="section-title">Composer sa tartelette</h1>
          <div class="composer-price-ux">
            Chez Amande, chaque tartelette est à prix unique :
              <span class="composer-price-ux-value">6€ / tartelette</span>
              Laissez-vous tenter, composez sans compter !
          </div>
            <p class="composer-intro">
            Créez la tartelette de vos rêves en quelques clics !<br>
            Choisissez chaque ingrédient, visualisez le résultat, et laissez parler votre gourmandise.<br>
              Chaque produit est préparé artisanalement dans notre atelier par nos pâtissiers passionnés, toujours à la recherche de qualité et de saveurs d'exception.<br>
              <span class="composer-intro-sub">Personnalisez, savourez, partagez ! Disponible sous 2h en boutique.</span>
          </p>
          <h2 class="composer-step-title">Pour commencer, choisissez votre fond de tartelette</h2>
          <p class="composer-step-desc">Sélectionnez la base de votre tartelette parmi nos fonds maison.</p>
                        <div class="fonds-row" v-if="!isMobile">
                <div v-for="fond in fonds" :key="fond.id" class="fond-card" style="position: relative; display: inline-block;">
              <div
                @click="selectFond(fond)"
                :style="`
                  width:220px;
                  height:150px;
                  border-radius:8px;
                  overflow:hidden;
                  border:${selectedFond?.id === fond.id ? '3px solid var(--accent-color)' : '1px solid #e0e0e0'};
                  position:relative;
                  cursor:pointer;
                  background:none;
                  margin:0;
                  padding:0;
                  box-sizing:border-box;`
                "
              >
                <img
                  :src="fond.image"
                  :alt="fond.nom"
                    style="width:100%;height:100%;object-fit:cover;border-radius:5px !important;box-sizing:border-box;display:block;margin:0;background:none;border:none;padding:0;"
                  @error="handleImageError"
                />
                <div
                  v-if="selectedFond?.id === fond.id"
                  style="position:absolute;top:3px;left:3px;width:calc(100% - 6px);height:calc(100% - 6px);border-radius:5px !important;box-sizing:border-box;background:rgba(60,60,60,0.45);display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding-bottom:24px;z-index:1;"
                >
                  <span style="color:#fff;font-size:1.1rem;font-weight:bold;text-align:center;max-width:90%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:'Roboto',sans-serif;">{{ fond.nom }}</span>
                </div>
              </div>
              <button
                v-if="selectedFond?.id === fond.id"
                class="fond-deselect-btn"
                @click.stop="deselectFond"
                aria-label="Désélectionner le fond"
                style="position: absolute; top: -12px; right: -12px; background: #e0e0e0; border: none; cursor: pointer; padding: 0; z-index: 3; box-shadow: 0 1px 4px rgba(0,0,0,0.04); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%;"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3L9 9M9 3L3 9" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
            <div v-else class="fond-carousel-mobile">
              <button class="fond-carousel-arrow" @click="prevFond" :disabled="fondIndex === 0" aria-label="Fond précédent">
                <svg width="18" height="18" viewBox="0 0 18 18"><path d="M12 15L6 9L12 3" stroke="#ff6f61" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <div class="fond-carousel-img-wrapper"
                @touchstart="handleFondSwipe"
                @touchend="handleFondSwipe"
              >
                <div class="fond-card fond-card-mobile" style="position: relative; display: inline-block; width: 100%;">
                  <div
                    @click="selectFond(fonds[fondIndex])"
                    :style="`
                      width:100%;
                      height:150px;
                      border-radius:8px;
                      overflow:hidden;
                      border:${selectedFond?.id === fonds[fondIndex].id ? '3px solid var(--accent-color)' : '1px solid #e0e0e0'};
                      position:relative;
                      cursor:pointer;
                      background:none;
                      margin:0;
                      padding:0;
                      box-sizing:border-box;`
                    "
                  >
                    <img
                      :src="fonds[fondIndex].image"
                      :alt="fonds[fondIndex].nom"
                      style="width:100%;height:100%;object-fit:cover;border-radius:5px !important;box-sizing:border-box;display:block;margin:0;background:none;border:none;padding:0;"
                      @error="handleImageError"
                    />
                    <div
                      v-if="selectedFond?.id === fonds[fondIndex].id"
                      style="position:absolute;top:3px;left:3px;width:calc(100% - 6px);height:calc(100% - 6px);border-radius:5px !important;box-sizing:border-box;background:rgba(60,60,60,0.45);display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding-bottom:24px;z-index:1;"
                    >
                      <span style="color:#fff;font-size:1.1rem;font-weight:bold;text-align:center;max-width:90%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:'Roboto',sans-serif;">{{ fonds[fondIndex].nom }}</span>
                    </div>
                  </div>
                  <button
                    v-if="selectedFond?.id === fonds[fondIndex].id"
                    class="fond-deselect-btn"
                    @click.stop="deselectFond"
                    aria-label="Désélectionner le fond"
                    style="position: absolute; top: -12px; right: -12px; background: #e0e0e0; border: none; cursor: pointer; padding: 0; z-index: 3; box-shadow: 0 1px 4px rgba(0,0,0,0.04); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%;"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3L9 9M9 3L3 9" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
                <div class="fond-carousel-dots">
                  <span v-for="(fond, idx) in fonds" :key="fond.id" :class="['fond-dot', { active: idx === fondIndex }]" />
                </div>
              </div>
              <button class="fond-carousel-arrow" @click="nextFond" :disabled="fondIndex === fonds.length - 1" aria-label="Fond suivant">
                <svg width="18" height="18" viewBox="0 0 18 18"><path d="M6 15L12 9L6 3" stroke="#ff6f61" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
            <h2 class="composer-step-title">Votre première couche de douceur</h2>
            <p class="composer-step-desc">C'est parti pour la douceur ! Choisissez parmi nos délicieuses crèmes maison. Chaque saveur a son petit caractère, à vous de jouer !</p>
            <div v-if="isMobile">
              <div class="garnitures-grid-mobile">
                <div v-for="garniture in garnitures1.slice(0, 4)" :key="garniture.id"
                  :class="['garniture-cta-btn', { selected: selectedGarniture1?.id === garniture.id }]"
                  @click="selectGarniture1(garniture)"
                >
                  {{ garniture.nom }}
                  <button
                    v-if="selectedGarniture1 && selectedGarniture1.id === garniture.id"
                    class="garniture-deselect-btn"
                    @click.stop="selectedGarniture1 = null"
                    aria-label="Désélectionner la garniture"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3L9 9M9 3L3 9" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="garniture-img-mobile-wrapper">
                <img v-if="selectedFond" :src="getGarnitureImage(selectedFond, selectedGarniture1)" :alt="selectedGarniture1?.nom || selectedFond.nom" class="garniture-img-mobile" @error="handleImageError" />
                <div v-else class="garniture-img-placeholder garniture-img-mobile">Aucun fond sélectionné</div>
              </div>
            </div>
            <div v-else style="display: flex; gap: 2.5rem; align-items: flex-start;">
              <div v-if="selectedFond" style="height: 312px; width: 220px; display: flex; flex-direction: column; justify-content: space-between;">
              <div v-for="garniture in garnitures1.slice(0, 4)" :key="garniture.id"
                :class="['garniture-cta-btn', { selected: selectedGarniture1?.id === garniture.id }]"
                style="display: flex; align-items: center; justify-content: flex-start; text-align: left; padding: 1.1rem 1.2rem; min-width: 180px; max-width: 300px; font-size: 1.08rem; font-family: var(--font-family-text); cursor: pointer; box-sizing: border-box; transition: border 0.18s, outline 0.18s; border-radius: 8px;"
                @click="selectGarniture1(garniture)"
              >
                {{ garniture.nom }}
                <button
                  v-if="selectedGarniture1 && selectedGarniture1.id === garniture.id"
                  class="garniture-deselect-btn"
                  @click.stop="selectedGarniture1 = null"
                  aria-label="Désélectionner la garniture"
                  style="position: absolute; top: -12px; right: -12px; background: #e0e0e0; border: none; cursor: pointer; padding: 0; z-index: 3; box-shadow: 0 1px 4px rgba(0,0,0,0.04); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%;"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L9 9M9 3L3 9" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div style="height: 312px; flex: 1; display: flex; align-items: stretch;">
              <img v-if="selectedFond" :src="getGarnitureImage(selectedFond, selectedGarniture1)" :alt="selectedGarniture1?.nom || selectedFond.nom" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; display: block;" @error="handleImageError" />
              <div v-else style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #b0b0b0; font-size: 1rem; border: 1px dashed #e0e0e0; border-radius: 8px; background: #fafafa;">Aucun fond sélectionné</div>
            </div>
          </div>
          <div class="composer-footer">
            <div class="composer-progress-bar">
              <template v-for="step in 5">
                <span
                  class="progress-dot"
                  :class="{
                    done: currentStep > step,
                    active: currentStep === step
                  }"
                ></span>
                <span
                  v-if="step < 5"
                  class="progress-bar"
                  :class="{ done: currentStep > step }"
                ></span>
              </template>
            </div>
            <div class="composer-nav-btns">
                <button class="composer-btn-secondary composer-btn-icon" @click="currentStep = 1">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 5l-4 4 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <span class="btn-text">Précédent</span>
                </button>
                <button class="composer-btn composer-btn-icon" :disabled="!selectedFond || !selectedGarniture1" @click="goToNextStep" aria-label="Suivant">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 5l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>
        </section>

        <section v-if="currentStep === 3">
          <h2 class="composer-step-title">Votre seconde couche de douceur</h2>
            <p class="composer-step-desc">On continue la création ! Ajoutez une touche supplémentaire à votre tartelette. Et laissez-vous porter par votre envie !</p>
            <div v-if="isMobile">
              <div class="garnitures-grid-mobile">
                <div v-for="garniture in garnitures2.slice(0, 4)" :key="garniture.id"
                  :class="['garniture-cta-btn', { selected: selectedGarniture2?.id === garniture.id }]"
                  @click="selectGarniture2(garniture)"
                >
                  {{ garniture.nom }}
                  <button
                    v-if="selectedGarniture2 && selectedGarniture2.id === garniture.id"
                    class="garniture-deselect-btn"
                    @click.stop="selectedGarniture2 = null"
                    aria-label="Désélectionner la garniture"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3L9 9M9 3L3 9" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="garniture-img-mobile-wrapper">
                <img v-if="selectedFond" :src="getGarnitureImage(selectedFond, selectedGarniture2)" :alt="selectedGarniture2?.nom || selectedFond.nom" class="garniture-img-mobile" @error="handleImageError" />
                <div v-else class="garniture-img-placeholder garniture-img-mobile">Aucun fond sélectionné</div>
              </div>
            </div>
            <div v-else style="display: flex; gap: 2.5rem; align-items: flex-start;">
              <div v-if="selectedFond" style="height: 312px; width: 220px; display: flex; flex-direction: column; justify-content: space-between;">
              <div v-for="garniture in garnitures2.slice(0, 4)" :key="garniture.id"
                :class="['garniture-cta-btn', { selected: selectedGarniture2?.id === garniture.id }]"
                style="display: flex; align-items: center; justify-content: flex-start; text-align: left; padding: 1.1rem 1.2rem; min-width: 180px; max-width: 300px; font-size: 1.08rem; font-family: var(--font-family-text); cursor: pointer; box-sizing: border-box; transition: border 0.18s, outline 0.18s; border-radius: 8px;"
                @click="selectGarniture2(garniture)"
              >
                {{ garniture.nom }}
                <button
                  v-if="selectedGarniture2 && selectedGarniture2.id === garniture.id"
                  class="garniture-deselect-btn"
                  @click.stop="selectedGarniture2 = null"
                  aria-label="Désélectionner la garniture"
                  style="position: absolute; top: -12px; right: -12px; background: #e0e0e0; border: none; cursor: pointer; padding: 0; z-index: 3; box-shadow: 0 1px 4px rgba(0,0,0,0.04); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%;"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L9 9M9 3L3 9" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div style="height: 312px; flex: 1; display: flex; align-items: stretch;">
                <img v-if="selectedFond" :src="getGarnitureImage(selectedFond, selectedGarniture2)" :alt="selectedGarniture2?.nom || selectedFond.nom" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; display: block;" @error="handleImageError" />
              <div v-else style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #b0b0b0; font-size: 1rem; border: 1px dashed #e0e0e0; border-radius: 8px; background: #fafafa;">Aucun fond sélectionné</div>
            </div>
          </div>
          <div class="composer-footer">
            <div class="composer-progress-bar">
              <template v-for="step in 5">
                <span
                  class="progress-dot"
                  :class="{
                    done: currentStep > step,
                    active: currentStep === step
                  }"
                ></span>
                <span
                  v-if="step < 5"
                  class="progress-bar"
                  :class="{ done: currentStep > step }"
                ></span>
              </template>
            </div>
            <div class="composer-nav-btns">
                <button class="composer-btn-secondary composer-btn-icon" @click="currentStep = 2">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 5l-4 4 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <span class="btn-text">Précédent</span>
              </button>
                <button class="composer-btn composer-btn-icon" :disabled="!selectedGarniture2" @click="goToNextStep" aria-label="Suivant">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 5l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>
        </section>

        <section v-if="currentStep === 4">
            <h2 class="composer-step-title">La touche finale</h2>
            <p class="composer-step-desc">On arrive au bout ! Ajoutez cette petite touche qui va faire toute la différence. Dernier moment pour laisser parler votre créativité !</p>
            <div v-if="isMobile">
              <div class="garnitures-grid-mobile">
                <div v-for="garniture in garnitures3.slice(0, 4)" :key="garniture.id"
                  :class="['garniture-cta-btn', { selected: selectedGarniture3?.id === garniture.id }]"
                  @click="selectGarniture3(garniture)"
                >
                  {{ garniture.nom }}
                  <button
                    v-if="selectedGarniture3 && selectedGarniture3.id === garniture.id"
                    class="garniture-deselect-btn"
                    @click.stop="selectedGarniture3 = null"
                    aria-label="Désélectionner la garniture"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3L9 9M9 3L3 9" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="garniture-img-mobile-wrapper">
                <img v-if="selectedFond" :src="getGarnitureImage(selectedFond, selectedGarniture3)" :alt="selectedGarniture3?.nom || selectedFond.nom" class="garniture-img-mobile" @error="handleImageError" />
                <div v-else class="garniture-img-placeholder garniture-img-mobile">Aucun fond sélectionné</div>
              </div>
            </div>
            <div v-else style="display: flex; gap: 2.5rem; align-items: flex-start;">
              <div v-if="selectedFond" style="height: 312px; width: 220px; display: flex; flex-direction: column; justify-content: space-between;">
                <div v-for="garniture in garnitures3.slice(0, 4)" :key="garniture.id"
                  :class="['garniture-cta-btn', { selected: selectedGarniture3?.id === garniture.id }]"
                style="display: flex; align-items: center; justify-content: flex-start; text-align: left; padding: 1.1rem 1.2rem; min-width: 180px; max-width: 300px; font-size: 1.08rem; font-family: var(--font-family-text); cursor: pointer; box-sizing: border-box; transition: border 0.18s, outline 0.18s; border-radius: 8px;"
                  @click="selectGarniture3(garniture)"
              >
                  {{ garniture.nom }}
                <button
                    v-if="selectedGarniture3 && selectedGarniture3.id === garniture.id"
                  class="garniture-deselect-btn"
                    @click.stop="selectedGarniture3 = null"
                    aria-label="Désélectionner la garniture"
                  style="position: absolute; top: -12px; right: -12px; background: #e0e0e0; border: none; cursor: pointer; padding: 0; z-index: 3; box-shadow: 0 1px 4px rgba(0,0,0,0.04); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%;"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L9 9M9 3L3 9" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div style="height: 312px; flex: 1; display: flex; align-items: stretch;">
                <img v-if="selectedFond" :src="getGarnitureImage(selectedFond, selectedGarniture3)" :alt="selectedGarniture3?.nom || selectedFond.nom" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; display: block;" @error="handleImageError" />
              <div v-else style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #b0b0b0; font-size: 1rem; border: 1px dashed #e0e0e0; border-radius: 8px; background: #fafafa;">Aucun fond sélectionné</div>
            </div>
          </div>
          <div class="composer-footer">
            <div class="composer-progress-bar">
              <template v-for="step in 5">
                <span
                  class="progress-dot"
                  :class="{
                    done: currentStep > step,
                    active: currentStep === step
                  }"
                ></span>
                <span
                  v-if="step < 5"
                  class="progress-bar"
                  :class="{ done: currentStep > step }"
                ></span>
              </template>
            </div>
            <div class="composer-nav-btns">
                <button class="composer-btn-secondary composer-btn-icon" @click="currentStep = 3">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 5l-4 4 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <span class="btn-text">Précédent</span>
              </button>
                <button class="composer-btn composer-btn-icon" :disabled="!selectedGarniture3" @click="goToNextStep" aria-label="Suivant">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 5l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>
        </section>

        <section v-if="currentStep === 5">
            <h2 class="composer-step-title">Et voilà, votre création finale !</h2>
            <p class="composer-step-desc">Il ne vous reste plus qu'à définir votre gourmandise… Choisissez le nombre de tartelettes à commander, pour vous faire plaisir ou pour partager !</p>
            <div class="composer-step5-wrapper">
              <div class="composer-step5-summary">
                <h3 class="composer-step-title" style="font-size: 1.15rem; margin-top: 0; margin-bottom: 1.7rem;">Votre création</h3>
                <div style="display: flex; flex-direction: column; gap: 0.7rem; margin-bottom: 1.7rem; width: 100%;">
                  <div v-if="selectedFond" class="composer-step-desc" style="margin-bottom: 0; font-weight: 500; display: flex; align-items: center; gap: 0.5em;">
                    <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #ff6f61;"></span>
                    {{ selectedFond.nom }}
                  </div>
                  <div v-if="selectedGarniture1" class="composer-step-desc" style="margin-bottom: 0; font-weight: 500; display: flex; align-items: center; gap: 0.5em;">
                    <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #ff6f61;"></span>
                    {{ selectedGarniture1.nom }}
                  </div>
                  <div v-if="selectedGarniture2" class="composer-step-desc" style="margin-bottom: 0; font-weight: 500; display: flex; align-items: center; gap: 0.5em;">
                    <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #ff6f61;"></span>
                    {{ selectedGarniture2.nom }}
                  </div>
                  <div v-if="selectedGarniture3" class="composer-step-desc" style="margin-bottom: 0; font-weight: 500; display: flex; align-items: center; gap: 0.5em;">
                    <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #ff6f61;"></span>
                    {{ selectedGarniture3.nom }}
                  </div>
                  <div v-if="selectedFinition" class="composer-step-desc" style="margin-bottom: 0; font-weight: 500; display: flex; align-items: center; gap: 0.5em;">
                    <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #ff6f61;"></span>
                    {{ selectedFinition.nom }}
                  </div>
                </div>
                <div style="width: 100%; margin-bottom: 0.7rem;">
                  <div class="composer-step-title" style="font-size: 1.15rem; margin-top: 0; margin-bottom: 1.1rem; font-weight: bold;">Quantité</div>
                  <div class="composer-qty-row">
                    <button @click="quantite = Math.max(1, quantite - 1)" aria-label="Diminuer la quantité" class="composer-qty-btn-bare" :disabled="quantite <= 1" :class="{ 'composer-qty-btn-disabled': quantite <= 1 }">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 15L5 9L11 3" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                    <input type="number" v-model="quantite" min="1" max="10" class="composer-qty-input-bare" :class="{ 'composer-qty-input-animate': animateQty }" @animationend="animateQty = false" @input="triggerQtyAnim" />
                    <button @click="quantite = Math.min(10, quantite + 1)" aria-label="Augmenter la quantité" class="composer-qty-btn-bare" :disabled="quantite >= 10" :class="{ 'composer-qty-btn-disabled': quantite >= 10 }">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 15L13 9L7 3" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <span style="color: #888; font-size: 0.98rem; margin-left: 0.5rem; min-width: 70px; text-align: left; font-weight: bold; font-family: var(--font-family-text);">
                      {{ quantite > 1 ? 'tartelettes' : 'tartelette' }}
                    </span>
              </div>
            </div>
            </div>
              <div class="composer-step5-img">
                <img v-if="selectedFond" :src="getGarnitureImage(selectedFond, selectedGarniture1)" :alt="selectedGarniture1?.nom || selectedFond.nom" class="composer-step5-img-el" @error="handleImageError" />
                <div v-else class="garniture-img-placeholder composer-step5-img-el">Aucun fond sélectionné</div>
          </div>
            </div>
            <div class="composer-footer composer-footer-step5">
            <div class="composer-progress-bar">
              <template v-for="step in 5">
                <span
                  class="progress-dot"
                  :class="{
                    done: currentStep > step,
                    active: currentStep === step
                  }"
                ></span>
                <span
                  v-if="step < 5"
                  class="progress-bar"
                  :class="{ done: currentStep > step }"
                ></span>
              </template>
            </div>
              <div class="composer-nav-btns composer-nav-btns-step5">
                <button class="composer-btn-secondary composer-btn-icon" @click="currentStep = 4" aria-label="Précédent">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 5l-4 4 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <span class="btn-text">Précédent</span>
              </button>
                <button class="composer-btn-secondary composer-btn-icon" @click="recommencer(); currentStep = 1" aria-label="Recommencer">
                  <i class="fas fa-undo"></i>
                  <span class="btn-text">Recommencer</span>
                </button>
                <button class="composer-btn panier-cta composer-btn-icon" :disabled="!quantite" @click="ajouterAuPanier" aria-label="Ajouter au panier">
                  <i class="fas fa-shopping-cart"></i>
                  <span class="btn-text">Panier</span>
              </button>
            </div>
            
            <!-- CRUD Section -->
            <div class="crud-section" v-if="authStore.isLoggedIn">
              <div class="save-composition-section">
                <input 
                  v-model="compositionName" 
                  placeholder="Nom de votre création" 
                  class="composition-name-input"
                  :disabled="!peutValider"
                />
                <button 
                  @click="saveComposition" 
                  class="save-composition-btn"
                  :disabled="!peutValider || isLoading"
                >
                  <i class="fas fa-save"></i>
                  <span v-if="!isLoading">Sauvegarder</span>
                  <span v-else>Sauvegarde...</span>
                </button>
              </div>
              
              <div class="compositions-list-section">
                <button @click="toggleCompositionsList" class="toggle-compositions-btn">
                  <i class="fas fa-list"></i>
                  <span>Mes créations ({{ userCompositions.length }})</span>
                </button>
                
                <div v-if="showCompositionsList" class="compositions-list">
                  <div v-for="comp in userCompositions" :key="comp.id" class="composition-item">
                    <div class="composition-info">
                      <h4>{{ comp.name }}</h4>
                      <p class="composition-date">{{ new Date(comp.created_at!).toLocaleDateString() }}</p>
                    </div>
                    <div class="composition-actions">
                      <button @click="loadComposition(comp)" class="load-btn">
                        <i class="fas fa-upload"></i>
                        Charger
                      </button>
                      <button @click="deleteComposition(comp.id!)" class="delete-btn">
                        <i class="fas fa-trash"></i>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Save Message -->
              <div v-if="saveMessage" class="save-message" :class="saveMessageType">
                {{ saveMessage }}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
    <AddToCartModal 
      :show="showAddModal"
      message="Votre tartelette a bien été ajoutée au panier !"
      @close="closeAddModal"
    />


  </template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AddToCartModal from '@/components/AddToCartModal.vue'
import { useAuthStore } from '@/stores/auth'
import { usePanierStore } from '@/stores/panier'
import { compositionsService, type Composition } from '@/services/supabaseService'
import { productConfigService, type ProductConfig } from '@/services/productConfigService'


// Configuration des produits depuis Supabase
const productConfig = ref<ProductConfig[]>([])

// Computed properties pour organiser les données
const fonds = computed(() => {
  return productConfig.value
    .filter(p => p.config_type === 'fonds')
    .sort((a, b) => a.product_index - b.product_index)
    .map(p => ({
      id: p.product_index + 1,
      nom: p.nom || 'Fond à configurer',
      image: p.images && p.images.length > 0 ? p.images[0] : null
    }))
})

const garnitures1 = computed(() => {
  return productConfig.value
    .filter(p => p.config_type === 'premiere_couche_douceur')
    .sort((a, b) => a.product_index - b.product_index)
    .map(p => ({
      id: p.product_index + 1,
      nom: p.nom || 'Garniture à configurer',
      image: p.images && p.images.length > 0 ? p.images[0] : null
    }))
})

const garnitures2 = computed(() => {
  return productConfig.value
    .filter(p => p.config_type === 'seconde_couche_douceur')
    .sort((a, b) => a.product_index - b.product_index)
    .map(p => ({
      id: p.product_index + 1,
      nom: p.nom || 'Garniture à configurer',
      image: p.images && p.images.length > 0 ? p.images[0] : null
    }))
})

const garnitures3 = computed(() => {
  return productConfig.value
    .filter(p => p.config_type === 'touche_finale')
    .sort((a, b) => a.product_index - b.product_index)
    .map(p => ({
      id: p.product_index + 1,
      nom: p.nom || 'Garniture à configurer',
      image: p.images && p.images.length > 0 ? p.images[0] : null
    }))
})

const finitions = computed(() => {
  return productConfig.value
    .filter(p => p.config_type === 'touche_finale')
    .sort((a, b) => a.product_index - b.product_index)
    .map(p => ({
      id: p.product_index + 1,
      nom: p.nom || 'Finition à configurer',
      image: p.images && p.images.length > 0 ? p.images[0] : null
    }))
})

const selectedFond = ref(null as null | { id: number, nom: string })
const selectedGarniture1 = ref(null as null | { id: number, nom: string })
const selectedGarniture2 = ref(null as null | { id: number, nom: string })
  const selectedGarniture3 = ref(null as null | { id: number, nom: string })
const selectedFinition = ref(null as null | { id: number, nom: string })
const quantite = ref(1)
  const animateQty = ref(false)
  function triggerQtyAnim() {
    animateQty.value = false;
    void quantite.value;
    animateQty.value = true;
  }
const hoveredGarniture1 = ref<number|null>(null)
const showAddModal = ref(false)
const showLoginPrompt = ref(false)
const authStore = useAuthStore()
const panierStore = usePanierStore()

// CRUD Variables
const compositionName = ref('')
const userCompositions = ref<Composition[]>([])
const showSaveModal = ref(false)
const showCompositionsList = ref(false)
const isLoading = ref(false)
const saveMessage = ref('')
const saveMessageType = ref<'success' | 'error'>('success')

const peutValider = computed(() => {
    return !!selectedFond.value && !!selectedGarniture1.value && !!selectedGarniture2.value && !!selectedGarniture3.value && !!selectedFinition.value && quantite.value > 0
})

// Fonction helper simple pour gérer les erreurs d'images
// Utilise un placeholder CSS simple au lieu de fichiers SVG
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target) {
    // Créer un placeholder CSS simple
    target.style.background = '#f8f9fa'
    target.style.border = '1px solid #e0e0e0'
    target.style.borderRadius = '8px'
    target.style.display = 'flex'
    target.style.alignItems = 'center'
    target.style.justifyContent = 'center'
    target.style.color = '#999'
    target.style.fontSize = '14px'
    target.style.fontFamily = 'Arial, sans-serif'
    target.style.textAlign = 'center'
    target.style.padding = '20px'
    target.style.boxSizing = 'border-box'
    
    // Masquer l'image et afficher un texte
    target.style.backgroundImage = 'none'
    target.style.backgroundSize = 'cover'
    target.style.backgroundPosition = 'center'
    target.style.backgroundRepeat = 'no-repeat'
    
    // Ajouter un pseudo-élément pour le texte
    const placeholderText = document.createElement('div')
    placeholderText.textContent = 'Image non disponible'
    placeholderText.style.position = 'absolute'
    placeholderText.style.top = '50%'
    placeholderText.style.left = '50%'
    placeholderText.style.transform = 'translate(-50%, -50%)'
    placeholderText.style.color = '#999'
    placeholderText.style.fontSize = '12px'
    placeholderText.style.fontFamily = 'Arial, sans-serif'
    placeholderText.style.textAlign = 'center'
    placeholderText.style.pointerEvents = 'none'
    
    // Ajouter le texte au conteneur parent
    const parent = target.parentElement
    if (parent) {
      parent.style.position = 'relative'
      parent.appendChild(placeholderText)
    }
  }
}

// Charger la configuration des produits
const loadProductConfiguration = async () => {
  try {
    console.log('🔄 Chargement de la configuration des produits...')
    const config = await productConfigService.getAllProductConfig()
    productConfig.value = config
    console.log('✅ Configuration chargée:', config.length, 'produits')
  } catch (error) {
    console.error('❌ Erreur lors du chargement de la configuration:', error)
    productConfig.value = []
  }
}

function selectFond(fond: { id: number, nom: string }) {
  selectedFond.value = fond
  if (currentStep.value < 2) currentStep.value = 2
}
function selectGarniture1(garniture: { id: number, nom: string }) {
  selectedGarniture1.value = garniture
}
function selectGarniture2(garniture: { id: number, nom: string }) {
  selectedGarniture2.value = garniture
}
  function selectGarniture3(garniture: { id: number, nom: string }) {
    selectedGarniture3.value = garniture
}
function selectFinition(finition: { id: number, nom: string }) {
  selectedFinition.value = finition
}

function recommencer() {
  selectedFond.value = null
  selectedGarniture1.value = null
  selectedGarniture2.value = null
    selectedGarniture3.value = null
  selectedFinition.value = null
  quantite.value = 1
}
async function ajouterAuPanier() {
  if (!authStore.isLoggedIn) {
    showLoginPrompt.value = true
    return
  }
  
  // Créer le produit à partir des sélections
  const produit = {
    id: Date.now(), // ID unique basé sur le timestamp
    nom: `Tartelette personnalisée`,
    image: getGarnitureImage(selectedFond.value, selectedGarniture1.value),
    prix: 6, // Prix fixe pour les tartelettes personnalisées
    quantite: quantite.value,
    base: selectedFond.value?.nom || '',
    premiereDouceur: selectedGarniture1.value?.nom || '',
    secondeDouceur: selectedGarniture2.value?.nom || '',
    finition: selectedFinition.value?.nom || ''
  }
  
  // Ajouter au panier
  const success = await panierStore.ajouterAuPanier(produit)
  
  if (success) {
    showAddModal.value = true
  }
}
  function closeAddModal() {
    showAddModal.value = false
    recommencer()
    currentStep.value = 1
  }

  // Fonctions pour la modal d'incitation à la connexion
  function closeLoginPrompt() {
    showLoginPrompt.value = false
  }

  function handleLoginSuccess() {
    // L'utilisateur s'est connecté avec succès
    // On peut maintenant ajouter le produit au panier
    ajouterAuPanier()
  }

  function handleRegisterSuccess() {
    // L'utilisateur s'est inscrit avec succès
    // On peut maintenant ajouter le produit au panier
    ajouterAuPanier()
  }

  function openCartAfterLogin() {
  // Ouvrir le panier après connexion
  // Cette fonction sera appelée si l'utilisateur choisit d'ouvrir le panier
}

// CRUD Functions
async function saveComposition() {
  if (!authStore.isLoggedIn) {
    showLoginPrompt.value = true
    return
  }
  
  if (!compositionName.value.trim()) {
    saveMessage.value = 'Veuillez donner un nom à votre création'
    saveMessageType.value = 'error'
    return
  }
  
  if (!peutValider.value) {
    saveMessage.value = 'Veuillez compléter votre composition'
    saveMessageType.value = 'error'
    return
  }
  
  isLoading.value = true
  
  try {
    if (!authStore.user?.id) {
      saveMessage.value = 'Erreur: utilisateur non connecté'
      saveMessageType.value = 'error'
      return
    }
    
    const composition: Omit<Composition, 'id' | 'created_at' | 'updated_at'> = {
      user_id: authStore.user.id,
      name: compositionName.value.trim(),
      fond: selectedFond.value?.nom || '',
      garniture1: selectedGarniture1.value?.nom || '',
      garniture2: selectedGarniture2.value?.nom || '',
      garniture3: selectedFinition.value?.nom || '',
      finition: selectedFinition.value?.nom || ''
    }
    
    const result = await compositionsService.createComposition(composition)
    
    if (result) {
      saveMessage.value = 'Composition sauvegardée avec succès !'
      saveMessageType.value = 'success'
      compositionName.value = ''
      await loadUserCompositions()
    } else {
      saveMessage.value = 'Erreur lors de la sauvegarde'
      saveMessageType.value = 'error'
    }
  } catch (error) {
    saveMessage.value = 'Erreur lors de la sauvegarde'
    saveMessageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}

async function loadUserCompositions() {
  if (!authStore.isLoggedIn) return
  
  try {
    const data = await compositionsService.getUserCompositions(authStore.user!.id)
    userCompositions.value = data
  } catch (error) {
    console.error('Erreur lors du chargement des compositions:', error)
  }
}

async function loadComposition(composition: Composition) {
  // Trouver les objets correspondants aux noms stockés
  const fond = fonds.value.find(f => f.nom === composition.fond)
  const garniture1 = garnitures1.value.find(g => g.nom === composition.garniture1)
  const garniture2 = garnitures2.value.find(g => g.nom === composition.garniture2)
  const garniture3 = garnitures3.value.find(g => g.nom === composition.garniture3)
  const finition = finitions.value.find(f => f.nom === composition.garniture3)
  
  selectedFond.value = fond || null
  selectedGarniture1.value = garniture1 || null
  selectedGarniture2.value = garniture2 || null
  selectedGarniture3.value = garniture3 || null
  selectedFinition.value = finition || null
  compositionName.value = composition.name
}

async function deleteComposition(id: string) {
  if (!authStore.isLoggedIn) return
  
  try {
    const success = await compositionsService.deleteComposition(id)
    if (success) {
      await loadUserCompositions()
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

function showSaveCompositionModal() {
  showSaveModal.value = true
}

function closeSaveModal() {
  showSaveModal.value = false
  saveMessage.value = ''
}

function toggleCompositionsList() {
  showCompositionsList.value = !showCompositionsList.value
  if (showCompositionsList.value) {
    loadUserCompositions()
  }
}

function deselectFond() {
  selectedFond.value = null
  selectedGarniture1.value = null
  selectedGarniture2.value = null
  selectedGarniture3.value = null
  selectedFinition.value = null
}

function deselectGarniture1() {
  selectedGarniture1.value = null
}

  function getGarnitureImage(fond: { id: number, nom: string, image?: string } | null, garniture: { id: number, nom: string } | null) {
  if (!fond) return '';
  if (!garniture) return fond.image || '';
  // Logique simplifiée - retourner l'image du fond ou une chaîne vide
  return fond.image || '';
}

function handleClickOutsideFond(event: MouseEvent) {
  const fondOptions = document.querySelector('.fond-options')
  if (fondOptions && !fondOptions.contains(event.target as Node)) {
    deselectFond()
  }
}
onMounted(async () => {
  document.addEventListener('mousedown', handleClickOutsideFond)
  if (!selectedGarniture2.value && selectedGarniture1.value) {
    selectedGarniture2.value = selectedGarniture1.value;
  }
  // Charger la configuration des produits depuis Supabase
  await loadProductConfiguration()
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutsideFond)
})

function handleClickOutsideGarniture1(event: MouseEvent) {
  const ctaCol = document.querySelector('.garniture-cta-col');
  if (ctaCol && !ctaCol.contains(event.target as Node)) {
    selectedGarniture1.value = null;
  }
}
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutsideGarniture1)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutsideGarniture1)
})

const currentStep = ref(1)

const stepDone = computed(() => {
  if (!selectedFond.value) return 0;
  if (!selectedGarniture1.value) return 1;
  if (!selectedGarniture2.value) return 2;
    if (!selectedGarniture3.value) return 3;
    if (!selectedFinition.value) return 4;
    if (!quantite.value) return 5;
    return 6;
});

function goToNextStep() {
    if (currentStep.value < 6) {
    currentStep.value++
    setTimeout(() => {
      const card = document.querySelector('.composer-card');
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }
}
function goToPrevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}
  
  const fondIndex = ref(0)
  
  function prevFond() {
    if (fondIndex.value > 0) fondIndex.value--;
  }
  function nextFond() {
    if (fondIndex.value < fonds.value.length - 1) fondIndex.value++;
  }
  function handleFondSwipe(e: TouchEvent) {
    let startX = 0;
    let endX = 0;
    if (e.type === 'touchstart') {
      startX = e.touches[0].clientX;
      fondSwipeStartX = startX;
    } else if (e.type === 'touchend') {
      endX = e.changedTouches[0].clientX;
      if (fondSwipeStartX - endX > 40) nextFond();
      if (endX - fondSwipeStartX > 40) prevFond();
    }
  }
  let fondSwipeStartX = 0;
  
  const windowWidth = ref(window.innerWidth)
  function handleResize() {
    windowWidth.value = window.innerWidth
  }
  onMounted(() => window.addEventListener('resize', handleResize))
  onBeforeUnmount(() => window.removeEventListener('resize', handleResize))
  const isMobile = computed(() => windowWidth.value <= 600)
</script>

<style scoped>
  
.composer-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(180, 138, 120, 0.07);
  padding: 2.5rem 2rem;
  max-width: 800px;
  width: 100%;
  margin: 2rem 0;
  padding-bottom: 8rem;
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
.composer-intro {
  font-family: var(--font-family-text);
  font-size: 1.1rem;
  color: var(--text-color);
  margin-bottom: 2rem;
}
.composer-intro-left {
  text-align: left;
}
.composer-intro-sub {
  display: block;
  color: var(--text-color);
  font-weight: normal;
  margin-top: 0.7rem;
  font-size: 1.08rem;
  letter-spacing: 0.5px;
}
.composer-price {
  color: #90aeb0;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 0.5rem;
}
.composer-price-desc {
  color: #b0c7c8;
  font-size: 1.1rem;
  font-weight: 400;
}
.composer-price-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  background: #90aeb0;
  border-radius: 1.2rem;
  padding: 0.5rem 1.5rem;
  margin-bottom: 1.2rem;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 2px 8px rgba(144, 174, 176, 0.08);
}
.composer-price-simple {
  margin: 0 0 1.2rem 0;
  text-align: left;
}
.composer-price-ux {
  margin: 0 0 1.2rem 0;
  text-align: left;
  font-size: 1.08rem;
  color: var(--text-color);
  font-family: var(--font-family-text);
  font-weight: normal;
  line-height: 1.5;
}
.composer-price-ux-value {
  color: #ff6f61;
  font-weight: bold;
  font-size: 1.08em;
  margin-left: 0.5em;
  margin-right: 0.5em;
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
}
.fond-options {
  gap: 2.5rem;
  justify-content: center;
  display: flex;
}
.fond-option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
  min-width: 140px;
  cursor: pointer;
  transition: transform 0.16s, border 0.16s;
  position: relative;
}
.fond-option-card .fond-image-wrapper {
  position: relative;
  width: 220px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  background: transparent;
  border: 1px solid #e0e0e0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.fond-option-card.selected .fond-image-wrapper {
  border: 1.5px solid var(--accent-color);
}
.fond-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 8px;
  margin: 0;
  background: none;
  border: none;
  padding: 0;
}
.fond-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 8px;
  background: rgba(60,60,60,0.45);
  opacity: 0;
  pointer-events: none;
  z-index: 1;
}
.fond-option-card:hover .fond-overlay.fond-hover-overlay {
  opacity: 1;
  pointer-events: auto;
}
.fond-overlay-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 1.15rem;
  font-weight: bold;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
  letter-spacing: 0.5px;
  text-align: center;
  white-space: pre-line;
  pointer-events: none;
}
.fond-label {
  margin-top: 0.15rem;
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--text-color);
  text-align: center;
}
.fond-deselect-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e0e0e0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: background 0.15s;
  position: absolute;
  top: -12px;
  right: -12px;
  z-index: 3;
  border: none;
  padding: 0;
}
.fond-deselect-btn:hover {
  background: #d0d0d0;
}
.garniture-flex {
  display: flex;
  width: 100%;
  gap: 2.5rem;
  align-items: stretch;
}
.garniture-cta-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
}
.garniture-cta-btn {
  border: 1.5px solid #e0e0e0;
  position: relative;
  font-weight: bold;
  color: #222;
  background: #fff;
  transition: background 0.18s, color 0.18s, border 0.18s, outline 0.18s;
}
.garniture-cta-btn.selected {
  outline: 3px solid var(--accent-color);
  outline-offset: 2px;
  background: rgba(60,60,60,0.45);
  color: #fff;
  font-weight: bold;
    z-index: 15;
}
.garniture-img-col {
  display: flex;
  justify-content: flex-start;
}
.garniture-img {
  width: 100%;
  height: 312px;
  object-fit: contain;
  border-radius: 8px;
  display: block;
}
.garniture-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b0b0b0;
  font-size: 1rem;
  border: 1px dashed #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}
.garniture-deselect-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e0e0e0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: background 0.15s;
  position: absolute;
  top: -12px;
  right: -12px;
  z-index: 3;
  border: none;
  padding: 0;
}
.garniture-deselect-btn:hover {
  background: #d0d0d0;
}
.composer-btn {
  background: var(--accent-color);
  color: #fff;
  padding: 0.8rem 1.5rem;
  border-radius: 0.8rem;
  border: none;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(144, 174, 176, 0.15);
  display: flex;
  align-items: center;
}
.composer-btn:hover:not(:disabled) {
  background: var(--accent-hover-color);
  border: 2px solid var(--accent-color);
  box-sizing: border-box;
}
.composer-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  color: #888;
}
.composer-btn-secondary {
  background: #fff;
  color: var(--accent-color);
  border: 2px solid var(--accent-color);
  padding: 0.8rem 1.5rem;
  border-radius: 0.8rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  box-shadow: 0 2px 8px rgba(144, 174, 176, 0.10);
  display: flex;
  align-items: center;
}
.composer-btn-secondary:hover:not(:disabled) {
  background: #f0f0f0;
  color: #ff6f61;
}
  .composer-btn-secondary:disabled {
    background: #ccc;
    cursor: not-allowed;
    color: #888;
}
.composer-stepper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 0.5rem;
}
.stepper-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
  position: relative;
}
.stepper-index {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #90aeb0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
  border: 2px solid #90aeb0;
  transition: background 0.2s, color 0.2s;
}
.stepper-step.active .stepper-index {
  background: #90aeb0;
  color: #fff;
}
.stepper-step.done .stepper-index {
  background: #ff6f61;
  color: #fff;
  border-color: #ff6f61;
}
.stepper-label {
  font-size: 0.95rem;
  color: #90aeb0;
  font-weight: 500;
}
.stepper-step.active .stepper-label {
  color: #ff6f61;
  font-weight: bold;
}
.stepper-summary {
  font-size: 0.85rem;
  color: #222;
  margin-top: 0.1rem;
  text-align: center;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.composer-nav-btns {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
    margin-top: 2.5rem;
    margin-bottom: 0;
}
.composer-btn, .composer-btn-secondary {
  min-width: 160px;
  max-width: 160px;
  height: 40px;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px rgba(144, 174, 176, 0.10);
  margin: 0 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  color: inherit;
  border: none;
  font-weight: bold;
  cursor: pointer;
}
.composer-btn:disabled, .composer-btn-secondary:disabled {
  background: #ccc;
  cursor: not-allowed;
  color: #888;
}
.composer-footer {
  width: 100%;
  background: #fff;
  padding-top: 2rem;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}
.composer-card {
  padding-bottom: 2rem;
}
.composer-progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
    margin-bottom: 1.5rem;
  margin-top: 1rem;
  gap: 0.5rem;
  min-width: 340px;
}
.progress-dot {
    width: 12px;
    height: 12px;
  border-radius: 50%;
  background: #e0e0e0;
    border: 2px solid #e0e0e0;
  box-sizing: border-box;
  transition: background 0.2s, border 0.2s;
  position: relative;
  z-index: 1;
    opacity: 0.7;
}
.progress-dot.active {
  background: #fff;
    border: 2px solid #ff6f61;
    opacity: 1;
}
.progress-dot.done {
  background: #ff6f61;
    border: 2px solid #ff6f61;
    opacity: 1;
}
.progress-bar {
    width: 48px;
    height: 2px;
  background: #e0e0e0;
  border-radius: 2px;
  margin: 0 8px;
  transition: background 0.2s;
  z-index: 0;
    opacity: 0.5;
}
.progress-bar.done {
  background: #ff6f61;
    opacity: 1;
  }
  .composer-qty-input {
    width: 56px;
    text-align: center;
    font-size: 1.25rem;
    border-radius: 1.2rem;
    border: 2px solid var(--accent-color);
    color: var(--accent-color);
    padding: 0.4rem 0;
    outline: none;
    transition: box-shadow 0.18s, border 0.18s;
  }
  .composer-qty-input:focus {
    box-shadow: 0 0 0 2px #ffe3de;
    border-color: #ff6f61;
  }
  .composer-qty-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: #e0e0e0;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--accent-color);
    cursor: pointer;
    transition: background 0.18s, color 0.18s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .composer-qty-btn:hover {
    background: #ffe3de;
  }
  .composer-qty-btn:focus {
    outline: 2px solid #ff6f61;
    background: #ffe3de;
  }
  .composer-qty-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.7rem;
  }
  .composer-qty-btn-minimal {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1.5px solid var(--accent-color);
    background: #fff;
    color: var(--accent-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    transition: border 0.15s, background 0.15s;
    padding: 0;
  }
  .composer-qty-btn-minimal:hover {
    background: #f8f8f8;
    border-color: #ff6f61;
  }
  .composer-qty-input-minimal {
    width: 38px;
    text-align: center;
    font-size: 1.1rem;
    border: none;
    background: transparent;
    color: var(--accent-color);
    font-weight: bold;
    outline: none;
  }
  .composer-qty-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .composer-qty-btn-bare {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.15s;
    opacity: 0.85;
  }
  .composer-qty-btn-bare:hover:not(:disabled) {
    opacity: 1;
  }
  .composer-qty-btn-disabled {
    opacity: 0.4 !important;
    cursor: not-allowed !important;
    pointer-events: none;
  }
  .composer-qty-input-bare {
    width: 38px;
    text-align: center;
    font-size: 1.1rem;
    border: none;
    background: transparent;
    color: #222;
    font-weight: normal;
    outline: none;
    transition: background-color 0.2s;
  }
  .composer-qty-input-animate {
    animation: qtyPulse 0.2s;
  }
  @keyframes qtyPulse {
    0% { background-color: #f8f8f8; }
    100% { background-color: transparent; }
  }
  .composer-btn-panier {
  }
  .composer-btn-panier:disabled {
    background: #ccc;
    color: #888;
    cursor: not-allowed;
    box-shadow: none;
  }
  .composer-btn-panier:hover:not(:disabled) {
    background: #e05a4e;
    transform: scale(1.08);
    box-shadow: 0 4px 16px rgba(255, 111, 97, 0.18);
  }
  .composer-btn-panier i {
    color: #fff;
    font-size: 1.25em;
  }
  .composer-btn.panier-cta {
    border: 2px solid var(--accent-color);
    background: #fff;
    color: var(--accent-color);
    transition: background 0.18s, color 0.18s, border 0.18s;
  }
  .composer-btn.panier-cta i {
    color: var(--accent-color);
    transition: color 0.18s;
  }
  .composer-btn.panier-cta:hover:not(:disabled) {
    background: var(--accent-color);
    color: #fff;
    border: 2px solid var(--accent-color);
  }
  .composer-btn.panier-cta:hover:not(:disabled) i {
    color: #fff;
  }
  .garniture-cta-btn-disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed !important;
    background: #f5f5f5 !important;
    color: #aaa !important;
  }
  .garniture-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(255,255,255,0.7);
    backdrop-filter: blur(2px);
    border-radius: 8px;
    z-index: 2;
    pointer-events: none;
    transition: opacity 0.2s;
  }

  .fond-carousel-mobile { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
  .fond-carousel-img-wrapper { flex: 1; display: flex; flex-direction: column; align-items: center; }
  .fond-card-mobile { width: 100%; max-width: 320px; }
  .fond-carousel-arrow { background: none; border: none; color: var(--accent-color); font-size: 1.5rem; cursor: pointer; padding: 0.5rem; opacity: 0.7; transition: opacity 0.15s; }
  .fond-carousel-arrow:disabled { opacity: 0.3; cursor: not-allowed; }
  .fond-carousel-dots { display: flex; justify-content: center; gap: 0.5rem; margin-top: 0.7rem; }
  .fond-dot { width: 10px; height: 10px; border-radius: 50%; background: #e0e0e0; display: inline-block; transition: background 0.2s; }
  .fond-dot.active { background: #ff6f61; }
  .garnitures-grid-mobile {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.7rem;
    margin-bottom: 1.5rem;
    padding: 0 0.7rem;
    width: 100%;
    box-sizing: border-box;
  }
  .garnitures-grid-mobile .garniture-cta-btn {
    min-height: 32px;
    font-size: 0.8rem;
    border-radius: 6px;
    margin: 0;
    padding: 0.2rem 0.1rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    max-width: 100%;
    overflow-wrap: break-word;
    white-space: normal;
  }
  .garniture-img-mobile-wrapper {
    width: 100vw;
    max-width: 100vw;
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
  }
  .garniture-img-mobile {
    width: 80vw;
    max-width: 320px;
    height: 160px;
    object-fit: cover;
    border-radius: 8px;
    display: block;
  }
  @media (min-width: 601px) {
    .garnitures-grid-mobile, .garniture-img-mobile-wrapper, .garniture-img-mobile {
      display: none !important;
    }
  }
  @media (max-width: 600px) {
    .composer-progress-bar {
      width: 80vw !important;
      max-width: 80vw !important;
      margin: 0.8rem auto 0.8rem auto !important;
      height: 4px !important;
      min-height: 4px !important;
    }
    .composer-progress-bar .progress-bar-inner {
      height: 4px !important;
      min-height: 4px !important;
    }
    .composer-progress-bar-label {
      font-size: 0.75rem !important;
      margin-bottom: 0.1rem !important;
    }
  }
  .composer-step5-wrapper {
    display: flex;
    gap: 2.5rem;
    align-items: flex-start;
  }
  .composer-step5-summary {
    height: 312px;
    width: 220px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .composer-step5-img {
    height: 312px;
    flex: 1;
    display: flex;
    align-items: stretch;
  }
  .composer-step5-img-el {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    display: block;
  }
  .composer-footer-step5 {
    padding-bottom: 2.5rem;
  }
  .composer-nav-btns-step5 {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1.2rem;
    margin-top: 2.5rem;
    margin-bottom: 0;
  }
  .composer-btn-icon {
    min-width: 48px;
    max-width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    font-size: 1.2rem;
    position: relative;
    border: 2px solid var(--accent-color);
    background: #fff;
    transition: border 0.18s, background 0.18s, color 0.18s;
  }
  .composer-btn-icon:hover:not(:disabled) {
    border: 2.5px solid var(--accent-hover-color);
    background: var(--accent-color);
    color: #fff;
  }
  .composer-btn-icon:disabled {
    border: 2px solid #ccc;
    background: #f5f5f5;
    color: #888;
  }
  @media (max-width: 600px) {
    .composer-step5-wrapper {
      flex-direction: column;
      gap: 1.2rem;
      align-items: stretch;
    }
    .composer-step5-summary {
      width: 100%;
      height: auto;
      margin-bottom: 0.5rem;
    }
    .composer-step5-img {
      width: 100%;
      height: auto;
      max-width: 90vw;
      margin: 0 auto 1.2rem auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .composer-step5-img-el {
      width: 90vw;
      max-width: 350px;
      height: auto;
      min-height: 120px;
      object-fit: cover;
      border-radius: 8px;
      display: block;
    }
    .composer-nav-btns-step5 {
      margin-top: 2.5rem;
      margin-bottom: 0;
    }
  }
  .composer-btn-icon .btn-text {
    display: none;
}

/* CRUD Styles */
.crud-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.save-composition-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

.composition-name-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.composition-name-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.composition-name-input:disabled {
  background: #f5f5f5;
  color: #999;
}

.save-composition-btn {
  padding: 12px 24px;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.save-composition-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.save-composition-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.compositions-list-section {
  margin-top: 1rem;
}

.toggle-compositions-btn {
  width: 100%;
  padding: 12px 16px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toggle-compositions-btn:hover {
  border-color: var(--accent-color);
  background: #f8f9fa;
}

.compositions-list {
  margin-top: 1rem;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
}

.composition-item {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.composition-item:last-child {
  border-bottom: none;
}

.composition-info h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
  font-size: 1.1rem;
}

.composition-date {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.composition-actions {
  display: flex;
  gap: 0.5rem;
}

.load-btn, .delete-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.load-btn {
  background: var(--accent-color);
  color: white;
}

.load-btn:hover {
  background: var(--accent-hover);
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

.save-message {
  margin-top: 1rem;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
}

.save-message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.save-message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Responsive */
@media (max-width: 768px) {
  .save-composition-section {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .composition-item {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .composition-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
