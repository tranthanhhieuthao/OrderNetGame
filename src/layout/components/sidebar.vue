<template>
    <div>
        <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>Navigator One</span>
        </template>
        <el-menu-item-group title="Group One">
          <el-menu-item index="1-1">item one</el-menu-item>
          <el-menu-item index="1-2">item one</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Group Two">
          <el-menu-item index="1-3">item three</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <template slot="title">item four</template>
          <el-menu-item index="1-4-1">item one</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span><router-link to="/showUser"><el-button>
          List User
          </el-button></router-link></span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-document"></i>
        <span><router-link to="/listPc"><el-button>
          List PC
          </el-button></router-link></span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span><router-link to="/createPc"><el-button>
          Create PC
          </el-button></router-link></span>
      </el-menu-item>
    </el-menu>
    </div>
</template>

<script>
export default {
  methods: {
  }
}
</script>

<style scoped>
.el-menu-vertical-demo {
    height:900px;
}
</style>
