<template>
  <div class="mod-demo-echarts">
      <el-tag size="big">总体情况</el-tag>
   <h2>
     {{ dataForm.startTime }}至{{ dataForm.stopTime }}，
     公司共发生台区停电{{ dataForm.districtCount }}台次,涉及10千伏线路{{ dataForm.lineRoadCount }}条，其中公变台区停电{{ dataForm.commonTransformers }}台次、专变台区停电{{ dataForm.specialUse }}台次，
     计划停电{{ dataForm.planCount }}台次、故障停电{{ dataForm.faultCount }}台次。
   </h2>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <div id="J_firstBox" class="first-box"></div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card>
          <div id="J_secondBox" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card>
          <div id="J_thirdBox" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card>
          <div id="J_fourthBox" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card>
          <div id="J_fifthBox" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  data () {
    return {
      firstArry: [],
      thirdArry: [],
      arry: [],
      obj: {},
      firstBox: null,
      secondBox: null,
      thirdBox: null,
      fourthBox: null,
      fifthBox: null,
      dataForm: {
        startTime: '',
        stopTime: '',
        districtCount: '',
        lineRoadCount: '',
        commonTransformers: '',
        specialUse: '',
        planCount: '',
        faultCount: ''
      }
    }
  },
  mounted () {
    this.getDataList()
    this.initFirstBox()
    this.initSecondBox()
    this.initThirdBox()
    this.initFourthBox()
    this.initFifthBox()
  },
  activated () {
    // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
    if (this.firstBox) {
      this.firstBox.resize()
    }
    if (this.secondBox) {
      this.secondBox.resize()
    }
    if (this.thirdBox) {
      this.thirdBox.resize()
    }
    if (this.fourthBox) {
      this.fourthBox.resize()
    }
    if (this.fifthBox) {
      this.fifthBox.resize()
    }
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.$http({
        url: this.$http.adornUrl('/powercut/standingbook/generalSituation'),
        method: 'get',
        params: this.$http.adornParams({
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataForm.startTime = data.generalSituationDto.startTime
          this.dataForm.stopTime = data.generalSituationDto.stopTime
          this.dataForm.districtCount = data.generalSituationDto.districtCount
          this.dataForm.lineRoadCount = data.generalSituationDto.lineRoadCount
          this.dataForm.commonTransformers = data.generalSituationDto.commonTransformers
          this.dataForm.specialUse = data.generalSituationDto.specialUse
          this.dataForm.planCount = data.generalSituationDto.planCount
          this.dataForm.faultCount = data.generalSituationDto.faultCount
        }
      })
    },
    // 供电所停电情况统计 横向堆叠柱状图统计
    initFirstBox () {
      this.$http({
        url: this.$http.adornUrl('/powercut/repeatdetailed/placeBlackout'),
        method: 'get'
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.firstArry = []
          for (let i = data.placeBlackoutDtos.length - 1; i > 0; i--) {
            this.firstArry.push({
              placeName: data.placeBlackoutDtos[i].placeName,
              publicCount: data.placeBlackoutDtos[i].publicCount,
              privateCount: data.placeBlackoutDtos[i].privateCount
            })
          }
          var option = {
            title: {
              text: '供电所停电情况统计',
              subtext: '统计“停电明细导入分析”菜单中60天内各供电所停电数量'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend: {
              data: ['公变', '专变']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.1],
              minInterval: 1,
              axisLabel: {
                formatter: '{value} 台次'
              }
            },
            yAxis: {
              type: 'category',
              data: this.firstArry.map(item => {
                return item.placeName
              })
            },
            series: [
              {
                name: '公变',
                type: 'bar',
                stack: '总量',
                label: {
                  show: true,
                  position: 'insideRight'
                },
                data: this.firstArry.map(item => {
                  return item.publicCount
                })
              },
              {
                name: '专变',
                type: 'bar',
                stack: '总量',
                label: {
                  show: true,
                  position: 'insideRight'
                },
                data: this.firstArry.map(item => {
                  return item.privateCount
                })
              }
            ]
          }
          this.firstBox = echarts.init(document.getElementById('J_firstBox'))
          this.firstBox.setOption(option)
          window.addEventListener('resize', () => {
            this.firstBox.resize()
          })
        }
      })
    },
    // 停电原因统计 环状图
    initSecondBox () {
      this.$http({
        url: this.$http.adornUrl('/powercut/repeatdetailed/reasonCensus'),
        method: 'get'
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.arry = []
          data.reasonCensusDtos.map(item => {
            delete data.reasonCensusDtos['percentage']
            this.arry.push({
              value: item.cateCount,
              name: item.category
            })
          })
          var option = {
            title: {
              text: '停电原因统计',
              subtext: '环状图统计“停电明细导入分析”菜单中60天内停电记录的“停电分类”占比。'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              top: 60,
              left: 10,
              data: data.reasonCensusDtos.map((item) => {
                return item.category
              })
            },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: this.arry
              }
            ]
          }
          this.secondBox = echarts.init(document.getElementById('J_secondBox'))
          this.secondBox.setOption(option)
          window.addEventListener('resize', () => {
            this.secondBox.resize()
          })
        }
      })
    },
    // 停电报送核查统计 柱状图统计
    initThirdBox () {
      this.$http({
        url: this.$http.adornUrl('/powercut/repeatdetailed/placeMatching'),
        method: 'get'
      }).then(({data}) => {
        if (data && data.code === 0) {
          var option = {
            title: {
              text: '停电报送核查统计',
              subtext: '柱状图统计“停电明细导入分析”菜单中60天内各供电所上报停电记录的匹配率。匹配度低的在前。'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['匹配率']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: data.placeMatchingDtos.map(item => {
                  return item.placeName
                })
              }
            ],
            yAxis: [
              {
                type: 'value',
                boundaryGap: [0, 0.1]
              }
            ],
            series: [
              {
                name: '匹配率',
                type: 'bar',
                data: data.placeMatchingDtos.map(item => {
                  return item.matching
                })
              }
            ]
          }
          this.thirdBox = echarts.init(document.getElementById('J_thirdBox'))
          this.thirdBox.setOption(option)
          window.addEventListener('resize', () => {
            this.thirdBox.resize()
          })
        }
      })
    },
    // 台区经理重复停电统计
    initFourthBox () {
      this.$http({
        url: this.$http.adornUrl('/powercut/repeatdetailed/districtManager'),
        method: 'get'
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.thirdArry = []
          for (let i = data.districtManagerDtos.length - 1; i > 0; i--) {
            this.thirdArry.push({
              blackoutCount: data.districtManagerDtos[i].blackoutCount,
              managerName: data.districtManagerDtos[i].managerName
            })
          }
          var option = {
            title: {
              text: '台区经理重复停电统计',
              subtext: '横向柱状图统计“停电明细导入分析”菜单中60天内各台区经理的停电次数，数量多的在上。'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['停电次数']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: this.thirdArry.map(item => {
                return item.managerName
              })
            },
            series: [
              {
                name: '停电次数',
                type: 'bar',
                data: this.thirdArry.map(item => {
                  return item.blackoutCount
                })
              }
            ]
          }
          this.fourthBox = echarts.init(document.getElementById('J_fourthBox'))
          this.fourthBox.setOption(option)
          window.addEventListener('resize', () => {
            this.fourthBox.resize()
          })
        }
      })
    },

    initFifthBox () {
      this.$http({
        url: this.$http.adornUrl('/powercut/repeatdetailed/correctiveList'),
        method: 'get'
      }).then(({data}) => {
        if (data && data.code === 0) {
          var option = {
            title: {
              text: '重复停电整改统计',
              subtext: '堆叠柱状图统计“停电明细导入分析”菜单中60天内的各供电所重复停电闭环情况。'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend: {
              data: ['未整改', '进行中', '已整改']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: data.correctiveActionDtos.map(item => {
                  return item.placeName
                })
              }
            ],
            yAxis: [
              {
                type: 'value',
                boundaryGap: [0, 0.1],
                minInterval: 1
              }
            ],
            series: [
              {
                name: '未整改',
                type: 'bar',
                stack: '搜索引擎',
                data: data.correctiveActionDtos.map(item => {
                  return item.noCorrectiveCount
                })
              },
              {
                name: '进行中',
                type: 'bar',
                stack: '搜索引擎',
                data: data.correctiveActionDtos.map(item => {
                  return item.carryOnCount
                })
              },
              {
                name: '已整改',
                type: 'bar',
                stack: '搜索引擎',
                data: data.correctiveActionDtos.map(item => {
                  return item.correctiveCount
                })
              }
            ]
          }

          this.fifthBox = echarts.init(document.getElementById('J_fifthBox'))
          this.fifthBox.setOption(option)
          window.addEventListener('resize', () => {
            this.fifthBox.resize()
          })
        }
      })
    }

  }
}
</script>

<style lang="scss">
.mod-demo-echarts {
  > .el-alert {
    margin-bottom: 10px;
  }
  > .el-row {
    margin-top: -10px;
    margin-bottom: -10px;
    .el-col {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
  .chart-box {
    min-height: 400px;
  }
  .first-box {
    min-height: 700px;
  }
}
</style>
