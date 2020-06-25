<template>
    <div>
      <el-carousel :interval="4000" type="card" height="400px">
    <el-carousel-item v-for="item in listDiscount" :key="item.id">
      <img :src="item.img" width="auto;"/>
    </el-carousel-item>
  </el-carousel>
  <div class="navbarGame">
  <el-menu class="el-menu-demo" mode="horizontal">
  <el-menu-item style="background : rgba(0,0,0,0);">
    <el-input placeholder="Nhập từ khóa tìm kiếm" v-model="select" class="input-with-select">
    <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input>
  </el-menu-item>
  <el-menu-item  style="background : rgba(0,0,0,0);">
      <el-select v-model="value"  clearable placeholder="Trạng thái">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  </el-menu-item>
  <el-menu-item style="background : rgba(0,0,0,0);">
    <el-tooltip content="LIST" placement="top"><i class="el-icon-s-grid" @click="typeGridOrList = false" /></el-tooltip>
    <el-tooltip content="GRID" placement="top"><i class="el-icon-menu" @click="typeGridOrList = true" /></el-tooltip>
  </el-menu-item>
  </el-menu>
  </div>
  <div v-if="typeGridOrList">
        <el-row>
  <el-col class="displayDestop" :span="6" v-for="item of listPc" :key="item.id">
        <el-card :body-style="{ padding: '1px' }" shadow="hover" class="showPC">
      <img :src="item.img" class="image">
      <div style="padding: 5px;">
        <span>{{item.namePc}}: </span>
        <span>{{item.statusConvert}}</span>
        <div class="bottom clearfix">
          <el-button type="success" v-if="!item.status" class="button" @click="OderPc(item.namePc)">Đặt chỗ</el-button>
          <el-button type="warning" v-if="item.status && checkDisable()" class="button" @click="cancellOderPc(item.namePc)">Hủy</el-button>
          <el-button type="warning" v-if="item.status && !checkDisable()" class="button">Có người đã dùng</el-button>
        </div>
      </div>
    </el-card>
  </el-col>
    <el-col class="displayMobile" :span="12" v-for="item of listPc" :key="item.id">
        <el-card :body-style="{ padding: '1px' }" shadow="hover" class="showPC">
      <img :src="item.img" class="imageMobile">
      <div style="padding: 1px;font-size:9px;">
        <span>{{item.namePc}}: </span>
        <span>{{item.statusConvert}}</span>
        <div class="bottom clearfix">
          <el-button type="success" size="mini" v-if="!item.status" class="button" @click="OderPc(item.namePc)">Đặt chỗ</el-button>
          <el-button type="warning" size="mini" v-else class="button" @click="cancellOderPc(item.namePc)">Hủy</el-button>
        </div>
      </div>
    </el-card>
  </el-col>
        </el-row>
  </div>
    <div v-else>
     <el-table
    :data="listPc"
    style="width: 100%;"
    max-height="320">
     <el-table-column
      prop="namePc"
      label="Name"
      min-width="150" />
      <el-table-column
      prop="statusConvert"
      label="Status"
      min-width="150" />
      <el-table-column
      prop="type"
      label="Type"
      min-width="150" />
      <el-table-column
      prop="Chip"
      label="Chip"
      min-width="150" />
      <el-table-column
      prop="Ram"
      label="Ram"
      min-width="150" />
      <el-table-column
      prop="Win"
      label="Win"
      width="150" />
    <el-table-column
      fixed="right"
      label="Action"
      width="120">
      <template slot-scope="scope">
        <el-button
          v-if="!scope.row.status"
          @click="OderPc(scope.row.namePc)"
          type="success"
          size="small">
          Đặt chỗ
        </el-button>
        <el-button
          v-else
          @click="cancellOderPc(scope.row.namePc)"
          type="warning"
          size="small">
          Hủy
        </el-button>
      </template>
    </el-table-column>
     </el-table>
    </div>
    </div>
</template>

<script>
import firebase from 'firebase'
import VueCookies from 'vue-cookies'
export default {
  data() {
    return {
      listPc: [],
      usernameOder: '',
      order: true,
      resData: null,
      listDiscount: [],
      resDataDiscount: null,
      select: '',
      typeGridOrList: true,
      options: [
        {
          label: 'Đang tắt',
          value: false
        },
        {
          label: 'Đang hoạt động',
          value: true
        }
      ],
      value: ''
    }
  },
  mounted() {
    this.getListPc()
    this.getListDiscount()
    this.checkDisable()
  },
  watch: {
    resData() {
      this.changeList()
    },
    value() {
      this.changeList()
    },
    select() {
      this.changeList()
    }
  },
  methods: {
    getListPc() {
      this.listPc = []
      var computerDoc = firebase.firestore().collection('Computer')
      computerDoc.onSnapshot(res => {
        this.resData = res
        this.changeList()
      })
    },
    getListDiscount() {
      this.listDiscount = []
      var db = firebase.firestore()
      db.collection('Discount').onSnapshot(res => {
        this.resDataDiscount = res
        this.changeListDiscount()
      })
    },
    changeListDiscount() {
      var temp = []
      this.resDataDiscount.forEach(e => temp.push(e.data()))
      this.listDiscount = temp
    },
    changeList() {
      var temp = []
      this.resData.forEach(e => temp.push(e.data()))
      this.listPc = temp
      if (this.value !== '' || this.select !== '') {
        this.listPc = this.listPc.filter(e => {
          if (this.value !== '' && this.select !== '') {
            return e.status === this.value && e.namePc.toUpperCase().includes(this.select.toUpperCase())
          } else if (this.value !== '' && this.select === '') {
            return e.status === this.value
          } else if (this.value === '' && this.select !== '') {
            return e.namePc.toUpperCase().includes(this.select.toUpperCase())
          }
        })
      }
      this.listPc.forEach(e => {
        if (!e.status) e.statusConvert = 'Đang tắt'
        else if (e.status && this.checkDisable()) e.statusConvert = 'Đang hoạt động'
        else if (e.status && !this.checkDisable()) e.statusConvert = 'Có người khác sử dụng'
      })
    },
    checkDisable() {
      if (VueCookies.get('pcName') === null) return false
      var namePcCurrent = this.listPc.find(e => {
        return e.namePc.includes(VueCookies.get('pcName'))
      })
      if (namePcCurrent.nameUse.includes(VueCookies.get('username'))) return true
      else return false
    },
    async OderPc(pcName) {
      try {
        const db = firebase.firestore()
        const docpcName = db.collection('Computer').doc(pcName)
        if (VueCookies.get('pcName') !== pcName && VueCookies.get('pcName') !== null) {
          console.log(VueCookies.get('pcName'))
          this.$notify({
            title: 'warning',
            message: 'Bạn đã đặt chỗ, vui lòng hủy máy bạn đặt trước đó',
            type: 'warning',
            position: 'bottom-right'
          })
          return 0
        }
        VueCookies.set('pcName', pcName, '2h')
        const res = await docpcName.get()
        if (!res.data().status) {
          await db.collection('User').doc(VueCookies.get('username')).update('pcName', pcName)
          await docpcName.update('status', true)
          await docpcName.update('nameUse', VueCookies.get('username'))
          await docpcName.update('disable', true)
          this.$notify({
            title: 'Success',
            message: 'Đặt chỗ thành công',
            type: 'success',
            position: 'bottom-right'
          })
          VueCookies.get('pcName', pcName)
          this.$store.dispatch('app/timeUseServiceCurrent', true)
        } else {
          this.$notify({
            title: 'chỗ đã được đặt',
            message: 'Đặt chỗ lỗi',
            type: 'warning',
            position: 'bottom-right'
          })
        }
      } catch (er) {
        console.log(er)
      }
    },
    async cancellOderPc(pcName) {
      try {
        const db = firebase.firestore()
        const docpcName = db.collection('Computer').doc(pcName)
        VueCookies.set('pcName', '', '2h')
        await db.collection('User').doc(VueCookies.get('username')).update('pcName', '')
        await docpcName.update('status', false)
        await docpcName.update('nameUse', '')
        await docpcName.update('disable', false)
        this.$notify({
          title: 'Success',
          message: 'Hủy đặt máy thành công',
          type: 'success',
          position: 'bottom-right'
        })
        this.$store.dispatch('app/timeUseServiceCurrent', false)
      } catch (er) {
        console.log(er)
      }
    }
  }

}
</script>

<style lang="scss" scoped>
@media only screen and (min-width: 965px) {
.image {
    width: 300px;
}
.showPC {
    margin: 10px;
}
  .el-carousel__item img {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    margin: 0;
    width: auto;
    height: 400px;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .button {
    float: right;
  }
  .el-menu-demo {
    background : rgba(0,0,0,0);
  }
  .el-icon-s-grid {
    margin-left: 10px;
    font-size: 2.40em;
  }
  .el-icon-menu {
    font-size: 2.40em;
    margin-left: 10px;
  }
  .displayMobile {
    display: none;
  }
}
  @media only screen and (max-width: 965px) {
    .displayDestop {
    display: none;
  }
  .el-menu-demo {
    background : rgba(0,0,0,0);
  }
   .el-icon-s-grid {
    margin-left: 10px;
    font-size: 1.40em;
  }
  .el-icon-menu {
    font-size: 1.40em;
    margin-left: 10px;
  }
  .imageMobile {
    width: 200px;
}
.button {
    float: right;
    width: auto;
    height: 25px;
  }
  }
</style>
