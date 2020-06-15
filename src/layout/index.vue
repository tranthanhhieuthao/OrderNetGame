<template>
    <div class="mainStyle">
        <el-row :gutter="24">
        <el-col :span="3">
            <sidebar />
        </el-col>
            <el-col :span="21">
        <el-header>
           <Navbar />
        </el-header>
        <el-main >
        <app />
        </el-main>
        </el-col>
        </el-row>
    </div>
</template>

<script>
import Navbar from '@/layout/components/Navbar'
import sidebar from '@/layout/components/sidebar'
import app from '@/App'
import ResizeMixin from '@/layout/mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  components: {
    Navbar,
    app,
    sidebar
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
 background-image: url('https://thietbiketnoi.com/wp-content/uploads/2020/01/tong-hop-hinh-nen-background-vector-designer-dep-do-phan-giai-fhd-2k-4k-moi-nhat-3-scaled.jpg');
 background-repeat: no-repeat;
}
</style>
