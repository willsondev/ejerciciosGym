<!-- EjerciciosPorCategoria.vue -->
<template>
  <div>
    <h2>{{ categoria }}</h2>
    <div v-for="ejercicio in ejercicios" :key="ejercicio.id">
      <EjercicioCard :ejercicio="ejercicio" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import EjercicioCard from '../components/EjercicioCard.vue';

export default {
  components: {
    EjercicioCard
  },
  setup() {
    const route = useRoute();
    const categoria = ref('');
    const ejercicios = ref([]);

    onMounted(async () => {
      try {
        const response = await fetch('/ejercicios.json');
        if (!response.ok) {
          throw new Error('Error al cargar los ejercicios');
        }
        const todosEjercicios = await response.json();
        
        categoria.value = route.params.categoria; // Obtener la categoría de los parámetros de la ruta
        ejercicios.value = todosEjercicios.filter(ejercicio => 
          ejercicio.categoria.toLowerCase() === categoria.value.toLowerCase()
        ); // Filtrar ejercicios por la categoría actual
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    });

    return { categoria, ejercicios };
  }
};
</script>

<style scoped>
/* Estilos opcionales aquí */
</style>
