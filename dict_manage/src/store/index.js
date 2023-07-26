import { defineStore } from "pinia"; //这行代码是引入了Pinia库中的defineStore函数，该函数用于定义一个Pinia Store。
import axios from "axios";
import {get,post,put,del} from "../api/api.js"
import { ref ,reactive} from "vue";
//定义了一个名为useStore的函数，并使用defineStore函数来创建一个Pinia Store
export const useStore = defineStore({
  id: "dict", //这是Store的唯一标识符，可以在整个应用程序中区分不同的Store。
  state: () => ({
    //这是Store的状态部分，使用一个函数来返回状态对象
    visible: false, //新增弹窗是否可见
    updataVisible: false, //修改弹窗是否可见
    listValue: [], //字典管理的el-table数据
    navigationParams: [], //记录路由跳转的数组，用于顶部栏显示多少个字典数据
    selectedParams: "dict", //默认顶部栏选中的按钮是字典管理
    typeNameList: [], //所有字典名称数组
    deletedId: 1,//table表中删除数据的id
    windowWidth: ref(window.innerWidth),//屏幕宽度
    clickArr : reactive(["dict"]),//记录点击的数组
    searchData: {
      pageNo: 1, //当前页数
      pageSize: 10, //每页显示条目数
      total: 0, //字典管理显示总记录条数
      name: "", //字典名称
      type: "", //字典类型
      status: undefined, //字典状态
      create_time: [], //创建时间
    },
    queryParamsDict: {
      pageNo: 1, //当前页数
      pageSize: 10, //每页显示条目数
      total: 0, //字典数据总条数
      label: "", //字典标签
      status: undefined, //字典数据状态
      dict_type: "", //字典类型
      type: "",
    },
    formData: {
      //字典管理页面点击修改默认弹出的数据
      id: undefined,
      name: "",
      type: "",
      status: "",
      remark: "",
    },
    dictData: {
      //字典数据页面点击修改默认弹出的数据
      id: undefined,
      sort: "",
      label: "",
      value: "",
      dict_type: "",
      status: "",
      color_type: "",
      css_class: "",
      remark: "",
      param_id: "",
    },
    parentList: [//字典数据页面的父级字典名称数组，父节点数组
      {
        value: "用户性别",
        label: "用户性别",
      },
      {
        value: "用户性别",
        label: "用户性别",
      },
    ],
    listValueDict: [], //字典数据页面的el-table数据
  }),
  actions: {
    //这是Store的操作部分，包含操作方法
    //打开修改字典管理的弹窗赋初始值
    async dialogUpdataOpen(id) {
      try {
        const response = await get(`/record/${id}`);
        const record = response.data;
        this.formData.id = id;
        this.formData.name = record.name;
        this.formData.type = record.type;
        this.formData.status = record.status == 0 ? "开启" : "关闭";
        this.formData.remark = record.remark;
        console.log("Record:", record);
        // 进行后续处理，例如更新UI或其他操作
      } catch (error) {
        console.error("Error:", error);
        // 处理错误，例如显示错误消息或其他操作
      }
      this.updataVisible = true;
    },
    //打开修改字典数据的弹窗赋初始值
    async dictUpdataOpen(id) {
      try {
        const response = await get(
          `/recordDict/${id}`
        );
        const record = response.data;
        this.dictData = record;
        this.dictData.status = record.status == 0 ? "开启" : "关闭";
        console.log("Record:", record);
        // 进行后续处理，例如更新UI或其他操作
      } catch (error) {
        console.error("Error:", error);
        // 处理错误，例如显示错误消息或其他操作
      }
      this.updataVisible = true;
    },
    //获取字典管理表格数据
    async getListData() {
      try {
        console.log(this.searchData);
        // 将 create_time 转换为数组形式
        if (this.searchData.create_time!=null){
          this.searchData.create_time = Object.values(
            this.searchData.create_time
          );
        }else{
          this.searchData.create_time = [];
        }
        const response = await post(
          "/searchData",
          this.searchData
        );
        console.log(response.data);
        this.listValue = response.data.results;
        this.searchData.total = response.data.totalCount;
      } catch (error) {
        console.error("请求出错：", error);
      }
    },
    //获取字典数据表格数据
    async getListDataDict() {
      try {
        console.log(this.queryParamsDict);
        const response = await post(
          "/searchDataDict",
          this.queryParamsDict
        );
        this.typeNameList = response.data.allParentResult.recordset;
        this.parentList = response.data.allParentResult.recordset;
        this.listValueDict = response.data.results;
        this.queryParamsDict.total = response.data.totalCount;
      } catch (error) {
        console.error("请求出错：", error);
      }
    },
    //删除某表格某条记录
    async delete(tableName) {
      try {
        console.log(this.deletedId);
        const response = await del(
          `/record/${tableName}/${this.deletedId}`
        );
        this.getListData();
        this.getListDataDict();
      } catch (error) {
        console.error("请求出错：", error);
      }
    },
    //修改字典管理保存
    async updateRecord() {
      try {
        const response = await put(
          `/record/${this.formData.id}`,
          this.formData
        );
        this.updataVisible = false;
        this.getListData();
        // 进行后续处理，例如显示成功消息或其他操作
      } catch (error) {
        console.error("Error:", error);
        // 处理错误，例如显示错误消息或其他操作
      }
    },
    //修改字典数据保存
    async updataDict() {
      try {
        console.log(this.dictData);
        const response = await put(
          `/updict/${this.dictData.id}`,
          this.dictData
        );
        this.updataVisible = false;
        this.getListData();
        this.getListDataDict();
        // 进行后续处理，例如显示成功消息或其他操作
      } catch (error) {
        console.error("Error:", error);
        // 处理错误，例如显示错误消息或其他操作
      }
    },
  },
});
