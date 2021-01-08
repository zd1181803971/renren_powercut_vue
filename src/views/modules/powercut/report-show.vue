<template>
  <el-dialog
    center
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="130px">
      <div style="text-align: center">
        <h1>国网山东青州市供电公司台区停电分析报告</h1>
        <span>（停电分析针对导入的停电明细进行分析）</span>
      </div>
     <h3> 一、总体情况</h3>
      <h4>**年**月**日至**年**月**日，公司共发生台区停电**台次，涉及10千伏线路**条，其中公变台区停电**台次、专变台区停电**台次，计划停电**台次、故障停电**台次。</h4>
      <h3>二、按责任单位划分</h3>
      <h4>      **（单位）发生台区停电最多，达到**台次；**（单位）发生台区重复停电最多，达到**台次；3次及以上重停台区数量最多的为**（单位），上周新增3次及以上重复停电台区**个，分别为**（单位）**（台区）、**（单位）**（台区）、**（单位）**（台区）。
      </h4>
      <h3>三、按停电原因划分</h3>
      <h4>**年**月**日至**年**月**日，公司共计发生计划停电台区**个，故障停电台区**个，其中用户原因停电台区**个、占比**%，自然因素停电台区**个、占比**%，外力因素停电台区**个、占比**%，运行维护停电台区**个、占比**%，设备原因停电台区**个、占比**%，设计施工停电台区**个、占比**%，低压表前故障停电台区**个，占比**%，低压表后故障停电台区**个、占比**%。</h4>
      <h3>四、台区经理停电分析</h3>
      <h4>**年**月**日至**年**月**日，停电台区涉及台区经理**名，其中存在重复停电的台区经理有**名，重复停电次数最多的台区经理为**所**（姓名）。</h4>
      <h3>五、重复停电整改情况</h3>
      <h4>**年**月**日至**年**月**日，共计发生重复停电台区**个，其中已制定整改措施台区**个，已整改完成台区**个，整改完成率**%，重停台区沟通回访台区**个，沟通回访完成率**%。</h4>
      <h3>六、停电报送核查</h3>
      <h4>**年**月**日至**年**月**日，各单位累计报送停电台区**个，其中供电服务指挥系统可靠性模块累计集成、补录停电台区**个，通过与供服系统停电数据核对，公司总体停电台区报送偏差率为**%，报送偏差率最大的单位为**（单位），达到**%。</h4>
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
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].resetFields()
      //   if (this.dataForm.id) {
      //     this.$http({
      //       url: this.$http.adornUrl(`/powercut/report/info/${this.dataForm.id}`),
      //       method: 'get',
      //       params: this.$http.adornParams()
      //     }).then(({data}) => {
      //       if (data && data.code === 0) {
      //         this.dataForm.reportName = data.report.reportName
      //         this.dataForm.startTime = data.report.startTime
      //         this.dataForm.stopTime = data.report.stopTime
      //         this.dataForm.remarks = data.report.remarks
      //       }
      //     })
      //   }
      // })
    },
    // 表单提交
    dataFormSubmit () {
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     this.$http({
      //       url: this.$http.adornUrl(`/powercut/report/update`),
      //       method: 'post',
      //       data: this.$http.adornData({
      //         'id': this.dataForm.id || undefined,
      //         'reportName': this.dataForm.reportName,
      //         'startTime': this.dataForm.startTime,
      //         'stopTime': this.dataForm.stopTime,
      //         'remarks': this.dataForm.remarks
      //       })
      //     }).then(({data}) => {
      //       if (data && data.code === 0) {
      //         this.$message({
      //           message: '操作成功',
      //           type: 'success',
      //           duration: 1500,
      //           onClose: () => {
      //             this.visible = false
      //             this.$emit('refreshDataList')
      //           }
      //         })
      //       } else {
      //         this.$message.error(data.msg)
      //       }
      //     })
      //   }
      // })
    }
  }
}
</script>
