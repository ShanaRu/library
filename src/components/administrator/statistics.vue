<template >
  <div class="statistics-container">
    <div class="card">
      
      <el-row :gutter="40"> 

       <el-col :span="24">
        <el-card  shadow="hover">
           <span class="title el-icon-message-solid ">图书借阅统计</span>
        </el-card>
      </el-col>
      </el-row>
    </div>

    
    <div class="second">
    <span class="el-icon-cloudy"><strong>借书统计</strong></span><hr/>
      <el-row :gutter="40" class="borrow">  
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-watch grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{borrowToday}}</div>
                                    <div>今日借出统计</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-collection-tag grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{borrowThisMonth}}</div>
                                    <div>本月借出统计</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-date grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{borrowThisYear}}</div>
                                    <div>年度借出统计</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>      
      </el-row>
    </div>

    <div class="third">
    <span class="el-icon-partly-cloudy"><strong>借阅状态统计</strong></span><hr/>
      <el-row :gutter="40" class="borrow">  
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-s-flag grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{reviewing}}</div>
                                    <div>正在审核数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-s-marketing grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{borrowing}}</div>
                                    <div>正在借阅数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-circle-close grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{overdue}}</div>
                                    <div>逾期未还数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                
            
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name: "statistics",
    data() {
        return {
            overdue: 0,
            borrowToday: 0,
            borrowThisMonth: 0,
            borrowThisYear: 0,
            reviewing: 0,
            borrowing: 0,
        }
    },
    // created(){
    //     this.getStatisData();
    // },
    created(){
        this.getStatisData();
    },
    methods: {
        getStatisData(){
            axios({
                method:'get',
                url:"/borrowInfo/statistics"
            }).then(response=>{
                let result = response.data;
                if(result.code == 200){
                    // console.log(result.code);
                    // console.log(result.data);
                    this.overdue = result.data.overdue;
                    this.borrowToday = result.data.borrowToday;
                    this.borrowThisMonth = result.data.borrowThisMonth;
                    this.borrowThisYear = result.data.borrowThisYear;
                    this.reviewing = result.data.reviewing;
                    this.borrowing = result.data.borrowing;
                    // console.log(this.borrowToday);
                    
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
.title{
    font-size: 40px;
    color:#00CCFF;
    letter-spacing: 3px;
}
.borrow{
    margin-top: 1%;
}

.card{
  text-align: center;
  margin-top: 1%;
  line-height:1.7;
  height: 16px;

}

.second{
   margin-top:11%;
   line-height:1.7
}

.third{
   margin-top: 5%;
   line-height:1.7
}


.charts{
 text-align: center;
 margin-top: 1%;
 line-height:1.7;
 height: 20px;

}

.el-row {
    margin-bottom: 18px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 110px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}


.grid-con-icon {
    font-size: 50px;
    width: 110px;
    height: 110px;
    text-align: center;
    line-height: 110px;
    color: #fff;
}
.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon2 {
    background: rgb(250, 253, 50);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}
</style>