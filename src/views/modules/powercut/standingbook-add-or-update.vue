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
      <el-form-item label="停电时间：">
        <el-input
          readonly
          v-model="dataForm.blackoutTime">
        </el-input>
      </el-form-item>
      <el-form-item label="停电时长：">
        <el-input
          readonly
          v-model="dataForm.blackoutDuration+'小时'">
        </el-input>
      </el-form-item>
      <el-form-item label="是否计划内：">
        <el-input
          readonly
          v-if="dataForm.isPlan == 1" value="是">
        </el-input>
        <el-input
          readonly
          v-if="dataForm.isPlan == 0" value="否">
        </el-input>
      </el-form-item>
      <el-form-item label="停电原因：">
        <el-input
          readonly
          v-model="dataForm.reason"></el-input>
      </el-form-item>
      <el-form-item label="近两月停电次数：">
        <el-input
          readonly
          v-model="dataForm.blackoutCount"></el-input>
      </el-form-item>
      <el-form-item label="影响台区数量：">
        <el-input
          readonly
          v-model="dataForm.districtCount">
        </el-input>
      </el-form-item>
      <el-form-item label="用户数量：">
        <el-input
          readonly
          v-model="dataForm.userCount">
        </el-input>
      </el-form-item>
    </el-form>
    <div>
      <h3 style="text-align: center">台区信息</h3>
    </div>
    <div>
      <el-table
        fit
        border
        :data="districtDtoList"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="districtName"
          label="台区名称"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column
          prop="userCount"
          label="台区用户数量"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column
          prop="manager"
          header-align="center"
          align="center"
          label="台区经理">
        </el-table-column>
      </el-table>
    </div>
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
        blackoutTime: '',
        blackoutDuration: '',
        districtCount: '',
        userCount: '',
        isPlan: '',
        reason: '',
        blackoutCount: ''
      },
      districtDtoList: []
    }
  },
  methods: {
    init (id) {
      this.dataForm.company = ''
      this.dataForm.blackoutTime = ''
      this.dataForm.blackoutDuration = ''
      this.dataForm.districtCount = ''
      this.dataForm.company = ''
      this.dataForm.userCount = ''
      this.dataForm.isPlan = ''
      this.dataForm.reason = ''
      this.dataForm.blackoutCount = ''
      this.dataForm.districtDtoList = ''
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
              this.districtDtoList = data.standingbookDto.districtDtoList
            }
          })
        }
      })
    }
  }
}
</script>
