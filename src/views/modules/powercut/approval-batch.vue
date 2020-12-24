<template>
  <el-dialog
    :title="'批量审批/驳回'"
    center
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="15px">
        <h3>
          选择的要审批的公司：
        </h3>
      <p style="display: inline-block" v-for="(item,i) in this.dataForm.company">--{{item}}--</p>
      <el-form-item prop="departmentOpinion">
        <el-input
          type="textarea"
          :rows="4"
          v-model="dataForm.departmentOpinion"
          placeholder="手输，多行文本，200字以内。">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" type="warning">返回</el-button>
      <el-button type="primary" @click="dataFormSubmit()">审批所有</el-button>
      <el-button type="danger" @click="dataFormSubmit2()">驳回所有</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      approvalOrReject: '',
      visible: false,
      dataRule: {
        departmentOpinion: [
          {required: true, message: '审批意见不能为空！', trigger: 'blur'}
        ]
      },
      dataForm: {
        departmentOpinion: '',
        company: []
      }
    }
  },
  methods: {
    init (dataListSelections) {
      this.dataForm.company = []
      this.dataForm.departmentOpinion = ''
      this.visible = true
      dataListSelections.forEach((item, index, array) => {
        this.dataForm.company[index] = item.company
      })
      console.log(this.dataForm.company)
    },
// 审批
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确认审批吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消审批',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl(`/powercut/plan/passApproval`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id,
                'opinion': this.dataForm.departmentOpinion
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '审批成功！',
                  type: 'success',
                  duration: 3000,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消审批'
            })
          })
        }
      })
    },

    // 驳回
    dataFormSubmit2 () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确认驳回吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消驳回',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl(`/powercut/plan/rejectApproval`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id,
                'opinion': this.dataForm.departmentOpinion
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '驳回成功！',
                  type: 'success',
                  duration: 3000,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消驳回'
            })
          })
        }
      })
    }
  }
}
</script>
