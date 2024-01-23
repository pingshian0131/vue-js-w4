<script>
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;

export default {
  props: {
    loginStatus: {
      type: Number,
      default: -1,
    },
    page: {
      type: String,
    },
  },
  setup(props) {
    // console.log(props.loginStatus)
  },
  data() {
    return {
      accessToken: /accessToken=([^;]+)/.exec(document.cookie) && /accessToken=([^;]+)/.exec(document.cookie)[1],
    }
  },
  created() {
  },
  methods: {
    logout() {
      axios.defaults.headers.common.authorization = this.accessToken;
      axios.post(`${API_BASE_URL}v2/logout`).then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log(err);
      })
      document.cookie = `accessToken=; expires=${new Date()}; path=/`;
      window.location.href = '/';
    },
    isDisabled(link) {
      return this.page === link ? 'disabled' : '';
    }
  }
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <a class="navbar-brand" href="#">
        <img src="/favicon.ico" alt="" width="30" height="24" class="d-inline-block align-text-top">
        Home
      </a>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item" v-if="loginStatus === 1">
            <a :class="'nav-link ' + isDisabled('product')" href="#/product">Product</a>
          </li>
          <li class="nav-item" v-if="loginStatus === 1">
            <a :class="'nav-link ' + isDisabled('admin')" href="#/admin">Admin</a>
          </li>
          <li class="nav-item" v-if="loginStatus === 1">
            <a :class="'nav-link ' + isDisabled('login')" href="/" @click="logout">Logout</a>
          </li>
          <li class="nav-item" v-if="loginStatus === -1 && page !== 'index'">
            <a :class="'nav-link ' + isDisabled('login')" href="/">Login</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

</template>

<style scoped>

</style>