<template>
    <div>
        <el-row >
  <el-col :span="8" v-for="item of listPc" :key="item.id">
        <el-card :body-style="{ padding: '0px' }" shadow="hover" class="showPC">
      <img :src="item.img" class="image">
      <div style="padding: 14px;">
        <span>{{item.namePc}}: </span>
        <span>{{item.statusConvert}}</span>
        <div class="bottom clearfix">
          <el-button type="text" v-if="!item.status" class="button" @click="OderPc(item.namePc)">Đặt chỗ</el-button>
          <el-button type="text" v-else class="button" @click="cancellOderPc(item.namePc)">Hủy</el-button>
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
      resData: null
    }
  },
  mounted() {
    this.getListPc()
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
            message: 'You aldready order, please cancel your pc picked before',
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
            message: 'Oder success',
            type: 'success',
            position: 'bottom-right'
          })
          VueCookies.get('pcName', pcName)
          this.$store.dispatch('app/timeUseServiceCurrent', true)
        } else {
          this.$notify({
            title: 'chỗ đã được đặt',
            message: 'Oder fail',
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
          message: 'Cancel success',
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
    height: 300px;
}
.showPC {
    margin: 5px;
}
</style>
