<template>
    <div>
<el-menu
  class="el-menu-demo"
  mode="horizontal"
  background-color="#545c64"
  text-color="#fff"
  key="menuKey"
  active-text-color="#ffd04b">
      <el-dropdown class="dropUser" size="small" split-button type="info" plain >
        {{usernameReload}}
  <el-dropdown-menu class="dropUserMenu" slot="dropdown">
    <el-dropdown-item>
     <router-link to="/">
     <i class="el-icon-user-solid">Login</i>
      </router-link>
    </el-dropdown-item>
    <el-dropdown-item >
      <i class="el-icon-remove-outline" @click="logout">Logout</i>
    </el-dropdown-item>
      <el-dropdown-item>
        <router-link :to="{path: `/detail`, params: {id: id}}" >
         <a>Chi tiết</a>
          </router-link>
      </el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
    <el-menu-item  class="listpc-sub" style="margin-right:30px;float:right;">
      <el-badge v-model="stock" class="item" type="primary" >
         <a class="el-icon-shopping-cart-1" @click="dialogCart = true">Cart</a>
      </el-badge>
       <i class="el-icon-shopping-cart-2" @click="dialogCart = true" />
      </el-menu-item>
     <el-menu-item index="2" class="listpc-sub" style="margin-right:30px;">
        <router-link to="/listPc">
         <a class="textPc">Danh sách máy</a>
         <i class="el-icon-s-platform" />
          </router-link>
      </el-menu-item>
      <el-menu-item index="4" class="food-sub" style="margin-right:30px;">
        <router-link to="/food">
         <a class="textFood">Đồ ăn</a>
         <i class="el-icon-food" />
          </router-link>
      </el-menu-item>
      <el-menu-item index="5" class="LogoutMobile" style="margin-right:30px;">
         <i class="el-icon-remove-outline" @click="logout" />
      </el-menu-item>
      <el-menu-item index="4" class="detailMobile" style="margin-right:30px;">
        <router-link :to="{path: `/detail`, params: {id: id}}" >
         <i class="el-icon-user-solid" />
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
          <i class="el-icon-setting">Tạo mới</i>
          </router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <router-link to="/showUser">
          <i class="el-icon-menu">Danh sách user</i>
          </router-link>
        </el-dropdown-item>
      </el-dropdown-menu>
       </el-dropdown>
    </el-menu-item>
    <el-menu-item class="clock">
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
  <table>
  <tr>
    <td>Money:</td>
    <td>{{ dataUser.moneyForFood + 'đ'}}</td>
  </tr>
  <tr>
    <td>Total:</td>
    <td>{{ total + 'đ'}}</td>
  </tr>
  <tr>
    <td>Remain:</td>
    <td>{{ dataUser.moneyForFood-total + 'đ'}}</td>
  </tr>
  </table>
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
    <el-button size="mini" @click="dialogCart = false">Hủy</el-button>
    <el-button size="mini" type="primary" @click="confirmOrderFood">Xác nhận</el-button>
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
    if (VueCookies.get('orderFoodOfUser') !== null) {
      this.stock = JSON.parse(VueCookies.get('orderFoodOfUser')).length
    } else this.stock = 0
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
      this.total = 0
      if (this.stockFood !== null) {
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
    }
  },
  computed: {
    ...mapGetters(['usernameReload', 'dataUserCurrent', 'timeUseService', 'stockFood', 'device']),
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
    confirmOrderFood() {
      var db = firebase.firestore()
      var sfDocRef = db.collection('User').doc(VueCookies.get('username'))
      if (this.dataUser.moneyForFood - this.total < 0) {
        this.$notify({
          title: 'Warning',
          message: 'Số tiền trong tài khoản không đủ, vui lòng bớt sản phẩm trong giỏ',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        db.runTransaction(transaction => {
          return transaction.get(sfDocRef).then(sfDoc => {
            if (!sfDoc.exists) {
              console.log('Document nt exist!')
            }
            const newRemainMoney = this.dataUser.moneyForFood - this.total
            transaction.update(sfDocRef, { moneyForFood: newRemainMoney })
            this.dialogCart = false
          })
        }).then(() => {
          this.$notify({
            title: 'Success',
            message: 'Đặt hàng thành công',
            type: 'success',
            position: 'bottom-right'
          })
          this.$store.dispatch('app/stockFoodUser', [])
          VueCookies.set('orderFoodOfUser', '', '4h')
        }).catch((error) => {
          console.log('Transaction failed: ', error)
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
    removeStockFood(id) {
      var temp = this.stockFood.filter(e => {
        return e.idFood !== id
      })
      this.$store.dispatch('app/stockFoodUser', temp)
      VueCookies.set('orderFoodOfUser', JSON.stringify(temp), '4h')
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
@media only screen and (min-width: 965px) {
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
.food-sub a{
   float: left;
  text-align: center;
  text-decoration: none ;
  color: #FFFFFF;
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
.el-icon-s-platform {
  display: none;
}
.el-icon-food {
  display: none;
}
.el-icon-shopping-cart-2 {
  display: none;
}
.LogoutMobile {
  display: none;
}
.detailMobile {
  display: none;
}
.dropUser {
  float: right;
  margin-top:15px;
  margin-right:15px;
}
}
@media only screen and (max-width: 965px) {
  /* For mobile phones: */
.el-menu.el-menu--horizontal {
    display: flex;
    width: auto;
}
.textPc {
  display: none;
}
.textFood {
  display: none;
}
.buttonLike {
    padding: 0;
    float: left;
  }
.buttonCan {
    padding: 0;
    float: left;
  }
.el-menu-demo {
    width: 300px;
    display: flex;
  }
.el-icon-shopping-cart-1 {
  display: flex;
  justify-content: center;
  margin-top: 2px;
}
.listpc-sub {
  margin-left: 1px;
  padding: 0px;
}
.food-sub {
  margin-left: 1px;
  padding: 0px;
}
.dropUser {
  display: none;
}
.dropUserMenu {
  display: none;
}
.clock {
  display: none;
}
.el-icon-shopping-cart-1 {
  display: none;
}
.item {
  display: none;
}
.LogoutMobile {
  padding: 0px;
  margin-left:1px;
}
.detailMobile {
  padding: 0px;
  margin-left:1px;
}
.element.style {
  display: none;
}
.el-menu--horizontal {
    outline: 0;
    color: #303133;
    display: none;
}
}
</style>
