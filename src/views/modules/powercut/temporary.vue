<template>
  <div class="mod-config">
    <el-form :inline="true" :rules="dataRule" ref="dataForm" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <span>
          单位名称：
        </span>
        <el-input
          placeholder="请输入单位名称"
          v-model="dataForm.station"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <span>
          计划停电时间:
      </span>
        <div class="block">
          <el-date-picker
            v-model="dataForm.timeList"
            type="datetimerange"
            :picker-options="dataForm.pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </div>
      </el-form-item>

      <el-form-item prop="count">
        <span>
          近两月停电次数：
        </span>
        <el-input
          placeholder="请输入停电次数"
          v-model="dataForm.count"
          clearable>
        </el-input>
      </el-form-item>
      <br>
      <el-form-item>
        <el-button @click="getDataList()" type="success">查询</el-button>
        <el-button @click="clear()" type="warning">清空</el-button>
        <el-button @click="exportData()" type="primary">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      fit
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        label="序号"
        type="index"
        header-align="center"
        align="center"
        width="50">
        <template slot-scope="scope">{{ (pageIndex - 1) * pageSize + scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column
        prop="company"
        header-align="center"
        align="center"
        label="单位名称">
      </el-table-column>
      <el-table-column
        prop="blackoutTime"
        header-align="center"
        align="center"
        label="计划停电时间">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">
            {{scope.row.blackoutTime}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="recoveryTime"
        header-align="center"
        align="center"
        label="计划恢复时间">
      </el-table-column>
      <el-table-column
        prop="districtCount"
        header-align="center"
        align="center"
        label="影响台区数量">
      </el-table-column>
      <el-table-column
        prop="userCount"
        header-align="center"
        align="center"
        label="影响用户数量">
      </el-table-column>
      <el-table-column
        prop="reason"
        header-align="center"
        align="center"
        label="停电原因">
      </el-table-column>
      <el-table-column
        prop="blackoutCount"
        header-align="center"
        align="center"
        label="近两月停电次数">
      </el-table-column>
      <el-table-column
        prop="jobContent"
        header-align="center"
        align="center"
        label="工作内容">
      </el-table-column>
      <el-table-column
        prop="planState"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.planState == 0">已保存</span>
          <span v-if="scope.row.planState == 1">审批中</span>
          <span v-if="scope.row.planState == 2">审批中</span>
          <span v-if="scope.row.planState == 3">已通过</span>
        </template>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './temporary-add-or-update'
import {isIntegerNotMust} from '../../../utils'
export default {
  data () {
    return {
      dataForm: {
        station: '',
        count: '',
        // pickerOptions日期时间
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        timeList: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      dataRule: {
        count: [
          { validator: isIntegerNotMust, message: '只能输入正整数', trigger: 'blur' }
        ]
      },
      dataArray: ''
    }
  },
  components: {
    AddOrUpdate
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 计划停电导出数据
    exportData () {
      this.dataArray = ''
      if (this.dataForm.station !== '' && this.dataForm.station !== null) {
        this.dataArray += 'company=' + this.dataForm.station + '&'
      }
      if (this.dataForm.timeList !== '' && this.dataForm.timeList !== null) {
        if (this.dataForm.timeList[0] !== '' && this.dataForm.timeList[0] !== null) {
          this.dataArray += 'startBlackoutTime=' + this.dataForm.timeList[0] + '&'
        }
        if (this.dataForm.timeList[1] !== '' && this.dataForm.timeList[1] !== null) {
          this.dataArray += 'stopBlackoutTime=' + this.dataForm.timeList[1] + '&'
        }
      }
      if (this.dataForm.count !== '' && this.dataForm.count !== null) {
        this.dataArray += 'blackoutCount=' + this.dataForm.count + '&'
      }
      this.dataArray = this.dataArray.substring(0, this.dataArray.length - 1)
      console.log(this.dataArray)
      window.location.href = window.SITE_CONFIG['baseUrl'] + '/powercut/plan/exportTemporary?' + this.dataArray
    },
    clear () {
      this.dataForm.station = ''
      this.dataForm.startTime = ''
      this.dataForm.count = ''
      this.getDataList()
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/powercut/plan/temporaryList'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'company': this.dataForm.station || null,
          'startBlackoutTime': this.dataForm.timeList[1] || null,
          'stopBlackoutTime': this.dataForm.timeList[0] || null,
          'blackoutCount': this.dataForm.count || null
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          console.log(data)
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
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
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    }
  }
}
</script>
