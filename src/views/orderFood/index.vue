<template>
<div class="contain">
        <el-carousel :interval="4000" type="card" class="carouselDesktop" >
    <el-carousel-item v-for="itemImg in foodPopular" :key="itemImg.img">
      <img :src="itemImg.img" class="imgDesktop" />
    </el-carousel-item>
  </el-carousel>
<div>
    <el-row>
  <el-col :span="6" class="sixDisplay" v-for="itemImg in listFood" :key="itemImg.img" >
    <el-card :body-style="{ padding: '0px' }" class="showFood">
      <img :src="itemImg.img" class="image">
      <div style="padding: 14px;font-size:13px;">
        <span>{{ itemImg.name + ':' }}</span>
        <span>{{itemImg.money + 'đ'}}</span>
        <div class="bottom clearfix">
          <el-button type="primary" class="button" @click="handlePick(itemImg)">Order</el-button>
          <el-button type="success" class="buttonLike">{{ itemImg.like + ' '}}+</el-button>
        </div>
      </div>
    </el-card>
  </el-col>
  <el-col :span="12" class="eightDisplay" v-for="itemImg in listFood" :key="itemImg.id" >
    <el-card :body-style="{ padding: '0px' }" class="showFood">
      <img :src="itemImg.img" class="imageMobile">
      <div style="padding: 5px;font-size:8px;">
        <span>{{ itemImg.name + ':' }}</span>
        <span>{{itemImg.money + 'đ'}}</span>
        <div class="bottom clearfix">
          <el-button type="primary" size="mini" class="buttonMobile" @click="handlePick(itemImg)">Order</el-button>
          <el-button type="success" size="mini" class="buttonLikeMobile">{{ itemImg.like + ' '}}+</el-button>
        </div>
      </div>
    </el-card>
  </el-col>
</el-row>
</div>
<el-dialog
  :visible.sync="dialogOrder"
  width="20%"
 >
  <span>Số lượng</span>
  <hr />
  <el-form>
      <el-input type="number"  style="width:150px;" v-model="quatityFood" />
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogOrder = false">Hủy</el-button>
    <el-button type="primary" @click="oderFood">Xác nhận</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
import firebase from 'firebase'
import VueCookies from 'vue-cookies'
export default {
  data() {
    return {
      resData: null,
      listFood: [],
      foodPopular: [],
      dialogOrder: false,
      quatityFood: 0,
      tempFood: {},
      saveDataFoodCookie: {},
      orderTemp: []
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
      })
    },
    getListFood() {
      var temp = []
      var tempPopular = []
      var tempId = []
      var countPopular = 0
      this.resData.forEach(e => {
        if (e.data().like > 20) tempPopular.push(e.data())
        temp.push(e.data())
        tempId.push(e.id)
      })
      this.listFood = temp
      this.foodPopular = tempPopular
      for (let i = 0; i < this.listFood.length; i++) {
        if (this.listFood[i].like > 20) {
          this.foodPopular[countPopular].idFood = tempId[i]
          countPopular++
        }
        this.listFood[i].idFood = tempId[i]
      }
    },
    handlePick(food) {
      this.tempFood = food
      this.dialogOrder = true
    },
    oderFood() {
      this.saveDataFoodCookie = {}
      this.dialogOrder = false
      this.saveDataFoodCookie = {...this.tempFood, ...{ quatity: parseInt(this.quatityFood) }}
      if (VueCookies.get('orderFoodOfUser') !== null) {
        this.orderTemp = [...JSON.parse(VueCookies.get('orderFoodOfUser'))]
      }
      this.orderTemp.push(this.saveDataFoodCookie)
      VueCookies.set('orderFoodOfUser', JSON.stringify(this.orderTemp), '4h')
      this.$store.dispatch('app/stockFoodUser', this.orderTemp)
      this.quatityFood = 0
      this.$notify({
        title: 'Success',
        message: 'Thêm vào giỏ hàng thành công',
        type: 'success',
        position: 'bottom-right'
      })
    }

  }
}
</script>

<style lang="scss" scoped>
 @media only screen and (min-width: 965px) {
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

  .buttonLike {
    padding: 0;
    float: left;
  }

  .image {
    width: 350px;
    display: block;
    height: 200px;
  }

  .showFood {
      margin: 15px;
  }
  .dialog-footer {
      display: flex;
      justify-content: center;
  }
  .eightDisplay {
        display: none;
      }
  .imgDesktop {
    width:800px ;
  }
  .carouselDesktop {
   height: 400px;
  }
 }
@media only screen and (max-width: 965px) {
  .sixDisplay {
    display: none;
  }
  .imageMobile {
     width: 150px;
     display: block;
     height: 100px;
  }
  .imgDesktop {
    width:620px ;
  }
  .carouselDesktop {
    height: 400px;
  }
  .buttonMobile {
    padding: 0;
    float: right;
  }
  .buttonLikeMobile {
    padding: 0;
    float: left;
  }
    }
</style>
