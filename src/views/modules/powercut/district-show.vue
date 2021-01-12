<template>
  <el-dialog
    :title="'详情页面'"
    center
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm"  ref="dataForm"  label-width="120px">
      <el-form-item label="单位名称:" prop="company">
        <el-input  readonly v-model="dataForm.company" placeholder="单位名称"></el-input>
      </el-form-item>
      <el-form-item label="变电站名称:" prop="stationName">
        <el-input readonly v-model="dataForm.stationName" placeholder="变电站名称"></el-input>
      </el-form-item>
      <el-form-item label="线路名称:" prop="lineRoadName">
        <el-input  readonly v-model="dataForm.lineRoadName" placeholder="线路名称"></el-input>
      </el-form-item>
      <el-form-item label="线路名称:" prop="lineSegmentName">
        <el-input readonly v-model="dataForm.lineSegmentName" placeholder="线路名称"></el-input>
      </el-form-item>
      <el-form-item label="台区用户名称:" prop="userName">
        <el-input readonly v-model="dataForm.userName" placeholder="台区用户名称"></el-input>
      </el-form-item>
      <el-form-item label="用户性质:" prop="userNatrue">
        <el-input readonly  v-model="dataForm.userNatrue" placeholder="台区用户名称"></el-input>
      </el-form-item>
      <el-form-item label="台区经理:" prop="manager">
        <el-input readonly v-model="dataForm.manager" placeholder="台区经理"></el-input>
      </el-form-item>
<!--      <el-form-item label="用户数量:" prop="userCount">-->
<!--        <el-input readonly v-model="dataForm.userCount" placeholder="用户数量"></el-input>-->
<!--      </el-form-item>-->
    </el-form>
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
        stationName: '',
        lineRoadName: '',
        lineSegmentName: '',
        userName: '',
        userNatrue: 1,
        manager: '',
        userCount: ''
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.company = ''
      this.dataForm.stationName = ''
      this.dataForm.lineRoadName = ''
      this.dataForm.lineSegmentName = ''
      this.dataForm.userName = ''
      this.dataForm.userNatrue = ''
      this.dataForm.manager = ''
      this.dataForm.userCount = ''
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/powercut/district/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.company = data.district.company
              this.dataForm.stationName = data.district.stationName
              this.dataForm.lineRoadName = data.district.lineRoadName
              this.dataForm.lineSegmentName = data.district.lineSegmentName
              this.dataForm.userName = data.district.userName
              this.dataForm.userNatrue = data.district.userNatrue
              this.dataForm.manager = data.district.manager
              this.dataForm.userCount = data.district.userCount
            }
          })
        }
      })
    }
  }
}
</script>
