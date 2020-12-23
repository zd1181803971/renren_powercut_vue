<template>
  <el-dialog
    :title="'详细页面'"
    center
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm"  ref="dataForm"  label-width="150px">
      <el-form-item  label="单位名称：">
        <el-input
          readonly
          v-model="dataForm.company">
        </el-input>
      </el-form-item>
      <el-form-item label="线路名称：">
        <el-input
          readonly
          v-model="dataForm.lineRoadName">
        </el-input>
      </el-form-item>
      <el-form-item label="用户名称：">
        <el-input
          readonly
          v-model="dataForm.userName">
        </el-input>
      </el-form-item>
      <el-form-item label="用户性质：">
        <el-input
          readonly
          v-model="dataForm.userNatrue">
        </el-input>
      </el-form-item>
      <el-form-item label="起始时间：">
        <el-input
          readonly
          v-model="dataForm.startTime">
        </el-input>
      </el-form-item>
      <el-form-item label="终止时间：">
        <el-input
          readonly
          v-model="dataForm.stopTime">
        </el-input>
      </el-form-item>
      <el-form-item label="停电时户数：">
        <el-input
          readonly
          v-model="dataForm.hourCount">
        </el-input>
      </el-form-item>
      <el-form-item label="重复停电次数：">
        <el-input
          readonly
          v-model="dataForm.repeatCount">
        </el-input>
      </el-form-item>
      <el-form-item label="台区经理：">
        <el-input
          readonly
          v-model="dataForm.manager">
        </el-input>
      </el-form-item>
      <el-form-item label="停电原因：">
        <el-input
          readonly
          v-model="dataForm.reason">
        </el-input>
      </el-form-item>
      <el-form-item label="停电分类：">
        <el-input
          readonly
          v-model="dataForm.category">
        </el-input>
      </el-form-item>
      <el-form-item label="整改措施：">
        <el-input
          readonly
          v-model="dataForm.correctiveAction">
        </el-input>
      </el-form-item>
      <el-form-item label="是否整改完成：">
        <el-input
          readonly
          v-model="dataForm.isCorrectiveAction">
        </el-input>
      </el-form-item>
      <el-form-item label="沟通回访情况：">
        <el-input
          readonly
          v-model="dataForm.communicate">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" type="primary">确定</el-button>
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
        correctiveAction: '',
        isCorrectiveAction: '',
        communicate: '',
        reason: '',
        category: '',
        manager: ''
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      if (this.dataForm.id) {
        this.$http({
          url: this.$http.adornUrl(`/powercut/repeatdetailed/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            console.log(data)
            this.dataForm.company = data.repeatDetailed.company
            this.dataForm.lineRoadName = data.repeatDetailed.lineRoadName
            this.dataForm.userName = data.repeatDetailed.userName
            this.dataForm.userNatrue = data.repeatDetailed.userNatrue
            this.dataForm.startTime = data.repeatDetailed.startTime
            this.dataForm.stopTime = data.repeatDetailed.stopTime
            this.dataForm.hourCount = data.repeatDetailed.hourCount
            this.dataForm.repeatCount = data.repeatDetailed.repeatCount
            this.dataForm.correctiveAction = data.repeatDetailed.correctiveAction
            this.dataForm.isCorrectiveAction = data.repeatDetailed.isCorrectiveAction
            this.dataForm.communicate = data.repeatDetailed.communicate
            this.dataForm.reason = data.repeatDetailed.reason
            this.dataForm.category = data.repeatDetailed.category
            this.dataForm.manager = data.repeatDetailed.manager
          }
        })
      }
    }
  }
}
</script>
