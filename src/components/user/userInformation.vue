<template>
  <div class="userInformation-container">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="information"
      label-position="left">
      <el-row>
        <el-col :span="24">
        <p style="font-size:25px;text-align:center;">个人资料</p>
          <el-divider></el-divider>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="用户编号">
            <el-input
              disabled="disabled"
              v-model="form.userId"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户名">
            <el-input
              disabled="disabled"
              v-model="form.username"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="信用分">
            <el-input
              disabled="disabled"
              v-model="form.credit"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="姓名" prop="nickname">
            <el-input
              v-model="form.nickname"
              placeholder="请输入姓名"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="年龄" prop="age">
            <el-input
              v-model="form.age"
              placeholder="请输入年龄"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别" prop="sex">
              <el-radio label="男" v-model="form.sex"></el-radio>
              <el-radio label="女" v-model="form.sex"></el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="form.email"
              placeholder="请输入邮箱"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话" prop="telephone">
            <el-input
              v-model="form.telephone"
              placeholder="请输入电话"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                :picker-options="picker1"
                style="width:155%"
                v-model="form.birthday"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="地址" prop="address">
            <el-input
              v-model="form.address"
              placeholder="请输入家庭地址"
              clearable
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="个人描述" prop="personalDesc">
            <el-input
              :rows="4"
              type="textarea"
              v-model="form.personalDesc"
              placeholder="请输入内容"
              maxlength="100"
              show-word-limit
              resize="none"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-button type="primary" @click="submit('form')" class="btn">保存</el-button>
        <p style="line-height:20px;margin:0;padding:0;color:red">备注：信用分低于60分将限制借阅图书操作</p>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import Axios from 'axios';
import qs from 'qs'
export default {
  name: "userInformation",
  props: {
    msg: String,
  },
  data() {
    var validatorAge = (rule, value, callback) => {
        let reg= new RegExp("^[0-9][0-9]?[0-9]?$");
        if(!reg.test(value)) {
          callback('年龄输入不合法');
        }else if(value>120){
          callback('年龄输入不合法');
        }
        else {
          callback();
        }
    };
    return {
      selectDate: new Date(),
      form: {
        credit:"",
        username:"",
        nickname: "",
        personalDesc: "",
        birthday: "",
        sex: "男",
        age: "",
        address: "",
        telephone: "",
        email: "",
        id:"",
        userId:""
      },
      picker1: {
        disabledDate:(time) => {
           return time.getTime() > Date.now() - 8.64e7;
        }
      },
      rules: {
        nickname: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 20,
            message: "姓名的长度在 3 到 20 位之间",
          },
          // {
          //   pattern: /^[\u4E00-\u9FA5]+$/,
          //   message: "用户名只能为中文",
          // },
        ],
        sex: [
          {
            required: true,
            message: "请选择性别",
            trigger: "blur",
          },
        ],
        age: [
          {
            required: true,
            message: "请输入年龄",
            trigger: "blur",
          },
          { validator: validatorAge, trigger: 'blur' }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          {
            min: 1,
            max: 30,
            message: "邮箱的长度在 1 到 30 位之间",
          },
          {
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
            message: "请输入正确的邮箱地址",
          },
        ],
        birthday: [
          {
            required: true,
            message: "请选择出生日期",
            trigger: "change",
          },
        ],
        telephone: [
          {
            required: true,
            message: "请输入电话号码",
            trigger: "blur",
          },
          {
            min: 1,
            max: 30,
            message: "长度在 1 到 30 位之间",
          },
          {
            pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的电话号码",
          },
        ],
        address: [
          {
            required: true,
            message: "请输入地址",
            trigger: "blur",
          }
        ],
        personalDesc: [
          {
            required: true,
            message: "请输入个人描述",
            trigger: "blur",
          }
        ],
      }
    };
  },
  methods: {
    //性别数字换成字符
    changeSexValue1() {
      if(this.form.sex == 1) {
        this.form.sex = "男";
      }else {
        this.form.sex = "女";
      }
    },
    //性别换成数字
    changeSexValue2() {
      if(this.form.sex == "男"){
        this.form.sex = 1
      }else{
        this.form.sex = 2
      }
    },
    submit(form) {
      this.changeSexValue2();//性别换成数字
      this.form.age = Number.parseInt(this.form.age);
      console.log(this.form);
      this.$refs[form].validate((valid) => {
        if (valid) {
          Axios({
            method:'put',
            url:'user/updateuser',
            data:qs.parse(this.form)
          })
          .then(response => {
            let result = response.data;
            if(result.code == 200) {
              this.$message({
                  type: 'success',
                  message: '保存成功'
              }); 
              this.getUserInformationData();
            }else {
                this.$message({
                  type: 'error',
                  message: '保存失败',
                  showClose: true
                });
            }
          })
          .catch(error => {
              this.$message({
                type: 'error',
                message: '系统错误',
                showClose: true
              }); 
          })
        
        } else {
          console.log('保存失败');
          return false;
        }
      });
    },
    getUserInformationData() {
      Axios({
            method:'get',
            url:'/user/getuserbyuserid?userId='+Number.parseInt(sessionStorage.getItem('userId'))
          })
          .then(response => {
            let result = response.data;
            if(result.code == 200) {
              this.form.address = result.data.address;
              this.form.age = result.data.age;
              this.form.email = result.data.email;
              this.form.id = result.data.id;
              this.form.birthday = result.data.birthday;
              this.form.nickname = result.data.nickname;
              this.form.personalDesc = result.data.personalDesc;
              this.form.sex = result.data.sex;
              this.form.telephone = result.data.telephone;
              this.form.username = result.data.user.username;
              this.form.userId=result.data.user.id;
              this.form.credit = result.data.user.credit;
              this.changeSexValue1();//性别数字换成字符
            }
          })
          .catch(error => {
            this.$message({
                type: 'error',
                message: '系统错误'
          }); 
      })
    }
  },
  created() {
    this.getUserInformationData();
  }
};
</script>

<style scoped>
.userInformation-container {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.information {
  background-color: #fff;
  height: 100%;
  width: 1000px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  padding: 30px;
  border-radius: 3px;
}
.btn {
  margin: 10px 45%;
}

</style>