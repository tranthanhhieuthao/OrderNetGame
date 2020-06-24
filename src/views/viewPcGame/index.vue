<template>
    <div>
      <el-carousel :interval="4000" type="card" height="400px">
    <el-carousel-item v-for="item in listDiscount" :key="item">
      <img :src="item.img" width="auto;"/>
    </el-carousel-item>
  </el-carousel>
        <el-row >
  <el-col :span="8" v-for="item of listPc" :key="item.id">
        <el-card :body-style="{ padding: '1px' }" shadow="hover" class="showPC">
      <img :src="item.img" class="image">
      <div style="padding: 5px;">
        <span>{{item.namePc}}: </span>
        <span>{{item.statusConvert}}</span>
        <div class="bottom clearfix">
          <el-button type="success" v-if="!item.status" class="button" @click="OderPc(item.namePc)">Đặt chỗ</el-button>
          <el-button type="warning" v-else class="button" @click="cancellOderPc(item.namePc)">Hủy</el-button>
        </div>
      </div>
    </el-card>
  </el-col>
        </el-row>
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
      resDataDiscount: null
    }
  },
  mounted() {
    this.getListPc()
    this.getListDiscount()
  },
  watch: {
    resData() {
      this.changeList()
    }
  },
  methods: {
    getListPc() {
      this.listPc = []
      var db = firebase.firestore()
      db.collection('Computer').onSnapshot(res => {
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
      this.listPc.forEach(e => {
        if (e.status) e.statusConvert = 'Đang hoạt động'
        else e.statusConvert = 'Đang tắt'
      })
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

<style scoped>
.image {
    width: 450px;
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
</style>
