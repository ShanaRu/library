<template>
  <div class="adminLibrary-container">
    <div class="selectBox">
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="国家">
            <el-select v-model="country">
                <el-option v-for="item in defaultData" :label="item.defaultName" :value="item.id" v-bind:key="item.id"></el-option>
                <el-option v-for="item in countryData " :label="item.countryName" :value="item.id" v-bind:key="item.id"></el-option>
            </el-select>
            </el-form-item>

            <el-form-item label="类型">
            <el-select v-model="type">
                <el-option v-for="item in defaultData" :label="item.defaultName" :value="item.id" v-bind:key="item.id"></el-option>
                <el-option v-for="item in typeData " :label="item.typeName" :value="item.id" v-bind:key="item.id"></el-option>
            </el-select>
            </el-form-item>

            <el-form-item label="篇幅">
            <el-select v-model="space">
                <el-option v-for="item in spaceData" :label="item.spaceName" :value="item.id" v-bind:key="item.id"></el-option>
            </el-select>
            </el-form-item>

            <el-form-item label="主题">
            <el-select v-model="theme">
                <el-option v-for="item in defaultData" :label="item.defaultName" :value="item.id" v-bind:key="item.id"></el-option>
                <el-option v-for="item in themeData " :label="item.themeName" :value="item.id" v-bind:key="item.id"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item style="margin-right:0">
                <el-button type="primary" @click="query">查询</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>

    <div class="demo-input-suffix">
        <el-input
            placeholder="请输入图书名称" clearable maxlength="30"
            v-model="searchBookName" class="searchInput">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" @click="searchBook">搜索</el-button>
        <el-button type="success" @click="addOpenDialog">添加图书</el-button>
    </div>  

    <el-dialog title="添加书籍" :visible.sync="dialogAddFormVisible" width="50%" center 
        :before-close="handAddClose">
        <div style="padding:0 50px">
        <el-row :gutter="30">
            <el-form ref="addFormRef" label-width="100px" :model="addForm" :rules="rules">
                <el-col :span="12">
                    <el-form-item label="图书名称" prop="add_bookName">
                        <el-input v-model.trim="addForm.add_bookName" class="addInput"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="作者名称" prop="add_author">
                        <el-input v-model="addForm.add_author" class="addInput"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="图书数量" prop="add_bookCount">
                        <el-input v-model="addForm.add_bookCount" class="addInput"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="国家" prop="add_country">
                    <el-select v-model="addForm.add_country">
                        <el-option v-for="item in countryData " :label="item.countryName" :value="item.id" v-bind:key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="类型" prop="add_type">
                        <el-select v-model="addForm.add_type">
                            <el-option v-for="item in typeData " :label="item.typeName" :value="item.id" v-bind:key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="篇幅" prop="add_space">
                        <el-select v-model="addForm.add_space">
                            <el-option v-for="item in spaceAddData" :label="item.spaceName" :value="item.id" v-bind:key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="主题" prop="add_theme">
                        <el-select v-model="addForm.add_theme">
                            <el-option v-for="item in themeData " :label="item.themeName" :value="item.id" v-bind:key="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="简介" prop="add_info">
                        <el-input type="textarea" :rows="8" v-model="addForm.add_info" resize="none" style="width:560px"
                        placeholder="请输入图书简介"></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="add">添加图书</el-button>
            <el-button @click="close()">取消</el-button>
        </span>
    </el-dialog>
    <el-table :data="tableData.slice(0,7)" border stripe style="width: 100%;">
        <el-table-column prop="id" label="图书编号" min-width="5%" align="center">
        </el-table-column>
        <el-table-column prop="bookName" label="图书名称" min-width="8%" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="author" label="作者" min-width="5%" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="country.countryName" label="国家" min-width="5%" align="center">
        </el-table-column>
        <el-table-column prop="type.typeName" label="类型" min-width="5%" align="center"> </el-table-column>
        <el-table-column prop="theme.themeName" label="主题" min-width="5%" align="center">
        </el-table-column>
        <el-table-column prop="space" label="篇幅" min-width="5%" align="center">
        </el-table-column>
        <el-table-column prop="bookCount" label="图书数量" min-width="3%" align="center">
        </el-table-column>
        <el-table-column prop="createDate" label="上架日期" min-width="6%" align="center">
            <template slot-scope="scope">{{scope.row.createDate | formatDate}}</template>
        </el-table-column>
        <el-table-column prop="info" label="简介" min-width="12%" show-overflow-tooltip align="center">
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="14%" align="center">
            <template slot-scope="scope">
            <el-button @click="getBookHistory(scope.row)" size="small" plain type="success">历史</el-button>
            <el-button
                @click="edit(scope.$index, scope.row)"
                type="info"
                size="small" plain>编辑</el-button>
            <el-button type="danger" size="small" @click="deleteBook(scope.row)" plain>删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-size="pagesize"
        layout="total,prev,pager,next,jumper" :total="dataLength">
    </el-pagination>
    
    <el-dialog title="图书详情" :visible.sync="dialogFormVisible" width="50%" center :before-close="handleClose">
        <div>
            <el-form :model="editData" label-width="100px" :inline="true" :rules="rules" ref="editFormRef">
                <el-form-item label="图书名称" prop="bookName">
                    <el-input v-model="editData.bookName" class="addInput"></el-input>
                </el-form-item>
                <el-form-item label="作者名称" prop="author">
                    <el-input v-model="editData.author" class="addInput"></el-input>
                </el-form-item>
                <el-form-item label="数量" prop="bookCount">
                    <el-input v-model="editData.bookCount" class="addInput"></el-input>
                </el-form-item>
                <el-form-item label="国家" v-if="editData.country != undefined" prop="country">
                    <el-select v-model="editData.country.id" >
                       <el-option v-for="item in countryData " :label="item.countryName" :value="item.id" v-bind:key="item.id"></el-option>     
                    </el-select>
                </el-form-item>
                <el-form-item label="类型" v-if="editData.type != undefined" prop="type">
                    <el-select v-model="editData.type.id" >
                        <el-option v-for="item in typeData " :label="item.typeName" :value="item.id" v-bind:key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="篇幅" prop="space"> 
                    <el-select v-model="editData.space">
                        <el-option v-for="item in spaceAddData" :label="item.spaceName" :value="item.spaceName" v-bind:key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="主题" v-if="editData.theme != undefined" prop="theme">
                    <el-select v-model="editData.theme.id" >
                        <el-option v-for="item in themeData " :label="item.themeName" :value="item.id" v-bind:key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <div>
                    <el-form-item label="简介" prop="info">
                        <el-input type="textarea" :rows="8" v-model="editData.info" resize="none" style="width:550px"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save" ailgn="right">保存图书</el-button>
            <el-button type="text" @click="onSubmit4">取消</el-button>
        </div>
    </el-dialog>
    <el-dialog
    title="借阅历史"
    :visible.sync="bookHistoryVisible"
    width="40%"
    :before-close="handleCloseBookHistory">
        <el-table
            :data="bookHistory" style="100%"
            border>
            <el-table-column prop="userInfo.nickname" align="center" label="用户名称" min-width="15%"></el-table-column>
            <el-table-column prop="borrowDate"     align="center" label="借阅时间" min-width="10%">
                <template slot-scope="scope">{{scope.row.borrowDate | formatDate}}</template>
            </el-table-column>
            <el-table-column prop="returnDate"     align="center" label="应归还时间" min-width="10%">
                <template slot-scope="scope">{{scope.row.returnDate | formatDate}}</template>
            </el-table-column>
            <el-table-column prop="renewState" align="center" label="借阅有效期" min-width="10%">
            <template scope="scope">                    
                <p v-if="scope.row.renewState=='0'">1个月</p>
                <p v-if="scope.row.renewState=='1'">2个月</p>            
            </template>
            </el-table-column>
            <el-table-column prop="right" label="状态" min-width="10%" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.borrowState == 0" type="warning">审核中</el-tag>
                    <el-tag v-if="scope.row.borrowState == 1" type="success">借阅中</el-tag>
                    <el-tag v-if="scope.row.borrowState == 2" type="info">已归还</el-tag>
                    <el-tag v-if="scope.row.borrowState == -1" type="danger">拒绝借阅</el-tag>
                </template>
            </el-table-column>
        </el-table>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bookHistoryVisible = false">关闭</el-button>
    </span>
    </el-dialog>
    
    </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import {formatDate} from '../../assets/js/time.js'
    export default {
        name: "adminLibrary",
        created() {
            this.getBookData(1,this.pagesize);
            this.getCountryData();
            this.getThemeData(),
            this.getTypeData()
        },
        data() {
            var validateCount = (rule,value,callback) => {
                let reg = /^[0-9]+$/;
                if(value.length > 4) {
                    callback('图书数量过多')
                }
                if(!reg.test(value)){
                    callback("图书数量输入错误");
                }else{
                    callback();
                }
            };
            return {
                rules: {
                    add_bookName: [
                        { required: true, message: '请输入图书名称', trigger: 'blur' }
                    ],
                    add_author: [
                        { required: true, message: '请输入图书作者', trigger: 'blur' }
                    ],
                    add_info: [
                        { required: true, message: '请输入图书简介', trigger: 'blur' }
                    ],
                    add_country: [
                        { required: true, message: '请选择图书国家', trigger: 'blur' }
                    ],
                    add_type: [
                        { required: true, message: '请选择图书类型', trigger: 'blur' }
                    ],
                    add_theme: [
                        { required: true, message: '请选择图书主题', trigger: 'blur' }
                    ],
                    add_space: [
                        { required: true, message: '请选择图书篇幅', trigger: 'blur' }
                    ],
                    add_bookCount: [
                        { required: true, message: '请输入图书数量', trigger: 'blur' },
                        { validator:validateCount, trigger: 'blur' }
                    ],
                    bookName: [
                        { required: true, message: '请输入图书名称', trigger: 'blur' }
                    ],
                    author: [
                        { required: true, message: '请输入图书作者', trigger: 'blur' }
                    ],
                    info: [
                        { required: true, message: '请输入图书简介', trigger: 'blur' }
                    ],
                    country: [
                        { required: true, message: '请选择图书国家', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择图书类型', trigger: 'blur' }
                    ],
                    theme: [
                        { required: true, message: '请选择图书主题', trigger: 'blur' }
                    ],
                    space: [
                        { required: true, message: '请选择图书篇幅', trigger: 'blur' }
                    ],
                    bookCount: [
                        { required: true, message: '请输入图书数量', trigger: 'blur' },
                        { validator:validateCount, trigger: 'blur' }
                    ]
                },
                historyCurrentPage:1,
                historyPageSize:5,
                bookHistoryVisible:false,
                bookHistory:[],
                bookHistoryCount:0,
                isBorrowing:true,
                dialogFormVisible: false,
                dialogAddFormVisible: false,
                currentPage: 1, //初始页
                pagesize: 7, //    每页的数据
                visible: false,
                country:0,
                type:0,
                theme:0,
                space:0,
                dataLength:0,
                edit_space:0,
                searchBookName: "",
                defaultData:[{"id":0,"defaultName":"默认"}],
                tableData: [],
                countryData: [],
                themeData: [],
                typeData: [],
                spaceData:[
                  {"id":0,"spaceName":"默认"},
                  {"id":1,"spaceName":"短篇"},
                  {"id":2,"spaceName":"中篇"},
                  {"id":3,"spaceName":"长篇"},
                ],
                spaceAddData:[
                  {"id":1,"spaceName":"短篇"},
                  {"id":2,"spaceName":"中篇"},
                  {"id":3,"spaceName":"长篇"},
                ],
                editData:{},
                addForm:{
                    add_bookName:"",
                    add_author:"",
                    add_info:"",
                    add_country:0,
                    add_type:0,
                    add_theme:0,
                    add_space:1,
                    add_bookCount:0,
                },
                dialogVisible: false,
                dialogTableVisible: false,
            };
        },
        methods: {
            handleCloseBookHistory() {
                this.bookHistoryVisible = false;
            },
            //根据图书id查询该书的借阅历史
            getBookHistory(row){
                this.bookHistoryVisible = true;
                axios({
                    url:'/borrowInfo/bookHistory',
                    method:'get',
                    params: {
                        bookId:Number.parseInt(row.id)
                    }
                })
                .then(response => {
                    let result = response.data;
                    if(result.code == 200) {
                        this.bookHistory = result.data;
                        this.bookHistoryCount = result.count;
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
            handleClose(){
                this.$refs.editFormRef.resetFields(); 
                this.dialogFormVisible = false;
            },
            handAddClose(done){
                this.$nextTick(() => {
                    this.$refs.addFormRef.resetFields();  
                });
                this.dialogAddFormVisible = false;
            },
            addOpenDialog(){
                this.dialogAddFormVisible = true;
            },
            close(){
                this.dialogAddFormVisible = false;
            },
            
            deleteBook(row) {
                this.BookIsBorrowing(row.id);
                this.$confirm('此操作将删除该图书, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        if(this.isBorrowing){
                                this.$message({
                                    showClose: true,
                                    message: '书籍正在被借阅，不能被删除',
                                    type: 'error'
                                });
                            }else{
                                 axios({
                                    method:'delete',
                                    url:"/book/"+row.id,
                                }).then(response => {
                                    this.getBookData(this.currentPage,this.pagesize);
                                    this.$message({
                                        showClose: true,
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                })
                                .catch(error => {
                                    this.$message({
                                        showClose: true,
                                        message: '系统错误',
                                        type: 'error'
                                    });
                                })
                            }
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            },
            getBookData(currentPage,pageSize){
                axios({
                    method:'post',
                    url:"/book/query",
                    data:qs.parse({
                        nickName:this.searchBookName,
                        currentPage:currentPage,
                        pageSize:pageSize,
                        country_id:this.country,
                        theme_id:this.theme,
                        type_id:this.type,
                        space:this.space
                    })
                }).then(response=>{
                    let result = response.data;
                    if(result.code == 999) {
                        // console.log(result.data);
                        this.tableData = result.data;
                        this.dataLength = result.count;
                        // console.log(this.tableData);
                    }
                }).catch(error=>{
                    this.$message({
                        showClose: true,
                        message: '系统错误',
                        type: 'error'
                    });
                })
            },
            getCountryData(){
                axios({
                    method:'get',
                    url:"/country",
                }).then(response => {
                    let result = response.data;
                    if(result.code == 200) {
                        // console.log(result.data);
                        this.addForm.add_country = result.data[0].id;
                        this.countryData = result.data;
                        // console.log(this.countryData);
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
            getThemeData(){
                axios({
                    method:'get',
                    url:"/theme",
                }).then(response => {
                    let result = response.data;
                    if(result.code == 200) {
                        this.addForm.add_theme = result.data[0].id;
                        // console.log(result.data);
                        this.themeData = result.data;
                        // console.log(this.themeData);
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
            getTypeData(){
                axios({
                    method:'get',
                    url:"/type",
                }).then(response => {
                    let result = response.data;
                    if(result.code == 200) {
                        this.addForm.add_type = result.data[0].id;
                        // console.log(result.data);
                        this.typeData = result.data;
                        // console.log(this.typeData);
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
            handleClick(row) {
                console.log(row);
            },
            edit(index, row) {
                this.dialogFormVisible = true;
                this.editData = row;
            },

            add() {
                this.currentPage = 1,
                this.$refs['addFormRef'].validate((valid) => {
                    if(valid) {
                        axios({
                            method:'post',
                            url:"/book",
                            data:qs.parse({
                                bookName:this.addForm.add_bookName,
                                author:this.addForm.add_author,
                                country_id:this.addForm.add_country,
                                theme_id:this.addForm.add_theme,
                                type_id:this.addForm.add_type,
                                space_count:this.addForm.add_space,
                                info:this.addForm.add_info,
                                bookCount:this.addForm.add_bookCount
                            })
                        }).then(response => {
                                if(response.data.code == 200) {
                                    this.close();
                                    this.getBookData(this.currentPage,this.pagesize);
                                    this.$message({
                                        showClose: true,
                                        message: '添加成功',
                                        type: 'success'
                                    });
                                }else {
                                    this.$message({
                                        showClose: true,
                                        message: '添加失败',
                                        type: 'error'
                                    });
                                }
                        }).catch(error => {
                            this.$message({
                                showClose: true,
                                message: '系统错误',
                                type: 'error'
                            });
                        })
                    }else {
                        this.$message({
                            showClose: true,
                            message: '添加失败',
                            type: 'error'
                        });
                    }
                })
            },
            save() {
                this.$refs['editFormRef'].validate((valid) => {
                    if(valid) {
                        axios({
                        method:'put',
                        url:"/book",
                        data:qs.parse({
                            id:Number.parseInt(this.editData.id),
                            bookName:this.editData.bookName,
                            author:this.editData.author,
                            country_id:Number.parseInt(this.editData.country.id),
                            theme_id:Number.parseInt(this.editData.theme.id),
                            type_id:Number.parseInt(this.editData.type.id),
                            space:this.editData.space,
                            bookCount:Number.parseInt(this.editData.bookCount),
                            info:this.editData.info
                        })
                        }).then(response=>{
                                // console.log(this.editData);
                            if(response.data.code == 200) {
                                this.getBookData(this.currentPage,this.pagesize);
                                this.handleClose();
                                this.$message({
                                    showClose: true,
                                    message: '保存成功',
                                    type: 'success'
                                });
                            }else {
                                this.$message({
                                    showClose: true,
                                    message: '保存失败',
                                    type: 'error'
                                });
                            }
                        }).catch(error=>{
                            this.$message({
                                showClose: true,
                                message: '系统错误',
                                type: 'error'
                            });
                        })
                    }else {
                        this.$message({
                            type: 'error',
                            message: '保存失败',
                            showClose: true,
                        });
                    }
                })
            },
            reset(){
                this.currentPage=1;
                this.searchBookName="";
                this.space=0;
                this.type=0;
                this.theme=0;
                this.country=0;
                this.getBookData(this.currentPage,this.pagesize);
            },
            onSubmit4() {
                        this.dialogFormVisible = false;
                        this.getBookData(this.currentPage,this.pagesize);
                        this.$message({
                            type: "info",
                            message: "已取消修改",
                        });
            },

            searchBook() {
                this.currentPage = 1;
                axios({
                    url:"/book/query",
                    method: "post",
                    data:qs.parse({
                        nickname:this.searchBookName,
                        currentPage:this.currentPage,
                        pageSize:this.pagesize,
                        country_id:this.country,
                        theme_id:this.theme,
                        type_id:this.type,
                        space:this.space
                    })
                }).then(response=>{
                    console.log(response);
                    let result = response.data;
                    if(result.code == 999) {
                        // console.log(this.searchBookName);
                        // console.log(result.data);
                        this.tableData = result.data;
                        this.dataLength = result.count;
                    }
                }).catch(error=>{
                    this.$message({
                        showClose: true,
                        message: '系统错误',
                        type: 'error'
                    });
                })
            },
            open() {
                this.$confirm("是否确定添加此书", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        this.$message({
                            type: "success",
                            message: "添加成功!",
                            showClose: true,
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消添加",
                            showClose: true,
                        });
                    });
            },

            query() {
                this.currentPage = 1;
                console.log(this.searchBookName);
                axios({
                    url:"/book/query",
                    method: "post",
                    data:qs.parse({
                        nickname:this.searchBookName,
                        currentPage:this.currentPage,
                        pageSize:this.pagesize,
                        country_id:this.country,
                        theme_id:this.theme,
                        type_id:this.type,
                        space:this.space
                    })
                }).then(response=>{
                    let result = response.data;
                    if(result.code == 999) {
                        // console.log(result.data);
                        this.tableData = result.data;
                        this.dataLength = result.count;
                        // console.log(this.tableData);
                    }
                }).catch(error=>{
                    this.$message({
                        showClose: true,
                        message: '系统错误',
                        type: 'error'
                    });
                })
            },
            handleUserList() {},
            handleSizeChange(val) {
                this.pagesize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getBookData(this.currentPage,7);
            },
            BookIsBorrowing(bookId){
                axios({
                    method:'get',
                    url:'/borrowInfo/bookIsBorrowing',
                    params:{
                        bookId:bookId,
                    }
                }).then(response=>{
                    let result = response.data;
                   this.isBorrowing = result.data;
                })
            }
        },
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
.el-select {
    width: 220px;
}
.selectBox {
    margin-top: 10px;
    float: right;
}
.demo-input-suffix {
    margin-bottom: 20px;
    float: right;
}
.searchInput {
    width: 300px;
    margin-right: 20px;
}
.el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}
.addInput {
    width: 220px;
}
    /*.el-select {
        width: 164px;
    }
    
    .el-row {
        margin-top: 10px;
        width: 13px;
        margin-left: 77%;
    }
    
    .el-table {
        margin-top: 2%;
        margin-left: 12.5%;
    }
    
    .el-pagination {
        margin-top: 3%;
    }
    
    .b {
        margin-left: 45%;
    }
    .information {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
    }*/
</style>