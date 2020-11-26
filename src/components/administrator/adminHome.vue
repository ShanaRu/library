<template>
  <div class="adminHome-container">
    <el-container>
      <!-- 头部导航栏 -->
      <el-header>
        <HeadBar></HeadBar>
      </el-header>
      <el-container>
      <!-- 侧边栏 -->
        <el-aside width="250px">
          <SideBar></SideBar>
        </el-aside>
        <!-- 内容框 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import HeadBar from './headBar.vue'
import SideBar from './sideBar'
export default {
    name: "adminHome",
    data() {
        return {
            
        }
    },
    components: {
      HeadBar,
      SideBar
    },
}
</script>

<style scoped>
.adminHome-container {
  height: 100%;
  background-color: #EDEDED;
}
.el-header {
  padding: 0;
}
</style>