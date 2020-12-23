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
          线路名称：
        </span>
        <el-input
          placeholder="请输入线路名称"
          v-model="dataForm.lineName"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <span>
          选择停电时间:
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
      <el-form-item>
        <span>
          台区经理：
        </span>
        <el-input
          placeholder="请输入台区经理"
          v-model="dataForm.manger"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <span>
          是否上报：
        </span>
        <br>
        <el-select v-model="dataForm.report" placeholder="请选择">
          <el-option
            v-for="item in dataForm.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item prop="count">
        <span>
          重复停电次数：
        </span>
        <el-input
          placeholder="请输入重复停电次数"
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
        header-align="center"
        align="center"
        label="序号"
        type="index"
        width="50">
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
        label="用户名称"
        width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">
            {{scope.row.userName}}
          </el-button>
        </template>
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
        label="起始时间"
        width="170">
      </el-table-column>
      <el-table-column
        prop="stopTime"
        header-align="center"
        align="center"
        label="终止时间"
        width="170">
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
      <el-table-column
        prop="isReporting"
        header-align="center"
        align="center"
        label="是否上报">
        <template slot-scope="scope">
          <span v-if="scope.row.isReporting === 0">否</span>
          <span v-if="scope.row.isReporting === 1">是</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="isMatching"
        header-align="center"
        align="center"
        label="是否匹配">
        <template slot-scope="scope">
          <span v-if="scope.row.isMatching === 0">否</span>
          <span v-if="scope.row.isMatching === 1">是</span>
        </template>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './repeatbook-add-or-update'
import {isIntegerNotMust} from '../../../utils'

export default {
  data () {
    return {
      dataForm: {
        station: '',
        lineName: '',
        timeList: '',
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
        manger: '',
        report: '',
        count: '',
        options: [{
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }]
      },
      dataRule: {
        count: [
          { validator: isIntegerNotMust, message: '只能输入正整数', trigger: 'blur' }
        ]
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
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
    // 导出重复停电台账
    exportData () {
      this.dataArray = ''
      if (this.dataForm.station !== '' && this.dataForm.station !== null) {
        this.dataArray += 'company=' + this.dataForm.station + '&'
      }
      if (this.dataForm.lineName !== '' && this.dataForm.lineName !== null) {
        this.dataArray += 'lineRoadName=' + this.dataForm.lineName + '&'
      }
      if (this.dataForm.timeList !== '' && this.dataForm.timeList !== null) {
        if (this.dataForm.timeList[0] !== '' && this.dataForm.timeList[0] !== null) {
          this.dataArray += 'startTime=' + this.dataForm.timeList[0] + '&'
        }
        if (this.dataForm.timeList[1] !== '' && this.dataForm.timeList[1] !== null) {
          this.dataArray += 'stopTime=' + this.dataForm.timeList[1] + '&'
        }
      }
      if (this.dataForm.manger !== '' && this.dataForm.manger !== null) {
        this.dataArray += 'manager=' + this.dataForm.manger + '&'
      }
      if (this.dataForm.report !== '' && this.dataForm.report !== null) {
        this.dataArray += 'isReporting=' + this.dataForm.report + '&'
      }
      if (this.dataForm.count !== '' && this.dataForm.count !== null) {
        this.dataArray += 'repeatCount=' + this.dataForm.count + '&'
      }
      this.dataArray = this.dataArray.substring(0, this.dataArray.length - 1)
      console.log(this.dataArray)
      window.location.href = window.SITE_CONFIG['baseUrl'] + '/powercut/repeatdetailed/exportRepeat?' + this.dataArray
    },
    clear () {
      this.dataForm.station = ''
      this.dataForm.lineName = ''
      this.dataForm.startTime = ''
      this.dataForm.manger = ''
      this.dataForm.report = ''
      this.dataForm.count = ''
      this.getDataList()
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/powercut/repeatdetailed/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'company': this.dataForm.station || null,
          'lineRoadName': this.dataForm.lineName || null,
          'startTime': this.dataForm.timeList[0] || null,
          'stopTime': this.dataForm.timeList[1] || null,
          'manager': this.dataForm.manger || null,
          'isReporting': this.dataForm.report || null,
          'repeatCount': this.dataForm.count || null
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
