<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
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
    <el-form-item label="停电类型 0计划 1临时" prop="category">
      <el-input v-model="dataForm.category" placeholder="停电类型 0计划 1临时"></el-input>
    </el-form-item>
    <el-form-item label="状态 0已保存 1部门审批中 2部门审批通过待分管领导审批 3部门驳回 4分管领导驳回" prop="state">
      <el-input v-model="dataForm.state" placeholder="状态 0已保存 1部门审批中 2部门审批通过待分管领导审批 3部门驳回 4分管领导驳回"></el-input>
    </el-form-item>
    <el-form-item label="部门审批意见" prop="departmentOpinion">
      <el-input v-model="dataForm.departmentOpinion" placeholder="部门审批意见"></el-input>
    </el-form-item>
    <el-form-item label="分管领导审批意见" prop="leaderOpinion">
      <el-input v-model="dataForm.leaderOpinion" placeholder="分管领导审批意见"></el-input>
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
          company: '',
          blackoutTime: '',
          recoveryTime: '',
          districtCount: '',
          userCount: '',
          reason: '',
          blackoutCount: '',
          jobContent: '',
          category: '',
          state: '',
          departmentOpinion: '',
          leaderOpinion: '',
          gmtCreate: '',
          gmtModified: ''
        },
        dataRule: {
          company: [
            { required: true, message: '单位名称不能为空', trigger: 'blur' }
          ],
          blackoutTime: [
            { required: true, message: '计划停电时间不能为空', trigger: 'blur' }
          ],
          recoveryTime: [
            { required: true, message: '计划恢复时间不能为空', trigger: 'blur' }
          ],
          districtCount: [
            { required: true, message: '影响台区数量不能为空', trigger: 'blur' }
          ],
          userCount: [
            { required: true, message: '影响用户数不能为空', trigger: 'blur' }
          ],
          reason: [
            { required: true, message: '停电原因不能为空', trigger: 'blur' }
          ],
          blackoutCount: [
            { required: true, message: '近两个月停电次数不能为空', trigger: 'blur' }
          ],
          jobContent: [
            { required: true, message: '工作内容不能为空', trigger: 'blur' }
          ],
          category: [
            { required: true, message: '停电类型 0计划 1临时不能为空', trigger: 'blur' }
          ],
          state: [
            { required: true, message: '状态 0已保存 1部门审批中 2部门审批通过待分管领导审批 3部门驳回 4分管领导驳回不能为空', trigger: 'blur' }
          ],
          departmentOpinion: [
            { required: true, message: '部门审批意见不能为空', trigger: 'blur' }
          ],
          leaderOpinion: [
            { required: true, message: '分管领导审批意见不能为空', trigger: 'blur' }
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
                this.dataForm.category = data.plan.category
                this.dataForm.state = data.plan.state
                this.dataForm.departmentOpinion = data.plan.departmentOpinion
                this.dataForm.leaderOpinion = data.plan.leaderOpinion
                this.dataForm.gmtCreate = data.plan.gmtCreate
                this.dataForm.gmtModified = data.plan.gmtModified
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
              url: this.$http.adornUrl(`/powercut/plan/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'company': this.dataForm.company,
                'blackoutTime': this.dataForm.blackoutTime,
                'recoveryTime': this.dataForm.recoveryTime,
                'districtCount': this.dataForm.districtCount,
                'userCount': this.dataForm.userCount,
                'reason': this.dataForm.reason,
                'blackoutCount': this.dataForm.blackoutCount,
                'jobContent': this.dataForm.jobContent,
                'category': this.dataForm.category,
                'state': this.dataForm.state,
                'departmentOpinion': this.dataForm.departmentOpinion,
                'leaderOpinion': this.dataForm.leaderOpinion,
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
