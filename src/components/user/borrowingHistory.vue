<template>
  <div class="borrowingHistory-container">
    <p class="historyTitle">借 阅 历 史</p>
    <div class="box">
      <el-table
      :data="tableData.slice(0,7)"
      border stripe
      style="width: 100%"> 
      <el-table-column prop="id" label="编号" min-width="4%" align="center"></el-table-column>
      <el-table-column prop="book.bookName" label="图书名称" min-width="20%" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="borrowDate" label="借阅时间" min-width="10%" align="center">
          <template slot-scope="scope">{{scope.row.borrowDate | formatDate}}</template>
        </el-table-column>
        <el-table-column prop="returnDate" label="应归还时间" min-width="10%" align="center"> 
          <template slot-scope="scope">{{scope.row.returnDate | formatDate}}</template>
        </el-table-column>
        <el-table-column prop="renewState" label="借阅有效期" min-width="10%" align="center"> 
           <template scope="scope">                    
              <span v-if="scope.row.renewState=='0'">1个月</span>
              <span v-if="scope.row.renewState=='1'">2个月</span>            
          </template>
        </el-table-column>
        <el-table-column prop="right" label="操作" min-width="10%" align="center">
          <template slot-scope="scope">
            <el-button @click="showDetail(scope.row)" type="primary" size="small" plain style="margin-right:10px">详情</el-button>
            <el-tag v-if="scope.row.borrowState == 0" type="warning">审核中</el-tag>
            <el-tag v-if="scope.row.borrowState == 1" type="success">借阅中</el-tag>
            <el-tag v-if="scope.row.borrowState == 2" type="info">已归还</el-tag>
            <el-tag v-if="scope.row.borrowState == -1" type="danger">拒绝借阅</el-tag>
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
      <el-dialog title="借阅信息" :visible.sync="dialogVisible" width="30%" center>
        <div class="detail-content">
          <p>{{ "用户编号：" + row.userId }}</p>
          <p v-if="row.userInfo != undefined">{{ "姓名：" + row.userInfo.nickname }}</p>
          <p v-if="row.book != undefined">{{ "书籍名称：" + row.book.bookName}}</p>
          <p>借阅时间：{{row.borrowDate | formatDate}}</p>
          <p v-if="row.renewState==0">借阅有效期：1个月 </p>
          <p v-if="row.renewState==1">借阅有效期：2个月 </p>
          <p>{{ "距归还还剩：" + timeRemainCompute + '天'}}</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    
  </div>
</template>

<script>
import axios from 'axios'
import {formatDate} from '../../assets/js/time.js';
export default {
  name: "borrowingHistory",
  data() {
    return {
      historyName:"",
      totalLength:0,
      dialogVisible: false,
      row: {},
      tableData: [],
      currentPage: 1, //初始页
      pageSize: 7 //    每页的数据
    }
  },
  
  methods: {
    //打开借阅详情弹框
    showDetail(row) {
      this.row = row;
      this.dialogVisible = true;
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      this.getBookHistoryData(this.currentPage,this.pageSize);
    },
    getBookHistoryData(currentPage,pageSize) {
      axios({
        method:'get',
        url:"/borrowInfo/userHistory",
        params:{
          currentPage:currentPage,
          pageSize:pageSize,
          userId:Number.parseInt(sessionStorage.getItem('userId'))
        }
      })
      .then(response => {
        let result = response.data;
        if(result.code == 200) {
          this.tableData = result.data;
          this.totalLength = result.count;
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
    this.getBookHistoryData(1,this.pageSize);
  },
  computed: {
    //距离还书还有多少天
    timeRemainCompute() {
      let date1 = new Date(this.row.returnDate);
      let date2 = new Date();
      date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
      date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
      const diff = date1.getTime() - date2.getTime(); //目标时间减去当前时间
      let diffDate = diff / (24 * 60 * 60 * 1000);
      if(diffDate < 0) {//保证结果日期不为负数
        diffDate = 0;
      }
      return diffDate;
    }
  },
  //时间过滤器，将TimeStamp类型数据换成自定义格式
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
      }
    }
}
</script>


<style scoped>
.el-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.box {
  margin:0 15%;
}
.title {
  font-size: 25px;
  text-align: center;
}
.searchBox {
  margin:25px 15%;
  height:40px;
}
.historyTitle {
  line-height: 60px;
  text-align: center;
  font-size: 25px;
}
</style>>