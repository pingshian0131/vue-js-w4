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
<!-- Loading Animation -->
<div class="loading-progress">
    <div class="mask"></div>
    <div class="progress-bg">
        <div class="progress" style="background: #E0E0E0; border-radius: 10px; padding: 5px;">
            <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar"
                 aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"
                 style="width: 100%; border-radius: 10px;"></div>
        </div>
        <div class="bar-text">
            {{ text }}
        </div>
    </div>
</div>
</template>

<style scoped>
.loading-progress {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.loading-progress .progress {
  position: absolute;
  top: 40%;
  left: 25%;
  width: 50%;
  height: 3%;
}

.bar-text {
  position: absolute;
  color: white;
  top: 45%;
  left: 25%;
  font-size: 150%;
  font-weight: bold;
  line-height: normal;
}

.mask {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.5;
  overflow: hidden;
  background-attachment: fixed;
}
</style>