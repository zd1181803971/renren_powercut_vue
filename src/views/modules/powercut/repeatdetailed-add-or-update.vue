<template>
  <el-dialog
    :title="'详细页面'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm"  ref="dataForm"  label-width="120px">
    <el-form-item label="单位名称" prop="company">
      <el-input v-model="dataForm.company" placeholder="单位名称"></el-input>
    </el-form-item>
    <el-form-item label="线路名称" prop="lineRoadName">
      <el-input v-model="dataForm.lineRoadName" placeholder="线路名称"></el-input>
    </el-form-item>
    <el-form-item label="用户名称" prop="userName">
      <el-input v-model="dataForm.userName" placeholder="用户名称"></el-input>
    </el-form-item>
    <el-form-item label="用户性质" prop="userNatrue">
      <el-input v-model="dataForm.userNatrue" placeholder="用户性质"></el-input>
    </el-form-item>
    <el-form-item label="起始时间" prop="startTime">
      <el-input v-model="dataForm.startTime" placeholder="起始时间"></el-input>
    </el-form-item>
    <el-form-item label="终止时间" prop="stopTime">
      <el-input v-model="dataForm.stopTime" placeholder="终止时间"></el-input>
    </el-form-item>
    <el-form-item label="停电时户数" prop="hourCount">
      <el-input v-model="dataForm.hourCount" placeholder="停电时户数"></el-input>
    </el-form-item>
    <el-form-item label="重复停电次数" prop="repeatCount">
      <el-input v-model="dataForm.repeatCount" placeholder="重复停电次数"></el-input>
    </el-form-item>
    <el-form-item label="是否整改完成" prop="isCorrectiveAction">
      <el-input v-if="dataForm.isCorrectiveAction" value="是" placeholder="是否整改完成"></el-input>
      <el-input v-if="!dataForm.isCorrectiveAction" value="否" placeholder="是否整改完成"></el-input>
    </el-form-item>
    <el-form-item label="沟通回访" prop="communicate">
      <el-input v-model="dataForm.communicate" placeholder="沟通回访"></el-input>
    </el-form-item>
    <el-form-item label="停电原因" prop="reason">
      <el-input v-model="dataForm.reason" placeholder="停电原因"></el-input>
    </el-form-item>
    <el-form-item label="停电分类" prop="category">
      <el-input v-model="dataForm.category" placeholder="停电分类"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          company: '',
          lineRoadName: '',
          userName: '',
          userNatrue: '',
          startTime: '',
          stopTime: '',
          hourCount: '',
          repeatCount: '',
          isCorrectiveAction: '',
          communicate: '',
          reason: '',
          category: ''
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/powercut/repeatdetailed/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.company = data.repeatDetailed.company
                this.dataForm.lineRoadName = data.repeatDetailed.lineRoadName
                this.dataForm.userName = data.repeatDetailed.userName
                this.dataForm.userNatrue = data.repeatDetailed.userNatrue
                this.dataForm.startTime = data.repeatDetailed.startTime
                this.dataForm.stopTime = data.repeatDetailed.stopTime
                this.dataForm.hourCount = data.repeatDetailed.hourCount
                this.dataForm.repeatCount = data.repeatDetailed.repeatCount
                this.dataForm.isCorrectiveAction = data.repeatDetailed.isCorrectiveAction
                this.dataForm.communicate = data.repeatDetailed.communicate
                this.dataForm.reason = data.repeatDetailed.reason
                this.dataForm.category = data.repeatDetailed.category
              }
            })
          }
        })
      }
    }
  }
</script>
