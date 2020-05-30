<template>
    <div>
        <el-row :gutter="24">
        <el-col :span="3">
            <sidebar />
        </el-col>
            <el-col :span="21">
        <el-header>
           <Navbar />
        </el-header>
        <el-main>
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
export default {
  components: {
    Navbar,
    app,
    sidebar
  }
}
</script>

<style scoped>

</style>
