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
      Ejercicios Favoritos
    </h2>

    <!-- Mostrar mensaje si no hay favoritos -->
    <div v-if="favoritos.length === 0" class="text-center">
      <p>No tienes ejercicios favoritos aún.</p>
    </div>

    <!-- Lista de ejercicios agrupados por categoría -->
    <div v-else>
      <div v-for="(ejerciciosPorCategoria, categoria) in ejerciciosAgrupados" :key="categoria" class="mb-6">
        <button 
          @click="toggleCategoria(categoria)"
          class="w-full text-left bg-gray-300 py-2 px-4 rounded-lg mb-2 font-azonix"
        >
          <i :class="['fas', categoriaExpandida[categoria] ? 'fa-chevron-down' : 'fa-chevron-right', 'mr-2']"></i>
          {{ categoria }}
        </button>

        <ul v-if="categoriaExpandida[categoria]" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 font-azonix gap-4">
          <li
            v-for="ejercicio in ejerciciosPorCategoria"
            :key="ejercicio.id"
            class="flex flex-col items-center bg-white rounded-lg shadow-md p-4"
          >
            <!-- Componente de la tarjeta de ejercicio -->
            <EjercicioCard :ejercicio="ejercicio" class="mb-4" />

            <!-- Mostrar el peso del ejercicio -->
            <p v-if="ejercicio.peso !== undefined && ejercicio.peso !== null" class="text-gray-600 text-sm mt-2">
              Peso: {{ ejercicio.peso }} kg
            </p>
            <p v-else class="text-gray-600 text-sm mt-2">Peso no disponible</p>

            <!-- Formulario para editar el peso -->
            <div v-if="ejercicio.id === editId" class="mt-4">
              <input
                type="number"
                v-model="editPeso"
                class="border-2 border-gray-300 rounded-md p-2"
                placeholder="Nuevo peso"
              />
              <button
                @click="guardarPeso(ejercicio.id)"
                class="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Guardar Peso
              </button>
            </div>

            <!-- Ícono de eliminar favorito -->
            <button
              @click="eliminarFavorito(ejercicio)"
              class="focus:outline-none"
            >
              <i
                class="fas fa-trash text-red-500"
                style="font-size: 24px;"
              ></i>
            </button>

            <!-- Botón para editar el peso -->
            <button
              v-if="ejercicio.id !== editId"
              @click="editarPeso(ejercicio.id, ejercicio.peso)"
              class="mt-2 text-blue-500"
            >
              Editar Peso
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import EjercicioCard from '../components/EjercicioCard.vue';
import { db } from '../firebase'; // Asegúrate de que esta ruta esté correcta

export default {
  components: {
    EjercicioCard,
  },
  setup() {
    const db = getFirestore(); // Inicializa Firestore
    const favoritos = ref([]); // Lista local de favoritos
    const categoriaExpandida = ref({}); // Estado para controlar las categorías abiertas/cerradas
    const ejerciciosAgrupados = ref({}); // Objeto para agrupar los ejercicios por categoría
    const editId = ref(null); // ID del ejercicio que se está editando
    const editPeso = ref(''); // Peso a editar

    // Cargar ejercicios favoritos desde Firestore
    onMounted(async () => {
      try {
        const favoritosQuery = collection(db, 'favoritos');
        const snapshot = await getDocs(favoritosQuery);
        const favoritosData = snapshot.docs.map((doc) => doc.data());

        // Depuración adicional: Verifica la estructura completa de los datos
        console.log('Favoritos recuperados:', favoritosData);

        favoritos.value = favoritosData;

        // Agrupar ejercicios por categoría
        const agrupados = favoritosData.reduce((acc, ejercicio) => {
          const categoria = ejercicio.categoria || 'Sin categoría';
          if (!acc[categoria]) {
            acc[categoria] = [];
          }
          acc[categoria].push(ejercicio);
          return acc;
        }, {});

        ejerciciosAgrupados.value = agrupados;
      } catch (error) {
        console.error('Error al cargar los favoritos:', error);
      }
    });

    // Eliminar ejercicio de favoritos
    const eliminarFavorito = async (ejercicio) => {
      try {
        const favoritoRef = doc(db, 'favoritos', ejercicio.id.toString());
        await deleteDoc(favoritoRef); // Eliminar de Firestore

        // Eliminar de la lista local
        favoritos.value = favoritos.value.filter((item) => item.id !== ejercicio.id);

        // Eliminar de la categoría correspondiente
        const categoria = ejercicio.categoria || 'Sin categoría';
        ejerciciosAgrupados.value[categoria] = ejerciciosAgrupados.value[categoria].filter(
          (item) => item.id !== ejercicio.id
        );
      } catch (error) {
        console.error('Error al eliminar el favorito:', error);
      }
    };

    // Función para editar el peso
    const editarPeso = (id, peso) => {
      editId.value = id;
      editPeso.value = peso || ''; // Si no hay peso, dejamos el campo vacío
    };

    // Guardar el peso editado
    const guardarPeso = async (id) => {
      try {
        const ejercicioRef = doc(db, 'favoritos', id.toString());
        await updateDoc(ejercicioRef, { peso: editPeso.value });

        // Actualizar el peso en la lista local
        const ejercicioIndex = favoritos.value.findIndex((ejercicio) => ejercicio.id === id);
        if (ejercicioIndex !== -1) {
          favoritos.value[ejercicioIndex].peso = editPeso.value;
        }

        // Actualizar el peso en la categoría correspondiente
        for (const categoria in ejerciciosAgrupados.value) {
          const ejercicioCatIndex = ejerciciosAgrupados.value[categoria].findIndex((ejercicio) => ejercicio.id === id);
          if (ejercicioCatIndex !== -1) {
            ejerciciosAgrupados.value[categoria][ejercicioCatIndex].peso = editPeso.value;
            break;
          }
        }

        // Restablecer el estado de edición
        editId.value = null;
        editPeso.value = '';
      } catch (error) {
        console.error('Error al guardar el peso:', error);
      }
    };

    // Controlar la expansión y colapso de las categorías
    const toggleCategoria = (categoria) => {
      categoriaExpandida.value[categoria] = !categoriaExpandida.value[categoria];
    };

    return {
      favoritos,
      ejerciciosAgrupados,
      eliminarFavorito,
      categoriaExpandida,
      toggleCategoria,
      editarPeso,
      guardarPeso,
      editId,
      editPeso,
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
