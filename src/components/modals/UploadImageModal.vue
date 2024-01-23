<script>
import ProgressBar from '@/components/sys/ProgressBar.vue'

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;
const API_PATH = import.meta.env.VITE_API_PATH;
const PRODUCT_API_SERVER = `${API_BASE_URL}v2/api/${API_PATH}/admin/product`;
export default {
  name: "UploadImageModal",
  components: {ProgressBar},
  props: {
    uploadTargetProduct: {
      type: Object,
      default: null
    },
    uploadField: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      products: null,
      msg: '123'
    }
  },
  methods: {
    updateProductImage(url, field) {
      let images;
      if (field === 'imageUrl') {
        images = url;
      } else if (field === 'imagesUrl') {
        images = this.uploadTargetProduct.imagesUrl;
        if (this.uploadTargetProduct.imagesUrl.length < 5 && this.uploadTargetProduct.imagesUrl.length >= 0) {
          images.push(url);
        } else {
          this.failAndReload('uploaded', 'Too many images');
          return;
        }
      } else {
        this.failAndReload('uploaded', 'Invalid field');
        return;
      }

      let data = {
        [field]: images,
        title: this.uploadTargetProduct.title,
        category: this.uploadTargetProduct.category,
        unit: this.uploadTargetProduct.unit,
        origin_price: this.uploadTargetProduct.origin_price,
        price: this.uploadTargetProduct.price,
      }
      this.$axios.put(`${PRODUCT_API_SERVER}/${this.uploadTargetProduct.id}`, {
        data: data
      }).then((res) => {
        if (res.data.success === true) {
          this.$swal({
            title: "Success!",
            text: "Image updated successfully!",
            icon: "success",
            button: "OK",
          }).then(() => {
            window.location.reload();
          });
        } else {
          console.log(res.data)
          this.failAndReload('uploaded');
        }
      }).catch((err) => {
        console.log(err)
        this.failAndReload('uploaded', err);
      })
    },
    uploadImage() {
      const file = document.getElementById('formFile').files[0];
      const formData = new FormData();
      formData.append('file', file);
      this.$axios.post(`${API_BASE_URL}v2/api/${API_PATH}/admin/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        if (res.data.success === true) {
          let url = res.data.imageUrl;
          alert("Image uploaded successfully!")
          this.updateProductImage(url, this.uploadField);
        } else {
          this.failAndReload('uploaded');
        }
      }).catch((err) => {
        this.failAndReload('uploaded', err);
      })
    },
    confirmUpload() {
      this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Upload it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.uploadImage();
        }
      });
    },
    failAndReload(action, err = '') {
      this.$swal({
        title: "Failed!",
        text: `Your product has not been ${action}, please try again later. Error: ${err}.`,
        icon: "error",
      }).then(() => {
        window.location.reload();
      });
    },
  }
}
</script>

<template>
  <ProgressBar :text="msg"/>
  <div class="modal fade" id="uploadImageModal" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="uploadImageModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content" v-if="uploadTargetProduct">
        <form action="#" enctype="multipart/form-data" method="post">
          <div class="modal-header bg-secondary text-white">
            <h5 class="modal-title" id="editProductModalLabel">View Image: </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="formFile" class="form-label">Default file input example</label>
              <input class="form-control" type="file" id="formFile" name="file-to-upload">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="id-submit-btn" @click.prevent="confirmUpload">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>