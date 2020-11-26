<template>
    <div class="bookshelf-container">
        <div class="headline">
            我的书架
        </div>
        <el-row :gutter="20" v-show="!flag">
            <el-col :span="8" v-for="(item,index) in borrowingData" v-bind:key="index">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span class="showBook">{{item.book.bookName}}</span>
                        <div style="margin-top:10px">
                            <el-tag style=" margin-right: 15px" type="warning"  v-if="item.borrowState == 0">审核中</el-tag>
                            <el-tag style="margin-right: 15px" type="success"  v-if="item.borrowState == 1">借阅中</el-tag>
                            <el-tag style="margin-right: 15px; cursor:pointer" @click="renew(index,item.id)" v-if="item.renewState == 0 && item.borrowState == 1 && !isOverdue(item.returnDate)">申请续借</el-tag>
                            <el-tag style="margin-right: 15px" type="success"  v-if="item.renewState == 1">已续借</el-tag>
                            <el-tag style="margin-right: 15px; cursor:pointer" type="danger" v-if="item.borrowState == 0" @click="deleteBook(index,item.id)">撤销借书</el-tag>
                            <el-tag style="margin-right: 15px" type="warning"  v-if="isOverdue(item.returnDate)">已逾期</el-tag>
                        </div>
                    </div>
                    <div class="text item">借阅日期：{{item.borrowDate | formatDate}}</div>
                    <div class="text item">归还日期：{{item.returnDate | formatDate}}</div>
                    <div class="text item">作者：{{item.book.author}}</div>
                    <div class="text item">类型：{{item.book.type.typeName}}</div>
                    <div class="text item">国家：{{item.book.country.countryName}}</div>
                    <div class="text item">篇幅：{{item.book.space}}</div>
                    <div class="text item">主题：{{item.book.theme.themeName}}</div>
                    <div class="text item information">简介：{{item.book.info}}</div>
                </el-card>
            </el-col>
        </el-row> 
        <el-row :gutter="20" v-show="flag">
            <el-col :span="8" v-for="o in 3" :key="o">
                <el-card class="box-card" style="height:450px">
                    <div class="boxFontSize">
                       暂无书籍
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import axios from 'axios'
import {formatDate} from '../../assets/js/time.js'
export default {
    name: "bookshelf",
    data() {
        return {
            borrowingData: [],
            flag:false
        }
    },
    methods: {
        //判断是否逾期
        isOverdue(returnDate){
            let now = new Date();
            let returnDate1 = new Date(returnDate);
            let nowMill = now.getTime();
            let returnMill = returnDate1.getTime();
            if(returnMill<nowMill){
                return true;
            }else{
                return false;
            }
        },
        //续借
        renew(index,id) {
            this.$confirm('此操作将申请续借该图书，每本书仅限续借一次（共30天）, 是否继续?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                axios.put("/borrowInfo/renewBook?id="+id)
                .then(response => {
                    if(response.data.code == 200) {
                        this.getBookSelfData();//更新页面数据
                        this.$message({
                            type: 'success',
                            message: '续借成功',
                            showClose: true
                        });
                    }else {
                        this.$message({
                            type: 'info',
                            message: '续借失败',
                            showClose: true
                        });
                    }
                })
                .catch(error => {
                    this.$message({
                    type: 'info',
                    message: '系统错误',
                    showClose: true
                }); 
                })  
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消续借',
                    showClose: true
                });          
            });
        },
        //用户书架信息
        getBookSelfData() {
            axios.get("/borrowInfo/bookShelf?userId="+Number.parseInt(sessionStorage.getItem('userId')))
            .then(response => {
                let result = response.data;
                if(result.code == 200) {
                    this.borrowingData = result.data;
                    if(this.borrowingData.length == 0) {
                        this.flag = !this.flag;
                    }
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
        //未审核前可以删除该书
        deleteBook(index,id) {
            this.$confirm('此操作将取消借阅该图书, 是否继续?', '提示', {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                axios.delete("/borrowInfo/"+id)
                .then(response => {
                    if(response.data.code == 200) {
                        this.getBookSelfData();//更新当前页面数据
                        this.$message({
                            type: 'success',
                            message: '取消借阅成功',
                            showClose: true
                        });
                    }else {
                        this.$message({
                            type: 'info',
                            message: '取消借阅失败',
                            showClose: true
                        });
                    }
                })
                .catch(error => {
                    this.$message({
                    type: 'info',
                    message: '系统错误',
                    showClose: true
                }); 
                })  
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '关闭取消借阅请求',
                    showClose: true
                });          
            });
        }
    },
    created() {
        this.getBookSelfData();
    },
    //时间过滤器，将TimeStamp类型数据换成自定义格式
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
.bookshelf-container {
    margin: 30px 100px;
}
.text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 90%;
  }
  .headline {
      text-align: center;
      font-size: 25px;
      padding-bottom: 50px;
  }
   .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .information {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    height: 76px;
  }
  .boxFontSize{
    text-align:center;
    line-height:430px
  }
</style>