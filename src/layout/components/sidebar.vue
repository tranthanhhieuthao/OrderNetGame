<template>
    <div>
        <el-menu
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>Admin</span>
        </template>
          <el-menu-item index="1-1">
            <span><router-link to="/createPc">
         <i class="el-icon-setting"> Create PC</i>
          </router-link></span>
          </el-menu-item>
          <el-menu-item index="1-2">
            <span><router-link to="/showUser">
         <i class="el-icon-menu"> List User</i>
          </router-link></span>
          </el-menu-item>
      </el-submenu>
      <el-menu-item index="2">
        <span><router-link to="/listPc">
         <i class="el-icon-document"> List PC</i>
          </router-link></span>
      </el-menu-item>
       <el-menu-item index="3">
        <span><router-link :to="{path: `/detail/${id}`}" >
         <i class="el-icon-setting"> Detail</i>
          </router-link></span>
      </el-menu-item>
    </el-menu>
    </div>
</template>

<script>
import VueCookies from 'vue-cookies'
export default {
  data() {
    return {
      id: '',
      showBtnAd: true
    }
  },
  created() {
    this.id = VueCookies.get('username')
  }
}
</script>

<style scoped>
.el-menu-vertical-demo {
    height:900px;
}
</style>
