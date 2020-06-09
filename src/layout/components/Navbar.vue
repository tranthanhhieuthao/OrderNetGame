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
        {{usernameReload}}
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
import { mapGetters } from 'vuex'
import firebase from 'firebase'
export default {
  data() {
    return {
      usernameCurrent: '',
      iconreload: 0,
      dataLogout: {}
    }
  },
  computed: {
    ...mapGetters(['usernameReload', 'dataUserCurrent'])
  },
  created() {
    this.usernameCurrent = VueCookies.get('username')
  },
  watch: {
    dataUserCurrent() {
      this.dataLogout = this.$store.state.app.dataUserCurrent
    }
  },
  methods: {
    logout() {
      var db = firebase.firestore()
      console.log(this.dataLogout)
      if (this.dataLogout.pcName !== '') {
        var nycRef = db.collection('Computer').doc(this.dataLogout.pcName)
        db.batch().update(nycRef, {status: false})
      }
      this.dataLogout.status = false
      this.dataLogout.pcName = 0
      if (this.dataLogout.status || this.dataLogout.pcName !== 0) this.dataLogout.statusCurent = 'Online'
      else this.dataLogout.statusCurent = 'Offine'
      console.log(this.dataLogout)
      db.collection('User').doc(VueCookies.get('username')).update(this.dataLogout).then(() => {
        VueCookies.set('email', VueCookies.get('email'), '0s')
        VueCookies.set('Token', VueCookies.get('Token'), '0s')
        VueCookies.set('username', 'Noname', '12h')
        this.$store.dispatch('app/dataUserCurrent', {})
        this.usernameCurrent = VueCookies.get('username')
        this.$router.replace('/login')
        this.$store.dispatch('app/usernameReload', this.usernameCurrent)
      })
    }
  }
}
</script>

<style scoped>

</style>
