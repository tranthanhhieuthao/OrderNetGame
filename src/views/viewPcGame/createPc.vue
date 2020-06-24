<template>
<el-tabs type="border-card">
  <el-tab-pane>
    <div class="createPcStyle">
<el-form status-icon  label-width="120px" class="demo-ruleForm">
  <el-form-item label="Name">
    <el-input v-model="registerPcGame.namePc"></el-input>
  </el-form-item>
  <el-form-item label="Ram">
    <el-input v-model="registerPcGame.Ram" autocomplete="off"></el-input>
  </el-form-item>
   <el-form-item label="Chip">
    <el-input v-model="registerPcGame.Chip" autocomplete="off"></el-input>
  </el-form-item>
   <el-form-item label="Win">
    <el-input v-model="registerPcGame.Win" autocomplete="off"></el-input>
  </el-form-item>
   <el-form-item label="Type">
    <el-select v-model="registerPcGame.type" placeholder="please select type">
      <el-option label="Vip" value="Vip"></el-option>
      <el-option label="Normal" value="Normal"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="Image">
      <el-input v-model="registerPcGame.img" autocomplete="off"></el-input>
    </el-form-item>
  <el-form-item>
    <el-button type="primary"  @keyup.13="register" @click="register">Submit</el-button>
  </el-form-item>
</el-form>
    </div>
  </el-tab-pane>
</el-tabs>
</template>

<script>
import firebase from 'firebase'
export default {
  data() {
    return {
      registerPcGame: {
        namePc: '',
        Ram: '',
        Chip: '',
        Win: '',
        type: '',
        img: 'https://maytinhgiakhanh.vn/wp-content/uploads/2019/11/IMG_2318-500x333.jpg',
        status: false
      }
    }
  },
  methods: {
    register() {
      var db = firebase.firestore()
      db.collection('Computer').doc(this.registerPcGame.namePc).set(this.registerPcGame)
        .then(() => {
          this.$notify({
            title: 'Success',
            message: 'Đăng kí máy thành công',
            type: 'success',
            position: 'bottom-right'
          })
        })
    }
  }
}
</script>

<style scoped>
.createPcStyle {
  width: 500px;
}
</style>
