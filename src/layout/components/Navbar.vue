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
     <router-link to="/">
     <i class="el-icon-user-solid"> Login</i>
      </router-link>
    </el-dropdown-item>
    <el-dropdown-item >
      <i class="el-icon-remove-outline" @click="logout">Logout</i>
    </el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
    </el-menu-item>
    <el-menu-item  class="listpc-sub" style="margin-right:30px;float:right;">
      <el-badge v-model="stock" class="item" type="primary" >
         <a class="el-icon-shopping-cart-1" @click="dialogCart = true"> Cart</a>
      </el-badge>
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
      <el-menu-item class="food-sub" style="margin-right:30px;">
        <router-link to="/food">
         <a>Food</a>
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
<el-dialog
  :visible.sync="dialogCart"
  width="50%">
  <span>Total: {{ total + 'đ'}}</span>
  <hr />
  <el-row>
  <el-col :span="12" v-for="itemImg in dataStock" :key="itemImg.img" >
    <el-card :body-style="{ padding: '0px' }" class="showFood">
      <img :src="itemImg.img" class="image">
      <div style="padding: 10px;font-size:13px;">
        <span>{{ itemImg.name + ':' }}</span>
        <span>{{ itemImg.quatity + 'x' }}</span>
        <span>{{itemImg.money + 'đ'}}</span>
        <div class="bottom clearfix">
          <el-button size="mini" type="success" class="buttonLike">{{ itemImg.like + ' '}}+</el-button>
          <el-button size="mini" type="danger" class="buttonCan" @click="removeStockFood(itemImg.idFood)">XRemove</el-button>
        </div>
      </div>
    </el-card>
  </el-col>
</el-row>
  <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click="dialogCart = false">Cancel</el-button>
    <el-button size="mini" type="primary" @click="dialogCart = false">Confirm</el-button>
  </span>
</el-dialog>
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
      dialogCart: false,
      stock: 0,
      dataStock: [],
      total: 0
    }
  },
  created() {
    this.id = VueCookies.get('username')
    this.stock = JSON.parse(VueCookies.get('orderFoodOfUser')).length
    // this.dataStock = JSON.parse(VueCookies.get('orderFoodOfUser'))
    this.$store.dispatch('app/stockFoodUser', JSON.parse(VueCookies.get('orderFoodOfUser')))
    this.dataStock.forEach(e => {
      this.total += e.quatity * e.money
    })
    this.getData()
  },
  watch: {
    second() {
      if (VueCookies.get('pcName') !== null && !this.checkTime()) {
        this.convertTimeRemain()
      }
    },
    usernameReload() {
      this.id = VueCookies.get('username')
      if (this.usernameReload !== 'Noname') {
        this.getData()
      }
    },
    timeUseService() {
      if (this.timeUseService) {
        this.convertTimeRemain()
      }
    },
    stockFood() {
      if (this.stockFood.length !== 0) {
        this.stock = JSON.parse(VueCookies.get('orderFoodOfUser')).length
        this.dataStock = JSON.parse(VueCookies.get('orderFoodOfUser'))
        this.dataStock.forEach(e => {
          this.total += e.quatity * e.money
        })
      } else {
        this.stock = 0
        this.dataStock = []
        this.total = 0
      }
    }
  },
  computed: {
    ...mapGetters(['usernameReload', 'dataUserCurrent', 'timeUseService', 'stockFood']),
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
    clearCookie(name) {
      VueCookies.set(name.trim() + '', '', '0s')
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
    removeStockFood(id) {
      var temp = this.stockFood.filter(e => {
        return e.idFood !== id
      })
      this.$store.dispatch('app/stockFoodUser', temp)
      VueCookies.set('orderFoodOfUser', JSON.stringify(temp), '2h')
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
      var cookie = document.cookie.split(';')
      const dataLogout = this.dataUser
      console.log(VueCookies.get('pcName'))
      var db = firebase.firestore()
      if (VueCookies.get('pcName') !== null) {
        var sfDocRef = db.collection('Computer').doc(VueCookies.get('pcName'))
        db.runTransaction((transaction) => {
          return transaction.get(sfDocRef).then((sfDoc) => {
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
          if (!sfDoc.exists) {
            console.log('Document does not exist!')
          }
          const newStatusUser = false
          const newpcName = ''
          transaction.update(userDocRef, { status: newStatusUser, pcName: newpcName })
          for (var i = 0; i < cookie.length; i++) {
            this.clearCookie(cookie[i].split('=')[0])
          }
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
          this.$router.replace('/')
          this.$store.dispatch('app/usernameReload', this.usernameCurrent)
          this.$store.dispatch('app/stockFoodUser', [])
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
.food-sub {
   float: left;
  color: #f2f2f2;
  text-align: center;
  text-decoration: none;
  font-size: 17px;
}
.el-icon-shopping-cart-1 {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.showFood {
      margin-left: 5px;
  }
  .image {
    width: 350px;
    display: block;
    height: 150px;
  }

  .buttonLike {
    padding: 0;
    float: left;
  }
  .buttonCan {
    padding: 0;
    float: right;
  }
</style>
