<template>
    <div class="sideBar-container">
    <!-- default-active 激活当前菜单的index
    router 使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
        <!--一级菜单和二级菜单，判断数组中每一个对象是否包含数组-->
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
export default {
    name: "sideBar",
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-house',
                    index: 'adminHomePage',
                    title: '系统首页'
                },
                {
                    icon: 'el-icon-chat-dot-round',
                    index: 'announcement',
                    title: '公告'
                },
                {
                    icon: 'el-icon-reading',
                    index: 'adminLibrary',
                    title: '图书库'
                },
                {
                    icon: 'el-icon-notebook-2',
                    index: '3',
                    title: '借还书',
                    subs: [
                        {
                            index: 'borrowing',
                            title: '借阅审核'
                        },
                        {
                            index: 'returning',
                            title: '归还图书'
                        }
                    ]
                },
                {
                    icon: 'el-icon-folder-opened',
                    index: 'importAndExport',
                    title: '图书批量导入导出'
                },
                {
                    icon: 'el-icon-c-scale-to-original',
                    index: 'overdueManagement',
                    title: '逾期管理'
                },
                {
                    icon: 'el-icon-user',
                    index: 'showUserInformation',
                    title: '用户信息'
                },
                
                {
                    icon: 'el-icon-pie-chart',
                    index: 'statistics',
                    title: '借阅统计'
                }
            ]
        }
    },
    computed: {
        onRoutes() {
            //将后面的路径去掉，保留‘/’前的字段
            return this.$route.path.replace('/', '');
        }
    },
}
</script>

<style scoped>
.sideBar-container {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    width: 250px;
    background-color: rgb(50, 65, 87);
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>    