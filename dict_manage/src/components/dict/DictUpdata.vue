<template>
    <!-- 对话框组件 -->
    <el-dialog v-model="store.updataVisible" :model="store.dictData" title="修改数据">
        <el-form ref="formRef" v-loading="formLoading" :model="store.dictData" :rules="formRules" label-width="80px">
            <el-form-item label="字典类型" prop="dict_type">
                <el-input v-model="store.queryParamsDict.type" :disabled="true" />
            </el-form-item>
            <el-form-item label="数据标签" prop="label">
                <el-input v-model="store.dictData.label" placeholder="请输入数据标签" />
            </el-form-item>
            <el-form-item label="数据键值" prop="value">
                <el-input v-model="store.dictData.value" placeholder="请输入数据键值" />
            </el-form-item>
            <el-form-item label="显示排序" prop="sort">
                <el-input-number v-model="store.dictData.sort" :min="0" controls-position="right" />
            </el-form-item>
            <el-form-item label="父节点" prop="param_id">
                <el-select v-model="store.dictData.param_id">
                    <el-option :label="item.name" :key="item.name" :value="item.name" v-for="item in store.parentList" />
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-radio-group v-model="store.dictData.status">
                    <el-radio label="开启" />
                    <el-radio label="关闭" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="颜色类型" prop="colorType">
                <el-select v-model="store.dictData.color_type">
                    <el-option v-for="item in colorTypeOptions" :key="item.value"
                        :label="item.label + '(' + item.value + ')'" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="CSS Class" prop="cssClass">
                <el-input v-model="store.dictData.css_class" placeholder="请输入 CSS Class" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="store.dictData.remark" placeholder="请输入内容" type="textarea" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="store.updataVisible = false">取 消</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { computed, reactive, ref, readonly } from 'vue';
import { useStore } from '../../store/index';
import axios from 'axios';// 引入axios库
const store = useStore()//调用useStore函数来创建一个Store实例，并将其赋值给名为store的常量
// 数据标签回显样式
const colorTypeOptions = readonly([
    {
        value: 'default',
        label: '默认'
    },
    {
        value: 'primary',
        label: '主要'
    },
    {
        value: 'success',
        label: '成功'
    },
    {
        value: 'info',
        label: '信息'
    },
    {
        value: 'warning',
        label: '警告'
    },
    {
        value: 'danger',
        label: '危险'
    }
])

const submitForm = async () => {
    try {
        store.updataDict()
    } catch (error) {
        console.error('请求出错：', error);
    }
}
</script>

