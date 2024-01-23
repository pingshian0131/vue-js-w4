<script>
import {Modal} from 'bootstrap';
import Navbar from "@/components/Navbar.vue";
import AddProductModal from "@/components/AddProduct.vue";
import EditProductModal from "@/components/EditProduct.vue";
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const PRODUCT_API_SERVER = `${API_BASE_URL}v2/api/${API_PATH}/admin/product`;

export default {
  components: {
    AddProductModal,
    EditProductModal,
    Loading,
    Navbar
  },
  data() {
    return {
      isLogin: -1,
      page: 'admin',
      accessToken: /accessToken=([^;]+)/.exec(document.cookie) && /accessToken=([^;]+)/.exec(document.cookie)[1],
      targetAddProduct: null,
      products: [],
      productsMap: {},
      editTargetProduct: null,
      deleteTargetProduct: null,
      viewTargetImage: null,
      getProductsSuccess: 0,
      fullPage: true,
    }
  },
  created() {
    if (!this.accessToken) {
      alert('請先登入!');
      window.location.href = '/';
    }
    this.$axios.defaults.headers.common.authorization = this.accessToken;
    this.checkUserStatus();
    this.getAllProducts();
  },
  methods: {
    checkUserStatus() {
      this.isLogin = 0;
      const loader = this.$loading.show({
        isFullPage: false,
        canCancel: true,
        onCancel: this.onCancel
      })
      this.$axios.post(`${API_BASE_URL}v2/api/user/check`).then(() => {
        this.isLogin = 1;
        loader.hide();
      }).catch((err) => {
        alert('請重新登入!')
        this.isLogin = -1;
        window.location.href = '/';
      })
    },
    getAllProducts() {
      const loader = this.$loading.show({
        isFullPage: true,
        canCancel: true,
        onCancel: this.onCancel
      })
      this.$axios.get(`${API_BASE_URL}v2/api/${API_PATH}/admin/products/all`).then((res) => {
        this.products = res.data.products;
        let product;
        for (let key in this.products) {
          product = this.products[key];
          this.productsMap[product.title] = product;
        }
        this.getProductsSuccess = 1;
        loader.hide();
      }).catch((err) => {
        this.failAndReload('Get All', err);
        this.getProductsSuccess = -1;
      })
    },
    viewImage(e) {
      this.viewTargetImage = e.target.src;
      let myModal = new Modal(document.getElementById('viewImageModal'));
      myModal.show();
    },
    submitDeleteProduct() {
      this.$axios.delete(`${PRODUCT_API_SERVER}/${this.deleteTargetProduct.id}`).then((res) => {
        if (res.data.success === true) {
          this.$swal({
            title: "Deleted!",
            text: "Your product has been deleted.",
            icon: "success"
          }).then(() => {
            window.location.reload();
          });
        } else {
          this.failAndReload('deleted');
        }
      }).catch((err) => {
        this.failAndReload('deleted', err);
      })
    },
    showEditModal(id) {
      this.editTargetProduct = JSON.parse(JSON.stringify(this.products[id]));
    },
    showDeleteModal(id) {
      this.deleteTargetProduct = JSON.parse(JSON.stringify(this.products[id]));
      this.confirmDelete();
    },
    confirmDelete() {
      // Use sweetalert2
      this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.submitDeleteProduct();
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
  <Navbar :login-status=isLogin :page="page"></Navbar>
  <div class="container mt-5" v-if="isLogin === 1">
    <div class="row mt-3">
      <div class="col-auto">
        <h1>Admin</h1>
      </div>
    </div>
    <div class="row justify-content-start mb-5 mt-3" v-if="getProductsSuccess">
      <!-- tab nav-link -->
      <div class="col-2">
        <div class="d-flex align-items-start">
          <div class="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <button class="nav-link active" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home"
                    type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">
              <font-awesome-icon icon="fa-solid fa-suitcase"/>&nbsp;
              產品列表
            </button>
            <button class="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile"
                    type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">
              Other Tab1
            </button>
            <button class="nav-link" id="v-pills-messages-tab" data-bs-toggle="pill" data-bs-target="#v-pills-messages"
                    type="button" role="tab" aria-controls="v-pills-messages" aria-selected="false">
              Other Tab2
            </button>
            <button class="nav-link" id="v-pills-settings-tab" data-bs-toggle="pill" data-bs-target="#v-pills-settings"
                    type="button" role="tab" aria-controls="v-pills-settings" aria-selected="false">
              Other Tab3
            </button>
          </div>
        </div>
      </div>
      <!-- nav-tab -->
      <div class="col-10">
        <div class="row mb-3 justify-content-end">
          <div class="col-auto">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProductModal">
              新增產品
            </button>
          </div>
        </div>
        <div class="row mb-3">
          <div class="tab-content" id="v-pills-tabContent">
            <!-- Product Tab -->
            <div class="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
              <!-- Product List -->
              <div class="table-responsive">
                <!-- Product Data -->
                <table class="table table-hover table-bordered">
                  <thead>
                  <tr class="text-nowrap">
                    <th>Edit</th>
                    <th>Delete</th>
                    <!--                    <th>產品ID</th>-->
                    <th>產品名稱</th>
                    <th>產品類別</th>
                    <th>產品原價</th>
                    <th>產品售價</th>
                    <th>產品單位</th>
                    <th>產品描述</th>
                    <th>產品內容</th>
                    <th>產品上架</th>
                    <th>產品主圖</th>
                    <th>其他圖片1</th>
                    <th>其他圖片2</th>
                    <th>其他圖片3</th>
                    <th>其他圖片4</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(product, id) in products" :key="product.id">
                    <td>
                      <button type="button" class="btn btn-secondary text-nowrap"
                              data-bs-toggle="modal" data-bs-target="#editProductModal"
                              :id="'id-edit-btn_' + id" @click="showEditModal(id)">
                        <font-awesome-icon icon="fa-solid fa-edit"/>
                      </button>
                    </td>
                    <td>
                      <button type="button" class="btn btn-danger"
                              :id="'id-delete-btn_' + id" @click="showDeleteModal(id)">
                        <font-awesome-icon icon="fa-solid fa-trash"/>
                      </button>
                    </td>
                    <!--                    <td>{{ id.slice(0, 5) }}...</td>-->
                    <td class="text-nowrap">{{ product.title }}</td>
                    <td>{{ product.category }}</td>
                    <td class="text-nowrap">NT$ {{ product.origin_price.toLocaleString() }}</td>
                    <td class="text-nowrap">NT$ {{ product.price.toLocaleString() }}</td>
                    <td>{{ product.unit }}</td>
                    <td>{{ product.description.slice(0, 10) }}...</td>
                    <td>{{ product.content.slice(0, 20) }}...</td>
                    <td>
                      <template v-if="product.is_enabled !== 0">
                        <span class="text-white bg-success px-2 py-1" style="border-radius: 5px;">啟用</span>
                      </template>
                      <template v-else>
                        <span class="text-white bg-secondary px-2 py-1" style="border-radius: 5px;">未啟用</span>
                      </template>
                    </td>
                    <td>
                      <template v-if="product.imageUrl">
                        <img :src="product.imageUrl" alt="" class="img-preview" @click="viewImage">
                      </template>
                    </td>
                    <td>
                      <template v-if="product.imagesUrl[0]">
                        <img :src="product.imagesUrl[0]" alt="" class="img-preview" @click="viewImage">
                      </template>
                    </td>
                    <td>
                      <template v-if="product.imagesUrl[1]">
                        <img :src="product.imagesUrl[1]" alt="" class="img-preview" @click="viewImage">
                      </template>
                    </td>
                    <td>
                      <template v-if="product.imagesUrl[2]">
                        <img :src="product.imagesUrl[2]" alt="" class="img-preview" @click="viewImage">
                      </template>
                    </td>
                    <td>
                      <template v-if="product.imagesUrl[3]">
                        <img :src="product.imagesUrl[3]" alt="" class="img-preview" @click="viewImage">
                      </template>
                    </td>
                  </tr>
                  </tbody>
                </table>

              </div>
            </div>

            <!-- Other Tab1 -->
            <div class="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">...
            </div>

            <!-- Other Tab2 -->
            <div class="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab">...
            </div>

            <!-- Other Tab3 -->
            <div class="tab-pane fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab">...
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-start mb-5 mt-3" v-else-if="getProductsSuccess === 0">
      <Loading/>
    </div>
    <div class="row justify-content-start mb-5 mt-3" v-else>
      <h1>API Server Error</h1>
    </div>
  </div>
  <div class="container" v-else>
    <Loading/>
  </div>

  <AddProductModal :products-map="productsMap"/>

  <EditProductModal :edit-target-product="editTargetProduct"/>

</template>

<style scoped>
.img-preview {
  cursor: zoom-in;
}
</style>