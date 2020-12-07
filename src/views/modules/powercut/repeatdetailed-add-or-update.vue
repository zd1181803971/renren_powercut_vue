<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="单位名称" prop="company">
      <el-input v-model="dataForm.company" placeholder="单位名称"></el-input>
    </el-form-item>
    <el-form-item label="线路名称" prop="lineRoadName">
      <el-input v-model="dataForm.lineRoadName" placeholder="线路名称"></el-input>
    </el-form-item>
    <el-form-item label="用户名称" prop="userName">
      <el-input v-model="dataForm.userName" placeholder="用户名称"></el-input>
    </el-form-item>
    <el-form-item label="用户性质" prop="userNatrue">
      <el-input v-model="dataForm.userNatrue" placeholder="用户性质"></el-input>
    </el-form-item>
    <el-form-item label="起始时间" prop="startTime">
      <el-input v-model="dataForm.startTime" placeholder="起始时间"></el-input>
    </el-form-item>
    <el-form-item label="终止时间" prop="stopTime">
      <el-input v-model="dataForm.stopTime" placeholder="终止时间"></el-input>
    </el-form-item>
    <el-form-item label="停电时户数" prop="hourCount">
      <el-input v-model="dataForm.hourCount" placeholder="停电时户数"></el-input>
    </el-form-item>
    <el-form-item label="重复停电次数" prop="repeatCount">
      <el-input v-model="dataForm.repeatCount" placeholder="重复停电次数"></el-input>
    </el-form-item>
    <el-form-item label="整改措施" prop="correctiveAction">
      <el-input v-model="dataForm.correctiveAction" placeholder="整改措施"></el-input>
    </el-form-item>
    <el-form-item label="是否整改完成" prop="isCorrectiveAction">
      <el-input v-model="dataForm.isCorrectiveAction" placeholder="是否整改完成"></el-input>
    </el-form-item>
    <el-form-item label="沟通回访" prop="communicate">
      <el-input v-model="dataForm.communicate" placeholder="沟通回访"></el-input>
    </el-form-item>
    <el-form-item label="停电原因" prop="reason">
      <el-input v-model="dataForm.reason" placeholder="停电原因"></el-input>
    </el-form-item>
    <el-form-item label="停电分类" prop="category">
      <el-input v-model="dataForm.category" placeholder="停电分类"></el-input>
    </el-form-item>
    <el-form-item label="是否上报" prop="isReporting">
      <el-input v-model="dataForm.isReporting" placeholder="是否上报"></el-input>
    </el-form-item>
    <el-form-item label="是否匹配" prop="isMatching">
      <el-input v-model="dataForm.isMatching" placeholder="是否匹配"></el-input>
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
          lineRoadName: '',
          userName: '',
          userNatrue: '',
          startTime: '',
          stopTime: '',
          hourCount: '',
          repeatCount: '',
          correctiveAction: '',
          isCorrectiveAction: '',
          communicate: '',
          reason: '',
          category: '',
          isReporting: '',
          isMatching: '',
          gmtCreate: '',
          gmtModified: ''
        },
        dataRule: {
          company: [
            { required: true, message: '单位名称不能为空', trigger: 'blur' }
          ],
          lineRoadName: [
            { required: true, message: '线路名称不能为空', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '用户名称不能为空', trigger: 'blur' }
          ],
          userNatrue: [
            { required: true, message: '用户性质不能为空', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '起始时间不能为空', trigger: 'blur' }
          ],
          stopTime: [
            { required: true, message: '终止时间不能为空', trigger: 'blur' }
          ],
          hourCount: [
            { required: true, message: '停电时户数不能为空', trigger: 'blur' }
          ],
          repeatCount: [
            { required: true, message: '重复停电次数不能为空', trigger: 'blur' }
          ],
          correctiveAction: [
            { required: true, message: '整改措施不能为空', trigger: 'blur' }
          ],
          isCorrectiveAction: [
            { required: true, message: '是否整改完成不能为空', trigger: 'blur' }
          ],
          communicate: [
            { required: true, message: '沟通回访不能为空', trigger: 'blur' }
          ],
          reason: [
            { required: true, message: '停电原因不能为空', trigger: 'blur' }
          ],
          category: [
            { required: true, message: '停电分类不能为空', trigger: 'blur' }
          ],
          isReporting: [
            { required: true, message: '是否上报不能为空', trigger: 'blur' }
          ],
          isMatching: [
            { required: true, message: '是否匹配不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/powercut/repeatdetailed/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.company = data.repeatDetailed.company
                this.dataForm.lineRoadName = data.repeatDetailed.lineRoadName
                this.dataForm.userName = data.repeatDetailed.userName
                this.dataForm.userNatrue = data.repeatDetailed.userNatrue
                this.dataForm.startTime = data.repeatDetailed.startTime
                this.dataForm.stopTime = data.repeatDetailed.stopTime
                this.dataForm.hourCount = data.repeatDetailed.hourCount
                this.dataForm.repeatCount = data.repeatDetailed.repeatCount
                this.dataForm.correctiveAction = data.repeatDetailed.correctiveAction
                this.dataForm.isCorrectiveAction = data.repeatDetailed.isCorrectiveAction
                this.dataForm.communicate = data.repeatDetailed.communicate
                this.dataForm.reason = data.repeatDetailed.reason
                this.dataForm.category = data.repeatDetailed.category
                this.dataForm.isReporting = data.repeatDetailed.isReporting
                this.dataForm.isMatching = data.repeatDetailed.isMatching
                this.dataForm.gmtCreate = data.repeatDetailed.gmtCreate
                this.dataForm.gmtModified = data.repeatDetailed.gmtModified
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
              url: this.$http.adornUrl(`/powercut/repeatdetailed/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'company': this.dataForm.company,
                'lineRoadName': this.dataForm.lineRoadName,
                'userName': this.dataForm.userName,
                'userNatrue': this.dataForm.userNatrue,
                'startTime': this.dataForm.startTime,
                'stopTime': this.dataForm.stopTime,
                'hourCount': this.dataForm.hourCount,
                'repeatCount': this.dataForm.repeatCount,
                'correctiveAction': this.dataForm.correctiveAction,
                'isCorrectiveAction': this.dataForm.isCorrectiveAction,
                'communicate': this.dataForm.communicate,
                'reason': this.dataForm.reason,
                'category': this.dataForm.category,
                'isReporting': this.dataForm.isReporting,
                'isMatching': this.dataForm.isMatching,
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
