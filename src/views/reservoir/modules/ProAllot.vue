<template>
  <a-card :bordered="false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="12">
          <h3>
            <span>{{ pageTitle }}</span>
          </h3>
        </a-col>
        <a-col :md="12">
          <div class="scanInput">
            <div class="icons-list pageTitle-Btn">
              <span class="titleBtn" @click="onMudleUp">
                <a-tooltip placement="top" v-model="detail.isShowTool">
                  <template slot="title">
                    <span>返回</span>
                  </template>
                  <i class="iconfont icon-back" />
                </a-tooltip>
              </span>
              <span class="titleBtn" @click="onSaveDrafts">
                <a-tooltip placement="top" v-model="detail.isShowDrafts">
                  <template slot="title">
                    <span>保存草稿箱</span>
                  </template>
                  <i class="iconfont icon-saveDrafts" />
                </a-tooltip>
              </span>
              <span class="titleBtn" @click="handleuidMore">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>批量添加</span>
                  </template>
                  <i class="iconfont icon-udiMore" />
                </a-tooltip>
              </span>
              <span class="titleBtn" @click="handlePreInAdd">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>在库产品新增</span>
                  </template>
                  <a-button :disabled="isBtn">
                    <i class="iconfont icon-proIn" />
                  </a-button>
                </a-tooltip>
              </span>
              <span class="titleBtn" @click="handleSubmit">
                <a-tooltip placement="top" v-model="detail.isShowSubmit">
                  <template slot="title">
                    <span>提交</span>
                  </template>
                  <a-button :disabled="isBtn">
                    <i class="iconfont icon-save" />
                  </a-button>
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
      <div class="basicBorder" v-if="isBasic">
        <a-row :gutter="24">
          <a-col span="8">
            <label for class="basicTitle">经销商名称</label>
            <div class="basicInfo">
              <a-select
                style="max-width: 240px; width: 100%;"
                placeholder="选择经销商"
                @change="handleDist"
                v-model="proWrap.distCode"
              >
                <a-select-option
                  v-for="item in proWrap.distList"
                  :key="item.distCode"
                  :value="item.distCode"
                >{{ item.distName }}</a-select-option>
              </a-select>
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">单据号码</label>
            <div class="basicInfo">
              <a-input
                placeholder="单据号码"
                :style="{ maxWidth:'240px',width:'100%' }"
                v-model="proWrap.docNo"
              ></a-input>
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">单据日期</label>
            <div class="basicInfo">
              <a-date-picker
                @change="onOutChange"
                :disabledDate="disabledDate"
                :value="proWrap.docData !== null ? moment(proWrap.docData,'YYYY-MM-DD') : null"
                :allowClear="false"
              />
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">目标库位名称</label>
            <div class="basicInfo">
              <a-select
                style="max-width: 240px; width: 100%;"
                placeholder="选择库位名称"
                @change="handleOpt"
                v-model="proWrap.whCode"
              >
                <a-select-option
                  v-for="item in whList"
                  :key="item.whCode"
                  :value="item.whCode"
                >{{ item.whName }}</a-select-option>
              </a-select>
            </div>
          </a-col>
        </a-row>
      </div>
      <div v-if="jsonErrorList && jsonErrorList.length > 0" @click="handleRemoveAll" class="removeAll"><i class="iconfont icon-allRead"></i><span>一键清除错误行</span></div>
      <div class="wareWrap" :style="wareStyle">
        <scan-ware
          v-if="productList.length !== 0"
          :scanData="productList"
          @submit="handleEdit"
          @delete="handleRemove"
          :type="proAllot"
        ></scan-ware>
        <scan-empty v-else @click="handleClick" :scanEmpty="proType" />
      </div>
      <add-from-storage
        v-if="isPreAdd"
        :fromData="fromData"
        @preSubmit="handlePreSubmit"
        @cancel="handlePreCancle"
      ></add-from-storage>

      <add-udi-more
        v-if="uidMore"
        :visible="uidMore"
        @udiSub="handleUdiSub"
        @udiCancle="handleUdiCancle"
      ></add-udi-more>
      <add-new-type v-if="isWhEmpty" :visible="isWhEmpty" :distCode="proWrap.distCode" @checkWh="handleCheckWh" @checkCancle="handleCancle" ></add-new-type>
    </a-form>
    <SelectLocation
      v-if="locationAll"
      :formData="locFormData"
      @selectWh="handleAddWh"
      @selectCancle="handleWhCancle"
    ></SelectLocation>
  </a-card>
</template>

<script>
import moment from 'moment'
import ScanWare from '../Depot/modules/ScanWare'
import AddUdiMore from '../Depot/modules/addUdiMore'
import { scanEvent } from '@/utils/scanEvent'
import { addWareData, scanIn, listByDocNo, submitProduct, draftsNew, draftsDetail, getDocumentWhList, draftsDelete, scanOut, getAutoJson, getDocumentDistList } from '@/api/depot/wareHouse'
import AddFromStorage from '../Depot/modules/AddFromStorage'
import ScanEmpty from '../Depot/modules/ScanEmpty'
import scanImg from '@/assets/icons/scanImg.png'
import { saveParamsFromStore, getParamsFromStore } from '@/utils/storage'
import AddNewType from './addNewType'
import SelectLocation from '../Depot/modules/SelectLocation'

export default {
  name: 'ProAllot',
  props: ['newData'],
  components: {
    AddFromStorage,
    ScanWare,
    moment,
    ScanEmpty,
    AddUdiMore,
    AddNewType,
    SelectLocation
  },
  created () {
    this.getFirstData()
  },
  mounted () {
    // console.info('getParams---',getParams)
    this.routeFrom = this.getParamsRed.parentCom
    this.routeQuery = {
      ...this.getParamsRed
    }
    this.typeCode = this.getParamsRed.docType
    if (this.getParamsRed.docType === '21') {
      this.emptyData.type = 'proAllot'
      this.emptyData.typeCode = '21'
    } else {
      this.emptyData.typeCode = '20'
    }
  },
  data () {
    return {
      queryParam: {},
      basicIcon: 'iconfont icon-arrow-up',
      isBasic: true,
      productList: [],
      whList: [],
      locationAll: false, // 选择库位
      locFormData: {
        visible: false,
        locationData: [],
        distCode: '',
        docType: ''
      },
      proWrap: {
        docNo: '',
        whCode: '',
        docData: moment(new Date()),
        docInfo: '',
        distCode: '',
        distList: []
      },
      detail: {
        isShowTool: false,
        isShowDrafts: false,
        isShowSubmit: false
      },
      scanVal: '',
      udiList: [],
      isShowSearch: false,
      isPreAdd: false,
      wareStyle: { maxHeight: 'calc(100vh - 160px)' },
      emptyData: {},
      isproInAdd: false,
      fromData: {},
      proAllot: 'proAllot',
      isSubmit: false,
      isBtn: true,
      uidMore: false,
      pageTitle: '',
      proType: '',
      typeCode: '',
      routeFrom: '',
      isUdiMore: false,
      jsonErrorList: [],
      scanImgUrl: scanImg, // 扫码枪图片
      scanStart: false, // 扫码提示
      errorL: 0, // 提示信息控制
      getParamsRed: {}, // 记住params
      isWhEmpty: false // 提交判断是否添加库位
    }
  },
  methods: {
    moment,
    // 基础信息
    handleOpt (val) {
      // console.info("val--val-", val);
      this.proWrap.whCode = val
    },
    onOutChange (e, date) {
      // console.info('e---',e,'date',date)
      if (e === null) {
        this.proWrap.docData = e
      } else {
        this.proWrap.docData = date
      }
    },
    disabledDate (current) {
      return current && current > moment().endOf('day')
    },
    handleDist (val) {
      // console.info(val)
      this.proWrap.distChange = val
      this.proWrap.distCode = val
      const params = {
        distCode: val,
        docType: this.typeCode
      }
      this.getWhList(params)
    },
    getWhList (params, whCode) {
      getDocumentWhList(params).then(res => {
        if (res.message === 'SUCCESS') {
          // console.info('getDocumentWhList----',res)
          if (whCode) {
            this.proWrap.whCode = whCode
          } else {
            this.proWrap.whCode = res.data.whList[0].whCode
          }
          this.whList = res.data.whList
          this.whFromList = res.data.whFromList
          this.isBtn = false
        }
      })
    },
    // 选择库位
    handleAddWh (val) {
      // console.info('this.locFormData.locationData====', this.locFormData.locationData)
      val.forEach(wh => {
        const proIndex = this.productList.findIndex(item => item.serialNumber === wh.serialNumber)
        this.productList[proIndex].whCode = wh.whCode
        this.productList[proIndex].whName = wh.whName
        this.productList[proIndex].whType = wh.whType
        const WhIndex = this.locFormData.locationData.findIndex(loc => loc.serialNumber === wh.serialNumber)
        // console.info('WhIndex====', WhIndex)
        if (WhIndex > -1) {
          this.locFormData.locationData.splice(WhIndex, 1)
        }
      })
      if (this.locFormData.locationData.length === 0) {
        this.handleSubmit()
      }
    },
    handleWhCancle () {
      this.locationAll = false
      this.locationAll = false
    },
    getDocumentDistList () {
      getDocumentDistList().then(res => {
        if (res.message === 'SUCCESS') {
          this.proWrap.distList = res.data
        }
      })
    },
    // 扫码新增
    handleScan (e) {
      this.handleFocus()
      window.addEventListener('keydown', this.scanWrapper, false)
    },
    handleRemoveScan () {
      this.scanStart = false
      window.removeEventListener('keydown', this.scanWrapper, false)
    },
    handleFocus () {
      const input = document.getElementById('myInput')
      input.focus()
      window.addEventListener('keydown', this.scanWrapper, false)
    },
    // 扫码
    scanWrapper (e) {
      if (e.keyCode === 13 || e.keyCode === 40) {
        e.preventDefault()
        if (this.scanVal !== '') {
          const params = {
            udi: this.scanVal,
            distCode: this.proWrap.distCode
          }
          this.getScanIn(params)
        }
      }
    },
    getScanIn (val) {
      // console.info( this.udiList , this.productList)
      scanOut(val).then(res => {
        if (res.message === 'SUCCESS') {
          // console.info('res.data',res.data)
          this.scanVal = ''
          if (res.data.whType === 1 || res.data.whType === 3 || res.data.whType === null) {
            if (!res.data.distCode) {
              res.data.whName = ''
              res.data.whCode = undefined
              res.data.force = true
            }
            const params = {
              type: 'scanOut',
              preList: res.data
            }
            this.scanContent(params)
          } else {
            this.$notification['error']({
              message: '提示',
              description: '产品状态冻结中！',
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
    // 点击批量添加
    handleuidMore () {
      this.uidMore = true
    },
    handleUdiSub (val) {
      // console.info('val',newVal)
      const _that = this
      if (val.length > 0) {
        val.map(item => {
          // console.info('item---',item)
          if (item !== '' && item.length > 48) {
            this.$notification['error']({
              message: '提示',
              description: '呀，udi码超长啦！',
              duration: 4
            })
          } else {
            const params = {
              distCode: this.proWrap.distCode,
              udi: item
            }
            _that.getScanIn(params)
            // scanOut(params).then(res => {
            //   if (res.message === "SUCCESS") {
            //     if ( res.data.whType === 1 || res.data.whType === 3 || res.data.whType === null ) {
            //       if(!res.data.distCode){
            //         res.data.whName = ''
            //       }
            //       const params = {
            //         type: "scanOut",
            //         preList: res.data
            //       }
            //       this.scanContent(params)
            //     } else {
            //       this.$notification["error"]({
            //         message: "提示",
            //         description: "产品状态冻结中！",
            //         duration: 4
            //       })
            //     }
            //   } else {
            //     this.$notification["error"]({
            //       message: "提示",
            //       description: "该码不存在，请重新扫码或确认是否缺码！",
            //       duration: 4
            //     })
            //   }
            // })
            this.uidMore = false
          }
        })
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

    // 在库产品新增
    handlePreInAdd () {
      if (!this.isBtn) {
        this.isPreAdd = true
        this.fromData = {
          title: '在库产品新增',
          type: 'fromProIn',
          visible: true,
          typeCode: this.typeCode,
          distCode: this.proWrap.distCode,
          whFromList: this.whFromList,
          docType: this.getParamsRed.docType
        }
      } else {
        this.$notification['info']({
          message: '提示',
          description: '页面初始化加载中，请稍后！',
          duration: 2
        })
      }
    },
    handlePreCancle () {
      this.isPreAdd = false
      this.fromData.visible = false
    },
    handlePreSubmit (val) {
      console.info('val----', val)
      if (val.preStoList.length > 0) {
        val.preStoList.map(item => {
          if (item.qty < 1) {
            item.qty = 1
          }
        })
        const params = {
          type: 'preWare',
          preList: val.preStoList
        }
        this.scanContent(params)
      } else {
        this.$notification['error']({
          message: '提示',
          description: '未选择任何数据！',
          duration: 4
        })
      }
      this.isPreAdd = false
      this.fromData.visible = false
    },
    // 展开搜索
    onSearchClose () {
      this.isNoCode = false
      this.isShowSearch = false
    },
    handleSubmit () {
      // console.info('this.productList---',this.productList)
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
        let isNormal = true
        let isEPa = true
        let isWhCode = true
        this.locFormData.locationData = []
        console.info('this.productList', this.productList)
        this.productList.map(item => {
          // console.info('item',item)
          if (item.whCode && (item.whCode !== undefined)) {
            if (item.degree !== '1000.0' && item.productModel === 'EP-551A' && (
              !item.effectiveDateEnd || !item.registration)) {
              isEPa = false
            } else if (
              item.degree !== '1000.0' && item.productModel !== 'EP-551A' && (
                !item.effectiveDateBegin ||
                !item.effectiveDateEnd ||
                !item.registration
              )
            ) {
              isNormal = false
            }
          } else {
            isWhCode = false
            // this.isWhEmpty = true
          }

          if (item.force && item.whName === '' && this.locFormData.locationData.findIndex(loc => (loc.serialNumber === item.serialNumber)) === -1) {
            this.locFormData.locationData.push(item)
          }
          delete item.createBy
          delete item.creatTime
          delete item.updateBy
          delete item.updateTime
          delete item.remark
        })
        // console.info('isWhCode---',isWhCode)
        if (!isEPa) {
          this.$notification['error']({
            message: '提示',
            description:
              '型号（EP-551A）产品失效日期、注册证号不能为空，请编辑添加！',
            duration: 4
          })
        } else if (!isNormal) {
          this.$notification['error']({
            message: '提示',
            description:
              '产品生产日期、失效日期、注册证号不能为空，请编辑添加！',
            duration: 4
          })
        }
        const params = {
          docNo: this.proWrap.docNo,
          docDate: this.proWrap.docData,
          whCode: this.proWrap.whCode,
          detailList: this.productList,
          docType: this.getParamsRed.docType,
          cusCode: this.proWrap.distCode,
          distCode: this.proWrap.distCode
        }

        // console.info(isEPa,isNormal,this.isWhEmpty)
        if (this.locFormData.locationData.length > 0) {
          this.locationAll = true
          this.locFormData = {
            ...this.locFormData,
            visible: true,
            distCode: this.proWrap.distCode,
            docType: this.getParamsRed.docType
          }
        }
        if (isEPa && isNormal && this.locFormData.locationData.length === 0) {
          if (!this.isSubmit) {
            this.isSubmit = true
            console.info(params)
            submitProduct(params).then(res => {
              if (res.message === 'SUCCESS') {
                // this.$emit('back')
                this.$router.push({ name: 'FileManagement' })
                this.isSubmit = false
                this.detail = {
                  isShowTool: false,
                  isShowDrafts: false,
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
        }
      }
      if (this.getParamsRed.parentCom === 'Drafts') {
        const params = {
          id: this.getParamsRed.docId
        }
        draftsDelete(params).then(res => {
          // console.info("delete----", res);
        })
      }
    },
    onMudleDown () {},
    onMudleUp () {
      let routeFrom, routeQuery
      if (this.routeFrom) {
        routeFrom = this.routeFrom
        routeQuery = this.routeQuery
      } else {
        routeFrom = this.getParamsRed.parentCom
        routeQuery = {
          ...this.getParamsRed
          // page: this.getParamsRed.page,
          // size: this.getParamsRed.size
        }
      }
      this.$router.push({
        name: routeFrom,
        params: routeQuery
      })

      this.detail = {
        isShowTool: false,
        isShowDrafts: false,
        isShowSubmit: false
      }
      this.udiList = []
      this.productList = []
    },
    // 初始化点击
    handleClick (val) {
      if (!this.isBtn) {
        switch (val.type) {
          case 'scan':
            this.handleFocus()
            this.scanStart = true
            window.addEventListener('keydown', this.scanWrapper, false)
            break
          case 'udi':
            this.uidMore = true
            break
          case 'preStorageIn':
            this.isPreAdd = true
            this.fromData = {
              title: '在库产品新增',
              type: 'fromProIn',
              visible: true,
              typeCode: this.typeCode,
              distCode: this.proWrap.distCode,
              docType: this.getParamsRed.docType,
              whFromList: this.whFromList
            }
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

    // 提交
    scanContent (params) {
      console.info('this.params----', params)
      console.info('this.productList----', this.productList)
      console.info('this.udiList----', this.udiList)
      let allreadyIn = 0
      if (params.type === 'preWare') {
        params.preList.forEach(item => {
          let hasUid = 0
          if (item.serialNumber) {
            hasUid = this.udiList.findIndex(udi => udi === item.serialNumber)
          } else {
            hasUid = this.udiList.findIndex(udi => udi === item.id)
          }
          if (hasUid === -1) {
            if (item.serialNumber) {
              this.udiList.push(item.serialNumber)
            } else {
              this.udiList.push(item.id)
            }
            this.productList.unshift(item)
          } else if (hasUid > -1) {
            allreadyIn++
            return false
          }
        })
        if (allreadyIn > 0) {
          this.$notification['error']({
            message: '错误',
            description: '已入库数据将不重新入库！',
            duration: 4
          })
        }
      } else if (params !== '' && Array.isArray(this.udiList)) {
        let hasUid = 0
        if (params.preList.serialNumber) {
          hasUid = this.udiList.findIndex(
            udi => udi === params.preList.serialNumber
          )
        } else {
          hasUid = this.udiList.findIndex(udi => udi === params.preList.id)
        }
        if (hasUid > -1) {
          this.$notification['error']({
            message: '错误',
            description: '该码已扫过，请勿重复扫码！',
            duration: 4
          })
        } else {
          if (params.preList.serialNumber) {
            this.udiList.push(params.preList.serialNumber)
          } else {
            this.udiList.push(params.preList.id)
          }
          this.productList.unshift(params.preList)
        }
      }

      // if (this.getParamsRed.parentCom === 'Drafts') {
      //   const params = {
      //     id: this.getParamsRed.docId
      //   }
      //   draftsDelete(params).then(res => {
      //     // console.info("delete----", res);
      //   })
      // }
      // console.info('this.productList--3333-', this.productList)
      this.$forceUpdate()
    },
    // 编辑
    handleEdit (params) {
      // console.info('params',params)
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
      // let newProduct = []
      // this.productList.map( item => {
      //   if( (params.serialNumber !== null && item.serialNumber  === params.serialNumber) || item.id === params.id){
      //     newProduct.push(params)
      //   } else {
      //     newProduct.push(item)
      //   }
      // })
      // this.productList = newProduct
      // console.info('newProduct====', newProduct)
      if (proIndex > -1) {
        this.productList[proIndex] = JSON.parse(JSON.stringify(params))
      }
      // console.info('newProduct====', this.productList)
      this.$forceUpdate()
    },
    // 删除
    handleRemove (params) {
      console.info('params----', params)
      let proIndex = -1
      let udiIndex = -1
      if (params.serialNumber) {
        udiIndex = this.udiList.findIndex(item => item === params.serialNumber)
        proIndex = this.productList.findIndex(
          item => item.serialNumber === params.serialNumber
        )
      } else {
        udiIndex = this.udiList.findIndex(item => item === params.id)
        proIndex = this.productList.findIndex(item => item.id === params.id)
      }

      if (proIndex > -1) {
        this.productList.splice(proIndex, 1)
      }
      if (udiIndex > -1) {
        this.udiList.splice(udiIndex, 1)
      }
    },
    // 一键删除
    handleRemoveAll () {
      // console.info('this.productList===',this.productList)
      this.udiList = []
      const newList = JSON.parse(JSON.stringify(this.productList))
      const trueProList = []
      newList.map(item => {
        if (item.errorMessage === 'false') {
          trueProList.push(item)
          this.udiList.push(item.serialNumber ? item.serialNumber : item.id)
        }
      })
      this.productList = trueProList
      this.jsonErrorList = []
      // console.info('trueProList---',trueProList)
    },
    // 清空数据
    getLoad () {
      this.proWrap = {
        docNo: '',
        whCode: undefined,
        docData: moment(new Date()),
        distCode: undefined
      }
      this.productList = []
    },
    // 新增初始化
    getFirstData () {
      let getParams
      if (this.$route.params.pageTitle) {
        getParams = this.$route.params
        saveParamsFromStore(getParams, 'PROALLOT')
        this.getParamsRed = getParams
      } else {
        getParams = getParamsFromStore('PROALLOT')
        this.getParamsRed = getParamsFromStore('PROALLOT')
      }
      this.proWrap = {
        ...this.proWrap,
        docNo: '',
        cusCode: undefined,
        docData: null,
        remark: ''
      }
      this.productList = []
      this.udiList = []
      // console.info("this.newData----", this.$route.params)
      this.pageTitle = getParams.pageTitle
      this.proType = getParams.proType
      this.jsonErrorList = []
      // if(getParams.typeCode === '20'){
      //   this.isUdiMore = true
      // }
      if (getParams.parentCom === 'Drafts') {
        this.getLoad()
        const params = {
          id: getParams.docId
        }
        draftsDetail(params).then(res => {
          // console.info("res", res);
          if (res.message === 'SUCCESS') {
            this.whList = res.data.whList
            this.proWrap = {
              ...this.proWrap,
              docNo: res.data.document.docNo,
              whCode: res.data.document.whCode,
              docData: res.data.document.docDate ? moment(res.data.document.docDate).format('YYYY-MM-DD') : null,
              distList: res.data.distList,
              distCode: res.data.document.distCode
            }
            this.productList = res.data.document.detailList
            this.jsonErrorList = res.data.document.jsonErrorList ? res.data.document.jsonErrorList : []
          }
          this.proWrap.busType = getParams.docType
          res.data.document.detailList.map(item => {
            this.udiList.push(item.serialNumber ? item.serialNumber : item.id)
          })
          const params = {
            distCode: res.data.document.distCode,
            docType: getParams.docType
          }
          this.getWhList(params, res.data.document.whCode)
          // this.whFromList = res.data.whFromList
        })
      } else if (getParams.parentCom === 'FileManagement') {
        this.getLoad()
        const params = {
          id: getParams.fileIdDoc
        }
        getAutoJson(params).then(res => {
          if (res.message === 'SUCCESS') {
            const jsonAuto = JSON.parse(res.data.fileJson)
            this.jsonErrorList = res.data.errorIndexList
            // console.info("jsonAuto.detailList---",jsonAuto, res.data.errorIndexList)
            jsonAuto.detailList.map((file, index) => {
              if (this.jsonErrorList && this.jsonErrorList.indexOf((index + 1).toString()) !== -1) {
                file.errorMessage = 'true'
              } else {
                file.errorMessage = 'false'
              }
            })
            this.proWrap = {
              ...this.proWrap,
              docNo: jsonAuto.docNo,
              whCode: jsonAuto.whCode,
              docData: jsonAuto.docDate ? moment(jsonAuto.docDate).format('YYYY-MM-DD') : null,
              distList: jsonAuto.distList,
              distCode: jsonAuto.distCode,
              busType: jsonAuto.docType
            }
            this.productList = jsonAuto.detailList
            jsonAuto.detailList.map(item => {
              this.udiList.push(item.serialNumber ? item.serialNumber : item.id)
            })
            const params = {
              distCode: jsonAuto.distCode,
              docType: jsonAuto.docType
            }
            this.getWhList(params, jsonAuto.whCode)
            this.getDocumentDistList()
          }
        })
      } else {
        const params = {
          distCode: this.$store.state.user.info.distCode,
          docType: getParams.docType
        }
        this.proWrap.docData = new Date()
        addWareData(params).then(res => {
          if (res.message === 'SUCCESS') {
            this.whList = res.data.whList
            this.proWrap.docNo = res.data.docNo
            this.proWrap.whCode = res.data.whList[0].whCode
            this.proWrap.distList = res.data.distList
            this.proWrap.distCode = res.data.distList[0].distCode
            this.whFromList = res.data.whFromList
            this.isBtn = false
          }
        })
        this.getWhList(params)
      }
    },
    // 保存草稿箱
    onSaveDrafts () {
      const params = {
        docNo: this.proWrap.docNo,
        docDate: this.proWrap.docData,
        docType: this.getParamsRed.docType,
        whCode: this.proWrap.whCode,
        detailList: this.productList,
        distCode: this.proWrap.distCode,
        jsonErrorList: this.jsonErrorList
      }
      draftsNew(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.$notification['success']({
            message: '提示',
            description: '保存成功！',
            duration: 4
          })
          // this.$emit("back");
          this.$router.push({
            name: 'Drafts'
          })
          this.detail = {
            isShowTool: false,
            isShowDrafts: false,
            isShowSubmit: false
          }
        } else {
          this.$notification['error']({
            message: '提示',
            description: '出错了哦！',
            duration: 4
          })
        }
      })
      if (this.getParamsRed.parentCom === 'Drafts') {
        const params = {
          id: this.getParamsRed.docId
        }
        draftsDelete(params).then(res => {
          // console.info("delete----", res);
        })
      }
    },
    // 确认提交库位选择
    handleCheckWh (val) {
      // console.info('val====',val)
      this.productList.map(item => {
        if (item.whCode === null) {
          item.whCode = val.whCode
          item.whName = val.whName
        }
      })
      this.isWhEmpty = false
      this.handleSubmit()
    },
    // 取消库位选择
    handleCancle () {
      // console.info('====')
      this.isWhEmpty = false
    }
  },
  watch: {
    $route (to, from) {
      if (to.name.indexOf('_Detail') !== -1 || to.name.indexOf('_Edit') !== -1) {
        // console.info('to--',to)
        const getParams = to.params
        this.routeFrom = getParams.parentCom
        this.pageTitle = getParams.pageTitle
        this.routeQuery = {
          ...getParams
        }
        this.getFirstData()
      }
    }
  },
  destroyed () {
    window.removeEventListener('keydown', this.scanWrapper, false)
  }
}
</script>

<style lang="less">
  body{
    position: relative;
  }
.scanInput {
  .ant-input {
    float: right;
  }
}
.pageTitle {
  h3 {
    & > span {
      float: left;
    }
  }
  .showBasic {
    color: rgba(147, 147, 147, 1);
    display: inline-block;
    line-height: 22px;
    span {
      float: left;
      font-size: 12px;
      padding: 4px 12px 0 40px;
    }
    &:hover {
      span {
        color: rgba(62, 77, 168, 1);
      }
    }
    .iconfont {
      font-size: 12px;
      float: left;
      padding: 4px 0 0 0;
    }
  }
}

/*详情基本信息*/
.basicBorder {
  border: 1px solid rgba(233, 233, 233, 1);
  overflow: hidden;
  background: rgba(251, 251, 251, 1);
  > .ant-row {
    > div {
      display: flex;
      flex-wrap: nowrap;
      height: 56px;
      border-bottom: 1px solid rgba(233, 233, 233, 1);
      padding: 0 !important;
      label.basicTitle {
        width: 30%;
        flex-grow: 1;
        background: rgba(251, 251, 251, 1);
        text-align: right;
        line-height: 56px;
        padding: 0 12px;
        display: inline-block;
        color: rgba(52, 53, 62, 1);
      }
      .basicInfo {
        flex-grow: 1;
        width: 70%;
        border-left: 1px solid rgba(233, 233, 233, 1);
        border-right: 1px solid rgba(233, 233, 233, 1);
        display: inline-block;
        padding: 12px;
        color: rgba(52, 53, 62, 1);
        &:nth-child(3n) {
          border-right: none;
        }
        .basicBase {
          line-height: 32px;
        }
      }
    }
  }
  .ant-input,
  .ant-select-selection {
    background: white;
    border: 1px solid rgba(233, 233, 233, 1);
    border-radius: 4px;
  }
}
.scanInfo {
  .ant-input-affix-wrapper {
    border-radius: 16px;
    .ant-input:not(:first-child) {
      background: rgba(251, 251, 251, 1);
      border-radius: 16px;
    }
    &:hover {
      color: rgba(62, 77, 168, 1);
      border-color: rgba(62, 77, 168, 1);
      .ant-input-prefix {
        color: rgba(62, 77, 168, 1);
      }
    }
  }
}
.wholeWrap {
  width: 360px;
  .ant-popover-inner {
    width: 100%;
    .ant-popover-inner-content {
      padding: 24px;
      .ant-input-affix-wrapper {
        .ant-input {
          height: 40px;
        }
        .ant-input-search-button {
          border: none;
          border-left: 1px solid #e3e3e7;
        }
      }
    }
  }
}
  //一键清除
  .removeAll{
    position: fixed;
    right: 0;
    bottom: 32px;
    background: rgba(62, 77, 168, 1);
    height: 32px;
    line-height: 32px;
    border-radius:16px 0px 0px 16px;
    z-index: 9999;
    color: white;
    padding: 0 0 0 10px;
    font-size: 14px;
    cursor: pointer;
    .iconfont{
      font-size: 28px;
      float: left;
      margin: 0 6px 0 0;
    }
    span{
      display: none;
      padding: 0 10px 0 0;
    }
    &:hover{
      span{
        display: inline-block;
      }
    }
  }
.wareWrap {
  width: 100%;
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  overflow-x: hidden;
}
  .scanOverview{
    .ant-popover-inner{
      width: 100%;
    }
    .scanCon{
      text-align: center;
      padding: 24px 0;
      p{
        line-height: 32px;
        color: rgba(177, 177, 177, 1);
        font-size: 14px;
      }
    }
  }

</style>
