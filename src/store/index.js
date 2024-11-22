import { createStore } from "vuex";
import { getFirestore, getDocs, collection, deleteDoc, doc } from "firebase/firestore"; // Asegúrate de importar las funciones correctamente
import { db } from "../firebase"; // Importa la instancia de Firestore

export default createStore({
  state: {
    favoritos: [], // Lista de favoritos cargados desde Firestore
  },
  mutations: {
    // Mutación para establecer la lista de favoritos
    setFavoritos(state, favoritos) {
      state.favoritos = favoritos;
    },
    // Mutación para eliminar un favorito por su ID
    eliminarDeFavoritos(state, id) {
      // Filtramos los favoritos para eliminar el que coincida con el ID proporcionado
      state.favoritos = state.favoritos.filter((ejercicio) => ejercicio.id !== id);
    },
    // Mutación para agregar un favorito a la lista
    agregarAFavoritos(state, ejercicio) {
      if (!state.favoritos.some(e => e.id === ejercicio.id)) {
        state.favoritos.push(ejercicio);
      }
    }
  },
  actions: {
    // Acción para cargar favoritos desde Firestore
    async cargarFavoritosDesdeFirebase({ commit }) {
      try {
        // Obtener los documentos de la colección "favoritos"
        const favoritosSnapshot = await getDocs(collection(db, "favoritos"));
        // Transformar los datos obtenidos
        const favoritos = favoritosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Actualizar el estado con los favoritos
        commit("setFavoritos", favoritos);
      } catch (error) {
        console.error("Error al cargar favoritos desde Firestore:", error);
      }
    },
    // Acción para agregar un favorito a Firestore
    async agregarAFavoritosFirebase({ commit }, ejercicio) {
      try {
        // Crear la referencia al documento en Firestore
        const docRef = doc(db, "favoritos", ejercicio.id.toString()); // Asegúrate de que el ID sea una cadena
        await setDoc(docRef, ejercicio); // Agregar el ejercicio a Firestore
        
        // Actualizar el estado local agregando el favorito
        commit("agregarAFavoritos", ejercicio);
      } catch (error) {
        console.error("Error al agregar favorito a Firestore:", error);
      }
    },
    // Acción para eliminar un favorito de Firestore
    async eliminarDeFavoritosFirebase({ commit }, id) {
      try {
        // Verificamos que el ID sea válido y no sea undefined ni null
        if (!id || typeof id !== 'string') {
          console.error("El ID proporcionado no es válido:", id);
          throw new Error("El ID proporcionado no es válido.");
        }
        
        // Crear la referencia al documento en Firestore
        const docRef = doc(db, "favoritos", id); 
        await deleteDoc(docRef); // Eliminar el documento de Firestore
        
        // Actualizar el estado local eliminando el favorito
        commit("eliminarDeFavoritos", id);
      } catch (error) {
        console.error("Error al eliminar favorito de Firestore:", error);
      }
    },
  },
  getters: {
    // Getter para agrupar favoritos por categoría
    favoritosAgrupadosPorCategoria(state) {
      return state.favoritos.reduce((grupos, ejercicio) => {
        if (!grupos[ejercicio.categoria]) {
          grupos[ejercicio.categoria] = [];
        }
        grupos[ejercicio.categoria].push(ejercicio);
        return grupos;
      }, {});
    },
  },
});
