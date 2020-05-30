<template>
    <div>
<el-form status-icon  label-width="120px" class="demo-ruleForm">
    <el-form-item label="Email" >
    <el-input v-model="registerUser.email"></el-input>
  </el-form-item>
  <el-form-item label="Username" >
    <el-input v-model="registerUser.username"></el-input>
  </el-form-item>
  <el-form-item label="Phonenumber" >
    <el-input v-model="registerUser.phoneNumber"></el-input>
  </el-form-item>
  <el-form-item label="Password" >
    <el-input type="password" v-model="registerUser.password" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="register">Submit</el-button>
    <el-button @click="resetForm">Reset</el-button>
    <router-link to="/login">
    <el-button>Login</el-button>
    </router-link>
  </el-form-item>
</el-form>
    </div>
</template>

<script>
import firebase from 'firebase'
export default {
    data() {
        return {
            registerUser: {
               password: '',
               username: '',
               phoneNumber: '',
               moneyCurrent: 0,
               historyMoney: 0,
               pcName: 0,
               timeRemain: 0,
               status: false
            }
        }
    },
    methods: {
        register() {
            firebase.auth().createUserWithEmailAndPassword(this.registerUser.email, this.registerUser.password).then( res => {
                console.log('success')
                console.log(res)
                })
            .catch( er => console.log(er))
             var db = firebase.firestore()
      if (this.registerUser !== []) {
      db.collection('User').doc(this.registerUser.username).set(this.registerUser).then( ()=> {
        console.log('success')
      }).catch(er => console.log(er))
      }
        },
        resetForm() {
          this.registerUser = {} 
        },
    }
}
</script>
<style scoped>

</style>