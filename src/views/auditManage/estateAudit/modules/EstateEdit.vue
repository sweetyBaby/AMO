<template>
  <a-form layout="inline" :form="form">
    <div class="invoiceTableManual">
      <a-row :gutter="24" v-if="isAuditAdd">
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>发票类型
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-select
                :style="{ maxWidth:'255px',width:'100%' }"
                placeholder="请选择发票类型"
                v-model="titleData.inType"
                @change="invoiceTypeChange"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                :disabled="titleData.verifyStatus === '03' || (titleData.verifyStatus === '02' && (titleData.verifyErrCode === '2000' || titleData.verifyErrCode === '3000'))">
                <a-select-option v-for="(item,key) in invoiceList" :key="key" :value="item.code">{{ item.name }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>发票代码
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-input placeholder="请输入发票代码" :style="{ maxWidth:'255px',width:'100%' }" v-model="titleData.inCode" :disabled="titleData.verifyStatus === '03' || (titleData.verifyStatus === '02' && (titleData.verifyErrCode === '2000' || titleData.verifyErrCode === '3000'))" />
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>发票号码
            </a-col>
            <a-col :span="18" class="rightcell borderRadiusRight">
              <a-input placeholder="请输入发票号码" :style="{ maxWidth:'255px',width:'100%' }" v-model="titleData.inNo" :disabled="titleData.verifyStatus === '03' || (titleData.verifyStatus === '02' && (titleData.verifyErrCode === '2000' || titleData.verifyErrCode === '3000'))" />
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>开票日期
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-date-picker
                v-model="timeSelect"
                :style="{ maxWidth:'255px',width:'100%' }"
                :format="dateFormat"
                :disabledDate="disabledDate"
                @change="handleDateChange"
                :disabled="titleData.verifyStatus === '03' || (titleData.verifyStatus === '02' && (titleData.verifyErrCode === '2000' || titleData.verifyErrCode === '3000'))"></a-date-picker>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8" v-if="!isDistributor">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill" title="经销商">*</span>经销商
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-select style="width: 100%; max-width: 255px" placeholder="请选择经销商" v-model="titleData.distCode" @change="(value,option)=>{sellerChange(value,option)}">
                <a-select-option v-for="seller in sellerData" :key="seller.code" :value="seller.code" :type="seller.type">{{ seller.name }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>配送商
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-input-group compact :style="{margin:'12px 0'}">
                <a-select style="width:90px" placeholder="已备案" v-model="titleData.authDist" @change="handleDistAuth">
                  <a-select-option value="has">已备案</a-select-option>
                  <a-select-option value="hasNo">未备案</a-select-option>
                  <a-select-option value="unKnownDistribution">手动填写</a-select-option>
                </a-select>
                <a-select
                  style="width: 165px;"
                  showSearch
                  placeholder="请选择配送商"
                  optionFilterProp="children"
                  @change="(value, option)=>{handleChangeAuthDist(value, option)}"
                  v-model="titleData.authDistCode"
                  v-show="titleData.authDist === 'has'">
                  <a-select-option v-for="cusItem in distributorList" :key="cusItem.code" :value="cusItem.code" :title="cusItem.name">{{ cusItem.name }}</a-select-option>
                </a-select>
                <a-input
                  placeholder="请选择配送商"
                  @click="selectUnauthDist"
                  style="width: 100%;max-width:165px;"
                  v-model="titleData.authDistName"
                  v-show="titleData.authDist === 'hasNo'"
                  readonly />
                <a-input v-show="titleData.authDist === 'unKnownDistribution'" placeholder="请输入配送商" :style="{ maxWidth:'165px',width:'100%' }" v-model="titleData.distribution" />
              </a-input-group>

            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>购货方
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-input-group compact :style="{margin:'12px 0'}">
                <a-select style="width:75px" placeholder="已授权" v-model="titleData.authorize" @change="handleAuth">
                  <a-select-option value="has">已授权</a-select-option>
                  <a-select-option value="hasNo">未授权</a-select-option>
                </a-select>
                <a-select
                  style="width: 180px;"
                  showSearch
                  placeholder="请选择购货方"
                  optionFilterProp="children"
                  @change="handleChangeCus"
                  v-model="titleData.cusCode"
                  v-show="titleData.authorize !== 'hasNo'">
                  <a-select-option v-for="cusItem in cusList" :key="cusItem.code" :value="cusItem.code" :title="cusItem.name">{{ cusItem.name }}</a-select-option>
                </a-select>
                <a-input
                  placeholder="请选择购货方"
                  @click="handleSelectCus"
                  style="width: 100%;max-width:180px;"
                  v-model="titleData.cusName"
                  v-show="titleData.authorize === 'hasNo'"
                  readonly />
              </a-input-group>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>不含税金额</span>
                </template>
                <span class="mustFill">*</span>不含税金额
              </a-tooltip>
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-input placeholder="请输入不含税金额" :style="{ maxWidth:'255px',width:'100%' }" v-model="titleData.noneTaxTotal" @keydown="handleTaxChange" :disabled="titleData.verifyStatus === '03' || (titleData.verifyStatus === '02' && (titleData.verifyErrCode === '2000' || titleData.verifyErrCode === '3000'))">
                <a-icon slot="prefix" type="minus" v-if="titleData.negative" style="font-size:10px;" />
              </a-input>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8" v-show="titleData.verifyCodeShow">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>不含税金额</span>
                </template>
                <span class="mustFill">*</span>校验码后六位
              </a-tooltip>
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-input placeholder="请输入校验码后六位" :style="{ maxWidth:'255px',width:'100%' }" v-model="verifyCode" @keydown="handleCode" :disabled="titleData.verifyStatus === '03' || (titleData.verifyStatus === '02' && (titleData.verifyErrCode === '2000' || titleData.verifyErrCode === '3000'))"></a-input>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>销量月份
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-select style="width: 100%; max-width: 255px" placeholder="选择销量月份" v-model="titleData.date" @change="(value,option)=>{saleMonthChange(value,option,titleData)}">
                <a-select-option v-for="months in monthList" :key="months.code" :value="months.name" :configType="months.configType">{{ months.name }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">添加图片</a-col>
            <a-col :span="18" class="rightcell">
              <span class="imgMsg" @click="viewImgShow" v-if="titleData.fileUrl && titleData.fileUrl !== null">查看图片</span>
              <a-upload
                action="/amo/upload/file/add"
                @change="uploadChangeTitle"
                :showUploadList="false"
                :headers="headerUpload"
                :beforeUpload="beforeUpload"
                :data="uploadData">
                <span v-if="titleData.fileUrl && titleData.fileUrl !== null">重新上传</span>
                <span v-if="!titleData.fileUrl || titleData.fileUrl === null ">上传一张图片</span>
              </a-upload>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell" :class="titleData.verifyCodeShow ? 'leftcell borderRadiusLeft' : 'leftcell'">
              <span class="mustFill">*</span>发票状态
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-select
                :style="{ maxWidth:'255px',width:'100%' }"
                placeholder="请选择发票状态"
                v-model="titleData.inStatus"
                @change="invoiceStatus"
                :getPopupContainer="triggerNode => triggerNode.parentNode">
                <a-select-option v-for="(item,key) in invoiceStatusList" :key="key" :value="item.code">{{ item.name }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell" :class="titleData.verifyCodeShow ? 'leftcell' : 'leftcell borderRadiusLeft'">备注</a-col>
            <a-col :span="18" class="rightcell">
              <a-input placeholder="备注" :style="{ maxWidth:'255px',width:'100%' }" v-model="titleData.inRemark" :maxLength="60" />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="!isAuditAdd">
        <a-col :span="8" v-if="isWareDoc">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>出入库单凭证号</span>
                </template>
                <span class="mustFill">*</span>出入库单凭证号
              </a-tooltip>
            </a-col>
            <a-col :span="18" class="rightcell borderRadiusRight">
              <a-input placeholder="请输入出入库单凭证号" :style="{ maxWidth:'255px',width:'100%' }" v-model="wareNo" @change="handleNo" />
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8" v-if="isPusure">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">合同</a-col>
            <a-col :span="18" class="rightcell">
              <a-select style="max-width: 260px; width: 100%;" placeholder="选择合同" v-model="titleData.field1" @change="handlePurChange">
                <a-select-option v-for="item in purList" :key="item.id" :value="item.id">{{ item.contractNum }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8" v-if="!isDistributor">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill" title="经销商">*</span>经销商
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-select style="width: 100%; max-width: 255px" placeholder="请选择经销商" v-model="titleData.distCode" @change="(value,option)=>{sellerChange(value,option)}">
                <a-select-option v-for="seller in sellerData" :key="seller.code" :value="seller.code" :type="seller.type">{{ seller.name }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill">*</span>配送商
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-input-group compact :style="{margin:'12px 0'}">
                <a-select style="width:90px" placeholder="已备案" v-model="titleData.authDist" @change="handleDistAuth">
                  <a-select-option value="has">已备案</a-select-option>
                  <a-select-option value="hasNo">未备案</a-select-option>
                  <a-select-option value="unKnownDistribution">手动填写</a-select-option>
                </a-select>
                <a-select
                  style="width: 165px;"
                  showSearch
                  placeholder="请选择配送商"
                  optionFilterProp="children"
                  @change="(value, option)=>{handleChangeAuthDist(value, option)}"
                  v-model="titleData.authDistCode"
                  v-show="titleData.authDist === 'has'">
                  <a-select-option v-for="cusItem in distributorList" :key="cusItem.code" :value="cusItem.code" :title="cusItem.name">{{ cusItem.name }}</a-select-option>
                </a-select>
                <a-input
                  placeholder="请选择配送商"
                  @click="selectUnauthDist"
                  style="width: 100%;max-width:165px;"
                  v-model="titleData.authDistName"
                  v-show="titleData.authDist === 'hasNo'"
                  readonly />
                <a-input v-show="titleData.authDist === 'unKnownDistribution'" placeholder="请输入配送商" :style="{ maxWidth:'165px',width:'100%' }" v-model="titleData.distribution" />
              </a-input-group>

            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>客户名称</span>
                </template>
                <span class="mustFill">*</span>客户名称
              </a-tooltip>
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-input-group compact :style="{margin:'12px 0'}">
                <a-select style="width:75px" placeholder="已授权" v-model="authorize" @change="handleAuth">
                  <a-select-option value="has">已授权</a-select-option>
                  <a-select-option value="hasNo">未授权</a-select-option>
                </a-select>
                <a-select
                  style="width: 180px;"
                  showSearch
                  placeholder="选择客户"
                  optionFilterProp="children"
                  @change="handleChangeCus"
                  v-model="titleData.cusCode"
                  v-show="authorize !== 'hasNo'">
                  <a-select-option v-for="cusItem in cusList" :key="cusItem.code" :value="cusItem.code" :title="cusItem.name">{{ cusItem.name }}</a-select-option>
                </a-select>
                <a-input
                  placeholder="请选择客户名称"
                  @click="handleSelectCus"
                  style="width: 100%;max-width:180px;"
                  v-model="titleData.cusName"
                  v-show="authorize === 'hasNo'"
                  readonly />
              </a-input-group>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>单据日期</span>
                </template>
                <span class="mustFill">*</span>单据日期
              </a-tooltip>
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-date-picker v-model="timeSelect" :style="{ maxWidth:'255px',width:'100%' }" :format="dateFormat" :disabledDate="disabledDate" @change="handleDateChange"></a-date-picker>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <span class="mustFill" title="销量月份">*</span>销量月份
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-select style="width: 100%; max-width: 255px" placeholder="选择销量月份" v-model="titleData.date" @change="(value,option)=>{saleMonthChange(value,option,titleData)}">
                <a-select-option v-for="months in monthList" :key="months.code" :value="months.name" :configType="months.configType">{{ months.name }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8" v-if="isWareDoc">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>备注</span>
                </template>
                备注
              </a-tooltip>
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-input :style="{ maxWidth:'255px',width:'100%' }" v-model="titleData.inRemark" :maxLength="60"></a-input>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8" v-if="isNoSupport">
          <a-row class="tablecell">
            <a-col :span="6" class="leftcell">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>备注</span>
                </template>
                <span class="mustFill">*</span>备注
              </a-tooltip>
            </a-col>
            <a-col :span="18" class="rightcell">
              <a-textarea :style="{ maxWidth:'255px',width:'100%' }" v-model="titleData.inRemark" :maxLength="60"></a-textarea>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8" v-if="isNoSupport" :style="{padding: '0'}">
          <div class="tableEmpty"></div>
        </a-col>
        <!--        <a-col :span="8" v-if="isWareDoc" :style="{padding: '0'}">-->
        <!--          <div class="tableEmpty"></div>-->
        <!--        </a-col>-->
        <a-col :span="24" v-if="isWareDoc || isNoSupport" :style="{padding: '6px 0',height: '124px',}">
          <a-row class="tablecell">
            <a-col :span="2" class="leftcell" :style="{height: '112px'}">
              <span class="mustFill" title="单据凭证">*</span>单据凭证
            </a-col>
            <a-col :span="22" class="rightcell" :style="{height: '112px'}">
              <a-upload
                action="/amo/upload/file/add"
                @change="uploadChangeTitle"
                @preview="uploadPreview"
                :headers="headerUpload"
                listType="picture-card"
                :multiple="true"
                :beforeUpload="beforeUpload"
                :data="uploadData">
                <div v-if="fileList.length < 9 ">
                  <i class="iconfont icon-img"></i>
                  <div class="ant-upload-text">点击上传</div>
                </div>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="uploadCancel" width="660px" class="imgModal">
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
            </a-col>
          </a-row>
        </a-col>
        <!--        <a-col :span="8" v-if="isNoSupport" :style="{'display': 'block','height':'57px'}">-->
        <!--          <a-col :span="6" class="leftcell"></a-col>-->
        <!--          <a-col :span="18" class="rightcell">-->
        <!--          </a-col>-->
        <!--        </a-col>-->
      </a-row>
      <div class="deleteInvoice" @click="estateAdd">保存附件</div>
      <!--       选择购货方-->
      <select-cus-name v-if="selectShow" :visible="selectShow" :cusData="selectData" @selectCus="handleSelectOk" @selectCancle="handleSelectCancle"></select-cus-name>
      <!-- 选择未备案的配送商 -->
      <select-distributor v-if="selectUnauthDistShow" :visible="selectUnauthDistShow" @selectCus="handleSelectOk" @selectCancle="handleSelectCancle"></select-distributor>
      <!--             查看图片-->
      <a-modal :visible="imgVisible" :footer="null" @cancel="imgCancel" width="660px" class="imgModal">
        <img alt="example" style="width: 100%" :src="srcImg" />
      </a-modal>
    </div>
  </a-form>
</template>

<script>
import {
  invoiceSeller,
  invoiceBuyer,
  PerssionAdd,
  PerssionUpdate,
  getContract,
  getEstateDocNo,
  getSaleMonth
} from '@/api/auditManage/auditManage'
import { getCusCodeByDistCode, userDistRange } from '@/api/depot/wareHouse'// 查询已授权的配送商
import moment from 'moment'
import SelectCusName from '@/views/auditManage/auditWrap/modules/SelectCusName'
import SelectDistributor from '../../../reservoir/Depot/modules/SelectDistributor'
import { getStore, setStore } from '@/utils/storage'
export default {
  name: 'EstateInfo',
  components: {
    SelectCusName,
    SelectDistributor
  },
  props: ['titleDetail'],
  beforeCreate() {
    this.form = this.$form.createForm(this)
    const userDistCode = setStore('USER_DIST_CODE')
    if (userDistCode) {
      const index = userDistCode.indexOf('SVCT')
      this.isDistributor = index === 0
    }
  },
  mounted() {
    const newData = JSON.parse(JSON.stringify(this.titleDetail))
    const titleInfo = getStore('estateDetail')
    const EstateId = getStore('EstateId')
    this.titleData = newData
    // this.titleData.invoiceType = titleInfo.invoiceType
    // this.titleData.distribution = EstateId.distribution
    this.authorize = this.titleData.hosAuthFlag === '2' ? 'hasNo' : 'has'
    this.titleData.authDist = this.titleData.authDist ? this.titleData.authDist : 'has' // 默认配送商是已备案
    this.timeSelect = newData.inDate
      ? moment(moment(newData.inDate).format('YYYY-MM-DD'), 'YYYY-MM-DD')
      : null

    this.titleData.date = undefined
    this.verifyCode = newData.verifyCode
    if (newData.addType && !newData.id) {
      switch (newData.addType) {
        case 'wareDoc':
          this.isAuditAdd = false
          this.isWareDoc = true
          this.isPusure = false
          this.isNoSupport = false
          this.titleData.inType = '20'
          this.uploadData.fileType = '23'
          this.titleData.inStatus = null
          this.getDocNo()
          break
        case 'purSure':
          this.isAuditAdd = false
          this.isWareDoc = false
          this.isPusure = true
          this.isNoSupport = false
          this.titleData.inStatus = null
          this.titleData.inType = '30'
          this.getPurList()
          break
        case 'noSupport':
          this.isAuditAdd = false
          this.isWareDoc = false
          this.isPusure = false
          this.isNoSupport = true
          this.uploadData.fileType = '25'
          this.titleData.inStatus = null
          this.titleData.inType = '40'
          break
        default:
          this.isAuditAdd = true
          this.isWareDoc = false
          this.isPusure = false
          this.isNoSupport = false
          this.uploadData.fileType = '21'
          break
      }
    } else {
      switch (newData.inType) {
        case '20':
          this.isAuditAdd = false
          this.isWareDoc = true
          this.isPusure = false
          this.isNoSupport = false
          this.titleData.inType = '20'
          this.uploadData.fileType = '23'
          this.titleData.inStatus = null
          this.wareNo = newData.inNo
          break
        case '30':
          this.isAuditAdd = false
          this.isWareDoc = false
          this.isPusure = true
          this.isNoSupport = false
          this.titleData.inType = '30'
          this.uploadData.fileType = '24'
          this.titleData.inStatus = null
          this.getPurList()
          break
        case '40':
          this.isAuditAdd = false
          this.isWareDoc = false
          this.isPusure = false
          this.isNoSupport = true
          this.titleData.inType = '40'
          this.uploadData.fileType = '25'
          this.titleData.inStatus = null
          break
        default:
          this.isAuditAdd = true
          this.isWareDoc = false
          this.isPusure = false
          this.isNoSupport = false
          this.uploadData.fileType = '21'
          break
      }
    }
    // TODO   编辑
    // this.titleData.distCode = EstateId.distCode

    this.initData()
  },
  data() {
    return {
      isAuditAdd: true,
      isWareDoc: false,
      isPusure: false,
      isNoSupport: false,
      titleData: {
        distCode: this.$store.state.user.info.distCode,
        date: undefined
      },
      authorize: 'has',
      cusList: [],
      distributorList: [], // 已备案配送商列表
      selectUnauthDistShow: false,
      isDistributor: false,
      monthList: [],
      buyerData: [],
      purList: [{
        code: '1001',
        name: '合同111 '
      }],
      invoiceList: [{
        code: '01',
        name: '增值税专用发票'
      },
      {
        code: '04',
        name: '增值税普通发票'
      },
      {
        code: '10',
        name: '增值税普通发票（电子）'
      }
      ],
      sellerData: [],
      uploadData: {
        fileType: 21,
        uploadType: 1,
        correlationId: ''
      },
      invoiceStatusList: [{
        code: '1',
        name: '蓝票'
      },
      {
        code: '2',
        name: '红票'
      }
      ],
      previewVisibleTitle: false,
      headerUpload: {
        Authorization: 'Bearer ' + this.$store.state.user.token
      },
      selectShow: false,
      imgVisible: false,
      srcImg: '',
      dateFormat: 'YYYY-MM-DD',
      timeSelect: null,
      tableNegative: false,
      isAllEmpty: false,
      verifyCode: '',
      wareNo: '',
      isSubmit: true,
      previewVisible: false,
      previewImage: '',
      fileList: [],
      picId: ''
    }
  },
  methods: {
    moment,
    initData() {
      if (!this.isDistributor) {
        this.getInvoiceSeller()
      } else {
        this.getDistributorList(this.$store.state.user.info.distCode || '')
        this.getBuyerData(
          {
            code: this.$store.state.user.info.distCode,
            type: 1
          }
        )
      }

      this.invoiceTypeChange()
      this.getMonth()
      this.$forceUpdate()
    },
    handleNo(e) {
      // console.info('val===', e.target.value)
      this.titleData.inNo = e.target.value
    },
    getDocNo() {
      getEstateDocNo().then(res => {
        if (res.message === 'SUCCESS') {
          this.wareNo = res.data.docNo
          this.titleData.inNo = res.data.docNo
        } else {
          this.$notification['error']({
            message: '获取单号失败！',
            description: res.message,
            duration: 4
          })
        }
      })
    },
    getMonth() {
      const _that = this
      getSaleMonth().then(res => {
        res.data.map(item => {
          _that.monthList.push({
            code: item.id,
            name: item.year + '-' + item.month,
            configType: item.configType
          })
        })
      })
    },
    saleMonthChange(value, option, item) {
      item.invoiceType = option.data.attrs.configType
      item.salesMonth = value.split('-')[1]
      item.salesYear = value.split('-')[0]
      this.$forceUpdate()
    },
    handlePurChange(val) {
      this.purList.forEach(item => {
        if (item.id === val) {
          this.titleData.field2 = item.contractNum
          this.titleData.cusCode = item.hosCode
          this.titleData.cusName = item.hosName
          if (item.hosAuthFlag === '0') {
            this.handleAuth('hasNo', item.hosName)
          } else {
            this.handleAuth('has', item.hosCode)
          }
        }
      })
    },
    getPurList() {
      const params = {
        page: 1,
        size: 100
      }
      getContract(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.purList = res.data.list
        }
      })
    },
    getDistributorList(distCode = '') { // 查询所有已备案的配送商
      const params = {
        distCode: distCode || ''
      }
      getCusCodeByDistCode(params).then((res) => {
        if (res.message === 'SUCCESS') {
          const data = res.data
          data.map(item => { item.code = item.cusCode; item.name = item.cusName })
          this.distributorList = data
        }
      })
    },

    invoiceTypeChange() {
      // 发票类型切换
      if (
        this.titleData.inType === '04' ||
                this.titleData.inType === '10'
      ) {
        this.titleData.verifyCodeShow = true
      } else {
        this.titleData.verifyCode = undefined
        this.titleData.verifyCodeShow = false
      }
    },
    disabledDate(current) {
      // 不可选日期
      return current && current > moment().endOf('day')
    },
    getInvoiceSeller() {
      // 获取销货方数据
      invoiceSeller().then(res => {
        if (res.message === 'SUCCESS') {
          this.sellerData = res.data
          this.titleData.distCode = res.data[0].code
          this.titleData.distName = res.data[0].name
          this.getDistributorList(res.data[0].code || '')
          this.getBuyerData(
            {
              code: res.data[0].code || '',
              type: 1
            }
          )
        }
      })
    },

    sellerChange(value, option) {
      this.titleData.distName = option.componentOptions.propsData.title
      //   选择销货方
      const param = {
        code: value,
        type: option.data.attrs.type
      }
      this.getBuyerData(param)
      this.titleData.authDistCode = undefined
      this.titleData.authDistName = ''
      this.titleData.cusCode = undefined
      this.titleData.cusName = ''
      this.titleData.authorize = 'has'
      this.titleData.authDist = 'has'
      this.authorize = 'has'
      this.$forceUpdate()

      const param1 = {
        distCode: this.title.distCode
      }
      getDistributorList(param1)
    },
    // 选择购货方弹框
    handleSelectCus() {
      this.selectShow = true
      this.selectData = {
        distCode: this.titleData.distCode,
        cusCode: this.titleData.cusCode,
        cusName: this.titleData.cusName
      }
    },
    handleChangeCus() {
      const seleCus = this.titleData.cusCode
      this.cusList.forEach(item => {
        if (item.code === seleCus) {
          this.titleData.cusName = item.name
        }
      })
      this.$forceUpdate()
    },
    // 选择未授权的配送商弹框
    selectUnauthDist() {
      if (this.titleData.distCode) {
        this.selectUnauthDistShow = true
        this.selectShow = false
        this.selectData = {
          distCode: this.titleData.distCode,
          cusCode: this.titleData.cusCode,
          cusName: this.titleData.cusName
        }
      } else {
        this.$notification['error']({
          message: '提示',
          description: '请先选择经销商！',
          duration: 4
        })
      }
    },
    // 选择已授权的配送商
    handleChangeAuthDist(value, option) {
      const seleCus = this.titleData.authDistCode
      this.titleData.authDistName = option.componentOptions.propsData.title
      this.$forceUpdate()
    },
    getBuyerData(param, key) {
      // 获取购货方数据
      invoiceBuyer(param).then(res => {
        this.cusList = res.data
        this.buyerData = res.data
        this.$forceUpdate()
      })
    },
    // 已授权未授权
    handleAuth(e, cusName) {
      // console.info('ee', cusName)
      if (cusName.data) {
        // console.info('-----')
        this.titleData.cusCode = undefined
        this.titleData.cusName = ''
      }
      this.authorize = e
    },
    handleDistAuth() {
      this.titleData.distribution = ''
      this.titleData.authDistCode = undefined
      this.titleData.authDistName = ''
      this.$forceUpdate()
    },
    uploadChangeTitle({
      file,
      fileList
    }) {
      // console.info('fileList====', file, fileList)
      // title上传
      if (file.status === 'done' || file.status === 'removed') {
        if (file.response.code === 500) {
          if (file.thumbUrl === '' && file.status === 'removed') {
            this.$notification['success']({
              message: '删除成功',
              description: '删除成功',
              duration: 2
            })
          } else {
            this.$notification['error']({
              message: file.status === 'done' ? '上传失败，发票将添加不成功，请重新上传正确的发票！' : '删除失败！',
              description: file.response.message,
              duration: 2
            })
          }
          // console.info('fileList====', file, fileList, this.fileList)
        } else if (file.response.code === 200) {
          // console.info('file.response====', file.response)
          this.$notification['success']({
            message: '提示',
            description: file.status === 'done' ? '上传成功' : '删除成功',
            duration: 2
          })
          this.fileList = fileList
          this.titleData.fileUrl = file.response.data.fileUrl
          this.titleData.imgId = file.response.data.id
          const checkFile = []
          fileList.map(item => {
            if (item.response && item.response.code === 200) {
              checkFile.push(item.response.data)
            }
          })
          // console.info('checkFile======', checkFile)
          this.titleData.fileId = checkFile
          const arr = []
          if (fileList !== 0) {
            fileList.map(item => {
              if (item.response && item.response.code === 200) {
                arr.push(item.response.data.id)
              }
            })
            this.picId = arr.toString()
          } else {
            this.picId = ''
          }
          this.$forceUpdate()
        }
      }
    },
    uploadPreview(file) {
      // console.info('file===', file)
      this.previewImage = file.response.data.fileUrl
      this.previewVisible = true
    },
    uploadCancel() {
      // 取消
      this.previewVisible = false
    },
    titleImgClose() {
      // 关闭title图片
      this.previewVisibleTitle = false
    },
    viewImgShow() {
      // 查看图片
      this.srcImg = this.titleData.fileUrl
      this.imgVisible = true
    },
    imgCancel() {
      // 取消查看图片
      this.imgVisible = false
    },
    beforeUpload(file, fileList) {
      // 发票上传前回调
      const size = file.size / 1024 / 1024
      if (size > 5) {
        this.$notification['error']({
          message: '上传失败',
          description: '文件大小不能超过5M！',
          duration: 4
        })
        return false
      }
    },
    invoiceStatus(item) {
      // 发票状态切换
      if (item === '2') {
        this.titleData.negative = true
        this.tableNegative = true
        this.$forceUpdate()
      } else {
        this.titleData.negative = false
        this.tableNegative = false
        this.$forceUpdate()
      }
    },
    estateAdd() {
      if (this.isSubmit) {
        this.isSubmit = false
        this.titleData.timeSelect = this.timeSelect
        this.titleData.inDate = this.timeSelect
        this.titleData.verifyCode = this.verifyCode
        this.titleData.authorize = this.authorize // 客户是否授权
        this.titleData.hosAuthFlag = this.authorize === 'has' ? '1' : '2'
        this.titleData.unKnownDistribution = this.titleData.authDist === 'unKnownDistribution' // 是否手动填写
        // this.titleData.distAuthFlag = this.titleData.authDist === 'has' ? '1' : '2' // 配送商是否备案  1是备案  2是未备案   手动填写属于未备案
        this.titleData.distributionCode = this.titleData.authDist === 'unKnownDistribution' ? '' : this.titleData.authDistCode
        // delete this.titleData.authDist
        // delete this.titleData.authDistCode
        // delete this.titleData.authDistName
        // delete this.titleData.distAuthFlag
        this.titleData.distribution = this.titleData.authDist === 'unKnownDistribution' ? this.titleData.distribution : this.titleData.authDistName

        const userDistCode = getStore('USER_DIST_CODE')
        const userDistName = getStore('USER_DIST_NAME')
        this.titleData.reportOrgCode = userDistCode
        this.titleData.reportOrgName = userDistName
        const currentData = JSON.parse(JSON.stringify(this.titleData))

        let subArr = []
        const addType = currentData.addType ? currentData.addType : currentData.inType
        switch (addType) {
          case 'wareDoc':
          case '20':
            subArr = ['inNo', 'timeSelect', 'cusCode', 'distribution', 'date']
            break
          case 'purSure':
          case '30':
            subArr = ['timeSelect', 'cusName', 'distribution', 'date']
            break
          case 'noSupport':
          case '40':
            subArr = ['timeSelect', 'cusCode', 'distribution', 'inRemark', 'date']
            break
          default:
            subArr = ['inType', 'inCode', 'inNo', 'timeSelect', 'cusCode', 'noneTaxTotal', 'inStatus', 'distribution', 'date']
        }
        this.subArry(subArr)
        if (this.titleData.reportType) {
          currentData.reportType = this.titleData.reportType
        } else {
          currentData.reportType = (this.isAuditAdd || this.isWareDoc || this.isPusure || this.isNoSupport) ? 3 : null
        }
        if ((addType === 'wareDoc' || addType === 'noSupport') && this.fileList.length === 0) {
          this.$notification['error']({
            message: '提示',
            description: '单据凭证不能为空！',
            duration: 4
          })
          this.isSubmit = true
          return false
        }
        if (!this.isAllEmpty) {
          if (currentData.inCode && currentData.inCode.length > 20) {
            this.$notification['error']({
              message: '提示',
              description: '发票代码长度不能超过20！',
              duration: 4
            })
            this.isSubmit = true
            return false
          } else if (currentData.inNo && currentData.inNo.length < 8 && addType !== '20' && addType !== 'wareDoc') {
            this.$notification['error']({
              message: '提示',
              description: '发票号码长度不能小于8！',
              duration: 4
            })
            this.isSubmit = true
            return false
          } else if (currentData.remark && currentData.remark.length > 200) {
            this.$notification['error']({
              message: '提示',
              description: '备注长度不能超过200！',
              duration: 4
            })
            this.isSubmit = true
            return false
          }
          if (!currentData.isUpdate) {
            const param = {
              invoice: currentData,
              picId: addType === 'wareDoc' ? this.picId : currentData.imgId
            }
            console.info('0911 currentData===', currentData)
            PerssionAdd(param).then(res => {
              if (res.code === 200) {
                // console.info('res====', res)
                this.$notification['success']({
                  message: '新增成功',
                  description: '新增成功',
                  duration: 4
                })
                this.titleData.id = res.data.invoice.id
                this.$emit('addEstate', this.titleData)
              } else {
                this.$notification['error']({
                  message: '保存失败',
                  description: res.message,
                  duration: 4
                })
              }
              this.isSubmit = true
            })
          } else {
            currentData.distributionInvoiceId = this.titleData.distributionInvoiceId
            const param = {
              invoice: currentData,
              picId: addType === 'wareDoc' ? this.picId : currentData.imgId
            }
            // console.info('2222===', currentData, param)
            PerssionUpdate(param).then(res => {
              if (res.code === 200) {
                this.$notification['success']({
                  message: '修改成功',
                  description: '修改成功',
                  duration: 4
                })
                this.$emit('addEstate', currentData)
              } else {
                this.$notification['error']({
                  message: '修改失败',
                  description: res.message,
                  duration: 4
                })
              }
              this.isSubmit = true
            })
          }
        }
      } else {
        this.$notification['info']({
          message: '提示',
          description: '后台数据处理中，请稍后再试！',
          duration: 4
        })
      }
    },
    subArry(strArr) {
      const currentData = JSON.parse(JSON.stringify(this.titleData))
      this.isAllEmpty = false
      // console.info('==--9099', strArr, currentData)
      strArr.forEach(item => {
        if (this.isEmpty(currentData[item])) {
          this.isAllEmpty = true
        }
      })
      if (this.isAllEmpty) {
        this.$notification['error']({
          message: '提示',
          description: '必填信息不能为空！',
          duration: 4
        })
        this.isSubmit = true
      } else {
        this.isAllEmpty = false
      }
    },
    isEmpty(str) {
      // 验证是否为空
      if (str === null || str === undefined || str === '') {
        return true
      }
      return false
    },
    // 发票数据
    selectData() {
      return {
        distCode: this.titleData.distCode,
        cusCode: this.titleData.cusCode
      }
    },
    // //选择购货方弹框
    // handleSelectCus () {
    //   // console.info('3333')
    //   if (this.titleData.distCode) {
    //     this.selectShow = true
    //   } else {
    //     this.$notification["error"]({
    //       message: "提示",
    //       description: "请先选择销货方！",
    //       duration: 4
    //     });
    //   }
    // },
    handleSelectOk(subVal) {
      // console.info('subVal====', subVal)
      if (this.selectShow) {
        this.titleData.cusCode = subVal.cusCode
        this.titleData.cusName = subVal.cusName
        this.selectShow = false
      }
      if (this.selectUnauthDistShow) {
        this.titleData.authDistCode = subVal.cusCode
        this.titleData.authDistName = subVal.cusName
        this.selectUnauthDistShow = false
      }
    },
    handleSelectCancle() {
      if (this.selectShow) {
        this.selectShow = false
      }
      if (this.selectUnauthDistShow) {
        this.selectUnauthDistShow = false
      }
    },
    handleDateChange(date, string) {
      // console.info('date===', date, string)
      this.titleData.timeSelect = moment(string, 'YYYY-MM-DD')
    },
    handleMoment(val) {
      if (val) {
        return moment(val, 'YYYY-MM-DD HH:mm')
      }
      return null
    },
    handleTaxChange(e) {
      e.target.value = e.target.value.toString().match(/^\d+(?:\.\d{0,1})?/)
    },
    handleCode(val) {
      // console.info('val===', val)
      this.titleData.verifyCode = val
    }
  }
}
</script>

<style lang="less" scoped>
/*详情基本信息*/
.invoiceTableManual {
    ::-webkit-input-placeholder {
        /* Chrome/Opera/Safari */
        color: #939393;
    }

    ::-moz-placeholder {
        /* Firefox 19+ */
        color: #939393;
    }

    :-ms-input-placeholder {
        /* IE 10+ */
        color: #939393;
    }

    :-moz-placeholder {
        /* Firefox 18- */
        color: #939393;
    }

    margin-top: 10px;
    border: 1px solid #e9e9e9;
    border-right: none;
    border-bottom: none;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    background: #fbfbfb;
    line-height: 56px;
    position: relative;

    .deleteInvoice {
        position: absolute;
        right: 20px;
        bottom: 12px;
        border: 1px solid #e9e9e9;
        line-height: 28px;
        padding: 0 10px;
        border-radius: 4px;
        cursor: pointer;
    }

    .deleteInvoice:hover {
        border: 1px solid #3e4da8;
        background: #3e4da8;
        color: #fff;
    }

    .ant-row {
        margin: 0 !important;
    }

    .ant-col-8 {
        padding: 0 !important;
    }

    .tableEmpty {
        display: block;
        height: 57px;
        width: 100%;
        border-right: 1px solid #e9e9e9;
        border-bottom: 1px solid #e9e9e9;
    }

    .tablecell {
        >div {
            border-right: 1px solid #e9e9e9;
            border-bottom: 1px solid #e9e9e9;
        }

        .leftcell {
            text-align: right;
            padding: 0 15px;
            font-size: 14px;
            color: #34353e;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;

            .mustFill {
                color: #e17877;
                margin-right: 5px;
            }
        }

        .rightcell {
            text-align: left;
            padding: 0 20px;
            line-height: 57px;
            height: 57px;

            span {
                display: inline-block;
            }

            .priceNegative {
                position: absolute;
                left: 4px;
            }

            .ant-form-item-control-wrapper {
                width: 100%;
                margin-top: 12px;
            }

            .ant-upload {
                cursor: pointer;
                width: auto;
                height: auto;

                &:hover {
                    color: #3e4da8;
                }
            }

            .imgMsg {
                margin-right: 20px;
                cursor: pointer;

                &:hover {
                    color: #3e4da8;
                }
            }

            .ant-row {
                margin-top: 10px;
            }
        }
    }
}

.imgModal {
    .ant-modal-body {
        .ant-input-affix-wrapper {
            margin-bottom: 20px;
            width: 328px;
            height: 32px;

            .ant-input-search-button {
                height: 32px;
                background: #f6f6f6 !important;
                color: #939393;
                border: 1px solid #e9e9e9;
            }
        }
    }
}
</style>
