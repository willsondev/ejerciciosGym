<template>
  <div v-if="ejercicio" class="max-w-md mx-auto p-4">
    <div class="w-full max-w-md text-center rounded-lg shadow-lg">
      <nav class="rounded-t-lg bg-gym-image p-4">
        <div class="container flex items-center justify-between mx-auto">
          <h1 class="text-4xl text-gray-700">
            <i class="fas fa-dumbbell" style="font-size: 24px; color: gray;"></i>
          </h1>
          <router-link to="/" class="text-3xl font-azonix text-gray-800 hover:text-gray-500">Gym</router-link>
          <h1 class="text-4xl text-gray-700">
            <i class="fas fa-dumbbell" style="font-size: 24px; color: gray;"></i>
          </h1>
        </div>
      </nav>
    </div>
    
    <h2 class="text-xl font-bold mt-4 font-azonix">{{ ejercicio.titulo }}</h2>
    <p class="mt-2"><strong>Descripción:</strong> {{ ejercicio.descripcion }}</p>
    <p class="mt-2"><strong>Categoría:</strong> {{ ejercicio.categoria }}</p>
    
    <div class="mt-4">
      <h3 class="text-xl">Demostración:</h3>
      <!-- Usamos la ruta correcta para el video en public/assets/ -->
      <video class="w-full" controls>
        <source :src="`/assets/videos-gym/${ejercicio.video}`" type="video/mp4">
        Tu navegador no soporta la etiqueta de video.
      </video>
    </div>

    <router-link to="/categorias" class="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Volver a la lista de ejercicios</router-link>
  </div>
  <div v-else class="text-center mt-4">
    <p class="text-gray-600">Cargando...</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute(); // Acceder a la ruta actual
    const ejercicio = ref(null); // Objeto para almacenar los detalles del ejercicio

    onMounted(async () => {
      const id = route.params.id; // Obtener el id del ejercicio desde los parámetros de la ruta

      try {
        const response = await fetch('/ejercicios.json');
        if (!response.ok) {
          throw new Error('Error al cargar los ejercicios');
        }
        const data = await response.json();

        // Encontrar el ejercicio específico por id
        ejercicio.value = data.ejercicios.find(ej => ej.id === parseInt(id));
        if (!ejercicio.value) {
          console.error('Ejercicio no encontrado');
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    });

    return { ejercicio };
  }
};
</script>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/azonix');

.font-azonix {
  font-family: 'Azonix', sans-serif;
}

</style>
