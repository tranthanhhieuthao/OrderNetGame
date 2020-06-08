<template>
    <div class="detailUserStyle">
      <el-form label-position="left" label-width="180px">
  <el-form-item label="Username/Password">
    <div style="display:flex;">
    <el-input :disabled="disableEdit" v-model="dataUser.username" style="margin-right:10px;"></el-input>
    <el-input type="password" :disabled="disableEdit" v-model="dataUser.password"></el-input>
    </div>
  </el-form-item>
  <el-form-item label="Email">
    <el-input :disabled="disableEdit" v-model="dataUser.email"></el-input>
  </el-form-item>
   <el-form-item label="Status/PcName">
     <div style="display:flex;">
    <el-input disabled v-model="dataUser.statusCurent" style="margin-right:10px;" ></el-input>
    <el-input disabled v-model="dataUser.pcName"></el-input>
     </div>
  </el-form-item>
  <el-form-item label="phoneNumber">
    <el-input :disabled="disableEdit" v-model="dataUser.phoneNumber"></el-input>
  </el-form-item>
   <el-form-item label="Money current/Payment">
    <div style="display:flex;">
      <el-input disabled v-model="dataUser.moneyCurrent" style="margin-right:10px;"></el-input>
    <el-input v-model="moneyCurrentTemp" style="margin-right:10px;"/>
    <el-button @click="Payload">Confirm</el-button>
    </div>
  </el-form-item>
  <el-form-item label="Action">
    <div style="display:flex;">
    <el-button @click="EditUser" icon="el-icon-edit" >Chỉnh sửa</el-button>
    <el-button v-if="showBtnSave" @click="saveChange" icon="el-icon-success">Lưu</el-button>
    <el-button @click="dialogDelete = true">Xóa</el-button>
    </div>
  </el-form-item>
</el-form>
<el-dialog :visible.sync="dialogDelete">
  <span>Bạn chắc chắn muốn xóa không?</span>
  <el-form >
    <el-button @click="Delete">Xóa</el-button>
    <el-button @click="dialogDelete = false">Hủy</el-button>
  </el-form>
</el-dialog>
    </div>
</template>

<script>
import firebase from 'firebase'
export default {
  data() {
    return {
      dataUser: {
        password: '',
        email: '',
        username: '',
        phoneNumber: '',
        pcName: ''
      },
      moneyCurrentTemp: 0,
      dialogDelete: false,
      showBtnSave: false,
      disableEdit: true
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      var db = firebase.firestore()
      db.collection('User').doc(this.$route.params.id).get().then(res => {
        this.dataUser = res.data()
        this.convertStatus()
        this.credential()
      })
    },
    convertStatus() {
      if (this.dataUser.status || this.dataUser.pcName !== 0) this.dataUser.statusCurent = 'Online'
      else this.dataUser.statusCurent = 'Offine'
    },
    EditUser() {
      this.disableEdit = false
      this.showBtnSave = true
    },
    saveChange() {
      this.disableEdit = true
      this.showBtnSave = false
      var db = firebase.firestore()
      var auth = firebase.auth().currentUser
      console.log(auth)
      auth.updateEmail(this.dataUser.email + '').then(res => {
        auth.updatePassword(this.dataUser.password + '').then(res => {
          db.collection('User').doc(this.$route.params.id).update(this.dataUser).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Update success',
              type: 'success',
              position: 'bottom-right'
            })
          })
        })
      })

      // console.log(this.dataUser.password)
      // auth.updatePassword(this.dataUser.password + '').then(res => console.log('success')).catch(er => {
      //   console.log(er)
      // })
      // auth.updateEmail(this.dataUser.email + '').then(res => console.log(res))
    },
    Delete() {
      var db = firebase.firestore()
      var auth = firebase.auth().currentUser
      this.dialogDelete = false
      db.collection('User').doc(this.$route.params.id).delete().then(() => {
        auth.delete().then(res => {
          console.log('success')
        })
        this.$notify({
          title: 'Success',
          message: 'Delete success',
          type: 'success',
          position: 'bottom-right'
        })
      })
    },
    credential() {
      var auth = firebase.auth().currentUser
      firebase.auth().onAuthStateChanged(user => {
        let credential
        console.log(user)
        if (user === '') {
          credential = firebase.auth.EmailAuthProvider.credential(
            auth.email,
            this.dataUser.password
          )
        } else {
          console.log(this.dataUser)
          firebase.auth().signInWithEmailAndPassword(this.dataUser.email.trim(), this.dataUser.password).then(res => {
            console.log('success')
            console.log(auth)
            credential = firebase.auth.EmailAuthProvider.credential(
              auth.email,
              this.dataUser.password
            )
          })
        }
        auth.reauthenticateWithCredential(credential).then(res => { })
      })
    },
    Payload() {
      this.dataUser.moneyCurrent += parseInt(this.moneyCurrentTemp)
      this.moneyCurrentTemp = 0
      this.saveChange()
    }
  }
}
</script>

<style scoped>
.detailUserStyle {
    width: 450px;
}
</style>
