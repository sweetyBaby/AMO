<template>
  <a-modal
    title="选择库位"
    :width="900"
    :visible="formData.visible"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
    :maskClosable="false"
    wrapClassName="locWrap"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-spin :spinning="confirmLoading" class="modal-info">
      <a-form layout="inline" class="preSearch">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-select
              style="max-width: 240px; width: 100%;"
              placeholder="全部库位"
              v-model="queryParam.whCode"
              @change="handleChange"
            >
              <a-select-option
                v-for="item in whList"
                :key="item.whCode"
                :value="item.whCode"
              >
                <a-tooltip placement="topLeft">
                  <template slot="title">
                    <span>{{ item.whName }}</span>
                  </template>
                  {{ item.whName }}
                </a-tooltip>
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="12">
            <span class="table-page-search-submitButtons" :style="{float: 'right'} ">
              <a-button type="primary" @click="handleSeWh" size="small">确定添加此库位</a-button>
            </span>
            <span v-if="errorTip" class="errorTip"> 库位或数据不能为空！</span>
          </a-col>
        </a-row>
      </a-form>
      <a-table
        ref="table"
        size="default"
        rowKey="serialNumber"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          onSelect: handleSelect
        }"
        :columns="columns"
        :dataSource="storeList"
        :pagination="pagination"
        @change="handleTableChange"
        :loading="loading"
        :customRow="handleCheck"
      >
        <template slot="name" slot-scope="name">
          <a-tooltip placement="top" :title="name">
            <span class="serialWrap">{{ name }}</span>
          </a-tooltip>
        </template>
      </a-table>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { STable } from '@/components'
import { getDocumentWhList, findJsList } from '@/api/depot/wareHouse'
export default {
  name: 'SelectLocation',
  props: ['formData'],
  components: {
    STable,
    moment
  },
  created () {
    this.FirstLogin()
  },
  data () {
    // console.info('formData====', this.formData)
    return {
      confirmLoading: false,
      queryParam: {
        'page': 1,
        'size': 10
      },
      loading: false,
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: total => `共有 ${total} 条数据`
      },
      columns: [{
        title: '产品SN',
        dataIndex: 'serialNumber',
        align: 'left',
        scopedSlots: {
          customRender: 'name'
        },
        width: 120
      }, {
        title: '产品型号',
        dataIndex: 'productModel',
        align: 'left',
        scopedSlots: {
          customRender: 'name'
        },
        width: 120
      }, {
        title: '产品名称',
        dataIndex: 'productNameCn',
        align: 'left',
        scopedSlots: {
          customRender: 'name'
        },
        width: 120
      }, {
        title: '度数',
        dataIndex: 'degree',
        align: 'left',
        width: 80,
        customRender: (text) => {
          return text === '1000.0' ? '未知度数' : text
        }
      }, {
        title: '数量/单位',
        dataIndex: 'qty',
        align: 'left',
        width: 100,
        customRender: (text, record) => {
          return text + '/' + record.uom
        }
      }],
      storeList: [],
      selectedRowKeys: [],
      selectedRows: [],
      whList: [],
      errorTip: false,
      styleTop: {
        scrollTop: 0
      },
      changeVal: [] // 已选数据数组
    }
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      // console.info(selectedRowKeys,selectedRows);
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleSelect (record, selected, selectedRows) {
      // console.info('selectedRows-----',selectedRows)
    },
    handleConsign (val) {
      // console.info('val---',val)
    },
    handleChange (val) {
      // console.info('val====', this.whList)
      if (val) {
        this.errorTip = false
      }
      this.whList.map(item => {
        if (item.whCode === val) {
          this.queryParam.whCode = val
          this.queryParam.whName = item.whName
          this.queryParam.whType = item.whType
        }
      })
    },
    handleCheck (record, index) {
      return {
        on: {
          click: () => {
            // console.info('this.selectedRowKeys----',this.selectedRowKeys,this.selectedRows);
            const checkIndex = this.selectedRowKeys.indexOf(record.serialNumber)
            if (checkIndex === -1) {
              this.selectedRowKeys.push(record.serialNumber)
              this.selectedRows.push(record)
            } else {
              this.selectedRowKeys.splice(checkIndex, 1)
              this.selectedRows.splice(checkIndex, 1)
            }
          }
        }
      }
    },
    handleSeWh () {
      if (this.queryParam.whCode && this.selectedRows.length > 0) {
        // console.info('this.selectedRows====', this.selectedRows)
        this.selectedRows.map(item => {
          this.changeVal.push({
            serialNumber: item.serialNumber,
            whCode: this.queryParam.whCode,
            whName: this.queryParam.whName,
            whType: this.queryParam.whType.toString()
          })
          const checkIndex = this.storeList.findIndex(wh => wh.serialNumber === item.serialNumber)
          // console.info('checkIndex====', checkIndex)
          this.storeList.splice(checkIndex, 1)
        })
        // console.info('this.storeList===', this.storeList)
        if (this.storeList.length === 0) {
          this.$emit('selectCancle', false)
        }
        this.$emit('selectWh', this.changeVal)
        this.selectedRows = []
        this.selectedRowKeys = []
        this.changeVal = []
        this.queryParam.whCode = undefined
      } else {
        this.errorTip = true
      }
    },
    handleSubmit () {
      this.selectedRows.map(item => {
        this.changeVal.push({
          serialNumber: item.serialNumber,
          whCode: this.queryParam.whCode,
          whName: this.queryParam.whName,
          whType: this.queryParam.whType.toString()
        })
      })
      // console.info('params---',params)
      this.$emit('preSubmit', this.changeVal)
    },
    handleCancel () {
      this.$emit('selectCancle', false)
    },
    // 分页
    handleTableChange (pagination) {
      this.queryParam = {
        ...this.queryParam,
        page: pagination.current,
        size: pagination.pageSize
      }
      this.pagination = {
        ...this.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize
      }
      // console.info('this.queryParam====', this.queryParam)
      const whAllList = JSON.parse(JSON.stringify(this.formData))
      this.storeList = whAllList.locationData
    },
    FirstLogin () {
      const whAllList = JSON.parse(JSON.stringify(this.formData))
      // console.info('whAllList====', whAllList)
      this.storeList = whAllList.locationData
      // console.info('this.formData===', this.formData)
      if (this.formData.docType === '20' || this.formData.docType === '21') {
        const params = {
          distCode: whAllList.distCode
        }
        findJsList(params).then(res => {
          this.whList = res.data.map(item => {
            return {
              ...item,
              whType: 3
            }
          })
        })
      } else {
        const params = {
          distCode: whAllList.distCode,
          docType: whAllList.docType
        }
        getDocumentWhList(params).then(res => {
          if (whAllList.wareType) {
            this.whList = res.data.whList.filter(list => (list.whType === 1 || list.whType === 3))
          } else {
            this.whList = res.data.whList
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .ant-form .ant-btn{
    height: 32px;
    line-height: 32px;
  }
  .serialWrap{
    max-width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }
  span.serialWrap{
    float:left;
  }
  .errorTip{
    color: red;
    float: right;
    padding: 0 8px 0 0;
    line-height: 32px;
  }

</style>
