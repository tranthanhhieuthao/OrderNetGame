<template>
    <div>
        <el-row>
  <el-col :span="8" v-for="item of listPc" :key="item.namePc">
        <el-card :body-style="{ padding: '0px' }" shadow="hover" class="showPC">
      <img :src="item.img" class="image">
      <div style="padding: 14px;">
        <span>{{item.namePc}}: </span>
        <span>{{item.statusConvert}}</span>
        <div class="bottom clearfix">
          <el-button type="text" class="button" @click="OderPc(item.namePc)">Đặt chỗ</el-button>
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
      order: false
    }
  },
  mounted() {
    this.getListPc()
  },
  methods: {
    getListPc() {
      this.listPc = []
      var db = firebase.firestore()
      db.collection('Computer').get().then(res => {
        res.forEach(e => this.listPc.push(e.data()))
        this.ConvertStstusPc()
      })
    },
    OderPc(pcName) {
      var db = firebase.firestore()
      var docpcName = db.collection('Computer').doc(pcName)
      docpcName.get().then(res => {
        if (!res.data().status) {
          db.collection('User').doc(VueCookies.get('username')).update('pcName', pcName).then(() => {
            docpcName.update('status', true).then(() => {
              this.$notify({
                title: 'Success',
                message: 'Oder success',
                type: 'success',
                position: 'bottom-right'
              })
              this.getListPc()
            })
          })
        } else {
          this.$notify({
            title: 'chỗ đã được đặt',
            message: 'Oder fail',
            type: 'warning',
            position: 'bottom-right'
          })
        }
      })
    },
    ConvertStstusPc() {
      this.listPc.forEach(e => {
        if (e.status) e.statusConvert = 'Đang hoạt động'
        else e.statusConvert = 'Đang tắt'
      })
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
