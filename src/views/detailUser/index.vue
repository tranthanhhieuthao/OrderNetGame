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
  <el-form-item label="History Money">
    <el-input disabled v-model="dataUser.historyMoney"></el-input>
  </el-form-item>
   <el-form-item label="Money current/Payment">
    <div style="display:flex;">
      <el-input disabled v-model="dataUser.moneyCurrent" style="margin-right:10px;"></el-input>
    <el-input v-model="moneyCurrentTemp" style="margin-right:10px;"/>
    <el-button @click="Payload">Confirm</el-button>
    </div>
  </el-form-item>
  <el-form-item label="Time remain">
    <el-input disabled v-model="timeRemainData"/>
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
import VueCookies from 'vue-cookies'
export default {
  data() {
    return {
      dataUser: {
        password: '',
        email: '',
        username: '',
        phoneNumber: '',
        pcName: '',
        timeRemain: 0
      },
      count: 0,
      timeRemainData: '',
      moneyCurrentTemp: 0,
      dialogDelete: false,
      showBtnSave: false,
      disableEdit: true
    }
  },
  created() {
    this.getDetail()
  },
  watch: {
    second() {
      if (this.namePcStartTime !== '') {
        this.convertTimeRemain()
      }
    }
  },
  computed: {
    namePcStartTime: {
      get() {
        return this.dataUser.pcName
      }
    },
    second: {
      get() {
        return this.dataUser.second
      }
    }
  },
  methods: {
    getDetail() {
      var db = firebase.firestore()
      db.collection('User').doc(this.$route.params.id).get().then(res => {
        this.dataUser = res.data()
        this.convertStatus()
        this.credential()
        if (this.checkTime()) {
          this.dataUser.timeRemain = this.dataUser.moneyCurrent / 5000
        } else this.dataUser.moneyCurrent = 0
        this.timeRemainData = this.dataUser.timeRemain + 'h' + ':' + this.dataUser.minute + 'min' + ':' + this.dataUser.second + 's'
        this.$store.dispatch('app/timeUseServiceCurrent', this.timeRemainData)
        console.log(this.$store.state.app.timeUseService)
      })
    },
    convertStatus() {
      if (this.dataUser.status || this.dataUser.pcName !== 0) this.dataUser.statusCurent = 'Online'
      else this.dataUser.statusCurent = 'Offine'
    },
    convertTimeRemain() {
      this.timeRemainData = this.dataUser.timeRemain + 'h' + ':' + this.dataUser.minute + 'min' + ':' + this.dataUser.second + 's'
      var timeUse = setTimeout(() => {
        if (this.dataUser.second === 0 && this.dataUser.minute === 0 &&
        this.dataUser.timeRemain !== 0) {
          this.dataUser.second = 59
        }
        if (this.dataUser.second === 0 && this.dataUser.minute !== 0) {
          this.dataUser.minute--
          this.dataUser.second = 59
        } else {
          this.dataUser.second--
          if (this.dataUser.minute === 0 && this.dataUser.timeRemain !== 0) {
            this.dataUser.timeRemain = this.dataUser.timeRemain - 1
            this.dataUser.minute = 59
          }
        }
        this.$store.dispatch('app/timeUseServiceCurrent', this.timeRemainData)
        this.saveDataTimeRemain()
      }, 1000)
      if (this.checkTime()) {
        this.$notify({
          title: 'Warning',
          message: 'Thời gian sử dụng đã hết ,vui lòng nạp thêm',
          type: 'warning',
          position: 'bottom-right'
        })
        clearTimeout(timeUse)
      }
    },
    EditUser() {
      this.disableEdit = false
      this.showBtnSave = true
    },
    checkTime() {
      if (this.dataUser.timeRemain === 0 && this.dataUser.minute === 0 && this.dataUser.second === 0) {
        return true
      }
      return false
    },
    async saveChange() {
      try {
        console.log(this.dataUser)
        this.disableEdit = true
        this.showBtnSave = false
        var db = firebase.firestore()
        var auth = firebase.auth().currentUser
        await auth.updateEmail(this.dataUser.email + '')
        await auth.updatePassword(this.dataUser.password + '')
        await db.collection('User').doc(this.$route.params.id).update(this.dataUser)
        await auth.updatePassword(this.dataUser.password + '')
        // await auth.updateEmail(this.dataUser.email + '')
        this.$notify({
          title: 'Success',
          message: 'Update success',
          type: 'success',
          position: 'bottom-right'
        })
      } catch (er) {
        console.log(er)
      }
    },
    saveDataTimeRemain() {
      var db = firebase.firestore()
      var sfDocRef = db.collection('User').doc(VueCookies.get('username'))
      db.runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
          console.log(sfDoc)
          if (!sfDoc.exists) {
            console.log('Document does not exist!')
          }
          const newTimeRemain = this.dataUser.timeRemain
          const newMinute = this.dataUser.minute
          const newScond = this.dataUser.second
          transaction.update(sfDocRef, { timeRemain: newTimeRemain, minute: newMinute, second: newScond })
        })
      }).then(() => {
      }).catch((error) => {
        console.log('Transaction failed: ', error)
      })
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
    async credential() {
      try {
        var auth = firebase.auth().currentUser
        const user = await firebase.auth().onAuthStateChanged
        let credential
        if (user !== '') {
          await firebase.auth().signInWithEmailAndPassword(this.dataUser.email.trim(), this.dataUser.password)
          credential = firebase.auth.EmailAuthProvider.credential(
            auth.email,
            this.dataUser.password
          )
        }
        await auth.reauthenticateWithCredential(credential)
      } catch (er) {
        console.log(er)
      }
    },
    Payload() {
      if (this.moneyCurrentTemp % 5000 === 0) {
        this.dataUser.moneyCurrent = parseInt(this.moneyCurrentTemp)
        this.dataUser.historyMoney += parseInt(this.moneyCurrentTemp)
        this.moneyCurrentTemp = 0
        this.saveChange()
      } else {
        this.$notify({
          title: 'Warning',
          message: 'Xin hãy nạp bội số của 5000',
          type: 'warning',
          position: 'bottom-right'
        })
      }
    }
  }
}
</script>

<style scoped>
.detailUserStyle {
    width: 450px;
}
</style>
