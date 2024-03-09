<template>
  <div class='loader'></div>
</template>

<style scoped>
.loader {
  border: 4px solid #ada4a9;
  border-top: 4px solid  rgba(59, 130, 246, 1);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  margin: auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}


@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>