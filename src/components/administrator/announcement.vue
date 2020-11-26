<template>
  <div class="announcement-container">    
    <div class="demo-input-suffix">
        <el-input
            placeholder="请输入公告标题" clearable maxlength="30"
            v-model="searchNoticeName" class="searchInput">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" @click="searchAnnouncement">查询公告</el-button>
        <el-button type="success" @click="handleAdd">新增公告</el-button>
    </div>  
    <el-table
      style="width: 100%"
      :data="userList.slice(0,7)" 
      align="center"
      border
     stripe>
     <el-table-column prop="id" label="编号" min-width="6%" align="center">
      </el-table-column>
      <el-table-column prop="noticeName" label="标题" min-width="20%" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="content" label="公告内容" min-width="40%" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="releaseTime" label="发布时间" min-width="9%" align="center">
        <template slot-scope="scope">{{scope.row.releaseTime | formatDate}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="10%" align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)" type="info" plain>编辑</el-button>
          <el-button
            v-if="userList.length > 0"
            size="small"
            type="danger"
            @click.native.prevent="delNotice(scope.row)" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑时候的弹出层 -->
    <el-dialog
      center
      title="修改公告"
      :visible.sync="dialogFormVisible"
      width="40%"
      top="200px"
      :before-close="handleClose">
      <el-form :model="editForm" ref="editFormRef" :rules="rules">
        <el-form-item label="标题" :label-width="formLabelWidth" prop="noticeName">
          <el-input v-model="editForm.noticeName" maxlength="30" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="公告内容" :label-width="formLabelWidth" prop="content">
          <el-input v-model="editForm.content" type="textarea" :rows="8" resize="none"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelEdit()">取消</el-button>
        <el-button type="primary" @click.native="handleUpdate()">更新公告</el-button
        >
      </div>
    </el-dialog>
    <!-- 新增时候的弹出层 -->
    <el-dialog
      center
      title="新增公告"
      :visible.sync="FormVisible"
      width="50%"
      top="200px"
      :before-close="addClose">
      <el-form :model="addForm" ref="addFormRef" :rules="rule">
        <el-form-item
          label="标题"
          :label-width="formLabelWidth" 
          prop="noticeName">
          <el-input v-model="addForm.noticeName" maxlength="30" show-word-limit></el-input>
        </el-form-item>
        <el-form-item
          label="公告内容"
          :label-width="formLabelWidth"
          prop="content">
          <el-input v-model="addForm.content" type="textarea" resize="none" :rows="8"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelAdd()">取消</el-button>
        <el-button type="primary" @click.native="addNotice()">添加公告</el-button
        >
      </div>
    </el-dialog>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pagesize"
      layout="total,prev, pager, next, jumper"
      :total="totalLength"
      style="margin-top:20px;"
    >
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import {formatDate} from '../../assets/js/time.js'
export default {
  name: "announcement",
  created() {},
  data() {
     var titlecontent = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入标题内容'));
        } 
          callback();
        };
         var titlecontent = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请输入公告内容'));
        } 
          callback();
        };
    return {
      searchNoticeName:"",
      editForm: {
        noticeName: "",
        content: "",
      },
      addForm: {
        noticeName: "",
        content: "",
      },
      rules: {
        noticeName: [{ required: true, message: "请输入标题内容", trigger: "blur" }],
        content: [
          { required: true, message: "请输入公告内容", trigger: "blur" }
        ],
      },
      rule: {
        noticeName: [
          { required: true,message: "请输入标题内容", trigger: "blur" }
        ],
        content: [
          { required: true,  message: "请输入公告内容", trigger: "blur" }
        ],
      },
      userList:[],
      formLabelWidth: "80px",
      dialogFormVisible: false,
      FormVisible: false, //弹出层默认为关闭
      currentPage: 1, //初始页
      pagesize: 7, //每页的数据
      totalLength:0
    };
  },
  methods: {
    //打开编辑框
    handleEdit(index, row) {
      this.dialogFormVisible = true; //dialog对话窗口打开
      this.editForm = Object.assign({}, row); //将数据传入dialog页面，传递当前index
    },
    //关闭编辑框
    cancelEdit() {
      // this.$refs.editFormRef.resetFields();
      this.dialogFormVisible = false;
    },
    //打开新增框
    handleAdd: function () {
      this.FormVisible = true;
    },
    //关闭新增框
    cancelAdd() {
      // this.$refs.addFormRef.resetFields();
      this.FormVisible = false;
    },
    //更新公告
    handleUpdate() {
      this.$refs['editFormRef'].validate((valid) => {
        if (valid) {
          axios({
            url:"/notice",
            method: "put",
            data:qs.parse({
              noticeName:this.editForm.noticeName,
              id:this.editForm.id,
              content:this.editForm.content
              })
            })
          .then(response => {
              let result = response.data;
              if(result.code == 200) {
                  // console.log(result.data);
                  this.getAnnouncementData(this.currentPage,this.pagesize);
                  this.$message({
                    message: '更新成功',
                    type: 'success',
                    showClose: true
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
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });  
    },
    //添加公告
    addNotice() {
      this.$refs['addFormRef'].validate((valid) => {
        if (valid) {
          axios({
            url:"/notice",
            method: "post",
            data:qs.parse({
              noticeName:this.addForm.noticeName,
              id:this.addForm.id,
              content:this.addForm.content
              })
            })
          .then(response => {
              let result = response.data;
              if(result.code == 200) {
                  // console.log(result.data);
                  this.getAnnouncementData(this.currentPage,this.pagesize);
                  this.$message({
                    showClose: true,
                    message: '添加成功',
                    type: 'success'
                  });
                  this.$refs.addFormRef.resetFields();
              }else {
                  this.$message({
                    showClose: true,
                    message: '添加失败',
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
          this.FormVisible = false;
          // console.log('sumbit');
        } else {
          return false;
            console.log('errorsumbit');
        }
      });
    },
    //删除公告
    delNotice(row) {
      this.$confirm("该操作将删除该公告, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        axios({
          method:'delete',
          url:"/notice/"+row.id
        })
        .then(response => {
            let result = response.data;
            if(result.code == 200) {
                // console.log(result.data);
                this.getAnnouncementData(this.currentPage,this.pagesize);
                this.$message({
                  showClose: true,
                  message: '删除成功',
                  type: 'success'
                });
            }else {
                this.$message({
                  showClose: true,
                  message: '删除失败',
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
          message: "已取消删除",
        });
      });
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getAnnouncementData(this.currentPage,this.pagesize);    
    },
    //在关闭编辑框前
    handleClose(done){
      this.$refs['editFormRef'].validate((valid) => {
          if (valid) {
            this.dialogFormVisible = false;
          } else {
            return false;
          }
        });
    },
    //在关闭新增框前
    addClose(done){
      this.$nextTick(() => {
        this.$refs.addFormRef.resetFields();  
      });
       this.FormVisible = false;
    },
    getAnnouncementData(currentPage,pageSize){
      axios({
         method:'get',
         url:"/notice/query",
         params:{
          name:this.searchNoticeName,
          currentPage:currentPage,
          pageSize:pageSize
        }
      })
      .then(response => {
          let result = response.data;
          this.totalLength = result.count;
          if(result.code == 200) {
              this.userList = result.data;
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
    //查询公告
    searchAnnouncement() {
      this.currentPage = 1;
      this.getAnnouncementData(1,this.pagesize);
    }
  },
  created(){
    this.getAnnouncementData(1,this.pagesize);
  },
  //时间过滤器，将TimeStamp类型数据换成自定义格式
    filters: {
      formatDate(time) {
        let date = new Date(time);
        // return formatDate(date, 'yyyy-MM-dd hh:mm');
        return formatDate(date, 'yyyy-MM-dd');
      }
    }
};
</script>

<style scoped>
.demo-input-suffix {
    margin: 30px 0;
    float: right;
}
.searchInput {
    width: 300px;
    margin-right: 20px;
}
.el-pagination {
  display: flex;
  justify-content: center;
}
</style>