<template>
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
  <div class="mt-5 bg-gray-100 rounded-lg p-5">
    
    <h2 class="text-2xl font-azonix text-center text-gray-800 mb-4">Notas</h2>

    <form @submit.prevent="agregarNota" class="mb-6">
      <div class="mb-4">
        <input
          v-model="nuevaNota"
          type="text"
          placeholder="Escribe tu nota aquí..."
          class="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        Guardar Nota
      </button>
    </form>

    <!-- Mostrar mensaje si no hay notas -->
    <div v-if="notas.length === 0" class="text-center">
      <p>No tienes notas guardadas aún.</p>
    </div>

    <!-- Lista de notas -->
    <ul v-else class="space-y-4">
      <li
        v-for="nota in notas"
        :key="nota.id"
        class="flex justify-between items-center bg-white p-4 rounded-lg shadow"
      >
        <p class="text-gray-700">{{ nota.texto }}</p>
        <button @click="eliminarNota(nota)" class="text-red-500">
          <i class="fas fa-trash" style="font-size: 20px;"></i>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, addDoc, deleteDoc, getDocs, doc } from "firebase/firestore";
import { db } from '../firebase'; // Solo se importa una vez desde la instancia correcta

export default {
  setup() {
    const notas = ref([]); // Lista local de notas
    const nuevaNota = ref(""); // Texto de la nueva nota

    // Cargar notas desde Firestore
    const cargarNotas = async () => {
      try {
        const notasQuery = collection(db, "notas");
        const snapshot = await getDocs(notasQuery);
        notas.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          texto: doc.data().texto,
        }));
      } catch (error) {
        console.error("Error al cargar las notas:", error);
      }
    };

    // Agregar una nueva nota a Firestore
    const agregarNota = async () => {
      if (!nuevaNota.value.trim()) return; // Validar que la nota no esté vacía

      try {
        const docRef = await addDoc(collection(db, "notas"), {
          texto: nuevaNota.value.trim(),
        });

        // Agregar la nueva nota a la lista local
        notas.value.push({
          id: docRef.id,
          texto: nuevaNota.value.trim(),
        });

        // Limpiar el campo de entrada
        nuevaNota.value = "";
      } catch (error) {
        console.error("Error al guardar la nota:", error);
      }
    };

    // Eliminar una nota de Firestore
    const eliminarNota = async (nota) => {
      try {
        const notaRef = doc(db, "notas", nota.id);
        await deleteDoc(notaRef);

        // Eliminar la nota de la lista local
        notas.value = notas.value.filter((n) => n.id !== nota.id);
      } catch (error) {
        console.error("Error al eliminar la nota:", error);
      }
    };

    // Cargar las notas al montar el componente
    onMounted(cargarNotas);

    return {
      notas,
      nuevaNota,
      agregarNota,
      eliminarNota,
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
