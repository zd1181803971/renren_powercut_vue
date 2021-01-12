<template>
  <el-dialog
    :title="!showVisible ? '新增页面' : '报告预览页面'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form v-if="formVisible" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="130px">
      <el-form-item label="报告名称:" prop="reportName">
        <el-input v-model="dataForm.reportName" placeholder="报告名称"></el-input>
      </el-form-item>
      <el-form-item label="备注:" prop="remarks">
        <el-input v-model="dataForm.remarks" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="统计开始时间:" prop="startTime">
        <div class="block">
          <el-date-picker
            v-model="dataForm.startTime"
            type="datetime"
            placeholder="统计开始时间">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="统计结束时间:" prop="stopTime">
        <div class="block">
          <el-date-picker
            v-model="dataForm.stopTime"
            type="datetime"
            placeholder="统计结束时间">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="单位名称:" prop="station">
        <el-input v-model="dataForm.station" placeholder="单位名称"></el-input>
      </el-form-item>
      <el-form-item label="台区经理:" prop="manager">
        <el-input v-model="dataForm.manager" placeholder="台区经理"></el-input>
      </el-form-item>
    </el-form>
    <div v-if="buttonVisible">
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="id"
          header-align="center"
          align="center"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="company"
          header-align="center"
          align="center"
          label="单位名称">
        </el-table-column>
        <el-table-column
          prop="lineRoadName"
          header-align="center"
          align="center"
          label="线路名称">
        </el-table-column>
        <el-table-column
          prop="userName"
          header-align="center"
          align="center"
          label="用户名称">
        </el-table-column>
        <el-table-column
          prop="userNatrue"
          header-align="center"
          align="center"
          label="用户性质">
        </el-table-column>
        <el-table-column
          prop="startTime"
          header-align="center"
          align="center"
          label="起始时间">
        </el-table-column>
        <el-table-column
          prop="stopTime"
          header-align="center"
          align="center"
          label="终止时间">
        </el-table-column>
        <el-table-column
          prop="hourCount"
          header-align="center"
          align="center"
          label="停电时户数">
        </el-table-column>
        <el-table-column
          prop="repeatCount"
          header-align="center"
          align="center"
          label="重复停电次数">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <div v-if="showVisible">
        <div style="text-align: center">
          <h1>国网山东青州市供电公司台区停电分析报告</h1>
          <span>（停电分析针对导入的停电明细进行分析）</span>
        </div>
        <h3> 一、总体情况</h3>
        <h4>{{ paramOne1 }}至{{ paramOne2 }}，公司共发生台区停电{{ paramOne3 }}台次，涉及10千伏线路{{  paramOne4 }}条，其中公变台区停电{{  paramOne5 }}台次、专变台区停电{{ paramOne6 }}台次，计划停电{{ paramOne7 }}台次、故障停电{{ paramOne8 }}台次。</h4>
        <h3>二、按责任单位划分</h3>
        <h4>
          {{ paramTwo1 }}（单位）发生台区停电最多，达到{{ paramTwo2 }}台次；{{ paramTwo3 }}（单位）发生台区重复停电最多，达到{{ paramTwo4 }}台次；3次及以上重停台区数量最多的为{{ paramTwo5 }}（单位），上周新增3次及以上重复停电台区{{ paramTwo6 }}个，分别为{{ paramTwo7 }}（单位）{{ paramTwo8 }}（台区）。</h4>
        <span>
       <el-table
         :data="twoTable"
         border
         v-loading="dataListLoading"
         style="width: 100%;">
        <el-table-column
          prop="company"
          header-align="center"
          align="center"
          label="单位名称">
        </el-table-column>
        <el-table-column
          prop="lineRoadName"
          header-align="center"
          align="center"
          label="台区停电总数公变">
        </el-table-column>
        <el-table-column
          prop="userName"
          header-align="center"
          align="center"
          label="台区停电总数专变">
        </el-table-column>
        <el-table-column
          prop="userNatrue"
          header-align="center"
          align="center"
          label="重复停电数量公变">
        </el-table-column>
        <el-table-column
          prop="startTime"
          header-align="center"
          align="center"
          label="重复停电数量专变">
        </el-table-column>
        <el-table-column
          prop="stopTime"
          header-align="center"
          align="center"
          label="公变台区重停3次及以上">
        </el-table-column>
        <el-table-column
          prop="hourCount"
          header-align="center"
          align="center"
          label="公变台区重停5次及以上">
        </el-table-column>
        <el-table-column
          prop="repeatCount"
          header-align="center"
          align="center"
          label="专变台区重停3次及以上">
        </el-table-column>
        <el-table-column
          prop="repeatCount"
          header-align="center"
          align="center"
          label="专变台区重停5次及以上">
        </el-table-column>
      </el-table>
      </span>
        <h3>三、按停电原因划分</h3>
        <h4>
          {{ paramThree1 }}至{{ paramThree2 }}，公司共计发生计划停电台区{{ paramThree3 }}个，故障停电台区{{ paramThree4 }}个，其中用户原因停电台区{{ paramThree5 }}个、占比{{ paramThree6 }}%，自然因素停电台区{{ paramThree7 }}个、占比{{ paramThree8 }}%，外力因素停电台区{{ paramThree9 }}个、占比{{ paramThree10 }}%，运行维护停电台区{{ paramThree11 }}个、占比{{ paramThree12 }}%，设备原因停电台区{{ paramThree13 }}个、占比{{ paramThree14 }}%，设计施工停电台区{{ paramThree15 }}个、占比{{ paramThree16 }}%，低压表前故障停电台区{{ paramThree17 }}个，占比{{ paramThree18 }}%，低压表后故障停电台区{{ paramThree19 }}个、占比{{ paramThree20 }}%。</h4>
        <span>
        <el-table
          :data="threeTable"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
        <el-table-column
          prop="company"
          header-align="center"
          align="center"
          label="单位名称">
        </el-table-column>
        <el-table-column
          prop="lineRoadName"
          header-align="center"
          align="center"
          label="计划停电">
        </el-table-column>
        <el-table-column
          prop="userName"
          header-align="center"
          align="center"
          label="用户原因">
        </el-table-column>
        <el-table-column
          prop="userNatrue"
          header-align="center"
          align="center"
          label="自然因素">
        </el-table-column>
        <el-table-column
          prop="startTime"
          header-align="center"
          align="center"
          label="外力因素">
        </el-table-column>
        <el-table-column
          prop="stopTime"
          header-align="center"
          align="center"
          label="运行维护">
        </el-table-column>
        <el-table-column
          prop="hourCount"
          header-align="center"
          align="center"
          label="设备原因">
        </el-table-column>
        <el-table-column
          prop="repeatCount"
          header-align="center"
          align="center"
          label="设计施工">
        </el-table-column>
        <el-table-column
          prop="repeatCount"
          header-align="center"
          align="center"
          label="低压表前">
        </el-table-column>
        <el-table-column
          prop="repeatCount"
          header-align="center"
          align="center"
          label="低压表后">
        </el-table-column>
      </el-table>
      </span>
        <h3>四、台区经理停电分析</h3>
        <h4>{{ paramFour1 }}至{{ paramFour2 }}，停电台区涉及台区经理{{ paramFour3 }}名，其中存在重复停电的台区经理有{{ paramFour4 }}名，重复停电次数最多的台区经理为{{ paramFour5 }}所{{ paramFour6 }}（姓名）。</h4>
        <span>
        <el-table
          :data="fourTable"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
        <el-table-column
          prop="company"
          header-align="center"
          align="center"
          label="全部台区经理数量">
        </el-table-column>
        <el-table-column
          prop="lineRoadName"
          header-align="center"
          align="center"
          label="停电台区经理数量">
        </el-table-column>
        <el-table-column
          prop="userName"
          header-align="center"
          align="center"
          label="重复停电台区经理数量">
        </el-table-column>
        <el-table-column
          prop="userNatrue"
          header-align="center"
          align="center"
          label="重停次数最多的台区经理">
        </el-table-column>
      </el-table>
      </span>
        <h3>五、重复停电整改情况</h3>
        <h4>{{ paramFive1 }}至{{ paramFive2 }}，共计发生重复停电台区{{ paramFive3 }}个，其中已制定整改措施台区{{ paramFive4 }}个，已整改完成台区{{ paramFive5 }}个，整改完成率{{ paramFive6 }}%，重停台区沟通回访台区{{ paramFive7 }}个，沟通回访完成率{{ paramFive8 }}%。</h4>
        <span>
        <el-table
          :data="fiveTable"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
        <el-table-column
          prop="company"
          header-align="center"
          align="center"
          label="重停台区数量">
        </el-table-column>
        <el-table-column
          prop="lineRoadName"
          header-align="center"
          align="center"
          label="制定整改措施数量">
        </el-table-column>
        <el-table-column
          prop="userName"
          header-align="center"
          align="center"
          label="已整改数量">
        </el-table-column>
        <el-table-column
          prop="userNatrue"
          header-align="center"
          align="center"
          label="整改完成率">
        </el-table-column>
        <el-table-column
          prop="startTime"
          header-align="center"
          align="center"
          label="沟通回访数量">
        </el-table-column>
        <el-table-column
          prop="stopTime"
          header-align="center"
          align="center"
          label="沟通回访完成率">
        </el-table-column>
      </el-table>
      </span>
        <h3>六、停电报送核查</h3>
        <h4>{{ paramSix1 }}至{{ paramSix2 }}，各单位累计报送停电台区{{ paramSix3 }}个，其中供电服务指挥系统可靠性模块累计集成、补录停电台区{{ paramSix4 }}个，通过与供服系统停电数据核对，公司总体停电台区报送偏差率为{{ paramSix5 }}%，报送偏差率最大的单位为{{ paramSix6 }}（单位），达到{{ paramSix7 }}%。</h4>
        <span>
        <el-table
          :data="sixTable"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
        <el-table-column
          prop="company"
          header-align="center"
          align="center"
          label="报送停电台区数量">
        </el-table-column>
        <el-table-column
          prop="lineRoadName"
          header-align="center"
          align="center"
          label="供服系统停电台区数量">
        </el-table-column>
        <el-table-column
          prop="userName"
          header-align="center"
          align="center"
          label="差值">
        </el-table-column>
        <el-table-column
          prop="userNatrue"
          header-align="center"
          align="center"
          label="偏差率（%）">
        </el-table-column>
      </el-table>
      </span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="!buttonVisible" @click="visible = false">取消</el-button>
      <el-button v-if="buttonVisible"  @click="buttonVisible = false">上一步</el-button>

      <el-button v-if="!buttonVisible && !showVisible" type="primary" @click="nextGetData()">下一步</el-button>
      <el-button v-if="buttonVisible && !showVisible" type="primary" @click="buttonVisible = false;formVisible = false;showVisible = true">预览报告</el-button>

      <el-button v-if="showVisible" type="primary" @click="dataFormSubmit()">生成报告</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dataForm: {
        reportName: '',
        startTime: '',
        stopTime: '',
        reportHref: '',
        remarks: '',
        station: '',
        manager: ''
      },
      visible: false,
      paramOne1: '',
      paramOne2: '',
      paramOne3: '',
      paramOne4: '',
      paramOne5: '',
      paramOne6: '',
      paramOne7: '',
      paramOne8: '',
      paramTwo1: '',
      paramTwo2: '',
      paramTwo3: '',
      paramTwo4: '',
      paramTwo5: '',
      paramTwo6: '',
      paramTwo7: '',
      paramTwo8: '',
      paramThree1: '',
      paramThree2: '',
      paramThree3: '',
      paramThree4: '',
      paramThree5: '',
      paramThree6: '',
      paramThree7: '',
      paramThree8: '',
      paramThree9: '',
      paramThree10: '',
      paramThree11: '',
      paramThree12: '',
      paramThree13: '',
      paramThree14: '',
      paramThree15: '',
      paramThree16: '',
      paramThree17: '',
      paramThree18: '',
      paramThree19: '',
      paramThree20: '',
      paramFour1: '',
      paramFour2: '',
      paramFour3: '',
      paramFour4: '',
      paramFour5: '',
      paramFour6: '',
      paramFive1: '',
      paramFive2: '',
      paramFive3: '',
      paramFive4: '',
      paramFive5: '',
      paramFive6: '',
      paramFive7: '',
      paramFive8: '',
      paramSix1: '',
      paramSix2: '',
      paramSix3: '',
      paramSix4: '',
      paramSix5: '',
      paramSix6: '',
      paramSix7: '',

      twoTable: [],
      threeTable: [],
      fourTable: [],
      fiveTable: [],
      sixTable: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      showVisible: false,
      buttonVisible: false,
      dataListLoading: false,
      formVisible: false,
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
    nextGetData () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonVisible = true
          this.getDataList()
        }
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/powercut/report/getRepeatDetailedList'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'start_time': this.dataForm.startTime,
          'stopTime': this.dataForm.stopTime,
          'company': this.dataForm.company,
          'manager': this.dataForm.manager
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    init (id) {
      this.formVisible = true
      this.buttonVisible = false
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
              this.dataForm.reportHref = data.report.reportHref
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
          // this.$message.error('TOBECONTINUE')
          this.$http({
            url: this.$http.adornUrl(`/powercut/report/getAnalysisInfo`),
            method: 'get',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'reportName': this.dataForm.reportName,
              'startTime': this.dataForm.startTime,
              'stopTime': this.dataForm.stopTime,
              'remarks': this.dataForm.remarks,
              'company': this.dataForm.company,
              'manager': this.dataForm.manager
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
          // this.$http({
          //   url: this.$http.adornUrl(`/powercut/report/save`),
          //   method: 'post',
          //   data: this.$http.adornData({
          //     'id': this.dataForm.id || undefined,
          //     'reportName': this.dataForm.reportName,
          //     'startTime': this.dataForm.startTime,
          //     'stopTime': this.dataForm.stopTime,
          //     'remarks': this.dataForm.remarks
          //   })
          // }).then(({data}) => {
          //   if (data && data.code === 0) {
          //     this.$message({
          //       message: '操作成功',
          //       type: 'success',
          //       duration: 1500,
          //       onClose: () => {
          //         this.visible = false
          //         this.$emit('refreshDataList')
          //       }
          //     })
          //   } else {
          //     this.$message.error(data.msg)
          //   }
          // })
        }
      })
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    }
  }
}
</script>
