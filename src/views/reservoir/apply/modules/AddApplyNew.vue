<template>
  <div>
    <div class="pageTitle">
      <a-row :gutter="24">
        <a-col :md="12" :sm="24">
          <h3>{{ addData.title }}</h3>
        </a-col>
        <a-col :md="12">
          <div class="scanInput">
            <!--<a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>-->
            <div class="icons-list pageTitle-Btn">
              <span class="titleBtn" @click="handleBack()">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>返回</span>
                  </template>
                  <i class="iconfont icon-back" />
                </a-tooltip>
              </span>
              <span class="titleBtn" @click="handleuidMore" v-if="proType === 'delivery'">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>批量添加</span>
                  </template>
                  <a-button :disabled="isBtn">
                    <i class="iconfont icon-udiMore"></i>
                  </a-button>
                </a-tooltip>
              </span>
              <span class="titleBtn" @click="handleNoAdd" v-if="!isProBack">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>无码添加</span>
                  </template>
                  <a-button :disabled="isBtn">
                    <i class="iconfont icon-plus"></i>
                  </a-button>
                </a-tooltip>
              </span>
              <span class="titleBtn" @click="handleSubmit()">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>保存</span>
                  </template>
                  <i class="iconfont icon-save"/>
                </a-tooltip>
              </span>
            </div>
            <div class="scanInfo">
              <a-popover title="开始扫码" trigger="click" :visible="scanStart" :overlayStyle="{ width:'330px' }" overlayClassName="scanOverview">
                <template slot="content">
                  <div class="scanCon">
                    <img :src="scanImgUrl" alt="">
                    <p>用扫码抢扫描产品SN码</p>
                  </div>
                </template>
                <a-input
                  placeholder="单击扫码添加"
                  :style="{ width:'260px',float:'right' }"
                  v-model="scanVal"
                  autocomplete="off"
                  @change="handleScan"
                  id="myInput"
                  @blur="handleRemoveScan"
                  @focus="handleFocus"
                  :disabled="isBtn"
                >
                  <i slot="prefix" class="iconfont icon-scan"></i>
                </a-input>
              </a-popover>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    <a-form layout="inline">
      <div class="basicBorder">
        <a-row :gutter="24">
          <a-col span="8">
            <label for class="basicTitle">经销商名称</label>
            <div class="basicInfo">
              <a-select
                style="max-width: 260px; width: 100%;"
                placeholder="选择经销商"
                @change="handleDist"
                v-model="proWrap.distCode"
              >
                <a-select-option
                  v-for="item in proWrap.distList"
                  :key="item.distCode"
                  :value="item.distCode"
                >{{ item.distName }}
                </a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">经销商代码</label>
            <div class="basicInfo">
              <a-input
                placeholder="经销商代码"
                :style="{ maxWidth:'260px',width:'100%' }"
                v-model="proWrap.distCode"
                :disabled="true"
              />
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">库位名称</label>
            <div class="basicInfo">
              <a-select
                style="max-width: 260px; width: 100%;"
                showSearch
                placeholder="选择库位"
                v-model="proWrap.whCode"
                optionFilterProp="children"
              >
                <a-select-option
                  v-for="item in proWrap.whList"
                  :key="item.whCode"
                  :value="item.whCode"
                >
                  {{ item.whName }}
                </a-select-option>
              </a-select>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <!--    无码新增-->
    <div v-if="isNoCode">
      <a-drawer
        title="无码添加"
        placement="right"
        @close="onSearchClose"
        :visible="isShowSearch"
        wrapClassName="searchWrap"
        width="680"
      >
        <add-no-code
          @hasNoSub="handleNoSubmit"
          :delivery="delivery"
          :deliveryData="deliveryData"
        >
        </add-no-code>
      </a-drawer>
    </div>
    <!--    是否为空-->
    <div class="wareWrap" :style="wareStyle">
      <scan-ware
        v-if="productList.length !== 0"
        :scanData.sync="productList"
        :type="delivery"
        @submit="handleEdit"
        @delete="handleRemove"
        :whQueram="whQueram"
      ></scan-ware>
      <scan-empty
        v-else
        @click="handleClick"
        :scanEmpty="proType"
      ></scan-empty>
    </div>
    <!--    批量导入-->
    <add-udi-more
      v-if="uidMore"
      :visible="uidMore"
      @udiSub="handleUdiSub"
      @udiCancle="handleUdiCancle"
    ></add-udi-more>
  </div>
</template>

<script>
import ScanEmpty from '../../Depot/modules/ScanEmpty'
import ScanWare from '../../Depot/modules/ScanWare'
import addUdiMore from '../../Depot/modules/addUdiMore'
import AddNoCode from '../../Depot/modules/AddNoCode'
import { scanOut, getDocumentWhList, getDocumentDistList, applySave } from '@/api/depot/wareHouse'
import scanImg from '@/assets/icons/scanImg.png'
import moment from 'moment'

export default {
  name: 'AddApplyNew',
  components: {
    ScanEmpty,
    ScanWare,
    addUdiMore,
    AddNoCode
  },
  props: ['type', 'addData'], // 判断是否为退货申请
  created () {
    this.getFirst()
  },
  data() {
    return {
      title: '污损置换新增',
      isEmpty: false,
      isNoCode: false,
      isShowSearch: false,
      isBtn: true,
      delivery: 'replace',
      deliveryData: {
        wareType: 'delivery'
      },
      wareStyle: { maxHeight: 'calc(100vh - 80px)' },
      productList: [],
      udiList: [],
      whQueram: [],
      proType: 'delivery',
      wholeShow: false,
      uidMore: false,
      scanStart: false,
      scanImgUrl: scanImg,
      scanVal: '',
      proWrap: {
        distList: [],
        distCode: undefined,
        whCode: undefined,
        whList: []
      },
      isProBack: false
    }
  },
  methods: {
    moment,
    handleBack () {
      this.$emit('back')
    },
    // 展开搜索
    onSearchClose () {
      this.isNoCode = false
      this.isShowSearch = false
    },
    getFirst () {
      this.getDocumentDistList()
    },
    getDocumentDistList () {
      getDocumentDistList().then(res => {
        if (res.message === 'SUCCESS') {
          this.proWrap.distList = res.data
          this.proWrap.distCode = res.data[0].distCode
          this.getWhlist()
        }
      })
    },
    getWhlist () {
      const params = {
        docType: '11',
        distCode: this.proWrap.distCode
      }
      getDocumentWhList(params).then(res => {
        if (res.message === 'SUCCESS') {
          if (this.type === 'proback') {
            this.proWrap.whList = res.data.whList.filter(item => item.whType === 1)
            this.proWrap.whFromList = res.data.whList.filter(item => item.whType === 1)
            this.whQueram = res.data.whList.filter(item => item.whType === 1)
            this.proWrap.whCode = res.data.whList.filter(item => item.whType === 1)[0].whCode
            this.proType = 'proBack'
            this.isProBack = true
          } else {
            this.proWrap.whList = res.data.whList.filter(item => item.whType === 4)
            this.proWrap.whFromList = res.data.whList.filter(item => item.whType === 4)
            this.whQueram = res.data.whList.filter(item => item.whType === 4)
            this.proWrap.whCode = res.data.whList.filter(item => item.whType === 4)[0].whCode
            this.isProBack = false
            this.proType = 'delivery'
          }
          this.isBtn = false
        }
      })
    },
    // 基础信息
    handleDist (val) {
      // console.info(val)
      this.proWrap.distCode = val
      const params = {
        distCode: val,
        docType: this.proWrap.busType
      }
      this.getWhList(params)
      this.getCusList(params)
      this.authorize = 'has'
      this.handleAuth('has')
    },
    // 扫码新增
    handleScan (e) {
      if (!this.isBtn) { // 判断页面加载是否完成
        window.addEventListener('keydown', this.scanWrapper, false)
      } else {
        this.$notification['error']({
          message: '提示',
          description: '页面数据加载中，请稍后！',
          duration: 2
        })
      }
      // this.handleFocus()
    },
    handleFocus () {
      const input = document.getElementById('myInput')
      input.focus()
      // this.scanStart = true
      window.addEventListener('keydown', this.scanWrapper, false)
    },
    handleRemoveScan () {
      this.scanStart = false
      window.removeEventListener('keydown', this.scanWrapper, false)
    },
    // 扫码
    scanWrapper (e) {
      // console.info('e.keyCode---',e.keyCode)
      this.scanStart = false
      if (e.keyCode === 13 || e.keyCode === 40) {
        e.preventDefault()
        if (this.scanVal !== '' && (this.scanVal.length === 35 || this.scanVal.length === 44)) {
          const params = {
            distCode: this.proWrap.distCode,
            udi: this.scanVal
          }
          this.getScanIn(params)
        } else if (this.scanVal !== '' && this.scanVal.length > 48) {
          this.$notification['error']({
            message: '提示',
            description: '呀，操作太快！',
            duration: 4
          })
        } else {
          this.$notification['error']({
            message: '提示',
            description: '码不对哦！',
            duration: 4
          })
        }
      }
    },
    handleNoSubmit (val) {
      // console.info('NoSubmit---',val)
      const params = {
        type: 'NoWare',
        preList: val
      }
      this.scanContent(params)
      this.isNoCode = false
    },
    // 无码添加
    handleNoAdd () {
      if (!this.isBtn) { // 判断页面是否初始化成功
        this.isNoCode = true
        this.isShowSearch = true
        this.deliveryData = {
          whList: this.proWrap.whList,
          distCode: this.proWrap.distCode,
          docType: '11',
          wareType: 'delivery'
        }
      } else {
        this.$notification['info']({
          message: '提示',
          description: '页面初始化加载中，请稍后！',
          duration: 2
        })
      }
    },
    // 编辑
    handleEdit (params) {
      // console.info('changeparams---', params)
      let proIndex = -1
      if (params.serialNumber) {
        proIndex = this.productList.findIndex(
          item => item.serialNumber === params.serialNumber
        )
      } else {
        proIndex = this.productList.findIndex(
          item => item.id === params.id
        )
      }
      // console.info('proIndex=====', proIndex)
      if (proIndex > -1) {
        this.productList[proIndex] = JSON.parse(JSON.stringify(params))
      }

      // console.info('this.productList---',this.productList)
    },
    // 删除
    handleRemove (params) {
      let proIndex = -1
      let udiIndex = -1
      if (params.id) {
        proIndex = this.productList.findIndex(item => item.id === params.id)
        if (params.serialNumber) {
          udiIndex = this.udiList.findIndex(
            item => item === params.serialNumber
          )
        } else {
          udiIndex = this.udiList.findIndex(item => item === params.id)
        }
      } else {
        proIndex = this.productList.findIndex(item => item.serialNumber === params.serialNumber)
        udiIndex = this.udiList.findIndex(item => item === params.serialNumber)
      }
      // console.info('udiIndex---',proIndex,udiIndex)
      if (proIndex > -1) {
        this.productList.splice(proIndex, 1)
      }
      if (udiIndex > -1) {
        this.udiList.splice(udiIndex, 1)
      }
    },
    // 初始化点击
    handleClick (val) {
      if (!this.isBtn) {
        switch (val.type) {
          case 'noUdi': // 无码新增
            this.isNoCode = true
            this.isShowSearch = true
            this.deliveryData = {
              whList: this.proWrap.whList,
              distCode: this.proWrap.distCode,
              docType: '11',
              wareType: 'delivery'
            }
            break
          case 'udi':
            this.uidMore = true
            break
          case 'scan':
            this.handleFocus()
            this.scanStart = true
            window.addEventListener('keydown', this.scanWrapper, false)
            break
          default:
            break
        }
      } else {
        this.$notification['info']({
          message: '提示',
          description: '页面初始化加载中，请稍后！',
          duration: 2
        })
      }
    },
    // 点击批量添加
    handleuidMore () {
      if (!this.isBtn) {
        this.uidMore = true
      } else {
        this.$notification['info']({
          message: '提示',
          description: '页面初始化加载中，请稍后！',
          duration: 2
        })
      }
    },
    handleUdiSub (val) {
      if (val.length > 0) {
        const index = val.findIndex(item => item && item.length > 48)
        if (index === -1) {
          const params = {
            distCode: this.proWrap.distCode,
            udiList: val
          }
          this.getScanIn(params)
          this.uidMore = false
        } else {
          this.$notification['error']({
            message: '提示',
            description: '呀，udi码超长啦！',
            duration: 4
          })
        }
      } else {
        this.$notification['error']({
          message: '提示',
          description: '请输入唯一码！',
          duration: 4
        })
      }
    },
    handleUdiCancle () {
      this.uidMore = false
    },
    getScanIn (val) {
      // console.info('this.proType===', this.proType)
      scanOut(val).then(res => {
        if (res.message === 'SUCCESS') {
          // console.info('res.data.whType===', res.data)
          this.scanVal = ''
          if (((res.data.whType === 4 && this.proType === 'delivery') || (res.data.whType === 1 && this.proType === 'proBack')) && res.data.distCode && res.data.distCode !== null) {
            const params = {
              type: 'scan',
              preList: res.data
            }
            this.scanContent(params)
          } else if (this.proType === 'delivery') {
            this.$notification['error']({
              message: '提示',
              description: '只能选自己的污损库的产品哦！',
              duration: 4
            })
          } else if (this.proType === 'proBack') {
            this.$notification['error']({
              message: '提示',
              description: '只能选自己的自有库的产品哦！',
              duration: 4
            })
          }
        } else {
          this.$notification['error']({
            message: '提示',
            description: '该码不存在，请重新扫码或确认是否缺码！',
            duration: 4
          })
        }
      })
    },
    // 出库提交
    scanContent (params) {
      // console.info('params----',params)
      if (params.type === 'NoWare') {
        params.ScanTime = moment(new Date())
        const noWareId = new Date().getTime()
        this.udiList.push(noWareId)
        this.productList.unshift({
          id: noWareId,
          ...params.preList
        })
      } else if (params !== '' && Array.isArray(this.udiList)) {
        const hasUid = this.udiList.findIndex(
          udi => udi === params.preList.serialNumber
        )
        console.info('hasUid', this.udiList, this.productList)
        if (hasUid < 0 && params.preList.serialNumber !== undefined) {
          params.ScanTime = new Date()
          this.udiList.push(params.preList.serialNumber)
          this.productList.unshift(params.preList)
        } else {
          this.$notification['error']({
            message: '错误',
            description: '该码已扫过，请勿重复扫码！',
            duration: 4
          })
        }
      }
    },
    // 提交
    handleSubmit () {
      // console.info('this.routeQuery-----', this.routeQuery)
      if (this.productList.length === 0) {
        this.$notification['error']({
          message: '提示',
          description: '还未添加任何产品！',
          duration: 4
        })
      } else if (this.isBtn) {
        this.$notification['error']({
          message: '提示',
          description: '页面数据加载中，请稍后！',
          duration: 2
        })
      } else {
        let isNoSerialNum
        let isNormal = true
        let isEPa = true
        // console.info(' this.productList', this.proWrap.busType, 'this.whType===', this.whType)
        this.productList.map(item => {
          // console.info('item---', item)
          if (item.productModel === 'EP-551A' && (!item.effectiveDateEnd || !item.registration) && item.degree !== '1000.0') {
            isEPa = false
          } else if (
            item.productModel !== 'EP-551A' &&
              (!item.effectiveDateBegin || !item.effectiveDateEnd || !item.registration) && item.degree !== '1000.0') {
            isNormal = false
          }
          if (this.delivery === 'delivery' && (item.serialNumber === '' || item.serialNumber === null) && !item.reason && item.whType !== '3') {
            if (
              item.productModel === 'EMERALDC' || item.productModel === '1MTEC30' ||
                item.productModel === 'HEALON'
            ) {
              isNoSerialNum = true
            } else {
              isNoSerialNum = false
            }
          } else {
            isNoSerialNum = true
          }
        })
        // console.info('====', this.type)
        const params = {
          distCode: this.proWrap.distCode,
          list: this.productList,
          applyType: this.type === 'proback' ? 1 : 2
        }
        // console.info('isNoSerial====', isNoSerial)
        if (isNoSerialNum) {
          if (!this.isSubmit) {
            this.isSubmit = true
            // console.info('提交了')
            applySave(params).then(res => {
              if (res.message === 'SUCCESS') {
                // this.$emit('back')
                this.$emit('back')
                this.isSubmit = false
                this.detail = {
                  isShowSubmit: false
                }
                this.udiList = []
                this.productList = []
              } else {
                this.$notification['error']({
                  message: '提示',
                  description: '出错了哦！',
                  duration: 4
                })
              }
            })
          } else {
            this.$notification['error']({
              message: '提示',
              description: '系统处理中！',
              duration: 2
            })
          }
        } else if (!isNoSerialNum) {
          this.$notification['error']({
            message: '提示',
            description: '无码产品新增理由不能为空，请编辑添加！',
            duration: 4
          })
        }
      }
    },
  }
}
</script>

<style scoped lang="less">
  .scanOverview {
    .ant-popover-inner {
      width: 100%;
    }
    .scanCon {
      text-align: center;
      padding: 24px 0;
      p {
        line-height: 32px;
        color: rgba(177, 177, 177, 1);
        font-size: 14px;
      }
    }
  }
</style>
