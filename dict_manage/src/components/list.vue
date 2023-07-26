<template>
    <!-- 搜索按钮 -->
    <div class="search">
        <el-form ref="queryFormRef" :inline="true" :model="store.searchData" class="-mb-15px" label-width="68px">
            <el-form-item label="字典名称" prop="name">
                <el-input v-model="store.searchData.name" class="inputItem" clearable placeholder="请输入字典名称"
                    @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="字典类型" prop="type">
                <el-input v-model="store.searchData.type" class="inputItem" clearable placeholder="请输入字典类型"
                    @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="store.searchData.status" class="inputItem" clearable placeholder="请选择字典状态">
                    <el-option v-for="dict in options" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间" prop="store.searchData.create_time">
                <el-date-picker v-model="store.searchData.create_time" :style="{ width: '220px' }"
                    :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" end-placeholder="结束日期"
                    start-placeholder="开始日期" type="daterange" value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleSearch" class="btnSearch">搜索</el-button>
                <el-button type="primary" icon="Plus" @click="handleDialogClick" class="btnadd">新增</el-button>
            </el-form-item>
        </el-form>
    </div>

    <!-- table列表展示 -->
    <div class="el-body">
        <el-table v-loading="loading" :data="store.listValue">
            <el-table-column align="center" label="字典编号" prop="id" />
            <el-table-column align="center" label="字典名称" prop="name" show-overflow-tooltip />
            <el-table-column align="center" label="字典类型" prop="type" width="260" />
            <el-table-column align="center" label="状态" prop="status">
                <template #default="scope">
                    <span :class="getStatusClass(scope.row.status)">
                        {{ getStatusText(scope.row.status) }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注" prop="remark" />
            <el-table-column :formatter="dateFormatter" align="center" label="创建时间" prop="create_time" width="180" />
            <el-table-column align="center" label="操作" width="150">
                <template #default="scope">
                    <el-button v-hasPermi="['system:dict:update']" link type="primary"
                        @click="handleDialogUpdata(scope.row.id)">
                        修改
                    </el-button>
                    <el-button link type="primary" @click="handleDataClick(scope.row.type)">数据</el-button>
                    <el-button v-hasPermi="['system:dict:delete']" link type="danger" @click="handleDelete(scope.row.id)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination class="pagination" v-if="store.searchData.total !== 0"
            layout="total, sizes, prev, pager, next, jumper" v-model:total="store.searchData.total"
            v-model:current-page="store.searchData.pageNo" v-model:page-size="store.searchData.pageSize" :background="true"
            @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
    <!-- 表单弹窗：添加/修改 -->
    <MyDialog />
    <MyDialogUpdata></MyDialogUpdata>
</template>

<script lang="jsx" setup>
import { ref, h, onMounted, reactive, defineComponent, watchEffect  } from "vue";
import MyDialog from "./MyDialog.vue";
import MyDialogUpdata from "./MyDialogUpdata.vue";
import dayjs from 'dayjs'
import { ElMessageBox, ElMessage, ElButton, ElTag } from "element-plus";
import { useStore } from '../store/index';
const store = useStore()
import { useRouter } from 'vue-router'
const router = useRouter()

//字典状态选项
const options = [
    {
        value: '开启',
        label: '开启',
    },
    {
        value: '关闭',
        label: '关闭',
    }
]

//新增弹窗打开
const handleDialogClick = () => {
    store.visible = true;
}

//调整状态字段，使得status=0显示开启，1显示关闭
const getStatusText = (value) => {
    return value === 0 ? '开启' : '关闭';
}

//调整状态字段样式
const getStatusClass = (value) => {
    return value === 0 ? 'status-yes' : 'status-no';
}

//时间格式修改
const dateFormatter = (row, column, cellValue) => {
  // 如果 cellValue 不存在或为空，直接返回
  if (!cellValue) {
    return;
  }
  // 调用 formatDate 函数进行日期格式化
  return formatDate(cellValue);
};

function formatDate(date, format) {
  // 如果日期不存在，则返回空字符串
  if (!date) {
    return '';
  }
  // 如果未提供格式参数，则默认使用 'YYYY-MM-DD HH:mm:ss' 格式
  if (format === undefined) {
    format = 'YYYY-MM-DD HH:mm:ss';
  }
  // 使用 dayjs 库对日期进行格式化
  return dayjs(date).format(format);
}

//点击字典数据的时候
const handleDataClick = (type) => {
    const maxNum=Math.floor((store.windowWidth-200)/110-1)
    //当字典数据过多的时候，提示用户删除已有字典数据页
    if (store.navigationParams.length > maxNum) {
        ElMessage({
            message: '您最多可以打开'+maxNum+'个字典数据页，请删除已有字典数据页后再打开新字典数据页！',
            type: 'warning',
        })
    } else {
        store.clickArr.push(type)
        router.replace(`/dict/data/${type}`)
    }
}

//点击删除按钮
const handleDelete = (id) => {
    store.deletedId = id
    store.delete("system_dict_type")
}

//点击修改按钮
const handleDialogUpdata = (id) => {
    store.dialogUpdataOpen(id)
}

//分页器每页条数变化
const handleSizeChange = () => {
    store.getListData()
}
//分页器第几页变化
const handleCurrentChange = () => {
    store.getListData()
}
//搜索按钮
const handleSearch = () => {
    store.getListData()
}

//首次加载获取数据
store.getListData()
//在 Vue 3 中，watchEffect 是一个用于监听响应式数据变化的 API。
//它类似于 Vue 2 中的 watch，但与 watch 不同，watchEffect 没有指定要监听的特定响应式属性，
//而是会自动追踪函数体内使用的响应式数据，并在其中的任何数据发生变化时触发回调函数。
watchEffect(() => {//监听window的宽度变化
      store.windowWidth=ref(window.innerWidth);
});

</script>

<style scoped lang="scss">
.search {
    margin: 20px auto;
    margin-bottom: 8px;
    width: 94%;
    border: 1px solid #d8dce5;
    border-radius: 4px;
    padding: 20px 0px 16px 20px;
}
.btnSearch {
    background: #fff;
    color: #606266;
    border-color: #dcdfe6;
}

.btnSearch:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background: #ecf5ff;
}

.btnadd {
    background: #ecf5ff;
    color: #409eff;
    border-color: #a0cfff;
    transition: all 0.3s ease-in-out;
}

.btnadd:hover {
    color: #ffffff;
    border-color: #409eff;
    background: #409eff;
}

.el-body {
    padding: 13px;
    width: 93.5%;
    border: 1px solid #d8dce5;
    border-radius: 4px;
    margin: 15px auto;
    margin-bottom: 0px;
    position: relative;
    padding-bottom: 50px;
    .pagination {
        position: absolute;
        right: 5px;
        bottom: 6px;
    }
}

.status-yes {
    color: #409EFF;
    border: 0.1px solid #D9ECFF;
    padding: 1px 4px;
    border-radius: 18%;
    background: #ECF5FF;
}

.status-no {
    color: red;
    border: 0.1px solid #D9ECFF;
    padding: 1px 4px;
    border-radius: 18%;
    background: yellow;
}

.inputItem {
    width: 240px;
}
</style>