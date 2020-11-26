<template>
  <div class="userHomePage">
     <div class="notice-div">
          <ul class="notice-ul">
            <router-link to="/viewAnnouncement">
              <li class="notice-move" v-for="(item,index) in noticeList" v-bind:key="index">
                  <span class="el-icon-star-off message-icon notice-content">&nbsp;|{{item.releaseTime | formatDate}}| &nbsp; {{item.content}}</span>
              </li>
            </router-link>
          </ul>
    </div>
    <el-row :gutter="25">
        <el-col :span="8"><div class="grid-content"></div> 
        <div class="Mybook" >
            <router-link to="/bookshelf"><img src="../../assets/images/1.png" alt="1"></router-link>
            <p class="demonstration" >我 的 书 架</p>
        </div></el-col>

        <el-col :span="8"><div class="grid-content "></div>  
        <div class="Library">
          <router-link to="/userLibrary"><img src="../../assets/images/2.gif" alt="2"></router-link>
           <p class="demonstration" >图 书 库</p>
        </div></el-col>

        <el-col :span="8"><div class="grid-content "></div>
        <div class="Myinfo">
            <router-link to="/informationPage"><img src="../../assets/images/3.png" alt="3"></router-link>
            <p class="demonstration" style="">我 的 信 息</p>
        </div></el-col>
    </el-row>
</div>
  
</template>

<script>
import axios from 'axios'
import {formatDate} from '../../assets/js/time.js'
export default {
    name: "userHomePage",
    data() {
        return {
            noticeList:[],
            currentPage:1,
            pageSize:5,
        }
    },
    created(){
        this.getNotice();
    },
    methods:{
        getNotice(){
            axios({
                    method:'get',
                    url:'/notice',
                    params:{
                        currentPage:this.currentPage,
                        pageSize:this.pageSize,
                    }
                }).then(response=>{
                     let result = response.data;
                     if(result.code == 200) {
                        this.noticeList = result.data;
                    }
                }).catch(error => {
                    this.$message({
                      type: 'info',
                      message: '系统错误',
                      showClose: true
                    });
                })
        }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
      }
    }
}
</script>

<style scoped>
.userHomePage{
    position: relative;
    text-align: center;
    height: 100%;
}
.el-row {
    position: relative;
    text-align: center;
    top: 25%;
}
.el-col {
    border-radius: 4px;
}
  
.Mybook-img{
    height: 30px;
}

img {
    height:200px ;
    width: 200px; 
    transition: all 1s;
    border-radius: 10px;
}

img:hover {
    box-shadow: 0px 0px 35px rgb(150, 170, 214);
    transform: scale(1.2);
}
.demonstration{
     margin-left:8%;
     margin-top: 15%;
     font-size: 25px;
     font-weight: bold;
     font-family:SimSun ;
}


@keyframes scroll {
  0% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
  }
  20% {
    -webkit-transform: translateY(-20px);
    transform: translateY(-20px);
  }
  40% {
    -webkit-transform: translateY(-55px);
    transform: translateY(-55px);
  }
  60% {
    -webkit-transform: translateY(-95px);
    transform: translateY(-95px);
  }
  80% {
    -webkit-transform: translateY(-135px);
    transform: translateY(-135px);
  }
  100% {
    -webkit-transform: translateY(-175px);
    transform: translateY(-175px);
  }
 
}
.notice-div {
  position: relative;
  left: 410px;
  width: 940px;
  height: 40px;
  overflow: hidden;
}
.notice-ul{
  height: 100%;
  width: 100%;
  -webkit-animation: scroll 10s infinite;
}
li {
  padding-bottom: 10px;
  height: 30px;
  white-space: nowrap;
  list-style: none;
  text-overflow:ellipsis;
}
a{
  text-decoration: none;
  color: black;
}
.message-icon{
  font-size: 25px;
  color: rgb(30,14,107);
}
.notice-move{
  font-size: 25px;
  position: relative;
  left: 110px;
}
.notice-content{
  text-overflow:ellipsis;
  width: 1000px;
  text-align: left;
}
</style>