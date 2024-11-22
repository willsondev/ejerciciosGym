<template>
  <div class="mt-5 bg-gray-100 rounded-lg">
    <div class="w-full max-w-md text-center rounded-lg shadow-lg">
      <nav class="rounded-t-lg bg-gym-image">
        <div class="container flex items-center justify-between mx-auto">
          <h1 class="text-4xl">
            <i class="fas fa-dumbbell" style="font-size: 24px; color: gray;"></i>
          </h1>
          <router-link to="/" class="text-3xl font-azonix hover:text-gray-200">Gym</router-link>
          <h1 class="text-4xl">
            <i class="fas fa-dumbbell" style="font-size: 24px; color: gray;"></i>
          </h1>
        </div>
      </nav>
    </div>

    <h2 class="mt-5 text-2xl font-azonix text-center text-gray-800 mb-4">
      Ejercicios en la Categoría: {{ categoria }}
    </h2>

    <div v-if="ejerciciosFiltrados.length === 0" class="text-center">
      <p>No hay ejercicios disponibles en esta categoría.</p>
    </div>

    <ul v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 font-azonix gap-4">
      <li
        v-for="ejercicio in ejerciciosFiltrados"
        :key="ejercicio.id"
        class="flex flex-col items-center bg-white rounded-lg shadow-md p-4"
      >
        <EjercicioCard :ejercicio="ejercicio" class="mb-4" />

        <div class="flex flex-col items-center space-y-2">
          <label for="peso" class="text-sm text-gray-600">Peso:</label>
          <input
            v-model="peso[ejercicio.id]"
            type="number"
            :placeholder="'Ingrese peso para ' + ejercicio.nombre"
            class="w-24 px-2 py-1 border rounded"
            @change="guardarPeso(ejercicio.id)"
          />
        </div>

        <button @click="toggleFavorito(ejercicio)" class="focus:outline-none">
          <i
            :class="[ 'fas', 'fa-heart', favoritos.includes(ejercicio.id) ? 'text-red-500' : 'text-gray-400' ]"
            style="font-size: 24px;"
          ></i>
        </button>
      </li>
    </ul>

    <div class="flex justify-center space-x-2 mt-4">
      <button
        @click="paginaActual--"
        :disabled="paginaActual === 1"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Anterior
      </button>

      <span class="px-4 py-2">{{ paginaActual }} / {{ totalPaginas }}</span>

      <button
        @click="paginaActual++"
        :disabled="paginaActual === totalPaginas"
        class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import EjercicioCard from '../components/EjercicioCard.vue';
import { getFirestore, collection, getDocs, setDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default {
  components: {
    EjercicioCard,
  },
  setup() {
    const route = useRoute();
    const categoria = route.params.categoria;
    const ejercicios = ref([]);
    const paginaActual = ref(1);
    const ejerciciosPorPagina = 4;
    const favoritos = ref([]);
    const peso = ref({}); // Almacenará los pesos por ejercicio

    // Cargar ejercicios filtrados por categoría y los favoritos desde Firestore
    onMounted(async () => {
      try {
        const response = await fetch('/public/ejercicios.json'); // Ajusta la ruta si es necesario
        if (!response.ok) {
          throw new Error('Error al cargar los ejercicios');
        }
        const data = await response.json();
        ejercicios.value = data.ejercicios.filter(
          (ejercicio) => ejercicio.categoria.toLowerCase() === categoria.toLowerCase()
        );

        // Cargar los favoritos desde Firestore
        const favoritosQuery = collection(db, 'favoritos');
        const snapshot = await getDocs(favoritosQuery);
        const favoritosData = snapshot.docs.map((doc) => doc.data());
        favoritos.value = favoritosData.map((favorito) => favorito.id); // Solo extraemos los IDs

        // Cargar los pesos guardados en Firestore
        const pesosQuery = collection(db, 'pesos');
        const pesosSnapshot = await getDocs(pesosQuery);
        pesosSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          peso.value[data.ejercicioId] = data.peso; // Guardar el peso para cada ejercicio
        });

      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    });

    // Calcular los ejercicios a mostrar en la página actual
    const ejerciciosFiltrados = computed(() => {
      const inicio = (paginaActual.value - 1) * ejerciciosPorPagina;
      const fin = inicio + ejerciciosPorPagina;
      return ejercicios.value.slice(inicio, fin);
    });

    // Calcular el total de páginas
    const totalPaginas = computed(() => Math.ceil(ejercicios.value.length / ejerciciosPorPagina));

    // Función para alternar el estado de favorito de un ejercicio
    const toggleFavorito = async (ejercicio) => {
      const favoritoRef = doc(db, 'favoritos', ejercicio.id.toString());

      if (favoritos.value.includes(ejercicio.id)) {
        // Si ya es favorito, eliminarlo de Firestore y de la lista local
        await deleteDoc(favoritoRef); // Eliminar de Firestore
        favoritos.value = favoritos.value.filter((id) => id !== ejercicio.id); // Eliminar de la lista local
      } else {
        // Si no es favorito, agregarlo a Firestore y a la lista local
        await setDoc(favoritoRef, { id: ejercicio.id, ...ejercicio }); // Agregar a Firestore
        favoritos.value.push(ejercicio.id); // Agregar a la lista local
      }
    };

    // Función para guardar el peso de un ejercicio en Firestore
    const guardarPeso = async (ejercicioId) => {
      const pesoEjercicio = peso.value[ejercicioId];
      const pesoRef = doc(db, 'pesos', ejercicioId.toString());

      try {
        await setDoc(pesoRef, { ejercicioId, peso: pesoEjercicio });
        console.log('Peso guardado correctamente en Firestore');
      } catch (error) {
        console.error('Error al guardar el peso en Firestore:', error);
      }
    };

    return {
      categoria,
      ejerciciosFiltrados,
      paginaActual,
      totalPaginas,
      favoritos,
      peso,
      toggleFavorito,
      guardarPeso,
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/azonix');

.font-azonix {
  font-family: 'Azonix', sans-serif;
}
</style>
