<template>
    <div>
<el-form status-icon  label-width="120px" class="demo-ruleForm">
    <el-form-item label="username" prop="age">
    <el-input v-model="login.username"></el-input>
  </el-form-item>
  <el-form-item label="Password" prop="pass">
    <el-input v-model="login.password" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="loginNow">Login!</el-button>
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
            },
        }
    },
    methods: {
        loginNow() {
            firebase.auth().signInWithEmailAndPassword(this.login.username,this.login.password).then( res => {
                console.log('success')
                console.log(res.user.refreshToken)
                VueCookies.set('Token', res.user.refreshToken, '1h')
                console.log(VueCookies.get('Token'))
                this.$router.replace('/createUser')
            }).catch(er => console.log(er))
        },
        resetForm() {
          this.login = {} 
        }
    }
}
</script>
<style scoped>

</style>