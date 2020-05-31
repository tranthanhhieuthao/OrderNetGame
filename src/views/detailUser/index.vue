<template>
    <div class="detailUserStyle">
      <el-form label-position="left" label-width="100px">
  <el-form-item label="Name">
    <el-input disabled v-model="dataUser.username"></el-input>
  </el-form-item>
  <el-form-item label="Email">
    <el-input disabled v-model="dataUser.email"></el-input>
  </el-form-item>
   <el-form-item label="Status">
    <el-input disabled v-model="dataUser.statusCurent"></el-input>
  </el-form-item>
  <el-form-item label="phoneNumber">
    <el-input disabled v-model="dataUser.phoneNumber"></el-input>
  </el-form-item>
  <el-form-item label="Pc">
    <el-input disabled v-model="dataUser.pcName"></el-input>
  </el-form-item>
</el-form>
    </div>
</template>

<script>
import firebase from 'firebase'
export default {
  data() {
    return {
      dataUser: {}
    }
  },
  created() {
    this.getDetail()
    console.log(this.$route.params.id)
  },
  methods: {
    getDetail() {
      var db = firebase.firestore()
      db.collection('User').doc(this.$route.params.id).get().then(res => {
        this.dataUser = res.data()
        this.convertStatus()
      })
    },
    convertStatus() {
      if (this.dataUser.status || this.dataUser.pcName !== 0) this.dataUser.statusCurent = 'Online'
      else this.dataUser.statusCurent = 'Offine'
    }
  }
}
</script>

<style scoped>
.detailUserStyle {
    width: 450px;
}
</style>
