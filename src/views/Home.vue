<template>
  <div class="  text-center rounded-lg shadow-lg ">
    <nav class=" rounded-t-lg bg-gym-image">
      <div class="container flex items-center justify-between ">
        <h1 class=""><i class="fas fa-dumbbell" style="font-size: 24px; color: gray;"></i></h1>
        <router-link to="/" class="text-3xl font-bold text-white hover:text-gray-200 font-azonix">Gym</router-link>
        <h1 class=""><i class="fas fa-dumbbell" style="font-size: 24px; color: gray;"></i></h1>
      </div>
    </nav>
    
      <div class="flex justify-around  ">
    <div class="flex flex-col items-center p-4 mt-6 bg-white rounded-lg shadow-md">
      <router-link to="/Favoritos">
        <button class="w-full py3 text-lg font-semibold text-black transition duration-200 ease-in-out rounded hover:bg-gray-100 font-azonix">
          <i class="fas fa-running" style="font-size: 48px; color: black; "></i>
        </button>
      </router-link>
      <h2 class="text-sm font-bold font-azonix mt-3">Favoritos</h2>
    </div>

    <div class="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
      <router-link to="/categorias">
        <button class="w-full py-3 text-lg font-semibold text-black transition duration-200 ease-in-out rounded hover:bg-gray-100 btn-categorias font-azonix">
          <i class="fas fa-th" style="font-size: 48px; color: black;"></i> <h2 class="text-sm font-bold font-azonix mt-6">categorias</h2>
        </button>
      </router-link>
    </div>


    <div class="flex flex-col items-center p-4 mt-2 bg-white rounded-lg shadow-md">
      <router-link to="Notas">
        <button class="w-full py-3 text-lg font-semibold text-black transition duration-200 ease-in-out rounded hover:bg-gray-100 btn-categorias font-azonix">
              <i class="fas fa-sticky-note" style="font-size: 56px; color: black; "></i>
      <h2 class="text-sm font-bold font-azonix mt-2 p-4">Notas</h2>
        </button>
      </router-link>
    
    </div>
  </div>
  </div>


</template>

<script>
export default {
  name: 'Home',
};
</script>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/azonix');

.font-azonix {
  font-family: 'Azonix', sans-serif;
}

.bg-gym-image {
  background-image: url('../assets/img/home2.jpg');
  background-size: cover;
  background-position: center;
  height: 500px;
}
</style>
