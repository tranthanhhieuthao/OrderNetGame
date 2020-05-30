<template>
    <div>
        <el-row>
  <el-col :span="8" v-for="item of listPc" :key="item.namePc">
        <el-card :body-style="{ padding: '0px' }" shadow="hover" class="showPC">
      <img :src="item.img" class="image">
      <div style="padding: 14px;">
        <span>{{item.namePc}}</span>
        <div class="bottom clearfix">
          <el-button type="text" class="button">Đặt chỗ</el-button>
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
      listPc: []
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
