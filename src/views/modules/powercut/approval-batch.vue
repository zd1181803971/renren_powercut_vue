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
        company: [],
        ids: [],
        flags: 0
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
      this.dataForm.ids = dataListSelections.map(item => {
        return item.id
      })
    },
// 审批
    dataFormSubmit () {
      console.log(this.dataForm.ids)
      console.log(this.dataForm.flags)
      console.log(this.dataForm.departmentOpinion)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确认审批吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消审批',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl(`/powercut/plan/approvalBatch`),
              method: 'post',
              data: this.$http.adornData({
                'ids': this.dataForm.ids,
                'flag': this.dataForm.flags,
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
      this.dataForm.flags = 1
      this.dataFormSubmit()
    }
  }
}
</script>
