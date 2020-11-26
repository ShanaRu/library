<template >
  <div class="adminHomePage-container">
    <div class="card">
        <el-row :gutter="40"> 
        <el-col :span="8">
            <el-card  shadow="hover"> 
            <h1>图书管理系统概况</h1>
            
            </el-card>
        </el-col>

            <el-col :span="16">
                    <el-row :gutter="20" class="mgb20">
                        <el-col :span="12">
                            <el-card shadow="hover" :body-style="{padding: '0px'}">
                                <div class="grid-content grid-con-1">
                                    <i class="el-icon-s-custom grid-con-icon"></i>
                                    <div class="grid-cont-right">
                                        <div class="grid-num">{{userCount}}</div>
                                        <div>用户数量</div>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="12">
                            <el-card shadow="hover" :body-style="{padding: '0px'}">
                                <div class="grid-content grid-con-2">
                                    <i class="el-icon-reading grid-con-icon"></i>
                                    <div class="grid-cont-right">
                                        <div class="grid-num">{{bookCount}}</div>
                                        <div>图书数量</div>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                        
                    </el-row>
                </el-col>
        </el-row>
    </div>

    <div class="second">
        <el-row :gutter="40"> 
            <el-col :span="12">
            <!-- <el-card class="box-card-yuan" shadow="hover"> -->
            <el-card class="chart-box-card" shadow="hover"> 
                <div ref="typeChart" style="width:100%;height:220px"></div>
            </el-card>      
            </el-col>
            <el-col :span="12">
            <!-- <el-card class="box-card-yuan" shadow="hover"> -->
            <el-card class="chart-box-card" shadow="hover"> 
                <div ref="countryChart" style="width:100%;height:220px"></div>
            </el-card>      
            </el-col>
        </el-row>
    </div>

   <div class="charts">
    <el-row :gutter="40"> 
        <el-col :span="12">
            <el-card class="chart-box-card" shadow="hover"> 
                <div ref="ageChart" style="width:100%;height:208px"></div>
            </el-card> 
        </el-col>
        <el-col :span="12">
            <el-card class="team-card" shadow="hover">
            
                <div slot="">
                <strong>团队成员</strong>
                </div>
                <div class="grid-content2 grid-con-2">
                                    <i class="el-icon-ship grid-con-icon2"></i>
                            <div class="grid-cont-right">
                        <div class="grid-num2">李达成、李贤劭、李润东</div>
                    </div>
                </div>
                <div class="grid-content2 grid-con-2">
                                    <i class="el-icon-ship grid-con-icon2"></i>
                            <div class="grid-cont-right">
                        <div class="grid-num2">梁顺如、郑浩明、黄伟文</div>
                    </div>
                </div>
                <div class="grid-content2 grid-con-2">
                                    <i class="el-icon-ship grid-con-icon2"></i>
                            <div class="grid-cont-right">
                        <div class="grid-num2">梁耀渠、何美婷、冯雅萱、许露露</div>
                    </div>
                </div>
                <!-- <div class="grid-content2 grid-con-2">
                                    <i class="el-icon-ship grid-con-icon2"></i>
                            <div class="grid-cont-right">
                        <div class="grid-num2">测试：</div>

                    </div>
                </div>
                <div class="grid-content2 grid-con-2">
                                    <i class="el-icon-ship grid-con-icon2"></i>
                            <div class="grid-cont-right">
                        <div class="grid-num2">前端：</div>
                    
                    </div>
                </div> -->
            </el-card>
        </el-col>
    </el-row>
   </div>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default {
    name: "adminHomePage",
    data() {
        return {
            themeData:[],
            typeData:[],
            typeLegendData:[],
            countryData:[],
            countryLegendData:[],
            ageData:[],
            userCount:0,
            bookCount:0,
        }
    },
    // created(){
    //     this.getThemeData();//获取图书主题分类数据
    // },
    mounted(){
    this.getuserAndBookCount(),
    // this.getThemeEchartData(),
    this.getcountryEchartData(),
    this.getTypeEchartData(),
    this.getAgeEchartData()
    },
    methods: {
    // 获取用户和图书数量
    getuserAndBookCount(){
            axios({
                method:'get',
                url:"/welcome/getuserandbookcount"
            }).then(response=>{
                let result = response.data;
                if(result.code == 200){
                    // console.log(result.code);
                    // console.log(result.data);
                    this.bookCount = result.data.bookCount;
                    this.userCount = result.data.userCount;
                    // console.log(this.userCount);
                    
                }
            }).catch(error=>{
                this.$message({
                    showClose: true,
                    message: '错误',
                    type: 'error'
                });
            })
        },

    // 获取各主题的图书数量
    // getThemeData() {
    //     axios({
    //             method:'get',
    //             url:"/welcome/caltheme"
    //         }).then(response => {
    //         let result = response.data;
    //         //console.log(result);
    //         if(response.data.code == 200) {
    //             let themeData = result.data.echartSeriesDataList;
    //             console.log(themeData);
    //             // this.$message({
    //             //     type:'success',
    //             //     message:'获取图书主题分类成功',
    //             //     showClose:true
    //             // })
    //             //console.log(this.themeOption.series[0].data);
    //             this.themeOption.series[0].data = themeData;
    //             console.log(this.themeOption.series[0].data);
    //         }
    //     }).catch(error => {
    //         this.$message({
    //             type:'error',
    //             message:'获取图书主题分类失败',
    //             showClose:true
    //         })
    //     })
    // },
    // getThemeEchartData() {
    //     axios({
    //             method:'get',
    //             url:"/welcome/caltheme"
    //         }).then(response => {
    //             if(response.data.code == 200) {
    //                // console.log(response.data.code);
    //                 this.themeData = response.data.data.echartSeriesDataList;
    //                // console.log(response.data.data.echartSeriesDataList);
    //     const chart = this.$refs.themeChart;
    //     if (chart) {
    //         const myChart = this.$echarts.init(chart)
    //         const option={backgroundColor: '#BFBFBF ',
    //         title: {
    //             text: '图书主题分类',
    //             left: 'center'
    //         },

    //         tooltip: {
    //             trigger: 'item',
    //             formatter: '{a} <br/>{b} : {c} ({d}%)'
    //         },

    //         visualMap: {
    //             show: false,
    //             min: 80,
    //             max: 600,
    //             inRange: {
    //                 colorLightness: [0, 1]
    //             }
    //         },
    //         series: [
    //             {
    //                 name: '访问来源',
    //                 type: 'pie',
    //                 radius: '55%',
    //                 center: ['50%', '50%'],
    //                 data: this.themeData,
    //                 // data: this.themeData,
    //                 roseType: 'radius',
    //                 label: {
    //                     color: 'rgba(255, 255, 255, 0.3)'
    //                 },
    //                 labelLine: {
    //                     lineStyle: {
    //                         color: 'rgba(255, 255, 255, 0.3)'
    //                     },
    //                     smooth: 0.2,
    //                     length: 10,
    //                     length2: 20
    //                 },
    //                 itemStyle: {
    //                     color: '#c23531',
    //                     shadowBlur: 200,
    //                     shadowColor: 'rgba(0, 0, 0, 0.5)'
    //                 },

    //                 animationType: 'scale',
    //                 animationEasing: 'elasticOut',
    //                 animationDelay: function (idx) {
    //                     return Math.random() * 200;
    //                 }
    //             }
    //         ]}
    //         myChart.setOption(option)
    //             window.addEventListener("resize", function() {
    //             myChart.resize()
    //         })
    //     }
    //     this.$on('hook:destroyed',()=>{
    //         window.removeEventListener("resize", function() {
    //             myChart.resize();
    //         });
    //     })
    //     }

    //     }).catch(error => {
    //         this.$message({
    //             type:'error',
    //             message:'获取图书主题分类失败',
    //             showClose:true
    //         })
    //     })
    // },
    // 类型
    getTypeEchartData() {
        axios({
                method:'get',
                url:"/welcome/caltype"
            }).then(response => {
                if(response.data.code == 200) {
                   // console.log(response.data.code);
                    this.typeData = response.data.data.echartSeriesDataList;
                    this.typeLegendData = response.data.data.legendData;
        const chart = this.$refs.typeChart
        if (chart) {
            const myChart = this.$echarts.init(chart)
            const option = {
            title: {
                text: '图书分类',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: this.typeLegendData
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '60%',
                    center: ['55%', '65%'],
                    data: this.typeData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]}
            myChart.setOption(option)
                window.addEventListener("resize", function() {
                myChart.resize()
            })
        }
        this.$on('hook:destroyed',()=>{
            window.removeEventListener("resize", function() {
                myChart.resize();
            });
        })
                }
                }).catch(error => {
            this.$message({
                type:'error',
                message:'获取图书类别分类失败',
                showClose:true
            })
        })
    },
    // 获取国家
    
       getcountryEchartData() {
        axios({
                method:'get',
                url:"/welcome/calcountry"
            }).then(response => {
                if(response.data.code == 200) {
                     this.countryData = response.data.data.echartSeriesDataList;
                    this.countryLegendData = response.data.data.legendData;
        const chart = this.$refs.countryChart
        if (chart) {
            const myChart = this.$echarts.init(chart)
            const option = {
            title: {
            text: '图书国家分类',
            left: 'center'
        },
            tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: -1,
            data: this.countryLegendData
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: ['50%', '70%'],
                center: ['55%', '55%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: this.countryData
            }
        ]}
            myChart.setOption(option)
            window.addEventListener("resize", function() {
            myChart.resize()
            })
        }
        this.$on('hook:destroyed',()=>{
            window.removeEventListener("resize", function() {
                myChart.resize();
            });
        })
                }
                }).catch(error => {
            this.$message({
                type:'error',
                message:'获取图书国家分类失败',
                showClose:true
            })
        })
    },
    // 年龄
     getAgeEchartData() {
        axios({
                method:'get',
                url:"/welcome/calage"
            }).then(response => {
                if(response.data.code == 200) {
   this.ageData = response.data.data.series.data;
      const chart = this.$refs.ageChart
        if (chart) {
        const myChart = this.$echarts.init(chart)
        const option = {
            title: {
            text: '用户年龄分布',
            left: 'center'
        },
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['0~10', '11~20', '21~30', '31~40', '41~50', '51~60', '>=60'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '该年龄段的人数',
                type: 'bar',
                barWidth: '60%',
                data: this.ageData
            }
    ]}
        myChart.setOption(option)
        window.addEventListener("resize", function() {
            myChart.resize()
        })
        }
        this.$on('hook:destroyed',()=>{
            window.removeEventListener("resize", function() {
                myChart.resize();
            });
        })
                }
                }).catch(error => {
            this.$message({
                type:'error',
                message:'获取图书国家分类失败',
                showClose:true
            })
        })

    },
  }
}
</script>

<style scoped>


.card{
  text-align: center;
  margin-top: 1%;
  line-height:1.7;
  height: 16px;
  
}
.box-card{
  
  width: 410px;
}
.team-card{
  margin-top: 1%;
  
  
  height:240px
}
.second{
   text-align: center;
   margin-top:9%;
   line-height:1.7
}
.box-card-yuan{ 
  width: 200px;
  border-radius:90%
}
.charts{
 text-align: center;
 margin-top: 1%;
 line-height:1.7;
 height: 20px;

}


.adminHomePage-container{
   margin-top: 1%;
   
}

.el-row {
    margin-bottom: 18px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 110px;
}

.grid-content2 {
    margin-top: 15px;
    display: flex;
    align-items: center;
    height: 45px;
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

.grid-num2 {
    margin-left: 5px;
    font-size: 20px;
    font-weight: bold;
    float: left;
}

.grid-con-icon {
    font-size: 50px;
    width: 110px;
    height: 110px;
    text-align: center;
    line-height: 110px;
    color: #fff;
}

.grid-con-icon2 {
    font-size: 25px;
    width: 45px;
    height: 45px;
    text-align: center;
    line-height: 45px;
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

.grid-con-2 .grid-con-icon2 {
    background: rgb(100, 213, 114);
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