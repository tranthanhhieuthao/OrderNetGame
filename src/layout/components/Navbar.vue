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
      id: VueCookies.get('username')
      // dataLogout: {}
    }
  },
  created() {
    this.id = VueCookies.get('username')
  },
  computed: {
    ...mapGetters(['usernameReload', 'dataUserCurrent'])
  },
  methods: {
    logout() {
      const dataLogout = JSON.parse(JSON.stringify(this.dataUserCurrent))
      var db = firebase.firestore()
      VueCookies.set('pcName', dataLogout.pcName, '2h')
      if (dataLogout.pcName !== '') {
        var sfDocRef = db.collection('Computer').doc(VueCookies.get('pcName'))
        db.runTransaction((transaction) => {
          return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
              console.log('Document does not exist!')
            }
            var newStatus = false
            transaction.update(sfDocRef, { status: newStatus })
          })
        }).then((newStatus) => {
          console.log('status increased to ', newStatus)
        }).catch((error) => {
          console.log('Transaction failed: ', error)
        })
      }
      dataLogout.status = false
      dataLogout.pcName = ''
      if (dataLogout.status || dataLogout.pcName !== '') dataLogout.statusCurent = 'Online'
      else dataLogout.statusCurent = 'Offine'
      db.collection('User').doc(VueCookies.get('username')).update(dataLogout).then(() => {
        VueCookies.set('email', VueCookies.get('email'), '0s')
        VueCookies.set('Token', VueCookies.get('Token'), '0s')
        VueCookies.set('username', 'Noname', '12h')
        this.$store.dispatch('app/dataUserCurrent', {})
        this.usernameCurrent = VueCookies.get('username')
        VueCookies.set('pcName', dataLogout.pcName, '0s')
        this.$router.replace('/login')
        this.$store.dispatch('app/usernameReload', this.usernameCurrent)
      })
    }
  }
}
</script>

<style scoped>

</style>
