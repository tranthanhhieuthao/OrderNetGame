<template>
    <div>
        <el-carousel :interval="4000" type="card" height="400px">
    <el-carousel-item v-for="itemImg in dataImage" :key="itemImg">
      <img :src="getImgUrl(itemImg)" width="800px;"/>
    </el-carousel-item>
  </el-carousel>
    </div>
</template>

<script>
export default {
  data() {
    return {
      dataImage: []
    }
  },
  created() {
    this.dataImage = [
      'food1', 'food2',
      'food3', 'food4',
      'food5', 'food6'
    ]
  },
  methods: {
    getImgUrl(pet) {
      var images = require.context('@/assets/', false, /\.jpg$/)
      return images('./' + pet + '.jpg')
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
</style>
