<template>
<div class="contain">
        <el-carousel :interval="4000" type="card" height="400px">
    <el-carousel-item v-for="itemImg in foodPopular" :key="itemImg.img">
      <img :src="itemImg.img" width="800px;"/>
    </el-carousel-item>
  </el-carousel>
<div>
    <el-row>
  <el-col :span="6" v-for="itemImg in listFood" :key="itemImg.img" >
    <el-card :body-style="{ padding: '0px' }" class="showFood">
      <img :src="itemImg.img" class="image">
      <div style="padding: 14px;">
        <span>Yummy hamburger</span>
        <div class="bottom clearfix">
          <el-button type="text" class="button">Operating</el-button>
        </div>
      </div>
    </el-card>
  </el-col>
</el-row>
</div>
</div>
</template>

<script>
import firebase from 'firebase'
export default {
  data() {
    return {
      resData: null,
      listFood: [],
      foodPopular: []
    }
  },
  mounted() {
    this.getDataFood()
  },
  methods: {
    // getImgUrl(pet) {
    //   var images = require.context('@/assets/', false, /\.jpg$/)
    //   return images('./' + pet + '.jpg')
    // },
    getDataFood() {
      var db = firebase.firestore()
      db.collection('Food').onSnapshot(res => {
        this.resData = res
        this.getListFood()
        console.log(this.foodPopular)
        console.log(this.listFood)
      })
    },
    getListFood() {
      var temp = []
      var tempPopular = []
      this.resData.forEach(e => {
        if (e.data().like > 10) tempPopular.push(e.data())
        temp.push(e.data())
      })
      this.listFood = temp
      this.foodPopular = tempPopular
    }

  }
}
</script>

<style scoped>
  .el-carousel__item img {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 400px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 350px;
    display: block;
    height: 200px;
  }

  .showFood {
      margin: 15px;
  }
</style>
