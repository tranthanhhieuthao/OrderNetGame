<template>
<el-tabs type="border-card" class="card">
  <el-tab-pane label="Thêm PC">
    <div class="createPcStyle">
<el-form status-icon  label-width="50px" class="demo-ruleForm">
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
    <el-button type="primary"  @keyup.13="register" @click="register">Đăng kí</el-button>
  </el-form-item>
</el-form>
    </div>
  </el-tab-pane>

  <el-tab-pane label="Khuyến mãi">
        <div class="createPcStyle">
<el-form status-icon  label-width="50px" class="demo-ruleForm">
  <el-form-item label="Id">
      <el-input v-model="idDiscount" autocomplete="off"></el-input>
    </el-form-item>
  <el-form-item label="Type">
      <el-input v-model="registerDiscount.type" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="Name">
      <el-input v-model="registerDiscount.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="Image">
      <el-input v-model="registerDiscount.img" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item>
    <el-button type="primary" @click="registerDiscountForGamer">Đăng kí</el-button>
  </el-form-item>
</el-form>
        </div>
  </el-tab-pane>

   <el-tab-pane label="Thêm đồ ăn">
        <div class="createPcStyle">
<el-form status-icon  label-width="50px" class="demo-ruleForm">
  <el-form-item label="Id">
      <el-input v-model="idDiscount" autocomplete="off"></el-input>
    </el-form-item>
  <el-form-item label="IdFood">
      <el-input v-model="idFood" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="Name">
      <el-input v-model="registerFood.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="Image">
      <el-input v-model="registerFood.img" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item>
    <el-button type="primary" @click="registerFoodForGamer">Đăng kí</el-button>
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
        status: false,
        nameUse: '',
        disable: false
      },
      registerDiscount: {
        name: '',
        type: '',
        img: ''
      },
      idDiscount: '',
      registerFood: {
        name: '',
        money: 0,
        like: 0,
        img: ''
      },
      idFood: ''
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
    },
    registerDiscountForGamer() {
      var db = firebase.firestore()
      db.collection('Discount').doc(this.idDiscount).set(this.registerDiscount)
        .then(() => {
          this.$notify({
            title: 'Success',
            message: 'Thêm khuyến mãi thành công',
            type: 'success',
            position: 'bottom-right'
          })
        })
    },
    registerFoodForGamer() {
      var db = firebase.firestore()
      db.collection('Food').doc(this.idFood).set(this.registerFood)
        .then(() => {
          this.$notify({
            title: 'Success',
            message: 'Thêm đồ ăn thành công',
            type: 'success',
            position: 'bottom-right'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.createPcStyle {
  width: 500px;
  box-shadow:0 12px 15px 0 rgba(0,0,0,.24),0 17px 50px 0 rgba(0,0,0,.19);
  padding: 5px;
  visibility: visible;
  font-weight: bolder;
  & .el-input {
   display: inline;
  }
}
.card {
  /* box-shadow:0 12px 15px 0 rgba(0,0,0,.24),0 17px 50px 0 rgba(0,0,0,.19); */
  background : rgba(0,0,0,0);
  border: 0px;
}
</style>
