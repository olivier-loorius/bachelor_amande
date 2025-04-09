<template>
  <div id="app">
    <Navbar />
    <router-view />
    <Footer /> 
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    Footer 
  },
};
</script>
<!-- <style>
body {
  border: 2px solid red !important; /* Visualisez les limites */
}
* {
  max-width: 100% !important; /* Force tout à rentrer */
}
</style> -->