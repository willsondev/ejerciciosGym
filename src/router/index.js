import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Categorias from '../views/Categorias.vue';
import Ejercicios from '../views/Ejercicios.vue';
import EjercicioDetalle from '../views/EjercicioDetalle.vue'; // Importar el nuevo componenteip
import EjerciciosFavoritos from '../views/EjerciciosFavoritos.vue'
import NotasGym from '../views/NotasGym.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/categorias',
    name: 'Categorias',
    component: Categorias
  },
  {
    path: '/ejercicios/:categoria',
    name: 'Ejercicios',
    component: Ejercicios
  },
  {
    path: '/ejercicio/:id', // Ruta para el detalle del ejercicio
    name: 'EjercicioDetalle',
    component: EjercicioDetalle
  },
  {
    path: '/favoritos', // Ruta para el detalle del ejercicio
    name: 'Favoritos',
    component: EjerciciosFavoritos
  },
  {
    path: '/notas', // Ruta para el detalle del ejercicio
    name: 'Notas',
    component: NotasGym
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
