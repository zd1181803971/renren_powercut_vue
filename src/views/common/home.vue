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
      <el-col :span="12">
        <el-card>
          <div id="J_chartPieBox" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="test" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="J_chartScatterBox" class="chart-box"></div>
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
      chartLine: null,
      chartBar: null,
      chartBar2: null,
      chartPie: null,
      chartScatter: null,
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
    this.initChartBar()
    this.initChartPie()
    this.initChartBar2()
    this.initChartLine()
    this.getDataList()
  },
  activated () {
    // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
    if (this.chartLine) {
      this.chartLine.resize()
    }
    if (this.chartBar) {
      this.chartBar.resize()
    }
    if (this.chartBar2) {
      this.chartBar2.resize()
    }
    if (this.chartPie) {
      this.chartPie.resize()
    }
    if (this.chartScatter) {
      this.chartScatter.resize()
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
    initChartLine () {
      var option = {
        title: {
          text: '供电所停电情况统计',
          subtext: '统计“停电明细导入分析”菜单中60天内各供电所停电数量'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['专变', '公变']
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
          data: ['供电所1', '供电所2', '供电所3', '供电所4', '供电所5', '供电所6', '供电所7', '供电所8', '供电所9', '供电所10', '供电所11', '供电所12', '供电所13', '供电所14']
        },
        series: [
          {
            name: '专变',
            type: 'bar',
            data: [2, 5, 7, 6, 2, 8, 7, 8, 6, 3, 5, 4, 5, 6]
          },
          {
            name: '公变',
            type: 'bar',
            data: [1, 3, 5, 2, 8, 10, 2, 6, 9, 4, 2, 3, 6, 9]
          }
        ]
      }
      this.chartLine = echarts.init(document.getElementById('J_firstBox'))
      this.chartLine.setOption(option)
      window.addEventListener('resize', () => {
        this.chartLine.resize()
      })
    },
    // 停电原因统计 环状图
    initChartPie () {
      var option = {
        backgroundColor: '#2c343c',
        title: {
          text: '停电原因统计',
          left: 'center',
          top: 20,
          textStyle: {
            color: '#ccc'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [
              { value: 335, name: '计划停电' },
              { value: 310, name: '用户原因' },
              { value: 274, name: '自然因素' },
              { value: 235, name: '外力因素' },
              { value: 111, name: '运行维护' },
              { value: 222, name: '设备原因' },
              { value: 333, name: '设计施工' },
              { value: 444, name: '低压表前' },
              { value: 555, name: '低压表后' }
            ].sort(function (a, b) { return a.value - b.value }),
            roseType: 'radius',
            label: {
              normal: {
                textStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            itemStyle: {
              normal: {
                color: '#c23531',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200
            }
          }
        ]
      }
      this.chartPie = echarts.init(document.getElementById('J_secondBox'))
      this.chartPie.setOption(option)
      window.addEventListener('resize', () => {
        this.chartPie.resize()
      })
    },
    // null
    initChartBar () {
      var option = {
        title: {
          text: '供电所停电情况统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['专变', '公变']
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
            data: ['一台次', '二台次', '三台次', '四台次', '无台次', '六台次', '七台次']
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: ['1号供电所', '2号供电所', '3号供电所', '4号供电所', '5号供电所', '6号供电所', '7号供电所']
          }
        ],
        series: [
          {
            name: '专变',
            type: 'bar',
            data: [1, 2, 3, 4, 5, 6, 7]
          },
          {
            name: '公变',
            type: 'bar',
            data: [2, 5, 6, 4, 5, 6, 7]
          }
        ]
      }
      this.chartBar = echarts.init(document.getElementById('J_chartScatterBox'))
      this.chartBar.setOption(option)
      window.addEventListener('resize', () => {
        this.chartBar.resize()
      })
    },
    // 停电报送核查统计
    initChartBar2 () {
      var option = {
        title: {
          text: '停电报送核查统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['专变', '公变']
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
            data: ['一台次', '二台次', '三台次', '四台次', '无台次', '六台次', '七台次']
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: ['1号供电所', '2号供电所', '3号供电所', '4号供电所', '5号供电所 ', '6号供电所', '7号供电所']
          }
        ],
        series: [
          {
            name: '专变',
            type: 'bar',
            data: [1, 2, 3, 4, 5, 6, 7]
          },
          {
            name: '公变',
            type: 'bar',
            data: [2, 5, 6, 4, 5, 6, 7]
          }
        ]
      }
      this.chartBar2 = echarts.init(document.getElementById('test'))
      this.chartBar2.setOption(option)
      window.addEventListener('resize', () => {
        this.chartBar2.resize()
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
