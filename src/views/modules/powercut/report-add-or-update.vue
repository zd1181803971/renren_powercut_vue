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
          prop="index"
          header-align="center"
          align="center"
          label="序号">
          <template slot-scope="scope">{{ (pageIndex - 1) * pageSize + scope.$index + 1 }}</template>
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
        :page-sizes="[10, 20, 50, 100,200,500]"
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
      <h4>{{ generalSituation.startTime }}至{{ generalSituation.stopTime }}，公司共发生台区停电{{ generalSituation.districtCount }}台次，涉及10千伏线路{{  generalSituation.lineRoadCount }}条，其中公变台区停电{{  generalSituation.commonTransformers }}台次、专变台区停电{{ generalSituation.specialUse }}台次，计划停电{{ generalSituation.planCount }}台次、故障停电{{ generalSituation.faultCount }}台次。</h4>
      <h3>二、按责任单位划分</h3>
      <h4>
        {{ stationFirstTest.companyMax }}（单位）发生台区停电最多，达到{{ stationFirstTest.countMax }}台次；
        {{ stationFirstTest.repeatCompanyMax }}（单位）发生台区重复停电最多，
        达到{{stationFirstTest.repeatCountMax}}台次；
        3次及以上重停台区数量最多的为{{ stationFirstTest.threeRepeatMax }}（单位），
        上周新增3次及以上重复停电台区{{ stationFirstTest.lastWeekRepeatCount }}个，
        分别为{{ stationFirstTest.lastWeekRepeatCompany }}。</h4>
      <span>
       <el-table
         :data="reportFirst"
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
          prop="countPublic"
          header-align="center"
          align="center"
          label="台区停电总数公变">
        </el-table-column>
        <el-table-column
          prop="countPrivate"
          header-align="center"
          align="center"
          label="台区停电总数专变">
        </el-table-column>
        <el-table-column
          prop="repeatCountPublic"
          header-align="center"
          align="center"
          label="重复停电数量公变">
        </el-table-column>
        <el-table-column
          prop="repeatCountPrivate"
          header-align="center"
          align="center"
          label="重复停电数量专变">
        </el-table-column>
        <el-table-column
          prop="publicCountThree"
          header-align="center"
          align="center"
          label="公变台区重停3次及以上">
        </el-table-column>
        <el-table-column
          prop="publicCountFive"
          header-align="center"
          align="center"
          label="公变台区重停5次及以上">
        </el-table-column>
        <el-table-column
          prop="privateCountThree"
          header-align="center"
          align="center"
          label="专变台区重停3次及以上">
        </el-table-column>
        <el-table-column
          prop="privateCountFive"
          header-align="center"
          align="center"
          label="专变台区重停5次及以上">
        </el-table-column>
      </el-table>
      </span>
      <h3>三、按停电原因划分</h3>
      <h4>
        {{ stationCount.startTime }}至{{ stationCount.endTime }}，
        公司共计发生计划停电台区{{stationCount.planCount  }}个，
        故障停电台区{{stationCount.tempCount  }}个，
        其中用户原因停电台区{{stationCount.userReasonCount  }}个、
        占比{{stationCount.userReasonCount2  }}%，
        自然因素停电台区{{stationCount.ziranCount  }}个、
        占比{{stationCount.ziranCount2  }}%，
        外力因素停电台区{{stationCount.wailiCount  }}个、
        占比{{ stationCount.wailiCount2 }}%，
        运行维护停电台区{{stationCount.yunweiCount  }}个、占比{{stationCount.yunweiCount2  }}%，
        设备原因停电台区{{stationCount.shebeiCount  }}个、占比{{stationCount.shebeiCount2  }}%，
        设计施工停电台区{{stationCount.shejiCount  }}个、占比{{stationCount.shejiCount2  }}%，
        低压表前故障停电台区{{stationCount.biaoqianCount  }}个，占比{{stationCount.biaoqianCount2  }}%，
        低压表后故障停电台区{{stationCount.biaohouCount  }}个、占比{{stationCount.biaohouCount2  }}%。</h4>
      <span>
        <el-table
          :data="secondReport"
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
          prop="planCount"
          header-align="center"
          align="center"
          label="计划停电">
        </el-table-column>
        <el-table-column
          prop="oneCount"
          header-align="center"
          align="center"
          label="用户原因">
        </el-table-column>
        <el-table-column
          prop="twoCount"
          header-align="center"
          align="center"
          label="自然因素">
        </el-table-column>
        <el-table-column
          prop="threeCount"
          header-align="center"
          align="center"
          label="外力因素">
        </el-table-column>
        <el-table-column
          prop="foreCount"
          header-align="center"
          align="center"
          label="运行维护">
        </el-table-column>
        <el-table-column
          prop="fiveCount"
          header-align="center"
          align="center"
          label="设备原因">
        </el-table-column>
        <el-table-column
          prop="sixCount"
          header-align="center"
          align="center"
          label="设计施工">
        </el-table-column>
        <el-table-column
          prop="sevenCount"
          header-align="center"
          align="center"
          label="低压表前">
        </el-table-column>
        <el-table-column
          prop="eightCount"
          header-align="center"
          align="center"
          label="低压表后">
        </el-table-column>
      </el-table>
      </span>
      <h3>四、台区经理停电分析</h3>
      <h4>{{managerName.startTime  }}至{{managerName.endTime  }}，
        停电台区涉及台区经理{{managerName.managerCount  }}名，
        其中存在重复停电的台区经理有{{managerName.repeatManagerCount  }}名，
        重复停电次数最多的台区经理为{{ managerName.company }}所{{managerName.managerName  }}（姓名）。</h4>
      <span>
        <el-table
          :data="reportThree"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            prop="company"
            header-align="center"
            align="center"
            label="单位">
        </el-table-column>
        <el-table-column
          prop="allManagerCount"
          header-align="center"
          align="center"
          label="全部台区经理数量">
        </el-table-column>
        <el-table-column
          prop="managerCount"
          header-align="center"
          align="center"
          label="停电台区经理数量">
        </el-table-column>
        <el-table-column
          prop="repeatManagerCount"
          header-align="center"
          align="center"
          label="重复停电台区经理数量">
        </el-table-column>
        <el-table-column
          prop="repeatManagerName"
          header-align="center"
          align="center"
          label="重停次数最多的台区经理">
        </el-table-column>
      </el-table>
      </span>
      <h3>五、重复停电整改情况</h3>
      <h4>{{five.startTime  }}至{{five.endTime  }}，
        共计发生重复停电台区{{five.repeatCount }}个，
        其中已制定整改措施台区{{five.reformCount  }}个，
        已整改完成台区{{ five.finishCount }}个，
        整改完成率{{five.finishCount2  }}%，
        重停台区沟通回访台区{{ five.commCount }}个，
        沟通回访完成率{{five.commCount2 }}%。</h4>
      <span>
        <el-table
          :data="reportFour"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
       <el-table-column
                    prop="company"
                    header-align="center"
                    align="center"
                    label="单位">
        </el-table-column>
        <el-table-column
          prop="repeatCount"
          header-align="center"
          align="center"
          label="重停台区数量">
        </el-table-column>
        <el-table-column
          prop="reformCount"
          header-align="center"
          align="center"
          label="制定整改措施数量">
        </el-table-column>
        <el-table-column
          prop="finishCount"
          header-align="center"
          align="center"
          label="已整改数量">
        </el-table-column>
        <el-table-column
          prop="finishCount2"
          header-align="center"
          align="center"
          label="整改完成率">
        </el-table-column>
        <el-table-column
          prop="commCount"
          header-align="center"
          align="center"
          label="沟通回访数量">
        </el-table-column>
        <el-table-column
          prop="commCount2"
          header-align="center"
          align="center"
          label="沟通回访完成率">
        </el-table-column>
      </el-table>
      </span>
      <h3>六、停电报送核查</h3>
      <h4>{{ sixHeaderReport.startTime }}至{{sixHeaderReport.endTime  }}，
        各单位累计报送停电台区{{sixHeaderReport.stationCount   }}个，
        其中供电服务指挥系统可靠性模块累计集成、补录停电台区{{sixHeaderReport.stationCount2   }}个，
        通过与供服系统停电数据核对，公司总体停电台区报送偏差率为{{sixHeaderReport.piancha   }}%，
        报送偏差率最大的单位为{{sixHeaderReport.companyMax   }}（单位），达到{{sixHeaderReport.piancha2   }}%。</h4>
      <span>
        <el-table
          :data="reportSix"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
                  <el-table-column
                    prop="company"
                    header-align="center"
                    align="center"
                    label="单位">
        </el-table-column>
        <el-table-column
          prop="stationCount"
          header-align="center"
          align="center"
          label="报送停电台区数量">
        </el-table-column>
        <el-table-column
          prop="stationCount2"
          header-align="center"
          align="center"
          label="供服系统停电台区数量">
        </el-table-column>
        <el-table-column
          prop="chazhi"
          header-align="center"
          align="center"
          label="差值">
        </el-table-column>
        <el-table-column
          prop="piancha"
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
      <el-button v-if="buttonVisible && !showVisible" type="primary" @click="buttonVisible = false;formVisible = false;showVisible = true;showDataList()">预览报告</el-button>

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
      generalSituation: {},
      stationFirstTest: {},
      stationCount: {},
      managerName: {},
      five: {},
      sixHeaderReport: {},
      reportFirst: [],
      secondReport: [],
      reportThree: [],
      reportFour: [],
      reportSix: [],
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
    formatDateTime  (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      var h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      var minute = date.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      var second = date.getSeconds()
      second = second < 10 ? ('0' + second) : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    },
    // 报告预览
    showDataList () {
      console.log(this.dataForm.startTime)
      // alert('ceshi ')
      this.$http({
        url: this.$http.adornUrl('/powercut/report/analysisView'),
        method: 'post',
        data: this.$http.adornData({
          'reportName': this.dataForm.reportName,
          'startTime': this.formatDateTime(this.dataForm.startTime),
          'stopTime': this.formatDateTime(this.dataForm.stopTime),
          'remarks': this.dataForm.remarks
        })
      }).then(({data}) => {
        console.log(data)
        if (data && data.code === 0) {
          this.generalSituation = data.analysisView.generalSituation
          this.stationFirstTest = data.analysisView.stationFirstTest
          this.stationCount = data.analysisView.stationCount
          this.managerName = data.analysisView.managerName
          this.five = data.analysisView.five
          this.sixHeaderReport = data.analysisView.sixHeaderReport
          this.reportFirst = data.analysisView.reportFirst
          this.secondReport = data.analysisView.secondReport
          this.reportThree = data.analysisView.reportThree
          this.reportFour = data.analysisView.reportFour
          this.reportSix = data.analysisView.reportSix
        }
      })
    },
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
      this.dataForm.startTime = ''
      this.dataForm.stopTime = ''
      this.dataForm.reportName = ''
      this.dataForm.station = ''
      this.dataForm.manager = ''
      this.dataForm.remarks = ''
      this.formVisible = true
      this.buttonVisible = false
      this.showVisible = false
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
      this.$http({
        url: this.$http.adornUrl(`/powercut/report/getAnalysisInfo`),
        method: 'post',
        data: this.$http.adornData({
          'reportName': this.dataForm.reportName,
          'startTime': this.formatDateTime(this.dataForm.startTime),
          'stopTime': this.formatDateTime(this.dataForm.stopTime),
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
      //   }
      // })
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    }
  }
}
</script>

<style>
.customWidth{
  width:80%;
}
</style>
