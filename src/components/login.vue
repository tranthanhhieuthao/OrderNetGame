<template>
<el-tabs type="border-card">
  <el-tab-pane>
    <div class="login">
<el-form status-icon  label-width="30%" class="demo-ruleForm">
    <el-form-item label="Username" prop="age">
    <el-input v-model="login.username"></el-input>
  </el-form-item>
  <el-form-item label="Password" prop="pass">
    <el-input v-model="login.password" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary"  @keyup.13="loginNow" @click="loginNow">Login!</el-button>
    <el-button @click="resetForm">Reset</el-button>
  </el-form-item>
</el-form>
    </div>
  </el-tab-pane>
</el-tabs>
</template>

<script>
import firebase from 'firebase'
import VueCookies from 'vue-cookies'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      login: {
        password: '',
        username: ''
      },
      iconreload: 0,
      token: {
        Token: '',
        email: ''
      }
    }
  },
  computed: {
    ...mapGetters(['dataUserCurrent'])
  },
  methods: {
    resetForm() {
      this.login = {}
    },
    async loginNow() {
      try {
        const resLogin = await this.$store.dispatch('app/loginApplication', this.login)
        console.log(resLogin)
        VueCookies.set('Token', resLogin.user.xa, '2h')
        VueCookies.set('email', this.login.username, '2h')
        const setDataUserCurrent = await firebase.firestore().collection('User').where('email', '==', VueCookies.get('email')).get()
        setDataUserCurrent.forEach(e => {
          this.$store.dispatch('app/dataUserCurrent', e.data())
          VueCookies.set('username', e.id, '2h')
          this.$store.dispatch('app/usernameReload', VueCookies.get('username'))
          this.$router.replace('/detail/' + VueCookies.get('username'))
        })
        this.$notify({
          title: 'Success',
          message: 'Login success',
          type: 'success',
          position: 'bottom-right'
        })
      } catch (er) {
        this.$notify({
          title: 'Error',
          message: 'Login Error',
          type: 'error',
          position: 'bottom-right'
        })
      }
    }
  }
}
</script>
<style scoped>
.login {
  width: 400px;
  margin:auto;
}
</style>
