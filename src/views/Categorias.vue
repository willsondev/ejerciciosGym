<template>
  <div class="mt-8 text-center categorias">
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

    <!-- Cards -->
    <h2 class="my-6 text-2xl font-azonix">Categorías de Ejercicios</h2>
    
    <div class="grid grid-cols-2 md:grid-cols-2 ">
      <div
        v-for="categoria in categorias"
        :key="categoria.nombre"
        class="relative   "
      >
        <router-link
          :to="{ name: 'Ejercicios', params: { categoria: categoria.nombre.toLowerCase() } }"
          class=""
        >
          <img :src="categoria.imagen" :alt="categoria.nombre" class="object-cover h-48 w-full ">
          
          <!-- Texto de categoría encima de la imagen -->
          <div class="categoria-nombre absolute inset-0 flex items-center justify-center text-white font-azonix text-xl">
            {{ categoria.nombre }}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import pectoralesImage from '../assets/img/home2.jpg';
import espaldaImage from '../assets/img/espalda.jpg';
import hombrosImage from '../assets/img/hombros.png';
import tricepsImage from '../assets/img/triceps.jpg';
import bicepsImage from '../assets/img/biceps.jpg';
import piernasImage from '../assets/img/piernas.jpg';
import gemelosImage from '../assets/img/gemelos.jpg';
import abdominalesImage from '../assets/img/abdominales.jpg';

export default {
  name: 'Categorias',
  data() {
    return {
      categorias: [
        { nombre: 'Pectorales', imagen: pectoralesImage },
        { nombre: 'Espalda', imagen: espaldaImage },
        { nombre: 'Hombro', imagen: hombrosImage },
        { nombre: 'Triceps', imagen: tricepsImage },
        { nombre: 'Biceps', imagen: bicepsImage },
        { nombre: 'Piernas', imagen: piernasImage },
        { nombre: 'Gemelos', imagen: gemelosImage },
        { nombre: 'Abdominales', imagen: abdominalesImage }
      ]
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/azonix');

.font-azonix {
  font-family: 'Azonix', sans-serif;
}
.categorias img {
  transition: transform 0.3s;
}
.categorias img:hover {
  transform: scale(1.05);
}

/* Estilo para el texto sobre la imagen */
.categoria-nombre {
  background-color: rgba(0, 0, 0, 0.5); /* Fondo semi-transparente */
  color: white; /* Color del texto */
  text-align: center;
  /* Opcional: bordes redondeados */
}
</style>
