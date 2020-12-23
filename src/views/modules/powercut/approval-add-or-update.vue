<template>
  <el-dialog
    :title="'详细页面'"
    center
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" label-width="150px">
      <el-form-item  label="分类：">
        <el-input
          readonly
          v-if="dataForm.category == null">
        </el-input>
        <el-input
          readonly
          v-if="dataForm.category == 0"
          value="计划停电">
        </el-input>
        <el-input
          readonly
          v-if="dataForm.category == 1"
          value="临时停电">
        </el-input>
      </el-form-item>
      <el-form-item  label="单位名称：">
        <el-input
          readonly
          v-model="dataForm.company">
        </el-input>
      </el-form-item>
      <el-form-item  label="计划停电时间：">
        <el-input
          readonly
          v-model="dataForm.blackoutTime">
        </el-input>
      </el-form-item>
      <el-form-item  label="计划恢复时间：">
        <el-input
          readonly
          v-model="dataForm.recoveryTime">
        </el-input>
      </el-form-item>
      <el-form-item  label="影响台区数量：">
        <el-input
          readonly
          v-model="dataForm.districtCount">
        </el-input>
      </el-form-item>
      <el-form-item  label="影响用户数量：">
        <el-input
          readonly
          v-model="dataForm.userCount">
        </el-input>
      </el-form-item>
      <el-form-item  label="停电原因：">
        <el-input
          readonly
          v-model="dataForm.reason">
        </el-input>
      </el-form-item>
      <el-form-item  label="近两月停电次数：">
        <el-input
          readonly
          v-model="dataForm.blackoutCount">
        </el-input>
      </el-form-item>
      <el-form-item  label="工作内容：">
        <el-input
          readonly
          v-model="dataForm.jobContent">
        </el-input>
      </el-form-item>

        <h3 style="text-align: center">计划停电台区信息</h3>
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            header-align="center"
            align="center"
            label="序号"
            type="index"
          width="50">
          </el-table-column>
          <el-table-column
            prop="districtName"
            header-align="center"
            align="center"
            label="台区名称">
          </el-table-column>
          <el-table-column
            prop="userCount"
            header-align="center"
            align="center"
            label="台区用户数量">
          </el-table-column>
          <el-table-column
            prop="manager"
            header-align="center"
            align="center"
            label="台区经理">
          </el-table-column>
        </el-table>
      <br>
      <h3 style="text-align: center">审批意见</h3>
      <el-form :model="dataForm" ref="dataForm" :rules="dataRule">
        <el-form-item prop="departmentOpinion">
          <el-input
            type="textarea"
            :rows="4"
            v-model="dataForm.departmentOpinion"
            placeholder="手输，多行文本，200字以内。">
          </el-input>
        </el-form-item>
      </el-form>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" type="warning">返回</el-button>
      <el-button type="primary" @click="dataFormSubmit()">审批</el-button>
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
      dataRule: {
        departmentOpinion: [
          { required: true, message: '审批意见不能为空！', trigger: 'blur' }
        ]
      },
      dataForm: {
        id: 0,
        category: '',
        company: '',
        blackoutTime: '',
        recoveryTime: '',
        districtCount: '',
        userCount: '',
        reason: '',
        blackoutCount: '',
        jobContent: '',
        departmentOpinion: ''
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      if (this.dataForm.id) {
        this.$http({
          url: this.$http.adornUrl(`/powercut/plan/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm.company = data.plan.company
            this.dataForm.category = data.plan.category
            this.dataForm.blackoutTime = data.plan.blackoutTime
            this.dataForm.recoveryTime = data.plan.recoveryTime
            this.dataForm.districtCount = data.plan.districtCount
            this.dataForm.userCount = data.plan.userCount
            this.dataForm.reason = data.plan.reason
            this.dataForm.blackoutCount = data.plan.blackoutCount
            this.dataForm.jobContent = data.plan.jobContent
            this.dataForm.departmentOpinion = data.plan.opinion
            this.dataList = data.plan.districtDtoList
          }
        })
      }
    },
// 审批
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
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
        }
      })
    }
  }
}
</script>
