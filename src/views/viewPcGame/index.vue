<template>
    <div>
        <el-row>
  <el-col :span="8" v-for="item of listPc" :key="item.namePc">
        <el-card :body-style="{ padding: '0px' }" shadow="hover" class="showPC">
      <img :src="item.img" class="image">
      <div style="padding: 14px;">
        <span>{{item.namePc}}</span>
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
export default {
  data() {
    return {
      listPc: [],
      usernameOder: ''
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
      })
    },
    OderPc(pcName) {
      console.log(pcName)
      var db = firebase.firestore()
      var user = firebase.auth().currentUser
      console.log(user.email)
      db.collection('User').where('email', '==', user.email).get().then(res => {
        res.forEach(e => {
          db.collection('User').doc(e.id).update('pcName', pcName).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Oder success',
              type: 'success',
              position: 'bottom-right'
            })
          })
        })
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
