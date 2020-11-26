<template>
    <div class="login_container">
        <div class="login_box">
            <el-form label-width="80px" label-position="left" class="login_form front" :model="loginForm" :rules="rules" ref="loginFormRef">
                <div><h1 class="loginTitle" style="margin-top:15%">登录</h1></div>
                <el-form-item prop="loginUsername" label="用户名" style="margin-top:13%">
                    <el-input v-model="loginForm.loginUsername" type="text"></el-input>
                </el-form-item>
                <el-form-item prop="loginPassword" label="密码" style="margin-top:8%">
                    <el-input v-model="loginForm.loginPassword" type="password"></el-input>
                </el-form-item>
                <p class="btns" style="margin-top:8%">
                    <el-button type="primary" @click="login" style="margin-right:40px">登录</el-button>
                    <el-button @click="resetLoginForm">重置</el-button>
                </p>
                <p class="linkText" style="margin-top:13%"><a @click="registerBox" href="javascript:;">没有账号，去注册</a></p>
            </el-form>
             <el-form label-width="80px" label-position="left" class="login_form back" :model="registerForm" :rules="rules" ref="registerFormRef">
                <div><h1 class="loginTitle">注册</h1></div>
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="registerForm.username" type="text"></el-input>
                </el-form-item>
                <el-form-item prop="nickname" label="姓名">
                    <el-input v-model="registerForm.nickname" type="text"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="registerForm.email"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="输入密码">
                    <el-input v-model="registerForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item prop="confirmPassword" label="确认密码">
                    <el-input v-model="registerForm.confirmPassword" type="password"></el-input>
                </el-form-item>
                <p class="btns">
                    <el-button type="primary" @click="register" style="margin-right:40px">注册</el-button>
                    <el-button @click="resetRegisterForm">重置</el-button>
                </p>
                <p class="linkText"><a @click="loginBox" href="javascript:;">已有账号，去登录</a></p>
            </el-form>
        </div>
        <div class="systemName">
            <h1>图书馆管理系统</h1>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import $ from 'jquery'
export default {
    name: "register",
    data() {
        var validateName = (rule, value, callback) => {
            if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{3,30}$/.test(value)) {
                callback('必须同时包含数字和字母');
            }
            callback();
        };
        var validatePassword = (rule, value, callback) => {
            // if(!/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{8,30}$/.test(value)) {
            //     callback('必须同时包含数字、字母和特殊字符');
            // }
            // callback();
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
        var validatorEmail = (rule, value, callback) => {
            const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
            setTimeout(() => {
                if (mailReg.test(value)) {
                    callback()
                } else {
                    callback(new Error('请输入正确的邮箱格式'))
                }
            }, 100)
        }
        var validateConfirmPassword = (rule, value, callback) => {
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
            if (this.registerForm.password != value) {
                callback('两次输入密码不一致');
            }
            callback();
        };
        return {
            loginForm: {
                loginUsername: '',
                loginPassword: ''
            },
            registerForm: {
                username:'',
                nickname:'',
                password:'',
                confirmPassword:'',
                email:''
            },
            rules: {
                loginUsername: [
                    { required: true, message: '请输入登录名称', trigger: 'blur' }
                ],
                loginPassword: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                    { min: 3, max: 30, message: '登录名称的长度在 3 到 30 位之间', trigger: 'blur' },
                    { validator: validateName, trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 8, max: 30, message: '密码的长度在 8 到 30 位之间', trigger: 'blur' },
                    { validator: validatePassword, trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { min: 1, max: 30, message: '邮箱地址的长度不大于 30 位', trigger: 'blur' },
                    {validator: validatorEmail, trigger: 'blur'}
                ],
                nickname: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 2, max: 20, message: '姓名的长度在 2 到 20 位之间', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { min: 8, max: 30, message: '密码的长度在 8 到 30 位之间', trigger: 'blur' },
                    { validator: validateConfirmPassword, trigger: 'blur' }
                ]
            },
        }
    },
    methods: {
        resetLoginForm () {
            this.$refs.loginFormRef.resetFields();
        },
        resetRegisterForm() {
            this.$refs.registerFormRef.resetFields();
        },
        login () {
            this.$refs['loginFormRef'].validate((valid) => {
            if (valid) {
                axios({
                    method:'post',
                    url:"/user/login",
                    data:qs.parse({
                        username:this.loginForm.loginUsername,
                        password:this.loginForm.loginPassword
                    })
                })
                .then(response => {
                    let result = response.data;
                    if(result.code == 200) {
                        this.$message({
                            showClose: true,
                            message: '登录成功',
                            type: 'success'
                        });
                        //将用户信息保存到sessionStorage
                        sessionStorage.setItem("userId",result.data.user.id);
                        sessionStorage.setItem("userName",result.data.user.username);
                        sessionStorage.setItem('token',result.data.token);
                        let role = result.data.user.roles[0].roleName;
                        sessionStorage.setItem('role',role);
                        //跳转用户主页页面
                        if(role == 'user') {
                            this.$router.push('/userHomePage');
                        }else {
                            this.$router.push('/adminHomePage');
                        }
                        
                    }else if(result.code == 104) {
                        this.$message({
                            showClose: true,
                            message: result.msg,//用户名不存在
                            type: 'error'
                        });
                    }else if(result.code == 101) {
                        this.$message({
                            showClose: true,
                            message: result.msg,//密码错误
                            type: 'error'
                        });
                    }
                    else if(result.code == 103) {
                        this.$message({
                            showClose: true,
                            message: result.msg,//用户已注销
                            type: 'error'
                        });
                    }
                    else {
                        this.$message({
                            showClose: true,
                            message: '登录失败',
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
            } else {
                console.log('登录失败');
                return false;
            }
            });
        },
        register () {
            this.$refs['registerFormRef'].validate((valid) => {
                if(valid) {
                    axios({
                        method:'post',
                        url:'/user/register',
                        data:qs.parse({
                            userName:this.registerForm.username,
                            nickname:this.registerForm.nickname,
                            email:this.registerForm.email,
                            password:this.registerForm.password,
                            twicePassword:this.registerForm.confirmPassword
                        })
                    })
                    .then(response => {
                        if(response.data.code == 200) {
                            this.$message({
                                message: '请前往邮箱激活账号,在5秒后回到登录页面',
                                type: 'success',
                                showClose: true
                            });
                            //5秒后回到登录框
                            this.timer = setTimeout(()=>{
                                this.$refs.registerFormRef.resetFields();
                                $(".login_box").toggleClass("middle-flip");
                            },5000);
                        }else if(response.data.code == 109) {
                            this.$message({
                                message: response.data.msg,//用户名已存在
                                type: 'error',
                                showClose: true
                            });
                        }else {
                            this.$message({
                                message: '注册失败',
                                type: 'error',
                                showClose: true
                            });
                        }
                    })
                    .catch(error=>{
                        this.$message({
                            type:'error',
                            message:'系统错误',
                            showClose:true
                        })
                    })
                }else {
                    console.log('注册失败');
                    return false;
                }
            })
        },
        //控制登录框和注册框翻转
        registerBox() {
            $(".login_box").toggleClass("middle-flip");
        },
        loginBox() {
            $(".login_box").toggleClass("middle-flip");
        }
    },
    created() {
        //渲染登录页面成功前清除sessionStorage
        sessionStorage.clear();
    }
}
</script>
<style scoped>
.login_container {
  background-image: url("../assets/images/login.png");
  background-size: 100% 100%;
  height: 100%;
  position: relative;
}

.login_box {
  width: 500px;
  height: 300px;
  border-radius: 3px;
  position: absolute;
  left: 30%;
  top: 60%;
  transform: translate(-50%, -50%);
}

.login_form {
  position: absolute;
  bottom: 0;
  height:510px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  /*background-color:rgb(212, 210, 235);
  background-color:rgb(227, 226, 241);*/
  background-color:rgb(230, 228, 245);
  border-radius: 15px;
  padding:0 40px;
}

.btns {
  display: flex;
  justify-content: center;
}
.systemName {
    position: absolute;
    left:65%;
    top:8%;
    color: rgb(117, 110, 219);
    font-size: 28px;
}

.loginTitle {
    color: rgb(117, 110, 219);
    text-align: center;
}
.linkText {
    text-align: center;
    margin: 25px 0;
}
.linkText a {
    color: rgb(117, 110, 219);
    text-decoration: none;
    font-size: 16px;
}
.linkText a:hover {
    color:  rgb(172, 168, 231);
}

.front {
  transform: rotateY(0deg);
}
/* 将back旋转180度，背面朝向用户，这边选y轴的 */
.back {
  transform: rotateY(-180deg);
}

.front,
.back {
  position: absolute;
  /* 然后设置为背面朝向用户时不可见 */
  backface-visibility: hidden;
  /* 用linear顺滑一点 */
  transition: 0.3s linear;
}

/* 将front旋转180度 */
.middle-flip .front {
  transform: perspective(600px) rotateY(180deg) ;
}
/* 将back旋转180度 */
.middle-flip .back {
  transform: perspective(600px) rotateY(0deg) ;
}
</style>