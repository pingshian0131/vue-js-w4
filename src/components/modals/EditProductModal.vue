<script>
const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;
const API_PATH = import.meta.env.VITE_API_PATH;
const PRODUCT_API_SERVER = `${API_BASE_URL}v2/api/${API_PATH}/admin/product`;
export default {
  components: {},
  props: {
    editTargetProduct: {
      type: Object,
      default: () => {
        return {
          id: '',
          title: '',
          category: '',
          origin_price: 0,
          price: 0,
          unit: '',
          description: '',
          content: '',
          is_enabled: 0,
          imageUrl: '',
          imagesUrl: [],
        }
      }
    },
    viewTargetImage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    submitEditProduct() {
      this.editTargetProduct.origin_price = parseInt(this.editTargetProduct.origin_price);
      this.editTargetProduct.price = parseInt(this.editTargetProduct.price);
      this.editTargetProduct.is_enabled = document.querySelector('#id-edit-product-is_enabled').checked === true ? 1 : 0;
      const data = {
        "data": this.editTargetProduct,
      }
      this.$axios.put(`${PRODUCT_API_SERVER}/${this.editTargetProduct.id}`, data).then((res) => {
        if (res.data.success === true) {
          this.$swal({
            title: "Edited!",
            text: "Your product has been edited.",
            icon: "success"
          }).then(() => {
            window.location.reload();
          });
        } else {
          this.failAndReload('edited');
        }
      }).catch((err) => {
        this.failAndReload('edited', err);
      })
    },
    confirmEdit() {
      this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Edit it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.submitEditProduct();
        }
      });
    },

  },
}
</script>

<template>
  <!-- Edit Product Modal -->
  <div class="modal fade" id="editProductModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="editProductModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content" v-if="editTargetProduct">
        <div class="modal-header bg-secondary text-white">
          <h5 class="modal-title" id="editProductModalLabel">Edit Product: {{ editTargetProduct.title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row mb-3">
            <form id="add-product" action="#" method="post">
              <div class="container">

                <!-- 請輸入產品名稱 -->
                <div class="row align-items-center mb-3">
                  <div class="col-auto">
                    <label for="id-edit-product-title" class="form-label">產品名稱</label>
                  </div>
                  <div class="col">
                    <input type="text" class="form-control" id="id-edit-product-title" placeholder="請輸入產品名稱"
                           v-model="editTargetProduct.title">
                  </div>
                </div>

                <!-- 請輸入產品類別 -->
                <div class="row align-items-center mb-3">
                  <div class="col-auto">
                    <label for="id-edit-product-category" class="form-label">產品類別</label>
                  </div>
                  <div class="col">
                    <input type="text" class="form-control" id="id-edit-product-category" placeholder="請輸入產品類別"
                           v-model="editTargetProduct.category">
                  </div>
                </div>

                <!-- 請輸入產品原價 -->
                <div class="row align-items-center mb-3">
                  <div class="col-auto">
                    <label for="id-edit-product-origin_price" class="form-label">產品原價</label>
                  </div>
                  <div class="col">
                    <input type="text" class="form-control" id="id-edit-product-origin_price" placeholder="請輸入產品原價"
                           v-model="editTargetProduct.origin_price">
                  </div>
                </div>

                <!-- 請輸入產品售價 -->
                <div class="row align-items-center mb-3">
                  <div class="col-auto">
                    <label for="id-edit-product-price" class="form-label">產品售價</label>
                  </div>
                  <div class="col">
                    <input type="text" class="form-control" id="id-edit-product-price" placeholder="請輸入產品類別"
                           v-model="editTargetProduct.price">
                  </div>
                </div>

                <!-- 請輸入產品單位 -->
                <div class="row align-items-center mb-3">
                  <div class="col-auto">
                    <label for="id-edit-product-unit" class="form-label">產品單位</label>
                  </div>
                  <div class="col">
                    <input type="text" class="form-control" id="id-edit-product-unit" placeholder="請輸入產品單位"
                           v-model="editTargetProduct.unit">
                  </div>
                </div>

                <!-- 請輸入產品描述 -->
                <div class="row align-items-center mb-3">
                  <div class="col-auto">
                    <label for="id-edit-product-description" class="form-label">產品描述</label>
                  </div>
                  <div class="col">
                    <input type="text" class="form-control" id="id-edit-product-description" placeholder="請輸入產品描述"
                           v-model="editTargetProduct.description">
                  </div>
                </div>

                <!-- 請輸入產品內容 -->
                <div class="row align-items-center mb-3">
                  <div class="col-auto">
                    <label for="id-edit-product-content" class="form-label">產品內容</label>
                  </div>
                  <div class="col">
                    <textarea type="text" class="form-control" id="id-edit-product-content"
                              placeholder="請輸入產品內容" rows="10" cols="30"
                              v-model="editTargetProduct.content"/>
                  </div>
                </div>

                <!-- 產品上架 -->
                <div class="row align-items-center mb-3">
                  <div class="col-auto">
                    <label for="id-edit-product-is_enabled" class="form-label">產品上架</label>
                  </div>
                  <div class="col">
                    <input class="form-check-input" type="checkbox" id="id-edit-product-is_enabled"
                           :checked="editTargetProduct.is_enabled === 1">
                  </div>
                </div>

                <!-- 產品評分 -->
                <div class="row align-items-center mb-3">
                  <div class="col-auto">
                    <label for="id-edit-product-is_enabled" class="form-label">產品評分</label>
                  </div>
                  <div class="col">
                    <input class="form-control" type="text" id="id-edit-product-stars"
                           v-model="editTargetProduct.stars">
                  </div>
                </div>

                <!-- 產品圖片 -->
                <div class="row align-items-center mb-3">
                  <div class="col-auto">
                    <label for="id-edit-product-imageUrl" class="form-label">產品主圖</label>
                  </div>
                  <div class="col">
                    <input type="text" class="form-control" id="id-edit-product-imageUrl" placeholder="請輸入產品主圖"
                           v-model="editTargetProduct.imageUrl">
                  </div>
                </div>

                <!-- 其他圖片1 -->
                <div class="row align-items-center mb-3">
                  <div class="col-auto">
                    <label for="id-edit-product-imagesUrl-1" class="form-label">其他圖片1</label>
                  </div>
                  <div class="col">
                    <input type="text" class="form-control" id="id-edit-product-imagesUrl-1" placeholder="請輸入其他圖片1"
                           v-model="editTargetProduct.imagesUrl[0]">
                  </div>
                </div>

                <!-- 其他圖片2 -->
                <div class="row align-items-center mb-3">
                  <div class="col-auto">
                    <label for="id-edit-product-imagesUrl-2" class="form-label">其他圖片2</label>
                  </div>
                  <div class="col">
                    <input type="text" class="form-control" id="id-edit-product-imagesUrl-2" placeholder="請輸入其他圖片2"
                           v-model="editTargetProduct.imagesUrl[1]">
                  </div>
                </div>

                <!-- 其他圖片3 -->
                <div class="row align-items-center mb-3">
                  <div class="col-auto">
                    <label for="id-edit-product-imagesUrl-3" class="form-label">其他圖片3</label>
                  </div>
                  <div class="col">
                    <input type="text" class="form-control" id="id-edit-product-imagesUrl-3" placeholder="請輸入其他圖片3"
                           v-model="editTargetProduct.imagesUrl[2]">
                  </div>
                </div>

                <!-- 其他圖片4 -->
                <div class="row align-items-center mb-3">
                  <div class="col-auto">
                    <label for="id-edit-product-imagesUrl-4" class="form-label">其他圖片4</label>
                  </div>
                  <div class="col">
                    <input type="text" class="form-control" id="id-edit-product-imagesUrl-4" placeholder="請輸入其他圖片4"
                           v-model="editTargetProduct.imagesUrl[3]">
                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" id="id-submit-btn" @click.prevent="confirmEdit">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>