<script>
import Navbar from "@/components/sys/Navbar.vue";
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;
export default {
  components: {Loading, Navbar},
  data() {
    return {
      isLogin: 0,
      accessToken: /accessToken=([^;]+)/.exec(document.cookie) && /accessToken=([^;]+)/.exec(document.cookie)[1],
      page: 'index',
      username: '',
      password: '',
    }
  },
  created() {
    if (!this.accessToken) {
      this.isLogin = -1;
    } else {
      this.$axios.defaults.headers.common.authorization = this.accessToken;
      this.checkUserStatus();
    }
  },
  methods: {
    login() {
      const url = `${API_BASE_URL}/v2/admin/signin`;
      const user = {
        username: this.username,
        password: this.password,
      }
      this.$axios.post(url, user).then((res) => {
        if (res.data.success) {
          const accessToken = res.data.token;
          const expired = res.data.expired;
          document.cookie = `accessToken=${accessToken}; expires=${new Date(expired)}; path=/`;
          window.location.href = '/#/admin';
        } else {
          alert(res.data.message);
          window.location.reload();
        }
      }).catch((err) => {
        console.log(err);
      })
    },
    checkUserStatus() {
      this.isLogin = 0;
      this.$axios.post(`${API_BASE_URL}v2/api/user/check`).then(() => {
        this.isLogin = 1;
        window.location.href = '/#/admin';
      }).catch((err) => {
        console.log(err);
        this.isLogin = -1;
        alert('請重新登入!');
        window.location.reload();
      })
    },
  }
}
</script>

<template>
  <Navbar :login-status="isLogin" :page="page"></Navbar>
  <div class="container">
    <template v-if="isLogin === 0">
      <Loading/>
    </template>
    <template v-else-if="isLogin === -1">
      <div class="row justify-content-center mb-5">
        <h1 class="h3 mb-3 font-weight-normal">
          請先登入
        </h1>
        <div class="col-8">
          <form id="form" class="form-signin">
            <div class="form-floating mb-3">
              <input type="email" class="form-control" id="username"
                     placeholder="name@example.com" required autofocus
                     v-model="username">
              <label for="username">Email address</label>
            </div>
            <div class="form-floating">
              <input type="password" class="form-control" id="password"
                     placeholder="Password" required
                     v-model="password">
              <label for="password">Password</label>
            </div>
            <button class="btn btn-lg btn-primary w-100 mt-3" type="submit"
                    id="submit-btn" @click.prevent="login()">
              登入
            </button>
          </form>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-auto">
          &copy; {{ new Date().getFullYear() }} -
          <a href="https://pingshian.simplesocool.cc/" target="_blank">Pingshian</a> x
          <a href="https://www.hexschool.com/" target="_blank">六角學院</a>
        </div>
      </div>
    </template>

  </div>

</template>

<style scoped>

</style>