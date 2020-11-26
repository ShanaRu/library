<template>
  <div class="overdueManagement-container">
    <div class="demo-input-suffix">
        <el-input
            style="width:250px" maxlength="30" clearable
            placeholder="请输入逾期用户名称"
            v-model="keyWord" class="searchInput">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" @click="searchByNickName">查询</el-button>
    </div>
    <el-table :data="tableData.slice(0,7)" border style="width: 100%" class="overdueTable">
      <el-table-column fixed prop="id" label="惩罚编号" min-width="8%" align="center">
      </el-table-column>
      <el-table-column prop="userInfo.nickname" label="姓名" min-width="15%" align="center">
      </el-table-column> 
      <el-table-column prop="fine" label="罚款金额" min-width="10%" align="center">
      </el-table-column>
      <el-table-column prop="reason" label="罚款原因" min-width="60%" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="8%" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="handleOpen(scope.row)" plain>删除</el-button>
          </template>
      </el-table-column>
    </el-table>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%">
        <span>您确定要删除吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </span>
      </el-dialog>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total,prev,pager,next,jumper"
      :total="totalLength">
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name:"overdueManagement",
    data(){
      return{
        keyWord:"",
        tableData:[],
        currentPage:1,
        pageSize:7,
        dialogVisible:false,
        rowData:{},
        totalLength:0
      }
    },
    created(){
      this.searchOverdueUsers();
    },
    methods:{
        searchByNickName(){
            this.searchOverdueUsers();
        },
        handleCurrentChange(currentPage){
          this.currentPage = currentPage;
          this.searchOverdueUsers();
        },
        handleOpen(row){
            this.dialogVisible = true;
            this.rowData = row;
        },
        handleConfirm(){
            this.deletePunishment();
        },
        deletePunishment(){
          axios({
              method:'delete',
              url:"/punishment/"+this.rowData.id,
          }).then(response=>{
              let result = response.data;
              if(result.code == 200) {
                  this.searchOverdueUsers();
              }else{
                this.$message({
                    showClose: true,
                    message: '错误',
                    type: 'error'
                });
              }
              this.dialogVisible = false;
          }).catch(error=>{
                this.$message({
                    showClose: true,
                    message: '错误',
                    type: 'error'
                });
                this.dialogVisible = false;
            })
        },
        searchOverdueUsers(){
          axios({
              method:'get',
              url:"/punishment/query",
              params:{
                currentPage:this.currentPage,
                pageSize:this.pageSize,
                name:this.keyWord
              }
          }).then(response=>{
              let result = response.data;
              // console.log(result);
              if(result.code == 200) {
                  this.tableData = result.data;
                  this.totalLength = result.count;
              }
          }).catch(error=>{
                this.$message({
                    showClose: true,
                    message: '错误',
                    type: 'error'
                });
            })
        }
    }
}
</script>

<style scoped>
  /*.overdueTable{
    margin: 0 auto;
  }
  .el-pagination {
    margin-top: 1%;
    margin-left: 37%;
  }*/
  .demo-input-suffix {
    float: right;
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .searchInput {
    width: 60%;
    margin-right: 30px;
  }
  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
</style>