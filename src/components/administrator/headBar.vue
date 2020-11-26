<template>
    <div class="header-container">
        <div class="logo">图书馆管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 用户头像 -->
                <!-- <div class="user-avator">
                    <img src="../../assets/images/login.png" />
                </div> -->
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <router-link to="/adminPassword" style="text-decoration:none;">
                            <el-dropdown-item>修改密码</el-dropdown-item>
                        </router-link>
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "headBar",
    data() {
        return {
            username: 'admin',
        }
    },
    computed: {
        
    },
    methods: {
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'loginout') {
                sessionStorage.clear();
                this.$router.push('/login');
            }
        },
    },
    mounted() {

    }
}
</script>

<style scoped>
.header-container {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    background-color:  #242f42;
}
.logo {
    float: left;
    width: 250px;
    line-height: 70px;
    padding-left: 20px;
    color: #fff;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.user-name {
    margin-left: 10px;
    color: #fff;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>