<template>
  <div class="library-container">
    <div class="box">
      <el-form :inline="true"  class="demo-form-inline" :model="condition" label-width="50px">
        <el-form-item label="国家">
          <el-select v-model="condition.countryId" placeholder="请选择国家">
            <el-option :label="country.countryName" :value="country.id" v-for="country in selectBox.country" :key="country.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" >
          <el-select v-model="condition.typeId" placeholder="请选择书籍类型">
              <el-option :label="type.typeName" :value="type.id" v-for="type in selectBox.type" :key="type.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="篇幅">
          <el-select v-model="condition.space" placeholder="请选择书籍篇幅">
            <el-option v-for="item in spaces" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主题">
          <el-select v-model="condition.themeId" placeholder="请选择书籍主题">
             <el-option :label="theme.themeName" :value="theme.id" v-for="theme in selectBox.theme" :key="theme.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:25px;margin-right:0">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="resetForm"  style="margin-left:25px;">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="box" style="height:60px;float:right">
        <el-input placeholder="请输入图书名称" v-model="searchBookName" style="width:270px;" clearable  maxlength="30"></el-input>
        <el-button type="primary" @click="searchBook" style="margin-left:25px">搜索</el-button>
    </div>

    <el-table
      :data="tableData.slice(0,7)" border stripe style="100%">
      <el-table-column fixed prop="id" label="图书编号" min-width="5%" align="center">
      </el-table-column>
      <el-table-column prop="bookName" label="图书名称" min-width="15%" align="center">
      </el-table-column>
      <el-table-column prop="author" label="作者" min-width="10%" align="center">
      </el-table-column>
      <el-table-column prop="type.typeName" label="类型" min-width="5%" align="center"> </el-table-column>
      <el-table-column prop="country.countryName" label="国家" min-width="5%" align="center">
      </el-table-column>
      <el-table-column prop="createDate" label="上架日期" min-width="8%" align="center">
        <template slot-scope="scope">{{scope.row.createDate | formatDate}}</template>
      </el-table-column>
      <el-table-column prop="bookCount" label="剩余数量" min-width="5%" align="center"> </el-table-column>
      <el-table-column label="操作" min-width="10%" align="center">
        <template slot-scope="scope">
          <el-button @click="open(scope.row)" type="success" plain size="small">借阅</el-button>
          <el-button type="primary" @click="handleOpen(scope.row)" plain size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="图书详情"
      :visible.sync="dialogVisible"
      width="50%" center
      class="details">
      <h1 style="text-align:center">{{details.bookName}}</h1>
      <ul>
        <li><p>书籍编号：{{details.id}}</p></li>
        <li><p>书籍名称：{{details.bookName}}</p></li>
        <li><p>上架时间：{{details.createDate | formatDate}}</p></li>
        <li v-if="details.type!=undefined"><p>类型：{{details.type.typeName}}</p></li>
        <li v-if="details.theme!=undefined"><p>主题：{{details.theme.themeName}}</p></li>
        <li v-if="details.country != undefined"><p>国家：{{details.country.countryName}}</p></li>
        <li><p>篇幅：{{details.space}}</p></li>
        <li><p style="line-height:30px">详细信息：{{details.info}}</p></li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >关闭</el-button>
      </span>
    </el-dialog>

    <el-pagination
      class="bookPagination"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total,prev,pager,next,jumper"
      :total="totalLength"
    >
    </el-pagination>
  </div>
</template>

<script>
import Axios from 'axios';
import qs from 'qs'
import {formatDate} from '../../assets/js/time.js';
export default {
  name: "library",
  data() {
    return {
      flag:0,//0为名字搜索，1为条件搜索
      totalLength:0,
      dialogVisible: false,
      searchBookName: "",
      selectBox: {
        country:[],
        theme:[],
        type:[],
        space:[]
      },
      tableData: [],
      currentPage: 1, //初始页
      pageSize: 7, //    每页的数据
      condition:{
        countryId:null,
        themeId:null,
        typeId:null,
        space:null
      },
      spaces:[
        {
          id:1,
          name:"短篇"
        },
        {
          id:2,
          name:"中篇"
        },
        {
          id:3,
          name:"长篇"
        }

      ],
      details:{},
      bookHistory:[]
    }
  },
  methods: {
    //该书的借阅记录
    handleOpen(row){
      this.dialogVisible = true;
      this.details = row;
      Axios({
        method:'get',
        url:"/borrowInfo/bookHistory",
        params: {
          bookId:Number.parseInt(row.id)
        }
      })
      .then(response => {
        let result = response.data;
        if(result.code == 200) {
          this.bookHistory = result.data;
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
    searchBook() {
      this.flag=0;
      this.currentPage=1;
      this.searchByName();
    },
    searchByName(){
      Axios({
        method:'post',
        url:"/book/query",
        data: qs.parse({
          currentPage:this.currentPage,
          pageSize:this.pageSize,
          nickname:this.searchBookName
        })
      })
      .then(response => {
        let result = response.data;
        this.totalLength = result.count;
        this.tableData = result.data;
      })
      .catch(error => {
        this.$message({
              showClose: true,
              message: '错误',
              type: 'error'
        });
      })
    },
    open(row) {
      this.$confirm("是否确定借阅此书", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          Axios({
            method:'post',
            url:"/borrowInfo",
            data: qs.parse({
              userId:Number.parseInt(sessionStorage.getItem('userId')),
              bookId:row.id
            })
          })
          .then(response => {
            let result = response.data;
            if(result.code == 200){
              this.$message({
                type: "success",
                message: "借阅成功!",
                showClose: true
              });
              // row.bookCount = row.bookCount-1;
              this.getLibraryData(this.currentPage,this.pageSize);
            }else{
              this.$message({
                  showClose: true,
                  message: '书籍数量不足或用户借阅数量达到限制或信用分不足',
                  type: 'error'
            });
            }
          })
          .catch(error => {
            this.$message({
                  showClose: true,
                  message: '系统错误',
                  type: 'error'
            });
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消借阅",
            showClose: true
          });
        });
    },
    
    searchCondition(){
      Axios({
        method:'post',
        url:"/book/query",
        data: qs.parse({
          currentPage:this.currentPage,
          pageSize:this.pageSize,
          country_id:this.condition.countryId,
          theme_id:this.condition.themeId,
          type_id:this.condition.typeId,
          space:this.condition.space,
          nickname:""
        })
      })
      .then(response => {
        let result = response.data;
        this.totalLength = result.count;
        this.tableData = result.data;
        console.log(response);
      })
      .catch(error => {
        this.$message({
              showClose: true,
              message: '错误',
              type: 'error'
        });
      })
    },
    onSubmit() {
      this.flag=1;
      this.currentPage = 1
      this.searchCondition();
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
       if(this.flag == 0){
          this.searchByName();
       }else{
          this.searchCondition();
       }
    },
    getLibraryData(currentPage,pageSize) {
      Axios({
        method:'post',
        url:"/book/query",
        data: qs.parse({
          currentPage:currentPage,
          pageSize:pageSize,
          nickname:this.searchBookName,
        })
      })
      .then(response => {
        let result = response.data;
        this.totalLength = result.count;
        this.tableData = result.data;
      })
      .catch(error => {
        this.$message({
              showClose: true,
              message: '错误',
              type: 'error'
        });
      })
    },
    getCountries(){
      Axios({
        method:'get',
        url:"/country"
      })
      .then(response => {
        let result = response.data;
        this.selectBox.country = result.data;
      })
      .catch(error => {
        this.$message({
              showClose: true,
              message: '错误',
              type: 'error'
        });
      })
    },
    getThemes(){
      Axios({
        method:'get',
        url:"/theme"
      })
      .then(response => {
        let result = response.data;
        this.selectBox.theme = result.data;
      })
      .catch(error => {
        this.$message({
              showClose: true,
              message: '错误',
              type: 'error'
        });
      })
    },
    getTypes(){
      Axios({
        method:'get',
        url:"/type"
      })
      .then(response => {
        let result = response.data;
        this.selectBox.type = result.data;
      })
      .catch(error => {
        this.$message({
              showClose: true,
              message: '错误',
              type: 'error'
        });
      })
    },
    resetForm() {
      this.condition.countryId=null;
      this.condition.themeId=null;
      this.condition.typeId=null;
      this.condition.space=null;
    }
  },
  created() {
    this.getCountries();
    this.getThemes();
    this.getTypes();
    this.getLibraryData(1,this.pageSize);
  },
  //时间过滤器，将TimeStamp类型数据换成自定义格式
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
      }
    }
};
</script>

<style scoped>
.details h1{
  text-align: center;
}
.details ul{
  list-style: none;
}
.details ul li{
  font-size: 16px;
}
/*.box{
  margin-left: 15%;
}
.el-select {
  width: 164px;
}
.el-row {
  margin-top: 2%;
  width: 13px;
  margin-left: 75%;
}
.el-table {
  margin-top: 1%;
  margin-left: 15%;
}
.el-pagination {
  margin-top: 1%;
  margin-left: 25%;
}*/
.library-container {
  margin:0 15%;
}
.el-select {
  width: 164px;
}
.el-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.box {
  float: right;
}
</style>