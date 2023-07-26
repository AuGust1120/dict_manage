<template>
    <div class="search">
        <el-form ref="queryFormRef" :inline="true" :model="store.queryParamsDict" class="-mb-15px" label-width="68px">
            <el-form-item label="字典名称" prop="name">
                <el-select v-model="store.queryParamsDict.type" class="inputItem">
                    <el-option v-for="item in store.typeNameList" :key="item.name" :label="item.name" :value="item.type" />
                </el-select>
            </el-form-item>
            <el-form-item label="字典标签" prop="type">
                <el-input v-model="store.queryParamsDict.label" class="inputItem" clearable placeholder="请输入字典标签"
                    @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="store.queryParamsDict.status" class="inputItem" clearable placeholder="请选择字典状态">
                    <el-option v-for="dict in options" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleSearch" class="btnSearch">搜索</el-button>
                <el-button type="primary" icon="Plus" @click="handleDialogClick" class="btnadd">新增</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="el-body">
        <el-table v-loading="loading" :data="store.listValueDict">
            <el-table-column align="center" label="字典编码" prop="id" width="80"/>
            <el-table-column align="center" label="字典标签" prop="label" width="130" />
            <el-table-column align="center" label="字典键值" prop="value" />
            <el-table-column align="center" label="字典排序" prop="sort" />
            <el-table-column align="center" label="父节点" prop="param_id" />
            <el-table-column align="center" label="状态" prop="status">
                <template #default="scope">
                    <span :class="getStatusClass(scope.row.status)">
                        {{ getStatusText(scope.row.status) }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="颜色类型" align="center" prop="color_type" />
            <el-table-column label="CSS Class" align="center" prop="css_class" width="120"/>
            <el-table-column align="center" label="备注" prop="remark" />
            <el-table-column :formatter="dateFormatter" align="center" label="创建时间" prop="create_time" width="170" />
            <el-table-column align="center" label="操作" width="110">
                <template #default="scope">
                    <el-button v-hasPermi="['system:dict:update']" link type="primary"
                        @click="handleDialogUpdata(scope.row.id)">
                        修改
                    </el-button>
                    <el-button v-hasPermi="['system:dict:delete']" link type="danger" @click="handleDelete(scope.row.id)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination class="pagination" v-if="store.queryParamsDict.total !== 0" layout="total, sizes, prev, pager, next, jumper"
            v-model:total="store.queryParamsDict.total" v-model:current-page="store.queryParamsDict.pageNo"
            v-model:page-size="store.queryParamsDict.pageSize" :background="true" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </div>

    <DictDataType />
    <DictUpdata></DictUpdata>
</template>
<script lang="jsx"  setup>
import { ref, h, onMounted, reactive } from "vue";
import { ElMessageBox, ElMessage, ElButton, ElTag } from "element-plus";
import { useStore } from '../../store/index';
const store = useStore()
import { useRouter, useRoute } from 'vue-router'
import dayjs from 'dayjs'
import DictDataType from "./DictDataType.vue";
import DictUpdata from "./DictUpdata.vue";
const route = useRoute()
const router = useRouter()
const value = ref('')
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
    if (!cellValue) {
        return
    }
    return formatDate(cellValue)
}
function formatDate(date, format) {
    // 日期不存在，则返回空
    if (!date) {
        return ''
    }
    // 日期存在，则进行格式化
    if (format === undefined) {
        format = 'YYYY-MM-DD HH:mm:ss'
    }
    return dayjs(date).format(format)
}

const handleDialogClick = () => {
    store.visible = true;
}

//分页器
const handleSizeChange = () => {
    store.getListDataDict()
}

const handleCurrentChange = () => {
    store.getListDataDict()
}

//点击删除按钮
const handleDelete = (id) => {
    store.deletedId = id
    store.delete("system_dict_data")
}
//点击更新按钮
const handleDialogUpdata = (id) => {
    store.dictUpdataOpen(id)
}

const handleSearch = () => {
    router.replace(`/dict/data/${store.queryParamsDict.type}`)
    store.getListDataDict()
}

//组件挂载到 DOM 后执行
onMounted(() => {
    const type = route.params.dictType;
    store.selectedParams = type;
    if (!store.navigationParams.includes(type)) {//如果导航栏数组中没有该参数，就添加到数组中
        store.navigationParams.push(type);
    }
    store.queryParamsDict.type = type
    store.getListDataDict()
});

</script>
<style scoped lang="scss">
.btnSearch{
    background: #fff;
    color: #606266;
    border-color: #dcdfe6;
}
.btnSearch:hover{
    color:#409eff;
    border-color: #c6e2ff;
    background: #ecf5ff;
}

.btnadd{
    background: #ecf5ff;
    color: #409eff;
    border-color: #a0cfff;
    transition: all 0.3s ease-in-out;
}
.btnadd:hover{
    color:#ffffff;
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

.search {
    margin: 20px auto;
    margin-bottom: 8px;
    width: 94%;
    border: 1px solid #d8dce5;
    border-radius: 4px;
    padding: 20px 0px 16px 20px;
}

.inputItem {
    width: 240px;
}
</style>
  