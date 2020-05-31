<template>
<el-tabs type="border-card">
  <el-tab-pane>
    <div class="login">
<el-form status-icon  label-width="120px" class="demo-ruleForm">
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
export default {
  data() {
    return {
      login: {
        password: '',
        username: ''
      },
      token: {
        Token: '',
        email: ''
      }
    }
  },
  methods: {
    loginNow() {
      firebase.auth().signInWithEmailAndPassword(this.login.username, this.login.password).then(res => {
        console.log('success')
        VueCookies.set('Token', res.user.xa, '2h')
        VueCookies.set('email', this.login.username, '2h')
        console.log(VueCookies.get('email'))
        this.$notify({
          title: 'Success',
          message: 'Login success',
          type: 'success',
          position: 'bottom-right'
        })
        firebase.firestore().collection('User').where('email', '==', VueCookies.get('email')).get().then(res => {
          res.forEach(e => {
            VueCookies.set('username', e.id, '2h')
            this.$router.replace('/detail/' + VueCookies.get('username'))
          })
        })
      }).catch(er => {
        this.$notify({
          title: 'Error',
          message: 'Login Error',
          type: 'error',
          position: 'bottom-right'
        })
      })
    },
    resetForm() {
      this.login = {}
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
