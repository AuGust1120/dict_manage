<template>
    <!-- 对话框组件 -->
    <el-dialog v-model="store.updataVisible" :model="store.formData" title="修改数据">
        <el-form ref="formRef" v-loading="formLoading" :model="store.formData" :rules="formRules" label-width="80px">
            <el-form-item label="字典名称" prop="name">
                <el-input v-model="store.formData.name" placeholder="请输入字典名称" />
            </el-form-item>
            <el-form-item label="字典类型"  prop="type">
                <el-input v-model="store.formData.type" :disabled="true" placeholder="请输入参数名称" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-radio-group v-model="store.formData.status">
                    <el-radio label="开启" />
                    <el-radio label="关闭" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="store.formData.remark" placeholder="请输入内容" type="textarea" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="store.updataVisible = false">取 消</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useStore } from '../store/index';
const store = useStore()//调用useStore函数来创建一个Store实例，并将其赋值给名为store的常量
const formRules = reactive({
  name: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

const submitForm = async() => {
    // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
    try {
        store.updateRecord()
  } catch (error) {
    console.error('请求出错：', error);
  }
}
</script>

