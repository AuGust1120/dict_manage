<template>
    <!-- 对话框组件 -->
    <el-dialog v-model="store.visible" :model="formData" title="新增数据">
        <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules" label-width="80px">
            <el-form-item label="字典名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入字典名称" />
            </el-form-item>
            <el-form-item label="字典类型" prop="type">
                <el-input v-model="formData.type" placeholder="请输入参数名称" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-radio-group v-model="formData.status">
                    <el-radio label="开启" />
                    <el-radio label="关闭" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="formData.remark" placeholder="请输入内容" type="textarea" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useStore } from '../store/index';
import axios from 'axios';// 引入axios库
import { post } from "../api/api.js"
const store = useStore()//调用useStore函数来创建一个Store实例，并将其赋值给名为store的常量

const formData = reactive({
    id: undefined,
    name: '',
    type: '',
    status: '',
    remark: ''
})
//失去焦点（blur）是指在交互过程中，用户将焦点从当前输入框或元素移开，使其不再是当前活动元素。
// change是（值发生改变）
const formRules = reactive({
    name: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
    type: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }],
    status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

const submitForm = async () => {
    // 校验表单
    if (!formRef) return //这一行代码首先检查 formRef 是否存在。如果 formRef 不存在（即为 null 或 undefined），则直接返回，停止执行后续代码。
    //formRef 对象的 value 属性来获取真正的表单引用，并调用其 validate 方法进行表单验证。validate 方法是用于执行表单验证的函数，它会返回一个布尔值，表示表单是否通过了验证。
    const valid = await formRef.value.validate()
    if (!valid) return
    try {
        const response = await post('/createDict', formData);
        store.getListData()
        store.visible = false;
    } catch (error) {
        console.error('请求出错：', error);
    }
}
</script>

