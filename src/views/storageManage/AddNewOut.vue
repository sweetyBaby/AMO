<template>
  <div class="pageTitle">
    <a-row :gutter="48">
      <a-col :md="16" :sm="24">
        <h3>新增出库</h3>
      </a-col>
      <a-col :md="8" :sm="24">
        <div class="icons-list pageTitle-Btn">
          <span class="titleBtn" @click="handleBack()">
            <a-tooltip placement="top">
              <template slot="title">
                <span>返回</span>
              </template>
              <i class="iconfont icon-back"></i>
            </a-tooltip>
          </span>
          <span class="titleBtn">
            <a-tooltip placement="top">
              <template slot="title">
                <span>保存</span>
              </template>
              <i class="iconfont icon-save"></i>
            </a-tooltip>
          </span>
          <span class="titleBtn">
            <a-tooltip placement="top">
              <template slot="title">
                <span>取消</span>
              </template>
              <i class="iconfont icon-cancle"></i>
            </a-tooltip>
          </span>
        </div>
      </a-col>
    </a-row>
    <a-form layout="inline">
      <div class="proNew-title">
        <i class="iconfont icon-infor" />
        <span>出库基本信息</span>
      </div>
      <div class="basicBorder">
        <a-row :gutter="24">
          <a-col span="8">
            <label for="" class="basicTitle">出库类型</label>
            <div class="basicInfo">
              <a-select
                style="max-width: 240px; width: 100%;"
                placeholder="选择出库类型"
                @change="handleChange"
              >
                <a-select-option v-for="item in outType" :key="item.id">{{ item.name }}</a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">出库日期</label>
            <div class="basicInfo">
              <a-date-picker @change="onOutChange" :style="{ maxWidth:'240px' }" />
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">销售订单号</label>
            <div class="basicInfo">
              <a-input placeholder="销售订单号" :style="{ maxWidth:'240px',width:'100%' }" >
              </a-input>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">客户名称</label>
            <div class="basicInfo">
              <span class="basicBase">无锡市第二人民医院</span>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">联系人</label>
            <div class="basicInfo">
              <span class="basicBase">张三</span>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">联系电话</label>
            <div class="basicInfo">
              <span class="basicBase">13537821234</span>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">交货地址</label>
            <div class="basicInfo">
              <span class="basicBase">江苏省梁溪区中山路xxx</span>
            </div>
          </a-col>
          <a-col span="8">
            <label for="" class="basicTitle">备注</label>
            <div class="basicInfo">
              <a-input placeholder="备注" :style="{ maxWidth:'240px',width:'100%' }" />
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="outTable pad-t-md">
        <a-row :gutter="48">
          <a-col :md="16" :sm="24">
            <div class="proNew-title">
              <i class="iconfont icon-pay" />
              <span>出库基本信息</span>
            </div>
          </a-col>
          <a-col :md="8" :sm="24">
            <!--<a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>-->
            <div class="icons-list pageTitle-Btn">
              <a-button type="primary" size="small" @click="$refs.createModal.add()">扫码添加</a-button>
              <a-button type="primary" size="small">选择添加</a-button>
            </div>
          </a-col>
        </a-row>
        <s-table
          ref="table"
          size="default"
          rowKey="key"
          :columns="columns"
          :data="loadData"
          :alert="options.alert"
          :rowSelection="options.rowSelection"
        >
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
          <span slot="action" slot-scope="text, record">
            <template>
              <div class="align-right">
                <a-button size="small" type="primary">单品明细</a-button>
                <a-button size="small" type="primary">删除</a-button>
                <a-dropdown v-if=" record.inStatus !== '1' ">
                  <a-menu slot="overlay" @click="handleMenuClick">
                    <a-menu-item key="1"><a-icon type="user" />编辑</a-menu-item>
                    <a-menu-item key="2"><a-icon type="user" />取消</a-menu-item>
                  </a-menu>
                  <a-button style="margin-left: 8px">
                    更多 <a-icon type="down" />
                  </a-button>
                </a-dropdown>
              </div>
            </template>
          </span>
        </s-table>
      </div>
    </a-form>
    <sweep-code ref="createModal" @ok="handleChooseOk" />
  </div>
</template>

<script>
import { STable, StatusBadage, TableTags } from '@/components'
import { storageOut } from '@/api/storage'
import SweepCode from './modules/SweepCode'
const distData = [
  {
    id: 'dist01',
    name: '强生'
  },
  {
    id: 'dist02',
    name: '强生1'
  }
]
const prolistData = [
  {
    id: 'proline01',
    name: '产品线1'
  },
  {
    id: 'proline02',
    name: '产品线2'
  },
  {
    id: 'proline03',
    name: '产品线3'
  },
  {
    id: 'proline04',
    name: '产品线4'
  }
]

const outType = [
  {
    id: 'type001',
    name: '内部领用'
  },
  {
    id: 'type002',
    name: '销售出库'
  },
  {
    id: 'type003',
    name: '采购退货'
  },
  {
    id: 'type004',
    name: '调拨出库'
  },
  {
    id: 'type005',
    name: '其他出库'
  }
]
const statusMap = {
  1: {
    status: 'success',
    text: '调拨出库'
  },
  2: {
    status: 'processing',
    text: '发货出库'
  },
  3: {
    status: 'error',
    text: '其他出库'
  },
}
const statusMap1 = {
  1: {
    status: 'success',
    text: '已出库'
  },
  2: {
    status: 'processing',
    text: '待出库'
  },
}

export default {
  name: 'AddNewPro',
  components: {
    SweepCode,
    STable,
    StatusBadage
  },
  data () {
    return {
      distData,
      prolistData,
      queryParam: {},
      lineTag: ['产品线1'],
      outType,
      statusMap: statusMap,
      statusMap1: statusMap1,
      columns: [
        {
          title: '产品代码',
          dataIndex: 'productCode'
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
        },
        {
          title: '生产厂商',
          dataIndex: 'manufactor',
        },
        {
          title: '出库数量',
          dataIndex: 'number',
          // customRender:(text)=>{
          //
          // }
        },
        {
          title: '单位',
          dataIndex: 'productModel'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        // console.log('loadData.parameter', this.queryParam)
        return storageOut(Object.assign(parameter, this.queryParam))
          .then(res => {
            return {
              data: [],
              'pageSize': 10,
              'pageNo': 0,
              'totalPage': 3,
              'totalCount': 37
            }
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false
    }
  },
  watch: {
    $route(to, from) {
      if (to.path === '/storageOut') {
        this.isAdd = false
      }
    }
  },
  methods: {
    handleChange (val) {
      console.info('val---', val)
    },
    handleBack () {
      this.$emit('handleNewPro', false)
    },
    handleLineSel (val) {
      // console.info('val---',val);
      let inputVal
      this.prolistData.map((tag) => {
        if (tag.id === val) {
          inputVal = tag.name
        }
      })
      let lineTag = this.lineTag
      if (inputVal && lineTag.indexOf(inputVal) === -1) {
        lineTag = [...lineTag, inputVal]
      }
      // console.log(lineTag)
      Object.assign(this, {
        lineTag
      })
    },
    handleClose (removedTag) {
      const tags = this.lineTag.filter(tag => tag !== removedTag)
      // console.log(tags);
      this.lineTag = tags
    },
    onOutChange (date, dateString) {
      console.log(date, dateString)
    },
    handleAddOut() {
      console.info('添加')
    },
    handleChooseOk (lists) {
      console.info('lists----', lists)
      this.roleList = lists
      this.loadData = parameter => {
        // console.log('loadData.parameter', this.queryParam)
        return storageOut(Object.assign(parameter, this.queryParam))
          .then(res => {
            return {
              data: lists.map((item) => {
                return {
                  number: 0,
                  ...item
                }
              }),
              'pageSize': 10,
              'pageNo': 0,
              'totalPage': (lists.length / 10),
              'totalCount': lists.length
            }
          })
      }
      this.$refs.table.refresh()
    },
  }
}
</script>
<style lang="less">
  //新增页面边框
    .proNew-title{
      color: rgba(84, 97, 130, 1);
      font-size: 16px;
      height: 36px;
      width: 100%;
      display: inline-block;
      .iconfont{
        color: rgba(66, 131, 255, 1);
        font-size: 26px;
      }
      span{
        float: left;
        line-height: 36px;
        font-size: 16px;
      }
    }
    .addInput{
      margin: 36px 0 0 0;
      .addInput-title{
        padding: 0 0 8px 0;
        font-size: 14px;
        span{
          font-weight: bold;;
          color: rgba(84, 97, 130, 1);
        }
        small{
          color: rgba(66, 131, 255, 1);
          float: right;
          &.addInput-tips{
            color: rgba(170, 174, 185, 1);
          }
        }
      }
    }
    .adInput-input{
      .ant-select-selection--single{
        height: 54px;
      }
      .ant-select-selection__rendered{
        line-height: 54px;
      }
      .ant-input{
        height: 54px;
      }
      .ant-input-affix-wrapper .ant-input-suffix{
        .icon-cancle{
          color: rgba(205, 223, 252, 1);
          font-size: 24px;
        }
      }
    }
    .addInput-tag{
      padding: 24px 0;
      .ant-tag{
        width:168px;
        height:36px;
        background:rgba(247,250,255,1);
        border:1px solid rgba(205,223,252,1);
        border-radius:4px;
        line-height: 36px;
        color: rgba(159, 172, 195, 1);
        font-size: 14px;
        padding: 0 12px;
        display: inline-block;
        margin: 0 8px 16px 0;
        .anticon{
          float: right;
          line-height: 36px;
          color: rgba(205, 223, 252, 1);
          font-size: 16px;
        }
        &:hover{
          background: rgba(229, 238, 255, 1);
          border-color: rgba(176, 204, 255, 1);
          color: rgba(66, 131, 255, 1);
          font-weight: bold;
          .anticon{
            color: rgba(66, 131, 255, 1);
            font-weight: bold;
          }
        }
      }
    }

  .basicBorder {
    border: 1px solid rgba(229, 240, 255, 1);
    overflow: hidden;
    > .ant-row{
      >div{
        display: flex;
        flex-wrap:  nowrap;
        height: 56px;
        border-bottom: 1px solid rgba(229, 240, 255, 1);
        padding: 0 !important;
        label.basicTitle{
          width: 30%;
          flex-grow: 1;
          background: rgba(247, 250, 255, 1);
          text-align: right;
          line-height: 56px;
          padding:0 12px;
          display:inline-block;
          color: rgba(84, 97, 130, 1);
        }
        .basicInfo{
          flex-grow: 1;
          width: 70%;
          border-left: 1px solid rgba(229, 240, 255, 1);
          border-right: 1px solid rgba(229, 240, 255, 1);
          display: inline-block;
          padding: 12px;
          color: rgba(47, 60, 93, 1);
          &:nth-child(3n){
            border-right: none;
          }
          .basicBase{
            line-height: 32px;
          }
        }
      }
    }
    .ant-input{
      background: rgba(247, 250, 255, 1);
      border:1px solid rgba(205, 223, 252, 1);
      border-radius:4px;
    }
  }
  .pad-t-md{
    padding: 40px 0 0 0;
  }
  .pageTitle-Btn{
    button{
      border: none;
      margin: 0 0 0 12px;
      background: rgba(244, 247, 252, 1);
      border-radius: 4px;
      color: rgba(139, 174, 222, 1);
      &:hover{
        background: rgba(17, 137, 249, 1);
        color: white;
      }
    }
  }
</style>
