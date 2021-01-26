<template>
  <div class="mod-config">
    <el-form :inline="true" :rules="dataRule" ref="dataForm" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <span>在</span>
      </el-form-item>
      <el-form-item prop="days">
        <el-input
          v-model="dataForm.days"
          placeholder="请输入天数"
          style="width: 110px">
        </el-input>
      </el-form-item>
      <el-form-item>
        <span>天内，停电</span>
      </el-form-item>
      <el-form-item prop="nexts">
        <el-input
           v-model="dataForm.nexts"
           placeholder="请输入次数"
           style="width: 110px">
        </el-input>
      </el-form-item>
      <el-form-item>
        <span>次以上，记为重复停电</span>
      </el-form-item>
      <el-form-item>
        <el-button @click="getRepeatruleUpdate()" type="info">保存</el-button>
        <el-button @click="getRepeatruleInfo()" type="warning">取消</el-button>
      </el-form-item>
      <hr>
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
        <el-button v-if="isAuth('powercut:repeatdetailed:delete')" type="danger" @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-upload
          style="display:inline-block"
          :limit="1"
          class="upload-demo"
          ref="upload"
          accept=".xls, .xlsx, .csv"
          :action="uploadUrl"
          :file-list="fileList"
          :auto-upload="false"
          :on-success="onSuccess"
          :on-error="onError"
          :show-file-list="true">
          <el-button id="test1" slot="trigger" size="small" type="primary" plain>选取文件</el-button>
          <el-button type="primary" @click="handleSubmit()">导入</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      fit
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="序号"
        type="index"
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
        label="重复停电次数"
        width="120">
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
      :page-sizes="[10, 20, 50, 100,200,500]"
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
import {isIntegerNotMust} from '../../../utils'
export default {
  data () {
    return {
      dataForm: {
        days: '',
        nexts: '',
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
        options: [{
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }],
        count: ''
      },
      fileList: [],
      uploadUrl: '',
      dataRule: {
        count: [
          { validator: isIntegerNotMust, message: '只能输入正整数', trigger: 'blur' }
        ],
        days: [
          { validator: isIntegerNotMust, message: '只能输入正整数', trigger: 'blur' }
        ],
        nexts: [
          { validator: isIntegerNotMust, message: '只能输入正整数', trigger: 'blur' }
        ]
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      dataArray: '',
      filename: ''
    }
  },
  components: {
    AddOrUpdate
  },
  activated () {
    this.getDataList()
    this.getRepeatruleInfo()
  },
  methods: {
    test () {
      document.getElementById('test1').click()
      this.uploadUrl = window.SITE_CONFIG['baseUrl'] + '/powercut/repeatdetailed/importRepeatDetailed?flag=1'
      this.$nextTick(() => {
        this.$refs.upload.submit()
      })
    },
    onSuccess (res, file) {
      this.$refs.upload.clearFiles()
      this.filename = file.name

      if (res.code === 500) {
        this.$confirm(res.msg, '出现错误', {
          confirmButtonText: '继续导入',
          cancelButtonText: '取消导入',
          type: 'warning'
        }).then(() => {
          this.test()
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '取消导入'
          })
        })
      } if (res.code === 0) {
        this.$alert('上传成功', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            console.log(res)
            console.log('上传成功')
          }
        })
      }
    },
    onError (res) {
      this.$alert('上传失败', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          console.log(res)
          console.log('上传失败')
        }
      })
    },
    // 文件上传
    handleSubmit () {
      this.uploadUrl = window.SITE_CONFIG['baseUrl'] + '/powercut/repeatdetailed/importRepeatDetailed?flag=0'
      this.$nextTick(() => {
        this.$refs.upload.submit()
      })
    },
    // 获取停电规则信息
    getRepeatruleInfo () {
      this.$http({
        url: this.$http.adornUrl('/powercut/repeatrule/info'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataForm.days = data.repeatrule.days
          this.dataForm.nexts = data.repeatrule.number
        }
      })
    },
    // 更新停电规则
    getRepeatruleUpdate () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/powercut/repeatrule/update'),
            method: 'post',
            data: this.$http.adornData({
              'days': this.dataForm.days,
              'number': this.dataForm.nexts
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              if (data && data.code === 0) {
                this.$message({
                  message: '重复停电规则维护成功',
                  type: 'success',
                  duration: 1500
                })
              } else {
                this.$message.error(data.msg)
              }
            }
          })
        }
      })
    },
    // 停电明细导出出出全部数据
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
      window.location.href = window.SITE_CONFIG['baseUrl'] + '/powercut/repeatdetailed/exportRepeatDetailed?' + this.dataArray
    },
    clear () {
      this.dataForm.station = ''
      this.dataForm.lineName = ''
      this.dataForm.timeList = ''
      this.dataForm.manger = ''
      this.dataForm.report = ''
      this.dataForm.count = ''
      this.getDataList()
    },
    // 获取数据列表
    getDataList () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
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
