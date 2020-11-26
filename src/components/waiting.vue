<template>
    <div class="waiting-container">
        正在激活...还有{{time}}秒跳转
    </div>
</template>
<script>
import Axios from 'axios';
export default {
    name:"waiting",
    data() {
        return {
            time:5,
            userId:0,
            timer:0
        }
    },
    methods: {
        countDown() {
            this.active();//调用激活账号接口
            //倒计时5秒跳转登录页面
            this.timer = setInterval(()=>{
                this.time--; 
                if(this.time == 0){
                    clearInterval(this.timer);
                    this.$router.push('/login');
                }
            },1000)
            
        },
        active() {
            //获取url中的userId
            let url = window.location.href;
            // let index1 = url.indexOf("=");
            // this.userId = url.substr(index+1);
            let urlArray = url.split("&");
            let index1 = urlArray[0].indexOf("=");
            this.userId = urlArray[0].substr(index1+1);
            let index2 = urlArray[1].indexOf("=");
            this.timer = urlArray[1].substr(index2+1);
            Axios({
                method:'get',
                url:'user/active?userId='+this.userId+'&time='+this.timer
            })
            .then(response => {
                if(response.data.code == 200) {
                    this.$message({
                        type:'success',
                        message:'账号激活成功',
                        showClose:true
                    })
                }
            })
            .catch(error => {
                this.$message({
                    type:'error',
                    message:'账号激活失败',
                    showClose:true
                })
            })
        }
    },
    created() {
        this.countDown();
    }
}
</script>
<style scoped>
.waiting-container{
    text-align: center;
    margin-top: 100px;
    font-size: 18px;
}    
</style>