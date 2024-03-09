<template>
  <header class='absolute w-full bg-blue-500 text-white p-4'>
    <div class='container mx-auto flex justify-between items-center'>
      <h1 class='text-lg font-bold'>Pharmacy App</h1>
      <div class='flex-grow text-center'>
        <router-link to='/shop' class='mx-2'>Shop</router-link>
        <router-link to='/cart' class='mx-2'>Cart</router-link>
      </div>
    </div>
  </header>
</template>