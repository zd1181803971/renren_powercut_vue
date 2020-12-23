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
      <el-form-item label="计划停电时间：">
        <el-input
          readonly
          v-model="dataForm.blackoutTime">
        </el-input>
      </el-form-item>
      <el-form-item label="计划恢复时间：">
        <el-input
          readonly
          v-model="dataForm.recoveryTime">
        </el-input>
      </el-form-item>
      <el-form-item label="影响台区数量：">
        <el-input
          readonly
          v-model="dataForm.districtCount">
        </el-input>
      </el-form-item>
      <el-form-item label="影响用户数：">
        <el-input
          readonly
          v-model="dataForm.userCount">
        </el-input>
      </el-form-item>
      <el-form-item label="停电原因：">
        <el-input
          readonly
          v-model="dataForm.reason"></el-input>
      </el-form-item>
      <el-form-item label="近两个月停电次数：">
        <el-input
          readonly
          v-model="dataForm.blackoutCount"></el-input>
      </el-form-item>
      <el-form-item label="工作内容：">
        <el-input
          readonly
          v-model="dataForm.jobContent"></el-input>
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
        dataList: [],
        dataListLoading: false,
        dataForm: {
          id: 0,
          company: '',
          blackoutTime: '',
          recoveryTime: '',
          districtCount: '',
          userCount: '',
          reason: '',
          blackoutCount: '',
          jobContent: ''
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
              url: this.$http.adornUrl(`/powercut/plan/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.company = data.plan.company
                this.dataForm.blackoutTime = data.plan.blackoutTime
                this.dataForm.recoveryTime = data.plan.recoveryTime
                this.dataForm.districtCount = data.plan.districtCount
                this.dataForm.userCount = data.plan.userCount
                this.dataForm.reason = data.plan.reason
                this.dataForm.blackoutCount = data.plan.blackoutCount
                this.dataForm.jobContent = data.plan.jobContent
                this.dataList = data.plan.districtDtoList
              }
            })
          }
        })
      }
    }
  }
</script>
