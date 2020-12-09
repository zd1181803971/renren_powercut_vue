<template>
  <el-dialog
    :title="'详细页面'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" label-width="80px">
      <el-form-item label="单位名称" prop="company">
        <el-input v-model="dataForm.company" placeholder="单位名称"></el-input>
      </el-form-item>
      <el-form-item label="计划停电时间" prop="blackoutTime">
        <el-input v-model="dataForm.blackoutTime" placeholder="计划停电时间"></el-input>
      </el-form-item>
      <el-form-item label="计划恢复时间" prop="recoveryTime">
        <el-input v-model="dataForm.recoveryTime" placeholder="计划恢复时间"></el-input>
      </el-form-item>
      <el-form-item label="影响台区数量" prop="districtCount">
        <el-input v-model="dataForm.districtCount" placeholder="影响台区数量"></el-input>
      </el-form-item>
      <el-form-item label="影响用户数" prop="userCount">
        <el-input v-model="dataForm.userCount" placeholder="影响用户数"></el-input>
      </el-form-item>
      <el-form-item label="停电原因" prop="reason">
        <el-input v-model="dataForm.reason" placeholder="停电原因"></el-input>
      </el-form-item>
      <el-form-item label="近两个月停电次数" prop="blackoutCount">
        <el-input v-model="dataForm.blackoutCount" placeholder="近两个月停电次数"></el-input>
      </el-form-item>
      <el-form-item label="工作内容" prop="jobContent">
        <el-input v-model="dataForm.jobContent" placeholder="工作内容"></el-input>
      </el-form-item>
      <h4>计划停电台区信息</h4>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%;">
        <el-table-column
          prop="id"
          header-align="center"
          align="center"
          label="id">
        </el-table-column>
        <el-table-column
          prop="company"
          header-align="center"
          align="center"
          label="台区名称">
        </el-table-column>
        <el-table-column
          prop="manager"
          header-align="center"
          align="center"
          label="台区经理">
        </el-table-column>
        <el-table-column
          prop="userCount"
          header-align="center"
          align="center"
          label="用户数量">
        </el-table-column>
      </el-table>
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
      dataList: [{
        id: '1',
        company: '测试',
        manager: 'zzzzd',
        userCount: 123
      }],
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
            }
          })
        }
      })
    }
  }
}
</script>
