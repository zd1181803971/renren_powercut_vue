<template>
  <el-dialog
    :title="'详细信息'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px">
    <el-form-item label="单位名称：">
      {{dataForm.company}}
    </el-form-item>
    <el-form-item label="停电时间：">
      {{dataForm.blackoutTime}}
    </el-form-item>
    <el-form-item label="停电时长：">
      {{dataForm.blackoutDuration}}小时
    </el-form-item>
    <el-form-item label="影响台区数量：">
      {{dataForm.districtCount}}
    </el-form-item>
    <el-form-item label="影响用户数：">
      {{dataForm.userCount}}
    </el-form-item>
    <el-form-item label="是否计划内：">
      <span v-if="dataForm.isPlan == 0">是</span>
      <span v-if="dataForm.isPlan == 1">否</span>
    </el-form-item>
    <el-form-item label="停电原因：">
      {{dataForm.reason}}
    </el-form-item>
    <el-form-item label="近两个月停电次数：">
      {{dataForm.blackoutCount}}
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
          blackoutTime: '',
          blackoutDuration: '',
          districtCount: '',
          userCount: '',
          isPlan: '',
          reason: '',
          blackoutCount: '',
          gmtCreate: '',
          gmtModified: ''
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/powercut/standingbook/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.company = data.standingbookDto.company
                this.dataForm.blackoutTime = data.standingbookDto.blackoutTime
                this.dataForm.blackoutDuration = data.standingbookDto.blackoutDuration
                this.dataForm.districtCount = data.standingbookDto.districtCount
                this.dataForm.userCount = data.standingbookDto.userCount
                this.dataForm.isPlan = data.standingbookDto.isPlan
                this.dataForm.reason = data.standingbookDto.reason
                this.dataForm.blackoutCount = data.standingbookDto.blackoutCount
                this.dataForm.gmtCreate = data.standingbookDto.gmtCreate
                this.dataForm.gmtModified = data.standingbookDto.gmtModified
              }
            })
          }
        })
      }
    }
  }
</script>
