<script>

export default {
  props: {
    text: {
      type: String,
      default: null
    }
  }
}
</script>

<template>
  <div class="mask d-flex justify-content-center">
    <div class="progress" style="position: relative; top: 50%; width: 50%;">
      <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100"
           aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
      <div class="">
        <span class="text-black">{{ text }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mask {
  position: absolute;
  height: 100vh;
  width: 100%;
  background-color: #000;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9999;;
  opacity: 0.4;
}
</style>