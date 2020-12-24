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
      <el-form-item label="停电用户数：">
        <el-input
          readonly
          v-model="dataForm.userCount">
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
          v-model="dataForm.isCorrectiveAction"
          value="是">
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
          userCount: '',
          manager: '',
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
              console.log(data)

              if (data && data.code === 0) {
                this.dataForm.company = data.repeatDetailedDto.company
                this.dataForm.lineRoadName = data.repeatDetailedDto.lineRoadName
                this.dataForm.userName = data.repeatDetailedDto.userName
                this.dataForm.userNatrue = data.repeatDetailedDto.userNatrue
                this.dataForm.startTime = data.repeatDetailedDto.startTime
                this.dataForm.stopTime = data.repeatDetailedDto.stopTime
                this.dataForm.hourCount = data.repeatDetailedDto.hourCount
                this.dataForm.userCount = data.repeatDetailedDto.userCount
                this.dataForm.manager = data.repeatDetailedDto.manager
                this.dataForm.repeatCount = data.repeatDetailedDto.repeatCount
                this.dataForm.isCorrectiveAction = data.repeatDetailedDto.isCorrectiveAction
                this.dataForm.communicate = data.repeatDetailedDto.communicate
                this.dataForm.reason = data.repeatDetailedDto.reason
                this.dataForm.category = data.repeatDetailedDto.category
              }
            })
          }
        })
      }
    }
  }
</script>
