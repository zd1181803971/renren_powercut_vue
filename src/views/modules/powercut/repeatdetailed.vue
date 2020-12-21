<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <span>在</span>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.days" placeholder="请输入天数"></el-input>
      </el-form-item>
      <el-form-item>
        <span>天内，停电</span>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.nexts" placeholder="请输入次数"></el-input>
      </el-form-item>
      <el-form-item>
        <span>次以上，记为重复停电</span>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataListByDay()">保存</el-button>
        <el-button @click="clear()">取消</el-button>
      </el-form-item>
      <br>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button @click="clear()">清空</el-button>
        <el-button v-if="isAuth('powercut:repeatdetailed:delete')" type="danger" @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除
        </el-button>
        <el-button @click="exportData()">导出</el-button>
      </el-form-item>
      <el-form-item>
        <el-upload
          style="display:inline-block"
          :limit="1"
          class="upload-demo"
          ref="upload"
          accept=".csv"
          :action="uploadUrl"
          :file-list="fileList"
          :auto-upload="false"
          :on-success="onSuccess"
          :on-error="onError"
          :show-file-list="true">
          <el-button slot="trigger" size="small" type="primary" plain>选取文件</el-button>
          <el-button type="primary" @click="handleSubmit()">导入</el-button>
        </el-upload>
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
        prop="id"
        header-align="center"
        align="center"
        label="id">
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
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">
            {{ scope.row.userName }}
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
      <el-table-column
        prop="correctiveAction"
        header-align="center"
        align="center"
        label="整改措施">
      </el-table-column>
      <el-table-column
        prop="isCorrectiveAction"
        header-align="center"
        align="center"
        label="是否整改完成">
        <template slot-scope="scope">
          <span v-if="!scope.row.isCorrectiveAction">否</span>
          <span v-if="scope.row.isCorrectiveAction">是</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="communicate"
        header-align="center"
        align="center"
        label="沟通回访">
      </el-table-column>
      <el-table-column
        prop="reason"
        header-align="center"
        align="center"
        label="停电原因">
      </el-table-column>
      <el-table-column
        prop="category"
        header-align="center"
        align="center"
        label="停电分类">
      </el-table-column>
      <el-table-column
        prop="isReporting"
        header-align="center"
        align="center"
        label="是否上报">
        <template slot-scope="scope">
          <span v-if="!scope.row.isReporting">否</span>
          <span v-if="scope.row.isReporting">是</span>
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
    <!-- 弹窗, 详细信息 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

  </div>
</template>

<script>
import AddOrUpdate from './repeatdetailed-add-or-update'

export default {
  data () {
    return {
      fileList: [],
      uploadUrl: '',
      dataForm: {
        file: '',
        days: 60,
        nexts: 3,
        startTime: '',
        endTime: new Date()
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
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
    onSuccess (res) {
      this.$alert('上传成功', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          console.log('上传成功')
        }
      })
    },
    onError (res) {
      this.$alert('创建失败', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          console.log('上传失败')
        }
      })
    },
    handleSubmit () {
      this.uploadUrl = window.SITE_CONFIG['baseUrl'] + '/powercut/repeatdetailed/importRepeatDetailed'  // 这里，读者换成实际项目中的上传接口
      this.$nextTick(() => {
        this.$refs.upload.submit()
      })
    },
    // 获取多少天之前的日期
    getDataListByDay () {
      var date1 = new Date()
      console.log(date1)
      var date2 = new Date(date1)
      date2.setDate(date1.getDate() - this.dataForm.days)
      // num是正数表示之后的时间，num负数表示之前的时间，0表示今天
      var time2 = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate()
      console.log(time2)

      this.dataForm.startTime = time2
    },
    // 导入全部数据
    importData () {
    },
    // 停电明细导出出出全部数据
    exportData () {
      this.dataArray = ''
      if (this.dataForm.startTime !== '' && this.dataForm.startTime !== null) {
        this.dataArray += 'startTime=' + this.dataForm.startTime + '&'
      }
      if (this.dataForm.endTime !== '' && this.dataForm.endTime !== null) {
        this.dataArray += 'stopTime=' + this.dataForm.endTime + '&'
      }
      if (this.dataForm.nexts !== '' && this.dataForm.nexts !== null) {
        this.dataArray += 'repeatCount=' + this.dataForm.nexts + '&'
      }
      this.dataArray = this.dataArray.substring(0, this.dataArray.length - 1)
      console.log(this.dataArray)
      window.location.href = window.SITE_CONFIG['baseUrl'] + '/powercut/repeatdetailed/exportRepeatDetailed?' + this.dataArray
    },
    clear () {
      this.dataForm.days = null
      this.dataForm.nexts = null
      this.dataForm.startTime = null
      this.dataForm.endTime = null
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
          'startTime': this.dataForm.startTime || null,
          'stopTime': this.dataForm.endTime || null,
          'repeatCount': this.dataForm.nexts || null
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
    // 详细信息
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
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
          url: this.$http.adornUrl('/powercut/repeatdetailed/delete'),
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
