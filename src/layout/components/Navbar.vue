<template>
    <div>
<el-menu
  class="el-menu-demo"
  mode="horizontal"
  background-color="#545c64"
  text-color="#fff"
  key="menuKey"
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
     <el-menu-item index="2" class="listpc-sub" style="margin-right:30px;">
        <router-link to="/listPc">
         <a> List PC</a>
          </router-link>
      </el-menu-item>
       <el-menu-item index="3" class="setting-sub" style="margin-right:30px;">
        <router-link :to="{path: `/detail`, params: {id: id}}" >
         <a>Detail</a>
          </router-link>
      </el-menu-item>
       <el-menu-item style="float:left;" v-if="id === 'admin'">
         <el-dropdown>
      <span class="el-dropdown-link">
        Admin<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <router-link to="/createPc">
          <i class="el-icon-setting"> Create PC</i>
          </router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <router-link to="/showUser">
          <i class="el-icon-menu"> List User</i>
          </router-link>
        </el-dropdown-item>
      </el-dropdown-menu>
       </el-dropdown>
    </el-menu-item>
    <el-menu-item >
      <div id="clockdiv">
  <div>
    <span class="hours" id="hour">{{ dataUser.timeRemain }}</span>
  </div>
  <div>
    <span class="minutes" id="minute">{{ dataUser.minute}}</span>
  </div>
  <div>
    <span class="seconds" id="second">{{ dataUser.second }}</span>
  </div>
</div>
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
      id: VueCookies.get('username'),
      menuKey: 0,
      dataUser: {
        password: '',
        email: '',
        username: '',
        phoneNumber: '',
        pcName: '',
        timeRemain: 0,
        minute: 0,
        second: 0
      },
      dataTime: {
        hour: 0,
        minute: 0,
        second: 0
      }
      // dataLogout: {}
    }
  },
  created() {
    this.id = VueCookies.get('username')
    this.getData()
  },
  watch: {
    second() {
      if (VueCookies.get('pcName') !== null && !this.checkTime()) {
        this.convertTimeRemain()
      }
    },
    timeUseService() {
      if (this.timeUseService) {
        this.convertTimeRemain()
      }
    },
    usernameReload() {
      this.id = VueCookies.get('username')
      if (this.usernameReload !== 'Noname') {
        this.getData()
      }
    }
  },
  computed: {
    ...mapGetters(['usernameReload', 'dataUserCurrent', 'timeUseService']),
    second: {
      get() {
        return this.dataUser.second
      }
    }
  },
  methods: {
    getData() {
      var db = firebase.firestore()
      if (this.id !== 'Noname') {
        db.collection('User').doc(this.id).onSnapshot(res => {
          this.dataUser = res.data()
          if (this.checkTime()) {
            this.dataUser.timeRemain = this.dataUser.moneyCurrent / 5000
          } else this.dataUser.moneyCurrent = 0
        })
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
    checkTime() {
      if (this.dataUser.timeRemain === 0 && this.dataUser.minute === 0 && this.dataUser.second === 0) {
        return true
      }
      return false
    },
    convertTimeRemain() {
      var timeUse = setTimeout(() => {
        if (this.dataUser.second === 0 && this.dataUser.minute === 5 &&
        this.dataUser.timeRemain === 0) {
          this.$notify({
            title: 'Warning',
            message: 'Thời gian sử dụng sắp hết, còn 5 phút',
            type: 'warning',
            position: 'bottom-right'
          })
        }
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
    async logout() {
      const dataLogout = this.dataUser
      console.log(VueCookies.get('pcName'))
      var db = firebase.firestore()
      if (VueCookies.get('pcName') !== null) {
        var sfDocRef = db.collection('Computer').doc(VueCookies.get('pcName'))
        db.runTransaction((transaction) => {
          return transaction.get(sfDocRef).then((sfDoc) => {
            console.log(sfDoc)
            if (!sfDoc.exists) {
              console.log('Document does not exist!')
            }
            const newStatus = false
            transaction.update(sfDocRef, { status: newStatus })
          })
        }).then(() => {
          console.log('status change to succsess')
        }).catch((error) => {
          console.log('Transaction failed: ', error)
        })
      }
      dataLogout.status = false
      dataLogout.pcName = ''
      if (dataLogout.status || dataLogout.pcName !== '') dataLogout.statusCurent = 'Online'
      else dataLogout.statusCurent = 'Offine'

      var userDocRef = db.collection('User').doc(VueCookies.get('username'))
      db.runTransaction((transaction) => {
        return transaction.get(userDocRef).then((sfDoc) => {
          console.log(sfDoc)
          if (!sfDoc.exists) {
            console.log('Document does not exist!')
          }
          const newStatusUser = false
          const newpcName = ''
          transaction.update(userDocRef, { status: newStatusUser, pcName: newpcName })
          VueCookies.set('email', VueCookies.get('email'), '0s')
          VueCookies.set('Token', VueCookies.get('Token'), '0s')
          VueCookies.set('pcName', VueCookies.get('pcName'), '0s')
          VueCookies.set('username', 'Noname', '12h')
          this.$store.dispatch('app/dataUser', {})
          this.usernameCurrent = VueCookies.get('username')
          VueCookies.set('pcName', dataLogout.pcName, '0s')
          this.dataUser = {
            password: '',
            email: '',
            username: '',
            phoneNumber: '',
            pcName: '',
            timeRemain: 0,
            minute: 0,
            second: 0
          }
          this.$router.replace('/login')
          this.$store.dispatch('app/usernameReload', this.usernameCurrent)
        })
      }).then(() => {
        console.log('status change to succsess')
      }).catch((error) => {
        console.log('Transaction failed: ', error)
      })
    }
  }
}
</script>

<style scoped>
 #clockdiv{
    font-family: sans-serif;
    color: rgb(20, 20, 20);
    display: inline-block;
    font-weight: 100;
    text-align: center;
    font-size: 25px;
}
#clockdiv > div{
    border-radius: 3px;
    display: inline;
     text-align: center;
}
#clockdiv div > span{
    padding: 10px;
    border-radius: 3px;
    background: #63706d;
    display: inline;
}
.listpc-sub a {
   float: left;
  color: #f2f2f2;
  text-align: center;
  text-decoration: none;
  font-size: 17px;
}
.setting-sub a {
   float: left;
  color: #f2f2f2;
  text-align: center;
  text-decoration: none;
  font-size: 17px;
}
.el-dropdown-link {
   float: left;
  color: #f2f2f2;
  text-align: center;
  text-decoration: none;
  font-size: 17px;
}
</style>
