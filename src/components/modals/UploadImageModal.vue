<script>
import ProgressBar from '@/components/sys/ProgressBar.vue'
import {Modal} from "bootstrap";

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
      loadingStatus: false,
      msg: 'Uploading...'
    }
  },
  methods: {
    updateProductImage(url, field) {
      let images = [];
      if (field === 'imageUrl') {
        images = url;
      } else if (field === 'imagesUrl') {
        this.uploadTargetProduct.imagesUrl.forEach((item) => {
          if (item.length > 0) {
            images.push(item);
          }
        })
        if (images.length < 5 && images.length >= 0) {
          images.push(url);
        } else {
          this.failAndReload('uploaded', 'Too many images');
          this.loadingStatus = false;
          return;
        }
      } else {
        this.failAndReload('uploaded', 'Invalid field');
        this.loadingStatus = false;
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
            this.loadingStatus = false;
            window.location.reload();
          });
        } else {
          this.loadingStatus = false;
          this.failAndReload('uploaded');
        }
      }).catch((err) => {
        this.loadingStatus = false;
        this.failAndReload('uploaded', err);
      })
    },
    closeModal() {
      const modal = Modal.getInstance(document.getElementById('uploadImageModal'));
      modal.hide();
    },
    uploadImage() {
      this.closeModal();
      this.loadingStatus = true;
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
          this.updateProductImage(url, this.uploadField);
        } else {
          this.loadingStatus = false;
          this.failAndReload('uploaded');
        }
      }).catch((err) => {
        this.loadingStatus = false;
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
  <template v-if="loadingStatus">
    <ProgressBar :text="msg"/>
  </template>
  <div class="modal fade" id="uploadImageModal" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="uploadImageModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content" v-if="uploadTargetProduct">
        <form action="#" enctype="multipart/form-data" method="post">
          <div class="modal-header bg-secondary text-white">
            <h5 class="modal-title" id="editProductModalLabel">Upload Image: </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <input class="form-control mt-2" type="file" id="formFile" name="file-to-upload">
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