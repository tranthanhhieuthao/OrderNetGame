<template>
    <div class="mainStyle">
        <el-row :gutter="24">
          <el-col :span="20" :offset="2">
            <div>
        <el-header>
           <Navbar class="navbar" />
        </el-header>
        <el-main >
        <app />
        </el-main>
            </div>
          </el-col>
        </el-row>
    </div>
</template>

<script>
import Navbar from '@/layout/components/Navbar'
import app from '@/App'
import ResizeMixin from '@/layout/mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  components: {
    Navbar,
    app
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  }
}
</script>

<style scoped>
.mainStyle {
 background-image: url('https://ngockhangit93com.files.wordpress.com/2016/02/131120hinh-nen-nhung-hoa-tiet-trang-tri-mau-xanh-den-danh-cho-wesite.jpg');
 /* background-repeat: no-repeat; */
 min-height: 910px;
}
</style>
