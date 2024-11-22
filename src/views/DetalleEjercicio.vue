<template>
  <div v-if="ejercicio">
    <h2>{{ ejercicio.nombre }}</h2>
    <p>{{ ejercicio.descripcion }}</p>
    <p><strong>Repeticiones:</strong> {{ ejercicio.repeticiones }}</p>
    <img :src="ejercicio.gif" alt="GIF de {{ ejercicio.nombre }}" class="w-full h-auto" />
    
    <h3>Ejercicios en la misma categoría:</h3>
    <div v-if="ejerciciosSimilares.length">
      <ul>
        <li v-for="simil in ejerciciosSimilares" :key="simil.id">
          <router-link :to="'/ejercicio/' + simil.id">{{ simil.nombre }}</router-link>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No hay otros ejercicios en esta categoría.</p>
    </div>
    
    <router-link to="/ejercicios">Volver</router-link>
  </div>
  <div v-else>
    <p>Cargando ejercicio...</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const ejercicio = ref(null);
    const ejerciciosSimilares = ref([]);
    const route = useRoute();

    onMounted(async () => {
      try {
        const response = await fetch('/ejercicios.json'); // Asegúrate de que la ruta sea correcta
        if (!response.ok) {
          throw new Error('Error al cargar los ejercicios');
        }
        const ejercicios = await response.json();
        ejercicio.value = ejercicios.find(ej => ej.id === parseInt(route.params.id));
        
        // Obtener ejercicios de la misma categoría
        if (ejercicio.value) {
          ejerciciosSimilares.value = ejercicios.filter(ej => ej.categoria.toLowerCase() === ejercicio.value.categoria.toLowerCase() && ej.id !== ejercicio.value.id);
        }

        // Manejar el caso en el que no se encuentra el ejercicio
        if (!ejercicio.value) {
          console.error('Ejercicio no encontrado');
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    });

    return { ejercicio, ejerciciosSimilares };
  }
};
</script>

<style scoped>
/* Estilos opcionales aquí */
</style>
