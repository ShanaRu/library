<template>
  <div class="modifyPassword-container">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      label-position="left">
      <el-form-item label="原密码" prop="originalPassword">
        <el-input
          type="password"
          placeholder="请输入原密码"
          v-model="ruleForm.originalPassword"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item label="新密码" prop="newPassword">
        <el-input
          type="password"
          placeholder="请输入新密码)"
          v-model="ruleForm.newPassword"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input
          type="password"
          placeholder="请确认新密码"
          v-model="ruleForm.confirmPassword"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" style="margin-left:60px">提交</el-button>
        <el-button @click="resetForm('ruleForm')" style="margin-left:90px">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Axios from 'axios'
import qs from 'qs'
export default {
  name: "modifyPassword",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value !== this.ruleForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validatePassRegx = (rule, value, callback) => {
      let regx1 = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]+/;
      let regx2 = /[0-9]+/;
      let regx3 = /[a-zA-Z]/;
      if(!regx1.test(value)){
        callback("密码缺少特殊字符");
      }
      if(!regx2.test(value)){
        callback("密码缺少数字");
      }
      if(!regx3.test(value)){
        callback("密码缺少字母");
      }
      callback();
    };
    return {
      ruleForm: {
        originalPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        originalPassword: [
          {
            required: true,
            message: "请输入旧密码",
            trigger: "blur",
          },
          { validator: validatePassRegx, trigger: 'blur' },
          {
            min: 8,
            max: 30,
            message: "密码的长度在 8 到 30 位之间",
          }
        ],
        newPassword: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "blur",
          },
          { validator: validatePassRegx, trigger: 'blur' },
          {
            min: 8,
            max: 30,
            message: "密码的长度在 8 到 30 位之间",
          }
        ],
        confirmPassword: [
          {
            required: true,
            message: "请输入确认密码",
            trigger: "blur",
          },
          { validator: validatePass, trigger: 'blur' },
          { validator: validatePassRegx, trigger: 'blur' },
          {
            min: 8,
            max: 30,
            message: "密码的长度在 8 到 30 位之间",
          }
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Axios({
            method:'post',
            url:'user/modifypassword',
            data:qs.parse({
              userId:Number.parseInt(sessionStorage.getItem('userId')),
              oldPassword:this.ruleForm.originalPassword,
              newPassword:this.ruleForm.newPassword
            })
          })
          .then(response => {
            let result = response.data;
            if(result.code == 200) {
              this.$message({
                  type: 'success',
                  message: '保存成功',
                  showClose: true
              }); 
              this.$refs.ruleForm.resetFields();
            }else if(result.code == 107){
                this.$message({
                    showClose: true,
                    message: result.msg,//新密码和旧密码不同
                    type: 'error'
                });
            }else if(result.code == 108){
                this.$message({
                    showClose: true,
                    message: result.msg,//旧密码错误
                    type: 'error'
                });
            }
            else {
              this.$message({
                type: 'error',
                message: '保存失败',
                showClose: true,
              }); 
            }
          })
          .catch(error => {
            this.$message({
                type: 'error',
                message: '系统错误',
                showClose: true,
              }); 
          })
        } else {
          console.log("保存失败");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.demo-ruleForm {
  border-radius:3px;
  box-shadow: 0 0px 7px 0 rgba(0, 0, 0, 0.3);
  padding: 50px;
  height: 35%;
  width: 35%;
  background-color: #fff;
}

.modifyPassword-container{
  display: flex;
  justify-content: center;
  padding-top: 50px;
  padding-bottom: 00px;
}
</style>>