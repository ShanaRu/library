<template>
  <div class="returning-container">

    <!-- <div style="margin-top: 15px; width: 300px; margin-left: 52.5%">
      <el-input placeholder="请输入借阅者" v-model="searchUserName">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
        <el-button slot="append" @click="searchName">搜索</el-button>
      </el-input>
    </div> -->
    <div class="demo-input-suffix">
        <el-input
            style="width:270px" clearable maxlength="30"
            placeholder="请输入用户姓名"
            v-model="searchUserName" class="searchInput">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" @click="searchName">查询</el-button>
    </div>

    <el-table style="width:100%" stripe
     :data="tableData.slice(0,7)"
     border>
      <el-table-column prop="id" align="center" label="借阅编号" min-width="5%"></el-table-column>
      <el-table-column prop="userInfo.nickname" align="center" label="姓名" min-width="10%"></el-table-column>
      <el-table-column prop="bookId" align="center" label="图书编号" min-width="5%"></el-table-column>
      <el-table-column prop="book.bookName" align="center" label="图书名称" min-width="22%" show-overflow-tooltip></el-table-column>
      <el-table-column prop="book.author" align="center" label="作者" min-width="10%"></el-table-column>
      <el-table-column prop="returnDate" align="center" label="需要归还时间" min-width="10%">
        <template slot-scope="scope">{{scope.row.returnDate | formatDate}}</template>
      </el-table-column>
      <el-table-column label="借阅状态"  align="center" min-width="8%">
        <template  slot-scope="scope">
          <el-button @click="open(scope.row)" type="success" size="small" plain>归还</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
            <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pagesize"
            layout="total, prev, pager, next,jumper"
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
  name: "returning",
  data() {
    return {
      tableData: [],
      searchUserName:"",
      dataLength: 0,

      // 分页
      currentPage: 1, //初始页
      pagesize: 7, //每页的数据
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
    open(data) {
      console.log(data);
      this.$confirm("是否确定更改图书状态为已归还", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if(!this.isOverdue(data.returnDate)){
          axios({
              url:"/borrowInfo/returnBook",
              method: "put",
              params:{
                id:data.id
              }
          }).then(response=>{
            this.getBookSelfData(this.currentPage,this.pagesize),
            this.$message({
                type: 'success',
                message: '归还成功',
                showClose:true
            }); 
          }).catch(error=>{
              this.$message({
                  type: 'info',
                  message: '归还失败',
                  showClose:true
              }); 
          })
        }else {
          this.$message({
              type: 'info',
              message: '该用户存在逾期图书，请先交逾期罚款才能还书',
              showClose:true
          }); 
        }

      }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消归还",
            showClose:true
          });
      });
    },
    getBookSelfData(currentPage,pageSize) {
            axios({
                    method:'get',
                    url:"/borrowInfo/fuzzyQuery",
                    params:{
                        name:this.searchUserName,
                        states :1,
                        currentPage:currentPage,
                        pageSize:pageSize
                    }
            }).then(response => {
                let result = response.data;
                if(result.code == 200) {
                    console.log(result.data);
                    this.tableData = result.data;
                    this.dataLength = result.count;
                    console.log(this.tableData);
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

    handleSizeChange(val) {
        this.pagesize = val;
    },
    handleCurrentChange(val) {
        this.currentPage = val;
        this.getBookSelfData(this.currentPage,7);
    },
    searchName(){
        this.currentPage = 1;
            axios({
                 method:'get',
                 url:"/borrowInfo/fuzzyQuery",
                 params:{
                     name:this.searchUserName,
                     states:1,
                     currentPage:1,
                     pageSize:this.pagesize
                 }
            }).then(response => {
                let result = response.data;
                if(result.code == 200) {
                    console.log(result.data);
                    this.tableData = result.data;
                    this.dataLength = result.count;
                    console.log(this.tableData);
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
  },
  created() {
        this.getBookSelfData(1,7);
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
/*.el-select{
  width:164px;
}
.el-row{
  margin-top:10px;
  width:13px;
  margin-left:75%;
}
.el-table{
  margin-top:2%;
   margin-left:10%;
}
.el-pagination{
  margin-top:1%;
  margin-left:32%;
}
.el-form{
  margin-left:9.1%;
  margin-top:4%;
}
.block {
    padding-top:30px;
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