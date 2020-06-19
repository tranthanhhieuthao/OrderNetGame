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
     <el-menu-item index="2" class="listpc-sub" style="margin-right:30px;">
        <router-link to="/listPc">
         <i class="el-icon-document">List PC</i>
          </router-link>
      </el-menu-item>
       <el-menu-item index="3" class="setting-sub" style="margin-right:30px;">
        <router-link :to="{path: `/detail`, params: {id: id}}" >
         <i class="el-icon-setting">Detail</i>
          </router-link>
      </el-menu-item>
       <el-menu-item style="float:left;">
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
    <span class="hours" id="hour">{{ dataTime.hour + 'h' }}</span>
  </div>
  <div>
    <span class="minutes" id="minute">{{ dataTime.minute + 'min' }}</span>
  </div>
  <div>
    <span class="seconds" id="second">{{ dataTime.second + 's' }}</span>
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
  },
  mounted() {
    this.convertTimeUseSerive()
  },
  watch: {
    timeUseService() {
      this.convertTimeUseSerive()
    }
  },
  computed: {
    ...mapGetters(['usernameReload', 'dataUserCurrent', 'timeUseService'])
  },
  methods: {
    convertTimeUseSerive() {
      var temp = this.timeUseService.replace(/[^0-9:]/g, '').split(':')
      this.dataTime.hour = temp[0]
      this.dataTime.minute = temp[1]
      this.dataTime.second = temp[2] - 1
    },
    async logout() {
      const dataLogout = this.dataUserCurrent
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
          VueCookies.set('username', 'Noname', '12h')
          this.$store.dispatch('app/dataUserCurrent', {})
          this.usernameCurrent = VueCookies.get('username')
          VueCookies.set('pcName', dataLogout.pcName, '0s')
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
    color: rgb(28, 39, 197);
    display: inline-block;
    font-weight: 100;
    text-align: center;
    font-size: 25px;
    margin-left: 700px;
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
</style>
