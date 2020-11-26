<template>
    <div class="showUserInformation-container">
        <div class="demo-input-suffix">
            <el-input placeholder="请输入用户姓名" v-model="searchUsername" type="text" class="searchInput" maxlength="30" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
            <el-button @click="searchUser" type="primary">查询用户</el-button>
        </div> 
        <el-table style="width: 100%;"
            :data="userList.slice(0,7)" stripe border>
            <el-table-column prop="user.id" label="编号" min-width="5%" align="center"></el-table-column>
            <el-table-column prop="nickname" label="姓名" min-width="8%" align="center"></el-table-column>
            <el-table-column prop="sex" label="性别" min-width="4%"  align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.sex == 1">男</span>
                    <span v-if="scope.row.sex == 2">女</span>
                </template>
            </el-table-column>
            <el-table-column prop="age" label="年龄" min-width="4%"  align="center"></el-table-column>
            <el-table-column prop="birthday" label="生日" min-width="8%"  align="center">
                <template slot-scope="scope">{{scope.row.birthday | formatDate}}</template>
            </el-table-column>
            <el-table-column prop="telephone" label="电话" min-width="10%"  align="center"></el-table-column>
            <el-table-column prop="email" label="邮箱" min-width="15%"  align="center"></el-table-column>
            <el-table-column prop="address" label="地址" min-width="13%"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="personalDesc" label="描述" min-width="15%"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" min-width="13%"  align="center">
                <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)"  type="success" size="small" plain>借阅历史</el-button>
                <el-button v-if="userList.length > 0" size="small" type="danger" @click="del(scope.row)" plain>注销</el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"         
            layout="total, prev, pager, next, jumper"
            :total="dataLength">
        </el-pagination>
        <el-dialog  :visible.sync="dialogTableVisible" width="300" class="abow_dialog" center title="借阅历史">
            <el-table
                :data="tableData.slice(0,5)" style="100%" height="430px"
                border>
                <el-table-column prop="book.bookName" align="center" label="图书名称" min-width="30%"></el-table-column>
                <el-table-column prop="borrowDate"     align="center" label="借阅时间" min-width="10%">
                    <template slot-scope="scope">{{scope.row.borrowDate | formatDate}}</template>
                </el-table-column>
                <el-table-column prop="returnDate"     align="center" label="应归还时间" min-width="10%">
                    <template slot-scope="scope">{{scope.row.returnDate | formatDate}}</template>
                </el-table-column>
                <el-table-column prop="renewState" align="center" label="借阅有效期" min-width="10%">
                <template scope="scope">                    
                    <p v-if="scope.row.renewState=='0'">1个月</p>
                    <p v-if="scope.row.renewState=='1'">2个月</p>            
                </template>
                </el-table-column>
                <el-table-column prop="right" label="状态" min-width="10%" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.borrowState == 0" type="warning">审核中</el-tag>
                        <el-tag v-if="scope.row.borrowState == 1" type="success">借阅中</el-tag>
                        <el-tag v-if="scope.row.borrowState == 2" type="info">已归还</el-tag>
                        <el-tag v-if="scope.row.borrowState == -1" type="danger">拒绝借阅</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @current-change="handleBoxCurrentChange"
                :current-page="boxCurrentPage"
                :page-size="boxPageSize"         
                layout="total, prev, pager, next, jumper"
                :total="tableLength">
            </el-pagination>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogTableVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import {formatDate} from '../../assets/js/time.js'
export default {
    name: "showUserInformation",
    data() {
        return {
            searchUsername:"",
            boxCurrentPage:1,
            boxPageSize:5,
            dataLength:0,
            dialogTableVisible: false,
            currentPage:1, //初始页
            pageSize:7,    //每页的数据
            userList:[],
            row:{},
            tableData:[],
            tableLength:0
        }
    },
    created() {
        this.getUserList(1,this.pageSize);
    },
    methods: {
        handleClick(row){
            this.row = row;
            this.dialogTableVisible = true;
            this.getUserBorrowingData(1,this.boxPageSize,row.user.id);
        },
        handleCurrentChange: function(currentPage){
            this.currentPage = currentPage;
            this.getUserList(currentPage,this.pageSize);
        },
        getUserList(currentPage,pageSize) { 
            axios({
                method:'post',
                url:"/user/getuserinfolist",
                data:qs.parse({
                    pageSize:pageSize,
                    currentPage :currentPage,
                    status:1,
                    nickname:this.searchUsername
                })
            }).then(response => {
                let result = response.data;
                if(result.code == 200) {
                    // console.log(result.data);
                    this.userList = result.data;
                    this.dataLength = result.count;
                    // console.log(this.userList);
                }
            })
            .catch(error => {
                this.$message({
                    showClose: true,
                    message: '错误',
                    type: 'error'
                });
            })
        },
        del(row){
            this.row = row;
            console.log(this.row.user.id);
            this.$confirm("永久删除该用户, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(() => {
                axios({
                    url:"/user/usercancellation",
                    method: "get",
                    params:{
                        userId :this.row.user.id
                    }
                }).then(response=>{
                    let result = response.data;
                    console.log(result);
                    if(result.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '注销成功'
                        }); 
                        this.getUserList(this.currentPage,this.pageSize);
                    }else if(result.code == 113){
                        this.$message({
                            type: 'info',
                            message: result.msg
                        });
                    }else{
                        this.$message({
                            type: 'info',
                            message: '注销失败'
                        });
                    }
                }).catch(error=>{
                    this.$message({
                        type: 'info',
                        message: '注销失败'
                    });
                })
            })
            .catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消删除"
                });
            });
        },
        handleBoxCurrentChange(boxCurrentPage) {
            this.boxCurrentPage = boxCurrentPage;
            this.getUserBorrowingData(this.boxCurrentPage,this.boxPageSize,this.row.user.id);
        },
        getUserBorrowingData(currentPage,pageSize,id){
            axios({
                method:'get',
                url:"/borrowInfo/userHistory",
                params:{
                    currentPage:currentPage,
                    pageSize:pageSize,
                    userId:id
                }
            })
            .then(response => {
                let result = response.data;
                this.tableData = result.data;
                this.tableLength = result.count;
                // console.log(result);
                // console.log(this.tableLength);
            })
            .catch(error => {
                this.$message({
                    showClose: true,
                    message: '错误',
                    type: 'error'
                });
            })
        },
        searchUser() {
            this.getUserList(1,this.pageSize)
        }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        // return formatDate(date, 'yyyy-MM-dd hh:mm');
        return formatDate(date, 'yyyy-MM-dd');
      }
    }
}
</script>

<style scoped>
.el-dialog__body {
    position: absolute;
    left: 0;
    top: 54px;
    bottom: 70px;
    right: 0;
    padding: 0;
    z-index: 1;
    overflow: hidden;
    overflow-y: auto;
}
.el-dialog__footer{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
}
.history{
  font-size: 20px;
  float:left;
}
.demo-input-suffix {
    margin: 30px 0;
    float: right;
}
.searchInput {
    width: 300px;
    margin-right: 20px;
}
.el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
</style>