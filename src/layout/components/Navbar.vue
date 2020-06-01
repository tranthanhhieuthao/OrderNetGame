<template>
    <div>
<el-menu
  class="el-menu-demo"
  mode="horizontal"
  background-color="#545c64"
  text-color="#fff"
  active-text-color="#ffd04b">
  <el-menu-item />
    <el-menu-item style="float:right;">
      <el-dropdown split-button type="primary" >
        {{this.$store.state.app.usernameReload}}
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item>
     <router-link to="/login">
     <i class="el-icon-user-solid"> Login</i>
      </router-link>
    </el-dropdown-item>
    <el-dropdown-item>
      <router-link to="/register">
     <i class="el-icon-user"> Register</i>
      </router-link>
    </el-dropdown-item>
    <el-dropdown-item >
      <i class="el-icon-remove-outline" @click="logout">Logout</i>
    </el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
    </el-menu-item>
</el-menu>
    </div>
</template>

<script>
import VueCookies from 'vue-cookies'
export default {
  data() {
    return {
      usernameCurrent: '',
      iconreload: 0
    }
  },
  mounted() {
    this.usernameCurrent = VueCookies.get('username')
  },
  methods: {
    logout() {
      VueCookies.set('email', VueCookies.get('email'), '0s')
      VueCookies.set('Token', VueCookies.get('Token'), '0s')
      VueCookies.set('username', 'Noname', '12h')
      this.usernameCurrent = VueCookies.get('username')
      this.$router.replace('/login')
      this.$store.dispatch('app/usernameReload', this.usernameCurrent)
      console.log(this.$store.state.app.usernameReload)
    }
  }
}
</script>

<style scoped>

</style>
