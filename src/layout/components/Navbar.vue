<template>
    <div>
<el-menu
  class="el-menu-demo"
  mode="horizontal"
  background-color="#545c64"
  text-color="#fff"
  active-text-color="#ffd04b">
  <el-menu-item>
      <router-link to="/login">
      <el-button icon="el-icon-user-solid">Login</el-button>
      </router-link>
    </el-menu-item>
    <el-menu-item>
      <router-link to="/register">
      <el-button icon="el-icon-user">Register</el-button>
      </router-link>
    </el-menu-item>
  <el-menu-item @click="logout"><el-button icon="el-icon-remove-outline">Logout</el-button></el-menu-item>
</el-menu>
    </div>
</template>

<script>
import VueCookies from 'vue-cookies'
export default {
  methods: {
    logout() {
      VueCookies.set('email', VueCookies.get('email'), '0s')
      VueCookies.set('Token', VueCookies.get('Token'), '0s')
      VueCookies.set('username', VueCookies.get('username'), '0s')
      this.$router.replace('/login')
    }
  }
}
</script>

<style scoped>

</style>
