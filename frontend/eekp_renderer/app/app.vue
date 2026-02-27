<script setup>
import Footer from './components/Footer.vue';

useHead({
  bodyAttrs: {
    class: 'bg-offwhite' // Sets the color for the whole document
  }
})
</script>
<template>
    <div>
        <NuxtPage />
    </div>
    <Footer></Footer>
</template>
