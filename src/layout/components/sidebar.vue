<template>
    <div>
        <el-menu
        v-if="device !== 'mobile'"
      class="el-menu-vertical"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-submenu index="1" class="admin-sub">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>Admin</span>
        </template>
          <el-menu-item index="1-1" >
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
      <el-menu-item index="2" class="listpc-sub">
        <span><router-link to="/listPc">
         <i class="el-icon-document"> List PC</i>
          </router-link></span>
      </el-menu-item>
       <el-menu-item index="3" class="setting-sub">
        <span><router-link :to="{path: `/detail`, params: {id: id}}" >
         <i class="el-icon-setting"> Detail</i>
          </router-link></span>
      </el-menu-item>
    </el-menu>
    <el-menu
      v-else
      class="el-menu-vertical"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
       <el-submenu index="1" class="admin-sub">
        <template slot="title">
          <i class="el-icon-location"></i>
        </template>
          <el-menu-item index="1-1" >
            <span><router-link to="/createPc">
         <i class="el-icon-setting" />
          </router-link></span>
          </el-menu-item>
          <el-menu-item index="1-2">
            <span><router-link to="/showUser">
         <i class="el-icon-menu" />
          </router-link></span>
          </el-menu-item>
      </el-submenu>
      <el-menu-item index="2" class="listpc-sub">
        <span><router-link to="/listPc">
         <i class="el-icon-document" />
          </router-link></span>
      </el-menu-item>
       <el-menu-item index="3" class="setting-sub">
        <span><router-link :to="{path: `/detail`, params: {id: id}}" >
         <i class="el-icon-setting" />
          </router-link></span>
      </el-menu-item>
    </el-menu>
    </div>
</template>

<script>
import VueCookies from 'vue-cookies'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      id: VueCookies.get('username'),
      showBtnAd: true
    }
  },
  computed: {
    ...mapGetters(['device'])
  },
  created() {
    console.log(this.device)
    this.id = VueCookies.get('username')
  }
}
</script>

<style scoped>
.el-menu-vertical {
    height:900px;
    justify-content:left;
    align-content: inherit;
}
.admin-sub {
  margin-left: 0px;
}
.listpc-sub {
  margin-left: 0px;
}
.setting-sub {
  margin-left: 0px;
}
</style>
