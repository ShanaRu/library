<template>
  <div class="viewAnnouncement-container">
    <div class="searchBox">
        <el-button type="primary" @click="searchAnnouncement" style="margin-left:20px;float:right">查询</el-button>
        <el-input placeholder="请输入公告标题" v-model="announcementName" style="width:300px;float:right" clearable maxlength="30">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
    </div>
    <div class="notice-table">
      <el-table
        :data="tableData.slice(0,7)" stripe border style="width:100%">
        <el-table-column
          label="编号"
          prop="id"
          min-width="5%">
        </el-table-column>
        <el-table-column prop="releaseTime" label="发布时间" min-width="10%" align="center">
          <template slot-scope="scope">{{scope.row.releaseTime | formatDate}}</template>
        </el-table-column>
        <el-table-column prop="noticeName" label="公告标题" min-width="15%" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="content" label="公告内容" min-width="35%" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" min-width="10%" align="center">
          <template slot-scope="scope">
            <el-button @click="open(scope.row)" type="primary" size="small" plain>详情</el-button>
          </template>
        </el-table-column>
      </el-table>
        <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalLength">
        </el-pagination>
    </div>
    <el-dialog title="公告详情" :visible.sync="dialogVisible" width="40%" center>
      <div class="detail">
        <p>公告标题：{{row.noticeName }}</p>
        <p>发布时间：{{row.releaseTime | formatDate}}</p>
        <p>内容：{{ row.content }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import {formatDate} from '../../assets/js/time.js'
export default {
  name: "viewAnnouncement",
  methods: {
    open(row) {
      this.row = row;
      this.dialogVisible = true;
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage;
      this.getData(currentPage,this.pageSize);
    },
    getData(pageSize,currentPage){
      const url="/notice/query";
      axios({
        method:"get",
        url:url,
        params:{
          name:this.announcementName,
          currentPage:pageSize,
          pageSize:currentPage  
        }
      }).then(response => {
        let result = response.data;
        if(result.code == 200) {
          this.tableData=result.data;
          this.totalLength=result.count;
        }
      }).catch(error => {
        this.$message({
            type: 'info',
            message: '系统错误',
            showClose: true,
        });
      })
    },
    searchAnnouncement() {
      this.currentPage = 1;
      this.getData(1,7);
    }
  },

  data() {
    return {
      currentPage: 1,
      pageSize: 7,
      row: {},
      dialogVisible: false,
      tableData: [],
      totalLength:0,
      announcementName:""
    };
  },
  created(){
    this.getData(1,this.pageSize);
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
.searchBox {
  margin:25px 15%;
  height:40px;
}
.notice-table {
  margin: 0 15%;
}
.detail{
  padding:0 40px;
}
.detail p{
  font-size: 16px;
  line-height: 30px;
}
.el-pagination{
  display: flex;
  justify-content: center;
  margin-top:30px
}
</style>