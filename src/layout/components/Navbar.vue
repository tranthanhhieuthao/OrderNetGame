<template>
    <div>
<el-menu
  background-color="#545c64"
  text-color="#fff"
  mode="horizontal"
  active-text-color="#ffd04b">
  <el-menu-item>
      <router-link to="/login">
      <el-button>Login</el-button>
      </router-link>
    </el-menu-item>
    <el-menu-item>
      <router-link to="/showUser">
      <el-button>List User</el-button>
      </router-link>
    </el-menu-item>
    <el-menu-item>
      <router-link to="/register">
      <el-button>Register</el-button>
      </router-link>
    </el-menu-item>
  <el-menu-item @click="logout"><el-button>Logout</el-button></el-menu-item>
</el-menu>
    </div>
</template>

<script>
import VueCookies from 'vue-cookies'
export default {
  methods: {
    logout() {
      VueCookies.set('Token', VueCookies.get('Token'), '0s')
      this.$router.replace('/login')
    }
  }
}
</script>

<style scoped>

</style>
