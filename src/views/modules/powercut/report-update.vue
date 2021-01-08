<template>
  <el-dialog
    :title="'修改页面'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="130px">
      <el-form-item label="报告名称:" prop="reportName">
        <el-input v-model="dataForm.reportName" placeholder="报告名称"></el-input>
      </el-form-item>
      <el-form-item label="统计开始时间:" prop="startTime">
<!--        <el-input v-model="dataForm.startTime" placeholder="统计开始时间"></el-input>-->
        <div class="block">
          <el-date-picker
            v-model="dataForm.startTime"
            type="datetime"
            placeholder="统计开始时间">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="统计结束时间:" prop="stopTime">
<!--        <el-input v-model="dataForm.stopTime" placeholder="统计结束时间"></el-input>-->
        <div class="block">
          <el-date-picker
            v-model="dataForm.stopTime"
            type="datetime"
            placeholder="统计结束时间">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="备注:" prop="remarks">
        <el-input v-model="dataForm.remarks" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button  type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        reportName: '',
        startTime: '',
        stopTime: '',
        remarks: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      test: false,
      dataListLoading: false,
      dataListSelections: [],
      dataRule: {
        reportName: [
          {required: true, message: '报告名称不能为空', trigger: 'blur'}
        ],
        startTime: [
          {required: true, message: '统计开始时间不能为空', trigger: 'blur'}
        ],
        stopTime: [
          {required: true, message: '统计结束时间不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.test = false
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/powercut/report/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.reportName = data.report.reportName
              this.dataForm.startTime = data.report.startTime
              this.dataForm.stopTime = data.report.stopTime
              this.dataForm.remarks = data.report.remarks
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/powercut/report/update`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'reportName': this.dataForm.reportName,
              'startTime': this.dataForm.startTime,
              'stopTime': this.dataForm.stopTime,
              'remarks': this.dataForm.remarks
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
