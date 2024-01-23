<script setup>
import { ref, computed } from 'vue'
import Login from './views/Login.vue'
import Product from './views/Product.vue'
import Admin from './views/Admin.vue'
import NotFound from './views/404.vue'

const routes = {
  '/': Login,
  '/product': Product,
  '/admin': Admin,
  '/404': NotFound,
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
  <component :is="currentView" />
</template>