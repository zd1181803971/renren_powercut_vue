<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="报告名称" prop="reportName">
      <el-input v-model="dataForm.reportName" placeholder="报告名称"></el-input>
    </el-form-item>
    <el-form-item label="统计开始时间" prop="startTime">
      <el-input v-model="dataForm.startTime" placeholder="统计开始时间"></el-input>
    </el-form-item>
    <el-form-item label="统计结束时间" prop="stopTime">
      <el-input v-model="dataForm.stopTime" placeholder="统计结束时间"></el-input>
    </el-form-item>
    <el-form-item label="报告创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="报告创建时间"></el-input>
    </el-form-item>
    <el-form-item label="报告地址" prop="reportHref">
      <el-input v-model="dataForm.reportHref" placeholder="报告地址"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remarks">
      <el-input v-model="dataForm.remarks" placeholder="备注"></el-input>
    </el-form-item>
    <el-form-item label="数据创建时间" prop="gmtCreate">
      <el-input v-model="dataForm.gmtCreate" placeholder="数据创建时间"></el-input>
    </el-form-item>
    <el-form-item label="数据修改时间" prop="gmtModified">
      <el-input v-model="dataForm.gmtModified" placeholder="数据修改时间"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
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
          reportName: '',
          startTime: '',
          stopTime: '',
          createTime: '',
          reportHref: '',
          remarks: '',
          gmtCreate: '',
          gmtModified: ''
        },
        dataRule: {
          reportName: [
            { required: true, message: '报告名称不能为空', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '统计开始时间不能为空', trigger: 'blur' }
          ],
          stopTime: [
            { required: true, message: '统计结束时间不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '报告创建时间不能为空', trigger: 'blur' }
          ],
          reportHref: [
            { required: true, message: '报告地址不能为空', trigger: 'blur' }
          ],
          remarks: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
          ],
          gmtCreate: [
            { required: true, message: '数据创建时间不能为空', trigger: 'blur' }
          ],
          gmtModified: [
            { required: true, message: '数据修改时间不能为空', trigger: 'blur' }
          ]
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
              url: this.$http.adornUrl(`/powercut/report/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.reportName = data.report.reportName
                this.dataForm.startTime = data.report.startTime
                this.dataForm.stopTime = data.report.stopTime
                this.dataForm.createTime = data.report.createTime
                this.dataForm.reportHref = data.report.reportHref
                this.dataForm.remarks = data.report.remarks
                this.dataForm.gmtCreate = data.report.gmtCreate
                this.dataForm.gmtModified = data.report.gmtModified
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
              url: this.$http.adornUrl(`/powercut/report/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'reportName': this.dataForm.reportName,
                'startTime': this.dataForm.startTime,
                'stopTime': this.dataForm.stopTime,
                'createTime': this.dataForm.createTime,
                'reportHref': this.dataForm.reportHref,
                'remarks': this.dataForm.remarks,
                'gmtCreate': this.dataForm.gmtCreate,
                'gmtModified': this.dataForm.gmtModified
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
