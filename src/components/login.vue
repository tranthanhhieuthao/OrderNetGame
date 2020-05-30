<template>
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
        this.$notify({
          title: 'Success',
          message: 'Login success',
          type: 'success',
          position: 'bottom-right'
        })
        this.$router.replace('/showUser')
      }).catch(er => console.log(er))
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
