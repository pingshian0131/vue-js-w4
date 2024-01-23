<script>
export default {
  props: {
    viewTargetImage: {
      type: String,
      default: null
    }
  }
}
</script>

<template>
  <div class="modal fade" id="viewImageModal" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="viewImageModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content" v-if="viewTargetImage">
        <div class="modal-header bg-secondary text-white">
          <h5 class="modal-title" id="editProductModalLabel">View Image: </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <img :src="viewTargetImage" alt="" class="img-fluid" width="100%">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>