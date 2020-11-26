<template>
    <el-container class="userHome-container">
        <el-header>
            <!-- 属性router开启路由模式，index唯一值，改成路径 （原来的这个:default-active="activeIndex"）更新页面导航不留在原来的地方-->
            <el-menu
            :default-active="$route.path"
            router
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#8787c3"
            text-color="#fff"
            active-text-color="#ffd04b">
            <img src="../../assets/images/9.png" alt="9" style="float:left">
            <el-menu-item index="/login" class="headerBox" style="margin-right:80px" @click="exit">退出</el-menu-item>
            <el-submenu index="information" class="headerBox">
                <template slot="title">我的信息</template>
                <el-menu-item index="/userInformation">用户信息</el-menu-item>
                <el-menu-item index="/modifyPassword">修改密码</el-menu-item>
                <el-menu-item index="/borrowingHistory">借阅历史</el-menu-item>
            </el-submenu>
            <el-menu-item index="/viewAnnouncement" class="headerBox">公告</el-menu-item>
            <el-menu-item index="/bookshelf" class="headerBox">书架</el-menu-item>
            <el-menu-item index="/userLibrary" class="headerBox">图书库</el-menu-item>
            <el-menu-item index="/userHomePage" class="headerBox">主页</el-menu-item>
            <p class="title"><router-link to="/userHomePage" style="text-decoration:none;" class="title">图 书 馆 管 理 系 统</router-link></p> 
            </el-menu>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
      
</template>

<script>
export default {
    name: "userHome",
    data() {
        return {
            activeIndex: "/userHomePage",
        }
    },
    methods: {
      handleSelect(key, keyPath) {
        // console.log(key, keyPath);
      },
      exit(){
        sessionStorage.clear();
      }
    }
}
</script>

<style scoped>
.userHome-container {
    height: 100%;
}
.el-header {
    padding: 0;
}
.el-main {
     background-color:#E1DFFD;
    
}
img{
     height:30px ;
     width: 30px; 
     margin-left:4%;
     margin-top:1%;
}
.headerBox {
    float: right;
}
.title{
  color:white;
  line-height: 60px;
  margin: 0;
  float: left;
  margin-left: 20px;
  font-size: 25px;
}
</style>