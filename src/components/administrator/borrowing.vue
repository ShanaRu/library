<template>
    <div class="borrowing-container">
    <div class="demo-input-suffix">
        <el-input
            style="width:270px" maxlength="30" clearable
            placeholder="请输入用户姓名"
            v-model="searchBookName" class="searchInput">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" @click="searchBorrowing">查询</el-button>
    </div>
        <el-table
        :data="tableData.slice(0,9)"
            stripe
            border
            style="width: 100%">
            <el-table-column align="center"
            prop="userId"
            label="用户编号"
            min-width="5%">
            </el-table-column>
            <el-table-column align="center"
            prop="userInfo.nickname"
            label="姓名"
            min-width="10%">
            </el-table-column>
            <el-table-column align="center"
            prop="bookId"
            label="图书编号"
            min-width="5%">
            </el-table-column>
            <el-table-column align="center"
            prop="book.bookName" show-overflow-tooltip
            label="图书名称"
            min-width="20%">
            </el-table-column>
            <el-table-column align="center"
            prop="book.author"
            label="作者"
            min-width="10%">
            </el-table-column>
            <el-table-column prop="borrowDate" label="申请借阅时间" min-width="10%" align="center">
                <template slot-scope="scope">{{scope.row.borrowDate | formatDate}}</template>
            </el-table-column>
            <el-table-column align="center"
            label="操作"
            min-width="10%">
            <template slot-scope="scope">
                <el-button @click="pass(scope.row)" type="success" size="small" plain>审核通过</el-button>
                <el-button @click="refuse(scope.row)" type="danger" size="small" plain>拒绝</el-button>
            </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next ,jumper"
            :total="dataLength">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import {formatDate} from '../../assets/js/time.js'
export default {
    name: "borrowing",
    data() {
        return {
            currentPage: 1, //初始页
            pageSize: 7, //    每页的数据
            searchBookName: "",
            tableData: [],
            dataLength: 0
        }
    },
    methods: {
        searchBorrowing() {
            this.currentPage = 1;
            axios({
                 method:'get',
                 url:"/borrowInfo/fuzzyQuery",
                 params:{
                     name:this.searchBookName,
                     states:0,
                     currentPage:1,
                     pageSize:this.pageSize
                 }
            }).then(response => {
                let result = response.data;
                if(result.code == 200) {
                    // console.log(result.data);
                    this.tableData = result.data;
                    this.dataLength = result.count;
                    // console.log(this.tableData);
                }
            })
            .catch(error => {
                this.$message({
                    showClose: true,
                    message: '系统错误',
                    type: 'error'
                });
            })
        },
        pass(row) {
            this.$confirm('此操作将审核通过借阅图书申请, 是否继续?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                console.log("row...",row)
                axios({
                    url:"/borrowInfo/operate",
                    method: "put",
                    data:qs.parse({
                        operation:1,
                        id:row.id
                    })
                }).then(response=>{
                    this.getBookSelfData(this.currentPage,this.pageSize)
                    this.$message({
                        type: 'success',
                        message: '审核成功',
                        showClose: true,
                    }); 
                }).catch(error=>{
                    this.$message({
                        type: 'info',
                        message: '系统错误',
                        showClose: true,
                    }); 
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消审核',
                    showClose: true,
                });          
            });
        },
        refuse(row) {
            this.$confirm('此操作将拒绝通过借阅图书申请, 是否继续?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
            type: 'warning'
            }).then(() => {
                axios({
                    url:"/borrowInfo/operate",
                    method: "put",
                    data:qs.parse({
                        operation:2,
                        id:row.id
                    })
                }).then(response=>{
                    this.getBookSelfData(this.currentPage,this.pageSize);
                    this.$message({
                        type: 'success',
                        message: '拒绝成功',
                        showClose: true,
                    }); 
                }).catch(error=>{
                    this.$message({
                        type: 'info',
                        message: '拒绝失败',
                        showClose: true,
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消拒绝'
                });          
            });
        },
        getBookSelfData(currentPage,pageSize) {
            axios({
                    method:'get',
                    url:"/borrowInfo/fuzzyQuery",
                    params:{
                        name:this.searchBookName,
                        states :0,
                        currentPage:currentPage,
                        pageSize:pageSize 
                    }
            }).then(response => {
                let result = response.data;
                if(result.code == 200) {
                    // console.log(result.data);
                    this.tableData = result.data;
                    this.dataLength = result.count;
                    // console.log(this.tableData);
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
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getBookSelfData(this.currentPage,this.pageSize);
            // console.log(`当前页: ${val}`);
        }
        },
    created() {
        this.getBookSelfData(1,this.pageSize);
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
/*.borrowing-container {
    padding: 30px 50px;
}

.block {
    padding-top:30px;
}
.el-pagination {
    float: right;
}*/
.demo-input-suffix {
    float:right;
    margin: 30px 0;
}
.searchInput {
    width: 70%;
    margin-right: 20px;
}
.el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}
</style>