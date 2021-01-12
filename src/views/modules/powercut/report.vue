<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <span>
          报告名称：
        </span>
        <el-input
          placeholder="请输入单位名称"
          v-model="dataForm.reportName"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <span>
          创建时间:
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
      <br>
      <el-form-item>
        <el-button @click="getDataList()" type="success">查询</el-button>
        <el-button @click="clear()" type="warning">清空</el-button>
        <el-button v-if="isAuth('powercut:report:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('powercut:report:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
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
        label="序号"
        type="index"
        header-align="center"
        align="center"
        width="50">
        <template slot-scope="scope">{{ (pageIndex - 1) * pageSize + scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column
        prop="reportName"
        header-align="center"
        align="center"
        label="报告名称">
      </el-table-column>
      <el-table-column
        prop="startTime"
        header-align="center"
        align="center"
        label="统计开始时间">
      </el-table-column>
      <el-table-column
        prop="stopTime"
        header-align="center"
        align="center"
        label="统计结束时间">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="报告创建时间">
      </el-table-column>
      <el-table-column
        prop="remarks"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="报告">>
        <template slot-scope="scope">
<!--          <el-button type="danger" size="small" @click="showHandle(scope.row.id)">预览</el-button>-->
          <el-button type="danger" size="small" @click="downLoad()">下载</el-button>
          <el-button type="danger" size="small" @click="updateHandle(scope.row.id)">修改</el-button>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        fixed="right"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        width="150"-->
<!--        label="操作">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="danger" size="small" @click="updateHandle(scope.row.id)">修改</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
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
    <update v-if="updateVisible" ref="update" @refreshDataList="getDataList"></update>
    <show v-if="showVisible" ref="show"></show>
  </div>
</template>

<script>
  import AddOrUpdate from './report-add-or-update'
  import update from './report-update'
  import show from './report-show'
  export default {
    data () {
      return {
        dataForm: {
          reportName: '',
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
        updateVisible: false,
        showVisible: false
      }
    },
    components: {
      AddOrUpdate,
      update,
      show
    },
    activated () {
      this.getDataList()
    },
    methods: {
      downLoad () {
        this.$message.error('未完成')
        // this.$http({
        //   url: this.$http.adornUrl('/powercut/report/list'),
        //   method: 'get',
        //   params: this.$http.adornParams({
        //     'page': this.pageIndex,
        //     'limit': this.pageSize,
        //     'reportName': this.dataForm.reportName || null,
        //     'startTime': this.dataForm.timeList[0] || null,
        //     'stopTime': this.dataForm.timeList[1] || null
        //   })
        // }).then(({data}) => {
        //   if (data && data.code === 0) {
        //     this.dataList = data.page.list
        //     this.totalPage = data.page.totalCount
        //   } else {
        //     this.dataList = []
        //     this.totalPage = 0
        //   }
        //   this.dataListLoading = false
        // })
      },
      clear () {
        this.dataForm.reportName = ''
        this.dataForm.timeList = ''
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/powercut/report/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'reportName': this.dataForm.reportName || null,
            'startTime': this.dataForm.timeList[0] || null,
            'stopTime': this.dataForm.timeList[1] || null
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 修改
      updateHandle (id) {
        this.updateVisible = true
        this.$nextTick(() => {
          this.$refs.update.init(id)
        })
      },
      // 预览
      showHandle (id) {
        this.showVisible = true
        this.$nextTick(() => {
          this.$refs.show.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/powercut/report/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
