<template>
  <div class="importAndExport-container">
    <div class="selectBox">
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="国家">
            <el-select v-model="country">
                <el-option v-for="item in defaultData" :label="item.defaultName" :value="item.id" v-bind:key="item.id"></el-option>
                <el-option v-for="item in countryData " :label="item.countryName" :value="item.id" v-bind:key="item.id"></el-option>
            </el-select>
            </el-form-item>

            <el-form-item label="类型">
            <el-select v-model="type">
                <el-option v-for="item in defaultData" :label="item.defaultName" :value="item.id" v-bind:key="item.id"></el-option>
                <el-option v-for="item in typeData " :label="item.typeName" :value="item.id" v-bind:key="item.id"></el-option>
            </el-select>
            </el-form-item>

            <el-form-item label="篇幅">
            <el-select v-model="space">
                <el-option v-for="item in spaceData" :label="item.spaceName" :value="item.id" v-bind:key="item.id"></el-option>
            </el-select>
            </el-form-item>

            <el-form-item label="主题">
            <el-select v-model="theme">
                <el-option v-for="item in defaultData" :label="item.defaultName" :value="item.id" v-bind:key="item.id"></el-option>
                <el-option v-for="item in themeData " :label="item.themeName" :value="item.id" v-bind:key="item.id"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query" style="margin-left:38px;">查询</el-button>
              <el-button @click="reset" style="margin-left:22px;">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="upload-container">
        <div class="chose-file">
          <el-upload
          class="upload inline-block"
          action=""
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :limit="1"
          :auto-upload="false"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          :file-list="fileList">
              <el-button size="large" type="primary">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">只能导入xls/xlsx文件</div>  
          </el-upload>
        </div>
        <el-button class="importButton" size="large" type="success" @click="importExcel">导入数据</el-button>
        <a :href="getHref()">
          <el-button class="ExportButton" size="large" type="warning" >
              导出数据
          </el-button>
        </a>
    </div>
    <el-table :data="tableData.slice(0,7)" border stripe style="width: 100%;" class="Excel-table">
        <el-table-column prop="id" label="图书编号" min-width="5%" align="center">
        </el-table-column>
        <el-table-column prop="bookName" label="图书名称" min-width="15%" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="author" label="作者" min-width="10%" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="country.countryName" label="国家" min-width="5%" align="center">
        </el-table-column>
        <el-table-column prop="type.typeName" label="类型" min-width="5%" align="center"> </el-table-column>
        <el-table-column prop="theme.themeName" label="主题" min-width="5%" align="center">
        </el-table-column>
        <el-table-column prop="space" label="篇幅" min-width="5%" align="center">
        </el-table-column>
        <el-table-column prop="bookCount" label="图书数量" min-width="5%" align="center">
        </el-table-column>
        <el-table-column prop="createDate" label="上架日期" min-width="8%" align="center">
            <template slot-scope="scope">{{scope.row.createDate | formatDate}}</template>
        </el-table-column>
        <el-table-column prop="info" label="简介" min-width="20%" show-overflow-tooltip align="center">
        </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="pagesize"
        layout="total,prev,pager,next" :total="dataLength">
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import {formatDate} from '../../assets/js/time.js'
export default {
    name:"importAndExport",
    created() {
        this.getBookData(1,7);
        this.getCountryData();
        this.getThemeData();
        this.getTypeData();
    },
    data(){
      return{
          file:[{
            name:"",
            url:"",
          }],
          currentPage: 1, //初始页
          pagesize: 7, //    每页的数据
          fileTemp:[],
          fileList:[],
          tableData: [],
          countryData: [],
          themeData: [],
          typeData: [],
          defaultData:[{"id":0,"defaultName":"默认"}],
          spaceData:[
                  {"id":0,"spaceName":"默认"},
                  {"id":1,"spaceName":"短篇"},
                  {"id":2,"spaceName":"中篇"},
                  {"id":3,"spaceName":"长篇"},
          ],
          country:0,
          type:0,
          theme:0,
          space:0,
          dataLength:0,
          name:"",
      }
    },
    methods:{
        handleChange(file,fileList){
            this.fileTemp = file.raw;
        },
        handleRemove(file,fileList){
            this.fileTemp = null;
        },
        handleExceed(file,fileList){
            this.$message.warning(
              `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件
              ，共选择了 ${files.length + fileList.length} 个文件`);
        },
        handleSizeChange(val) {
                this.pagesize = val;
        },
        handleCurrentChange(val) {
                this.currentPage = val;
                this.getBookData(this.currentPage,7);
        },
        importExcel(){
            console.log(this.fileTemp);
            if(this.fileTemp.length!=0){
                if((this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                    ||this.fileTemp.type == 'application/vnd.ms-excel'){
                        let form = new FormData();
                        form.append("file",this.fileTemp);
                        let config = {
                            headers:{
                                'Content-type': 'multipart/form-data'
                            },
                        }
                        axios.post('/import',form,config).then(response=>{
                            this.$message({
                              showClose: true,
                              message: '导入成功',
                              type: 'success'
                            });
                        }).catch(error=>{
                            this.$message({
                              showClose: true,
                              message: '导入错误',
                              type: 'error'
                            });
                        })
                  }else{
                      this.$message({
                          showClose: true,
                          message: '导入文件格式不正确，请删除后重新上传',
                          type: 'error'
                      });
                  }
            }else{
                this.$message({
                    showClose: true,
                    message: '请上传附件',
                    type: 'error'
                });
            }
        },
        getBookData(currentPage,pageSize){
                axios({
                    method:'post',
                    url:"/book/query",
                    data:qs.parse({
                        currentPage:currentPage,
                        pageSize:pageSize,
                        country_id:this.country,
                        theme_id:this.theme,
                        type_id:this.type,
                        space:this.space
                    })
                }).then(response=>{
                    let result = response.data;
                    if(result.code == 999) {
                        // console.log(result.data);
                        this.tableData = result.data;
                        this.dataLength = result.count;
                        // console.log(this.tableData);
                    }
                }).catch(error=>{
                    this.$message({
                        showClose: true,
                        message: '系统错误',
                        type: 'error'
                    });
                })
            },
            getCountryData(){
                axios({
                    method:'get',
                    url:"/country",
                }).then(response => {
                    let result = response.data;
                    if(result.code == 200) {
                        // console.log(result.data);
                        this.countryData = result.data;
                        // console.log(this.countryData);
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
            getThemeData(){
                axios({
                    method:'get',
                    url:"/theme",
                }).then(response => {
                    let result = response.data;
                    if(result.code == 200) {
                        // console.log(result.data);
                        this.themeData = result.data;
                        // console.log(this.themeData);
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
            getTypeData(){
                axios({
                    method:'get',
                    url:"/type",
                }).then(response => {
                    let result = response.data;
                    if(result.code == 200) {
                        // console.log(result.data);
                        this.typeData = result.data;
                        // console.log(this.typeData);
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
             query() {
                this.currentPage = 1;
                axios({
                    url:"/book/query",
                    method: "post",
                    data:qs.parse({
                        currentPage:this.currentPage,
                        pageSize:this.pagesize,
                        country_id:this.country,
                        theme_id:this.theme,
                        type_id:this.type,
                        space:this.space
                    })
                }).then(response=>{
                    let result = response.data;
                    if(result.code == 999) {
                        // console.log(result.data);
                        this.tableData = result.data;
                        this.dataLength = result.count;
                        // console.log(this.tableData);
                    }
                }).catch(error=>{
                    this.$message({
                        showClose: true,
                        message: '系统错误',
                        type: 'error'
                    });
                })
            },
            reset(){
                this.currentPage=1;
                this.space=0;
                this.type=0;
                this.theme=0;
                this.country=0;
                this.getBookData(this.currentPage,this.pagesize);
            },
            getHref(){
                return "http://192.168.3.49:8089/library/export?country_id="
                        +this.country+"&theme_id="+this.theme+"&type_id="+this.type+"&space="+this.space+"&name="+this.name;
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
.chose-file{
  float: left;
}
.upload-container{
  margin-top: 0;
  width: 60%;
  margin-bottom:80px;
}
.el-upload__tip{
  font-size: 15px;
}
.inline-block {
  display: inline-block;
}
.importButton{
  margin-top: 0;
  margin-left: 10px;
  margin-right: 5%;
}
.ExportButton{
  margin-left: 5%;
}
.el-pagination {
    margin-top: 30px;
    display: flex;
    justify-content: center;
}
</style>