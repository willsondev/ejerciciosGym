<template>
  <router-link :to="`/ejercicio/${ejercicio.id}`" class="ejercicio-card flex border-2 mt-5 rounded-full bg-sky-500">
    <!-- Imagen -->
    <img :src="ejercicio.imagen" alt="Imagen del ejercicio" class="w-1/2 object-cover rounded-xl" />
    
    <!-- Contenido -->
    <div class="w-1/2 p-4 flex flex-col justify-center ">
      <h4 class="text-sm  text-white">{{ ejercicio.titulo }}</h4>
      
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    ejercicio: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
/* No es necesario usar scoped aquí ya que Tailwind CSS se encarga de los estilos */
</style>
