<template>
    <div>
        <el-row :gutter="24">
        <el-col :span="2">
            sidebar
        </el-col>
            <el-col :span="22">
        <el-header>
           <Navbar />
        </el-header>
        <el-main>
        <app />
        </el-main>
        <el-footer style="background:gray;margin-top:350px;">
            footer
        </el-footer>
        </el-col>
        </el-row>
    </div>
</template>

<script>
import Navbar from '@/layout/components/Navbar'
import app from '@/App'
export default {
    components: {
        Navbar,
        app
    }
}
</script>

<style scoped>

</style>