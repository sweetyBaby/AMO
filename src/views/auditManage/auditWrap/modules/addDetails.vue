<template>
  <div>
    <div :class="invoiceStyle">
      <a-row :gutter="48">
        <a-col :md="14">
          <h3 class="detailsTitle">添加明细</h3>
          <div class="turnon" v-show="turnOn" @click="turnonClick">
            点击收起基本信息
            <i class="iconfont icon-arrow-up"></i>
          </div>
          <div class="turnon" v-show="!turnOn" @click="turnonClick">
            点击展开基本信息
            <i class="iconfont icon-arrow-down"></i>
          </div>
        </a-col>
        <a-col :md="10">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleBack()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back" />
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="manualSearch" v-if="detailsDataProp.status !== '2' && detailsDataProp.verifyStatus !== '05'">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>手动选择</span>
                </template>
                <i class="iconfont icon-plus" />
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="accordCode" v-if="detailsDataProp.status !== '2' && detailsDataProp.verifyStatus !== '05'">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>根据单号</span>
                </template>
                <i class="iconfont icon-orderIn" />
              </a-tooltip>
            </span>
            <span class="titleBtn" v-if="detailsDataProp.status !== '2' && detailsDataProp.verifyStatus !== '05'">
              <a-upload
                action="/amo/upload/file/add"
                :fileList="accompanyList.fileList"
                :showUploadList="false"
                @change="uploadChange"
                :multiple="true"
                :beforeUpload="beforeUploadSui"
                :headers="headerUpload"
                :data="accompanyList.param">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>随行单</span>
                  </template>
                  <i class="iconfont icon-accompany" />
                </a-tooltip>
              </a-upload>
            </span>
            <span class="titleBtn" @click="handleSave()" v-if="detailsDataProp.status !== '2' && detailsDataProp.verifyStatus !== '05'">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>保存</span>
                </template>
                <i class="iconfont icon-save" />
              </a-tooltip>
            </span>
          </div>
        </a-col>
      </a-row>
      <!-- 根据单号选择 -->
      <a-modal
        :title="invoiceDetailsAdd.title"
        v-model="invoiceDetailsAdd.invoiceDetailsAdd"
        width="1000px"
        :maskClosable="false"
        :destroyOnClose="true"
        @cancel="addProductCancel"
        @ok="addProductOK">
        <template>
          <invoice-details-add :detailsAddData="titleData" @selectedData="selectedData" />
        </template>
      </a-modal>
    </div>
    <div v-show="turnOn" style="position:relative">
      <div class="scanListAudit" v-show="!editShow">
        <div class="invoiceDelete" @click="editTitleData" v-if="detailsDataProp.status!=='2' && detailsDataProp.verifyStatus !== '05' && isEdit">
          <a-tooltip placement="top">
            <template slot="title">
              <span>编辑</span>
            </template>
            <i class="iconfont icon-card-edit" />
          </a-tooltip>
        </div>
        <div class="scanListTitle">
          <a-row>
            <a-col :span="5">
              <div class="code">
                <span>发票代码</span>
                <b>{{ titleData.inCode }}</b>
              </div>
            </a-col>
            <a-col :span="4">
              <div class="invoiceLine">
                <div></div>
                <div></div>
              </div>
            </a-col>
            <a-col :span="6">
              <div class="invoiceType">
                <h3>{{ titleData.inType }}</h3>
                <p>开票日期：{{ moment(titleData.inDate).format('YYYY年MM月DD日') }}</p>
              </div>
            </a-col>
            <a-col :span="4">
              <div class="invoiceLine">
                <div></div>
                <div></div>
              </div>
            </a-col>
            <a-col :span="5">
              <div class="code" style="text-align: right;">
                <span>发票号码</span>
                <b>{{ titleData.inNo }}</b>
              </div>
            </a-col>
          </a-row>
        </div>
        <div class="invoiceTable">
          <a-row>
            <a-col :span="8">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell" title="销货方">销货方</a-col>
                <a-col :span="18" class="rightcell" :title="titleData.distName">{{ titleData.distName }}</a-col>
              </a-row>
            </a-col>
            <a-col :span="8" v-if="addType !== null">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell" title="配送商">配送商</a-col>
                <a-col :span="18" class="rightcell" :title="titleData.distribution">{{ titleData.distribution }}</a-col>
              </a-row>
            </a-col>
            <a-col :span="8" v-if="addType === null">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell" title="购货方">购货方</a-col>
                <a-col :span="18" class="rightcell" :title="titleData.cusName">{{ titleData.cusName }}</a-col>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell" title="不含税金额">不含税金额</a-col>
                <a-col :span="18" class="rightcell borderRadiusRight" :title="titleData.noneTaxTotal">
                  <span v-show="titleData.negative">-</span>
                  {{ titleData.noneTaxTotal }}
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="8" v-show="titleData.verifyCodeShow">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell" title="校验码后六位">校验码后六位</a-col>
                <a-col :span="18" class="rightcell" :title="titleData.verifyCode">{{ titleData.verifyCode }}</a-col>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell" title="发票图片" :style="titleData.verifyCodeShow ? '' : 'border-radius:0 0 0 8px'">发票图片</a-col>
                <a-col :span="18" class="rightcell">
                  <span class="viewImg" @click="viewImgShow" v-show="titleData.imgShow">查看图片</span>
                </a-col>
              </a-row>
              <a-modal :visible="previewVisibleTitle" :footer="null" width="660px" class="imgModal" @cancel="titleImgClose">
                <img alt="example" style="width: 100%" :src="titleData.fileUrl" />
              </a-modal>
            </a-col>
            <a-col :span="8">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell" title="发票状态">发票状态</a-col>
                <a-col :span="18" class="rightcell" :title="titleData.inStatus">{{ titleData.inStatus }}</a-col>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row class="tablecell">
                <a-col :span="6" class="leftcell" title="备注" :class="titleData.verifyCodeShow ? 'leftcell borderRadiusLeft' : 'leftcell'">备注</a-col>
                <a-col :span="18" class="rightcell" :title="titleData.inRemark" :style="titleData.verifyCodeShow ? '' : 'border-radius:0 0 8px 0'">{{ titleData.inRemark }}</a-col>
              </a-row>
            </a-col>
          </a-row>
        </div>
      </div>
      <a-tooltip>
        <template slot="title">{{ errMsg ? '验真通过':errMsg }}</template>
        <a href="javascript:;" class="iconCheck">
          <i class="iconfont check" :class="checkStyle" />
        </a>
      </a-tooltip>
      <div class="invoiceTitle" v-show="editShow">
        <a-form layout="inline">
          <div class="invoiceTableManual">
            <a-row :gutter="24">
              <a-col :span="8">
                <a-row class="tablecell">
                  <a-col :span="6" class="leftcell">
                    <span class="mustFill">*</span>发票类型
                  </a-col>
                  <a-col :span="18" class="rightcell">
                    <a-select
                      style="max-width: 260px; width: 100%;"
                      :disabled="isDisabled"
                      placeholder="请选择发票类型"
                      v-model="titleDataEdit.inType"
                      @change="invoiceTypeChange"
                      :getPopupContainer="triggerNode => triggerNode.parentNode">
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
                    <a-input :disabled="isDisabled" placeholder="请输入发票代码" :style="{ maxWidth:'255px',width:'100%' }" v-model="titleData.inCode" />
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="8">
                <a-row class="tablecell">
                  <a-col :span="6" class="leftcell">
                    <span class="mustFill">*</span>发票号码
                  </a-col>
                  <a-col :span="18" class="rightcell borderRadiusRight">
                    <a-input :disabled="isDisabled" placeholder="请输入发票号码" :style="{ maxWidth:'255px',width:'100%' }" v-model="titleData.inNo" />
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="8">
                <a-row class="tablecell">
                  <a-col :span="6" class="leftcell">
                    <span class="mustFill">*</span>开票日期
                  </a-col>
                  <a-col :span="18" class="rightcell">
                    <a-date-picker v-model="titleDataEdit.timeSelect" :disabledDate="disabledDate" :style="{ maxWidth:'255px',width:'100%' }" :disabled="isDisabled"></a-date-picker>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="8">
                <a-row class="tablecell">
                  <a-col :span="6" class="leftcell">
                    <span class="mustFill">*</span>销货方
                  </a-col>
                  <a-col :span="18" class="rightcell">
                    <a-select placeholder="请选择销货方" :style="{ maxWidth:'255px',width:'100%' }" v-model="titleData.distCode" @change="sellerChange" :getPopupContainer="triggerNode => triggerNode.parentNode">
                      <a-select-option v-for="(item,key) in sellerData" :value="item.code" :type="item.type" :key="key">{{ item.name }}</a-select-option>
                    </a-select>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="8" v-if="addType !== null">
                <a-row class="tablecell">
                  <a-col :span="6" class="leftcell">
                    <span class="mustFill">*</span>配送商
                  </a-col>
                  <a-col :span="18" class="rightcell borderRadiusRight">
                    <a-input placeholder="请输入配送商" :style="{ maxWidth:'255px',width:'100%' }" v-model="titleData.distribution" />
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="8" v-if="addType === null">
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
                        placeholder="选择客户"
                        optionFilterProp="children"
                        v-model="titleData.cusCode"
                        v-if="titleData.authorize !== 'hasNo'"
                        @change="handleChangeCus">
                        <a-select-option v-for="cusItem in cusList" :key="cusItem.code" :value="cusItem.code" :title="cusItem.name">{{ cusItem.name }}</a-select-option>
                      </a-select>
                      <a-input
                        placeholder="请选择客户名称"
                        @click="handleSelectCus"
                        style="width: 100%;max-width:180px;"
                        v-model="titleData.cusName"
                        v-if="titleData.authorize === 'hasNo'"
                        readonly />
                    </a-input-group>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="8">
                <a-row class="tablecell">
                  <a-col :span="6" class="leftcell">
                    <span class="mustFill">*</span>不含税金额
                  </a-col>
                  <a-col :span="18" class="rightcell">
                    <a-input :disabled="titleData.reportType === '1' ? true : ( detailsDataProp.verifyStatus === '03' ? ( titleDataEdit.inType === '01' ? true : false) : false )" placeholder="请输入不含税金额" :style="{ maxWidth:'255px',width:'100%' }" v-model="titleData.noneTaxTotal">
                      <a-icon slot="prefix" type="minus" v-if="titleData.negative" style="font-size:10px;" />
                    </a-input>
                    <!-- <span class="priceNegative" v-show="titleData.negative">-</span> -->
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="8" v-show="titleData.verifyCodeShow">
                <a-row class="tablecell">
                  <a-col :span="6" class="leftcell">
                    <span class="mustFill">*</span>校验码后六位
                  </a-col>
                  <a-col :span="18" class="rightcell">
                    <a-input :disabled="isDisabled" placeholder="请输入校验码后六位" :style="{ maxWidth:'255px',width:'100%' }" v-model="titleData.verifyCode" />
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="8">
                <a-row class="tablecell">
                  <a-col :span="6" class="leftcell">添加图片</a-col>
                  <a-col :span="18" class="rightcell">
                    <span class="imgMsg" @click="viewImgShow" v-if="titleData.imgShow">查看图片</span>
                    <a-upload
                      action="/amo/upload/file/add"
                      @change="uploadChangeTitle"
                      :showUploadList="false"
                      :headers="headerUpload"
                      :beforeUpload="beforeUpload"
                      :data="uploadData">
                      <span v-if="titleData.imgShow">重新上传</span>
                      <span v-if="!titleData.imgShow">上传一张图片</span>
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
                      :disabled="true"
                      :style="{ maxWidth:'255px',width:'100%' }"
                      placeholder="请选择发票状态"
                      v-model="titleDataEdit.inStatus"
                      @change="invoiceStatus(titleDataEdit)"
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
                    <a-input placeholder="备注" :style="{ maxWidth:'255px',width:'100%' }" v-model="titleData.inRemark" :maxLength="100" />
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </div>
        </a-form>
      </div>
    </div>
    <div class="addDeatils" v-if="detailsDataProp.status!=='2' && detailsDataProp.verifyStatus !== '05'" v-show="isEmpty">
      <h4>请在下方选择一种方式添加发票明细</h4>
      <div class="scanInfo">
        <div class="scanBor"></div>
        <div class="scanListAudit" @click="manualSearch">
          <span class="scanIcon">
            <i class="iconfont icon-plus" />
          </span>
          <div class="scanMain">
            <h3>手动选择</h3>
            <p>从产品主数据选择</p>
          </div>
        </div>
        <div class="scanBor"></div>
        <div class="scanListAudit" @click="accordCode">
          <span class="scanIcon">
            <i class="iconfont icon-orderIn" />
          </span>
          <div class="scanMain">
            <h3>根据单号</h3>
            <p>输入单号选择产品</p>
          </div>
        </div>
        <div class="scanBor"></div>
      </div>
    </div>
    <div>
      <a-drawer
        title="手动添加"
        placement="right"
        @close="onSearchClose"
        :visible="isShowSearch"
        wrapClassName="searchWrap"
        :destroyOnClose="true"
        width="680">
        <AddProductManual @selectedData="selectedDataManual" :selectedProduct="titleData" />
      </a-drawer>
    </div>
    <div class="productDetails" v-show="!isEmpty">
      <div>
        <div class="tableTitle">发票产品明细</div>
        <a-table
          :columns="columns"
          :dataSource="tableData"
          rowKey="id"
          class="tableProduct"
          size="default"
          :pagination="pagination"
          @change="handleTableChange">
          <span slot="qty" slot-scope="text, record, index">
            <template>
              <div v-if="detailsDataProp.status !== '2' && detailsDataProp.verifyStatus !== '05'" class="detailsProduct">
                <span v-show="tableNegative">-</span>
                <a-input style="margin: -5px 0" v-model="record.newQty" @change="changeQty(record)" @blur="blurQty(record)" v-show="detailsDataProp.verifyStatus !== '05'"></a-input>
              </div>
              <div v-else>
                <span v-show="tableNegative">-</span>
                {{ record.qty }}
              </div>
            </template>
          </span>
          <span slot="nonePrice" slot-scope="text, record">
            <template>
              <div v-if="detailsDataProp.status!=='2' && detailsDataProp.verifyStatus !== '05' ">
                <a-input style="margin: -5px 0" v-model="record.nonePrice" @change="changeNonePrice(record)" @blur="blurNonePrice(record)"></a-input>
              </div>
              <div v-else>{{ record.nonePrice }}</div>
            </template>
          </span>
          <span slot="nonePriceTotal" slot-scope="text, record">
            <template>
              <span v-if="isNaN(record.nonePrice*record.qty)">0</span>
              <span v-else-if="tableNegative">{{ -(record.nonePrice*record.qty).toFixed(7) }}</span>
              <span v-else>{{ (record.nonePrice*record.qty).toFixed(7) }}</span>
            </template>
          </span>
          <span slot="operation" slot-scope="text, record">
            <template>
              <div>
                <a-popover placement="bottomRight" overlayClassName="auditOper">
                  <template slot="content">
                    <a @click="handleDelete(record)">
                      <i class="iconfont icon-tableEmpty"></i>删除
                    </a>
                  </template>
                  <i class="iconfont icon-tableMore"></i>
                </a-popover>
              </div>
            </template>
          </span>
        </a-table>
      </div>
    </div>
    <div class="accompanyList" v-show="accompanyList.accompanyShow && accompanyList.fileList.length > 0 ">
      <div class="accompanyTitle">
        <span class="tip">注：最多上传9张</span>随行单
      </div>
      <div class="accompanyUpload">
        <div class="clearfix">
          <a-upload
            action="/amo/upload/file/add"
            listType="picture-card"
            :fileList="accompanyList.fileList"
            @preview="uploadPreview"
            @change="uploadChange"
            :multiple="true"
            :headers="headerUpload"
            :beforeUpload="beforeUploadSui"
            :data="accompanyList.param">
            <div v-if="accompanyList.fileList.length < 9 && detailsDataProp.verifyStatus !== '05'">
              <i class="iconfont icon-img"></i>
              <div class="ant-upload-text">点击上传</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="uploadCancel" width="660px" class="imgModal">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>
      </div>
    </div>
    <select-cus-name v-if="selectShow" :visible="selectShow" :cusData="selectData" @selectCus="handleSelectOk" @selectCancle="handleSelectCancle"></select-cus-name>
  </div>
</template>

<script>
import {
  DataFilter
} from '@/utils/storage'
import {
  CheckList
} from '@/api/depot/depot'
import {
  invoiceDetail,
  invoiceUpdate,
  invoiceDetailAdd,
  invoiceDetailDelete,
  invoiceDetailUpdate,
  invoiceSeller,
  invoiceBuyer,
  deleteImg,
  EstateDetail,
  EstateUpdate,
  EstateProAdd,
  EstateProDelete,
  EstateProUpdate
} from '@/api/auditManage/auditManage'
import InvoiceDetailsAdd from './invoiceDetailsAdd'
import AddProductManual from './addProductManual'
import SelectCusName from './SelectCusName'
import moment from 'moment'

export default {
  name: 'AddDetails',
  components: {
    InvoiceDetailsAdd,
    AddProductManual,
    SelectCusName
  },
  props: ['detailsDataProp'],
  data() {
    return {
      isEdit: true,
      errMsg: '',
      keepList: {},
      isShowSearch: false,
      editShow: false,
      invoiceDetailsAdd: {
        invoiceDetailsAdd: false,
        invoiceDetailsAddType: '',
        title: '',
        productAdd: [],
        accompanyShow: false
      },
      tableNegative: false,
      titleDataEdit: {
        timeSelect: null,
        inType: '',
        inStatus: 1
      },
      selectShow: false,
      columns: [{
        title: '产品型号',
        dataIndex: 'productModel',
        key: 'productModel'
      },
      {
        title: '产品名称',
        dataIndex: 'productName',
        key: 'productName'
      },
      {
        title: '单位',
        key: 'uom',
        dataIndex: 'uom'
      },
      {
        title: '数量',
        key: 'qty',
        dataIndex: 'qty',
        width: '160px',
        scopedSlots: {
          customRender: 'qty'
        }
      },
        //   {
        //     title: '单价（不含税）',
        //     key: 'nonePrice',
        //     dataIndex: 'nonePrice',
        //     width: '160px',
        //     scopedSlots: {
        //       customRender: 'nonePrice'
        //     }
        //   },
        //   {
        //     title: '总价（不含税）',
        //     key: 'nonePriceTotal',
        //     dataIndex: 'nonePriceTotal',
        //     scopedSlots: {
        //       customRender: 'nonePriceTotal'
        //     }
        //   }
        // {
        //   title: '操作',
        //   dataIndex: 'operation',
        //   align: 'center',
        //   width: '100px',
        //   scopedSlots: { customRender: 'operation' }
        // }
      ],
      pagination: {
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100']
      },
      uploadData: {
        fileType: 1,
        uploadType: 1,
        correlationId: ''
      },
      previewVisibleTitle: false,
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
      invoiceStatusList: [{
        code: '1',
        name: '蓝票'
      },
      {
        code: '2',
        name: '红票'
      }
      ],
      previewVisible: false,
      previewImage: '',
      accompanyList: {
        param: {
          fileType: 2,
          uploadType: 1,
          correlationId: ''
        },
        fileList: []
      },
      isEmpty: true,
      imgList: [],
      titleData: {},
      tableData: [],
      sellerData: [],
      buyerData: [],
      turnOn: true,
      queryParam: {
        page: 1,
        size: 10
      },
      uploadStatus: true,
      uploadNumAdd: 0,
      saveStatus: false,
      selectData: {},
      cusList: [],
      addType: null,
      isDisabled: false,
      isPriceDis: false,
      invoiceStyle: 'pageTitle', // 三产发票明细title样式
    }
  },
  computed: {
    checkStyle() {
      if (this.detailsDataProp.verifyStatus === '03') {
        return 'iconcheckPass'
      } else if (this.detailsDataProp.verifyStatus === '02') {
        return 'iconCheckUnpass'
      } else if (this.detailsDataProp.verifyStatus === '01') {
        if (this.detailsDataProp.verifyErrCode === '1108') {
          return 'iconNationTax'
        }
        return 'iconCheckAbnormal'
      }
    },
    headerUpload() {
      return {
        Authorization: 'Bearer ' + this.$store.state.user.token
      }
    }
  },
  created() {
    console.log('detailsDataProp====', this.detailsDataProp)
    if (this.detailsDataProp.verifyErrCode === '1008') {
      this.errMsg = '查验结果不一致。请检查发票信息是否正确，修改后进行验真'
    } else if (this.detailsDataProp.verifyErrCode === '1009') {
      this.errMsg = '开票日期超过一年。请检查发票信息是否正确，修改后进行验真'
    } else if (this.detailsDataProp.verifyErrCode === '1000') {
      this.errMsg = '发票已作废。请检查发票信息是否正确，修改后进行验真'
    } else if (this.detailsDataProp.verifyErrCode === '1007') {
      this.errMsg = '发票日期为当天。请48h后可查看验真结果'
    } else if (this.detailsDataProp.verifyErrCode === '1010') {
      this.errMsg = '超过该张票当天查验次数，请隔天查看验真结果'
    } else if (this.detailsDataProp.verifyErrCode === '1108') {
      this.errMsg = '查验异常。个别地区税务数据在维护，请隔天查看验真结果'
    } else if (this.detailsDataProp.verifyErrCode === '1004') {
      this.errMsg = '发票不存在'
    } else if (this.detailsDataProp.verifyErrCode === '0000') {
      this.errMsg = '查验通过'
    } else {
      this.errMsg = this.detailsDataProp.verifyErrMsg || '系统异常，请稍后查看验真结果'
    }
    if (this.detailsDataProp.verifyStatus !== '05') {
      this.columns.push({
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        width: '100px',
        scopedSlots: {
          customRender: 'operation'
        }
      })
    }
    const addType = JSON.parse(window.localStorage.getItem('EstateInfo'))
    this.addType = addType.addType
    // console.info('addType====', addType)
    if (addType.addType !== null) {
      this.uploadData.fileType = 11
      this.accompanyList.param.fileType = 12
      this.invoiceStyle = 'pageTitle estateTitle'
      this.titleData.addType = addType.addType
      this.$forceUpdate()
    }
    this.detailsData()
  },
  methods: {
    moment,
    invoiceStatus(item) {
      // 发票状态切换
      if (item.inStatus === '2') {
        this.titleData.negative = true
        this.tableNegative = true
      } else {
        this.titleData.negative = false
        this.tableNegative = false
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    changeNonePrice(record) {
      // 单价改变
      record.changeStatusNonePrice = true
    },
    blurNonePrice(record) {
      // 修改单价
      if (record.changeStatusNonePrice) {
        record.changeStatusNonePrice = false
        if (record.nonePrice < 0 || isNaN(record.nonePrice)) {
          this.$notification['error']({
            message: '保存失败',
            description: '单价格式错误',
            duration: 4
          })
          return false
        }

        const index = record.nonePrice.indexOf('.')
        if (index !== -1) {
          const str = record.nonePrice.substring(
            index + 1,
            record.nonePrice.length
          )
          if (str.length > 7) {
            record.nonePrice = parseFloat(record.nonePrice).toFixed(7)
          }
        }
        const param = {
          id: record.id,
          nonePrice: record.nonePrice
        }
        if (this.addType === null) {
          invoiceDetailUpdate(param).then(res => {
            this.updatePro(res)
          })
        } else {
          EstateProUpdate(param).then(res => {
            this.updatePro(res)
          })
        }
        // invoiceDetailUpdate(param).then(res => {
        //   if (res.code === 200) {
        //     this.$notification['success']({
        //       message: '提示',
        //       description: '修改成功',
        //       duration: 4
        //     })
        //   }
        // })
      }
    },
    changeQty(record) {
      // 数量改变
      record.changeStatusQty = true
    },
    blurQty(record) {
      // console.info('this.tableData=====', this.tableData)
      // 修改数量
      if (record.changeStatusQty) {
        record.changeStatusQty = false
        const param = {
          id: record.id,
          qty: record.newQty
        }
        if (!/^\d+$/.test(record.newQty)) {
          if (record.newQty < 0 || isNaN(record.newQty)) {
            this.$notification['error']({
              message: '保存失败',
              description: '数量格式错误',
              duration: 4
            })
          } else {
            this.$notification['error']({
              message: '保存失败',
              description: '数量不能为空',
              duration: 4
            })
          }
          this.detailsData()
          return false
        }
        if (record.newQty === 0) {
          this.tableNegative = false
        } else if (this.titleDataEdit.inStatus === '1') {
          this.tableNegative = false
        } else {
          this.tableNegative = true
        }
        if (this.addType === null) {
          invoiceDetailUpdate(param).then(res => {
            this.updatePro(res)
          })
        } else {
          EstateProUpdate(param).then(res => {
            this.updatePro(res)
          })
        }
      }
    },
    updatePro(res) {
      if (res.code === 200) {
        this.$notification['success']({
          message: '提示',
          description: '修改成功',
          duration: 4
        })
        this.detailsData()
      } else {
        this.$notification['error']({
          message: '提示',
          description: res.message,
          duration: 4
        })
        this.detailsData()
      }
    },
    disabledDate(current) {
      // 不可选日期
      return current && current > moment().endOf('day')
    },
    onSearchClose() {
      // 关闭手动添加
      this.isShowSearch = false
    },
    invoiceTypeChange() {
      // 发票类型切换
      //   const verifyCode=this.titleData.verifyCode;
      if (
        this.titleDataEdit.inType === '04' ||
                this.titleDataEdit.inType === '10'
      ) {
        //   this.titleData.verifyCode=verifyCode;
        this.titleData.verifyCodeShow = true
      } else {
        this.titleData.verifyCode = undefined
        this.titleData.verifyCodeShow = false
      }
    },
    beforeUploadSui(file, fileList) {
      // 随行单上传前回调
      const num = 9 - this.accompanyList.fileList.length
      this.uploadStatus = true
      if (fileList.length > num) {
        this.uploadNumAdd++
      }
      if (this.uploadNumAdd === fileList.length && fileList.length > num) {
        this.$notification['error']({
          message: '上传失败',
          description: '上传文件总数量不能大于9！',
          duration: 4
        })
      }
      if (fileList.length > num) {
        this.uploadStatus = false
        return false
      }
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
    handleTableChange(pagination) {
      // 表格翻页
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.queryParam.page = pagination.current
      this.queryParam.size = pagination.pageSize
      this.detailsData()
    },
    uploadChangeTitle({
      file,
      fileList
    }) {
      // title上传
      if (file.status === 'done') {
        if (file.response.code === 500) {
          this.$notification['error']({
            message: '上传失败',
            description: file.response.message,
            duration: 4
          })
        } else if (file.response.code === 200) {
          // console.info('file.response====', file.response)
          this.$notification['success']({
            message: '提示',
            description: '上传成功',
            duration: 4
          })
          this.titleData.imgId = file.response.data.id
          this.titleData.fileUrl = file.response.data.fileUrl
          this.titleData.imgShow = true
          this.$forceUpdate()
        }
      }
    },
    titleImgClose() {
      // 关闭title图片
      this.previewVisibleTitle = false
    },
    viewImgShow() {
      // 查看title图片
      this.previewVisibleTitle = true
    },
    getInvoiceSeller() {
      // 获取销货方数据
      invoiceSeller().then(res => {
        this.sellerData = res.data
        const param = {
          code: this.titleData.distCode,
          type: this.titleData.distType
        }
        this.getBuyerData(param)
      })
    },
    sellerChange(value, option) {
      // 选择销货方
      const param = {
        code: value,
        type: option.data.attrs.type
      }
      this.titleData.cusCode = undefined
      this.titleData.cusName = ''
      this.getBuyerData(param)
    },
    handleAuth() {
      this.titleData.cusCode = undefined
      this.titleData.cusName = ''
      this.$forceUpdate()
    },
    handleChangeCus() {
      const seleCus = this.titleData.cusCode
      // console.info('this.cusList====',this.cusList)
      this.cusList.forEach(item => {
        if (item.code === seleCus) {
          this.titleData.cusName = item.name
        }
      })
    },
    // 选择购货方弹框
    handleSelectCus() {
      if (this.titleData.distCode) {
        this.selectShow = true
        this.selectData = {
          distCode: this.titleData.distCode,
          cusKey: 0,
          cusCode: this.titleData.cusCode,
          cusName: this.titleData.cusName
        }
      } else {
        this.$notification['error']({
          message: '提示',
          description: '请先选择销货方！',
          duration: 4
        })
      }
    },
    handleSelectOk(subVal) {
      this.titleData.cusCode = subVal.cusCode
      this.titleData.cusName = subVal.cusName
      this.selectShow = false
    },
    handleSelectCancle() {
      this.selectShow = false
    },
    getBuyerData(param) {
      // 获取购货方数据
      invoiceBuyer(param).then(res => {
        this.cusList = res.data
        this.buyerData = res.data
        this.$forceUpdate()
      })
    },
    handleDelete(record) {
      // 发票产品删除
      const param = {
        id: record.id
      }
      if (this.addType === null) {
        invoiceDetailDelete(param).then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '提示',
              description: '删除成功',
              duration: 4
            })
            this.detailsData()
          } else {
            this.$notification['error']({
              message: '提示',
              description: res.message || '删除失败',
              duration: 4
            })
          }
        })
      } else {
        EstateProDelete(param).then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '提示',
              description: '删除成功',
              duration: 4
            })
            this.detailsData()
          } else {
            this.$notification['error']({
              message: '提示',
              description: res.message || '删除失败',
              duration: 4
            })
          }
        })
      }
    },
    addProductCancel() {
      // 取消添加产品
      this.invoiceDetailsAdd.productAdd = []
    },
    addProductOK() {
      // 确认添加产品
      if (this.invoiceDetailsAdd.productAdd.length < 1) {
        this.invoiceDetailsAdd.invoiceDetailsAdd = false
        return false
      }
      const param = {
        invoiceId: this.titleData.id,
        list: this.invoiceDetailsAdd.productAdd
      }
      // console.info('param===', param)
      if (this.addType === null) {
        invoiceDetailAdd(param).then(res => {
          this.setProAdd(res)
        })
      } else {
        EstateProAdd(param).then(res => {
          this.setProAdd(res)
        })
      }
    },
    setProAdd(res) {
      if (res.code === 200) {
        this.$notification['success']({
          message: '提示',
          description: '添加成功',
          duration: 4
        })
        this.invoiceDetailsAdd.productAdd = []
        this.detailsData()
      } else {
        this.$notification['error']({
          message: '提示',
          description: res.message,
          duration: 4
        })
      }
      this.invoiceDetailsAdd.invoiceDetailsAdd = false
      this.isShowSearch = false
    },
    selectedDataManual(data) {
      // 手动添加
      this.invoiceDetailsAdd.productAdd = data
      this.addProductOK()
    },
    selectedData(data) {
      // 添加产品
      this.invoiceDetailsAdd.productAdd = data
    },
    accordCode() {
      // 单号添加详情
      this.invoiceDetailsAdd.invoiceDetailsAdd = true
      this.invoiceDetailsAdd.invoiceDetailsAddType = 'accordCode'
      this.invoiceDetailsAdd.title = '根据单号'
    },
    manualSearch() {
      // 手动添加详情
      this.isShowSearch = true
      // this.invoiceDetailsAdd.invoiceDetailsAdd = true;
      this.invoiceDetailsAdd.invoiceDetailsAddType = 'manual'
      this.invoiceDetailsAdd.title = '手动选择'
    },
    isEmptyData(str) {
      // 验证是否为空
      if (str === null || str === undefined || str === '') {
        return true
      }
      return false
    },
    handleSave() {
      // 保存数据
      if (!this.editShow) {
        return false
      }
      if (this.saveStatus) {
        this.$notification['error']({
          message: '提示',
          description: '正在保存中，请稍后...',
          duration: 4
        })
        return false
      }
      this.saveStatus = true
      // console.log(this.titleData);
      const currentData = this.titleData
      if (
        this.isEmptyData(currentData.inCode) ||
                this.isEmptyData(currentData.inNo) ||
                this.isEmptyData(this.titleDataEdit.timeSelect) ||
                this.isEmptyData(currentData.distCode) ||
                this.addType === null && this.isEmptyData(currentData.cusCode) ||
                this.isEmptyData(currentData.noneTaxTotal) ||
                this.addType !== null && this.isEmptyData(currentData.distribution)
      ) {
        this.$notification['error']({
          message: '提示',
          description: '必填信息不能为空！',
          duration: 4
        })
        this.saveStatus = false
        return false
      }
      if (
        this.titleDataEdit.inType === '04' ||
                this.titleDataEdit.inType === '10'
      ) {
        if (this.isEmptyData(currentData.verifyCode)) {
          this.$notification['error']({
            message: '提示',
            description: '必填信息不能为空！',
            duration: 4
          })
          this.saveStatus = false
          return false
        }
      }

      if (currentData.inCode.length > 20) {
        this.$notification['error']({
          message: '提示',
          description: '发票代码长度不能超过20！',
          duration: 4
        })
        this.saveStatus = false
        return false
      }
      if (!this.isEmptyData(currentData.inRemark)) {
        if (currentData.inRemark.length > 200) {
          this.$notification['error']({
            message: '提示',
            description: '备注长度不能超过200！',
            duration: 4
          })
          this.saveStatus = false
          return false
        }
      }
      const re = /^(\d+)(.\d{0,2})?$/
      if (isNaN(currentData.noneTaxTotal) || currentData.noneTaxTotal < 0) {
        // console.log(currentData.noneTaxTotal)
        this.$notification['error']({
          message: '提示',
          description: '不含税金额格式不正确！',
          duration: 4
        })
        this.saveStatus = false
        return false
      } else if (currentData.noneTaxTotal.length > 20) {
        this.$notification['error']({
          message: '提示',
          description: '不含税金额长度不能超过20！',
          duration: 4
        })
        this.saveStatus = false
        return false
      } else if (!re.test(currentData.noneTaxTotal)) {
        this.$notification['error']({
          message: '提示',
          description: '不含税金额最多保留小数点后两位！',
          duration: 4
        })
        this.saveStatus = false
        return false
      }
      // 判断是否有改动
      //   console.log("==", this.keepList.inDate, this.titleDataEdit.timeSelect);
      // if (
      //   this.keepList.inType !== this.titleDataEdit.inType ||
      //   this.keepList.inCode !== currentData.inCode ||
      //   this.keepList.inNo !== currentData.inNo ||
      //   this.keepList.inDate !== this.titleDataEdit.timeSelect ||
      //   this.keepList.noneTaxTotal !== currentData.noneTaxTotal ||
      //   this.keepList.verifyCode !== currentData.verifyCode
      // ) {
      //   this.titleData.reportType = 3
      // }
      // console.info('currentData====', this.detailsDataProp)
      const param = {
        invoice: {
          ...currentData,
          inType: this.titleDataEdit.inType,
          inDate: moment(this.titleDataEdit.timeSelect).format('YYYY-MM-DD'),
          inStatus: this.titleDataEdit.inStatus,
          invoiceType: this.detailsDataProp.invoiceType
        },
        picId: currentData.imgId
      }
      delete currentData.reportType
      if (this.addType === null) {
        param.invoice.cusCode = currentData.cusCode
        param.invoice.cusName = currentData.cusName
        param.invoice.cusType = currentData.cusType
        invoiceUpdate(param).then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '提示',
              description: '保存成功！',
              duration: 4
            })
            this.detailsData()
            this.editShow = false
            this.saveStatus = false
          } else {
            this.$notification['error']({
              message: '提示',
              description: res.message || '保存失败！',
              duration: 4
            })
            this.detailsData()
            this.editShow = false
            this.saveStatus = true
          }
        })
      } else {
        param.invoice.distribution = currentData.distribution
        EstateUpdate(param).then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '提示',
              description: '保存成功！',
              duration: 4
            })
            this.detailsData()
            this.editShow = false
            this.saveStatus = false
          } else {
            this.$notification['error']({
              message: '提示',
              description: res.message || '保存失败！',
              duration: 4
            })
            this.detailsData()
            this.editShow = false
            this.saveStatus = true
          }
        })
      }
      // console.info('param====',param)
    },
    detailsData() {
      // 获取详情信息
      const param = {
        invoice: {
          id: this.detailsDataProp.invoiceId
        },
        invoiceProducts: {
          pageNum: this.queryParam.page,
          pageSize: this.queryParam.size
        }
      }
      if (this.addType !== null) {
        EstateDetail(param).then(res => {
          this.getDetail(res)
        })
      } else {
        invoiceDetail(param).then(res => {
          this.getDetail(res)
        })
      }
    },
    getDetail(res) {
      this.titleData = {
        ...this.titleData,
        ...res.data.invoice
      }
      this.isEdit = res.data.editable !== '0'
      // console.info('res.data.invoice====', res.data.invoice)
      if (res.data.invoiceFileList !== null && res.data.invoiceFileList.length > 0) {
        this.titleData.imgId = (res.data.invoiceFileList.length > 0) ? res.data.invoiceFileList[0].id : null
        this.titleData.fileUrl = (res.data.invoiceFileList.length > 0) ? res.data.invoiceFileList[0].fileUrl : null
        this.titleData.imgShow = true
      } else {
        this.titleData.imgShow = false
      }
      if (res.data.invoice.inStatus === '1' || res.data.invoice.noneTaxTotal === 0) {
        this.titleData.negative = false
      } else {
        this.titleData.negative = true
      }
      if (res.data.invoice.inStatus === '1') {
        this.tableNegative = false
      } else {
        this.tableNegative = true
      }
      if (res.data.invoice.hosAuthFlag === '2') {
        this.titleData.authorize = 'hasNo'
      } else {
        this.titleData.authorize = 'has'
      }

      this.accompanyList.param.correlationId = this.titleData.id
      this.uploadData.correlationId = this.titleData.id
      this.accompanyList.fileList = []
      if (res.data.accompanyFileList !== null && res.data.accompanyFileList !== '') {
        this.accompanyList.accompanyShow = true
        const currentList = res.data.accompanyFileList
        for (let i = 0; i < currentList.length; i++) {
          this.accompanyList.fileList.push({
            uid: currentList[i].id,
            id: currentList[i].id,
            name: currentList[i].fileName,
            status: 'done',
            url: currentList[i].fileUrl
          })
        }
      } else {
        this.accompanyList.accompanyShow = false
      }
      this.titleDataEdit = {
        ...this.titleDataEdit,
        timeSelect: moment(this.titleData.inDate),
        inStatus: this.titleData.inStatus,
        inType: this.titleData.inType
      }
      // 五要素是否可编辑
      // console.info('this.titleData====', this.titleData)
      if (this.titleData.reportType === '1' || this.detailsDataProp.verifyStatus === '03' || this.detailsDataProp.verifyErrCode === '1108') {
        this.isDisabled = true
        if (this.titleData.inType === '01') {
          this.isPriceDis = true
        }
      } else {
        this.isDisabled = false
      }
      this.getInType(this.titleData.inType)
      this.titleData.inStatus = this.titleData.inStatus === '1' ? '蓝票' : '红票'
      this.tableData = res.data.invoiceProducts.list
      const pagination = {
        ...this.pagination
      }
      pagination.total = res.data.invoiceProducts.total
      this.pagination = pagination
      if (this.tableData.length < 1) {
        this.isEmpty = true
      } else {
        this.isEmpty = false
        for (let i = 0; i < this.tableData.length; i++) {
          if (
            this.tableData[i].qty === null ||
                        this.tableData[i].qty === ''
          ) {
            this.tableData[i].qty = 1
          }
          if (
            this.tableData[i].nonePrice === null ||
                        this.tableData[i].nonePrice === ''
          ) {
            this.tableData[i].nonePrice = 0
          }
        }
        this.tableData = this.tableData.map(item => {
          return {
            ...item,
            newQty: item.qty
          }
        })
      }

      this.keepList = JSON.parse(JSON.stringify(this.titleData))
      this.changeKeepType(this.keepList.inType)
      this.getInvoiceSeller()
    },
    getInType(intyppe) {
      switch (intyppe) {
        case '01':
          this.titleData.inType = '增值税专用发票'
          this.titleData.verifyCodeShow = false
          break
        case '04':
          this.titleData.inType = '增值税普通发票'
          this.titleData.verifyCodeShow = true
          break
        case '10':
          this.titleData.inType = '增值税普通发票（电子）'
          this.titleData.verifyCodeShow = true
          break
        case '97':
          this.titleData.inType = '机打发票'
          this.titleData.verifyCodeShow = true
          break
        case '98':
          this.titleData.inType = '冠名票'
          this.titleData.verifyCodeShow = true
          break
        case '99':
          this.titleData.inType = '手术植入单'
          this.titleData.verifyCodeShow = true
          break
      }
    },
    changeKeepType(keepType) {
      switch (keepType) {
        case '增值税专用发票':
          this.keepList.inType = '01'
          break
        case '增值税普通发票':
          this.keepList.inType = '04'
          break
        case '增值税普通发票（电子）':
          this.keepList.inType = '10'
          break
        case '机打发票':
          this.keepList.inType = '97'
          break
        case '冠名票':
          this.keepList.inType = '98'
          break
        case '手术植入单':
          this.keepList.inType = '99'
          break
      }
    },
    uploadCancel() {
      // 取消
      this.previewVisible = false
    },
    uploadPreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    uploadChange({
      file,
      fileList
    }) {
      if (
        fileList.length ===
                this.uploadNumAdd + this.accompanyList.fileList.length &&
                !this.uploadStatus
      ) {
        this.uploadNumAdd = 0
      }
      if (fileList.length !== 0) {
        for (let i = fileList.length - 1; i >= 0; i--) {
          const size = fileList[i].size / 1024 / 1024
          if (size > 5) {
            fileList.splice(i, 1)
          }
          if (!fileList[i].status) {
            fileList.splice(i, 1)
          }
        }
      }
      if (file.status === 'removed') {
        if (file.id) {
          const param = {
            id: file.id
          }
          deleteImg(param).then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: '提示',
                description: '删除成功！',
                duration: 4
              })
            }
          })
        }
      }
      if (fileList.length > 0) {
        for (let i = fileList.length - 1; i >= 0; i--) {
          if (fileList[i].status === 'error') {
            this.$notification['error']({
              message: fileList[i].name + '上传失败',
              description: '网络错误',
              duration: 4
            })
            fileList.splice(i, 1)
          }
        }
      }
      this.accompanyList.fileList = fileList
      const currentList = this.accompanyList.fileList
      if (currentList.length > 0) {
        const index = currentList.length - 1
        for (let k = index; k >= 0; k--) {
          if (currentList[k].status === 'done') {
            if (
              currentList[k].response &&
                            currentList[k].response.code !== 200
            ) {
              this.$notification['error']({
                message: currentList[k].name + '上传失败',
                description: currentList[k].response.message,
                duration: 4
              })
              currentList.splice(k, 1)
            } else if (
              currentList[k].response &&
                            currentList[k].response.code === 200
            ) {
              currentList[k].uid = currentList[k].response.data.id
              currentList[k].id = currentList[k].response.data.id
              currentList[k].url = currentList[k].response.data.fileUrl
            }
          }
        }
      }
      if (this.accompanyList.fileList.length < 1) {
        this.accompanyList.accompanyShow = false
      } else if (this.accompanyList.fileList.length > 0) {
        this.accompanyList.accompanyShow = true
      }
    },
    turnonClick() {
      // 收缩展开
      this.turnOn = !this.turnOn
    },
    editTitleData() {
      this.editShow = true
    },
    handleBack() {
      // 返回
      this.$emit('details', 'index')
    }
  }
}
</script>

<style lang="less" scoped>
.iconCheck {
    position: absolute;
    display: inline-block;
    right: 8px;
    // top: 215px;
    bottom: -17px;

    .check {
        font-size: 66px;
        opacity: 0.7;
    }

    .iconCheckUnpass {
        color: #e17877;
    }

    .iconcheckPass {
        color: #60c697;
    }

    .iconCheckAbnormal {
        color: #fbc773;
    }

    .iconNationTax {
        color: #e17877;
    }
}

.iconCheck:hover {
    .check {
        opacity: 1;
    }
}

.ant-input-affix-wrapper .ant-input:not(:first-child) {
    background: white;
}

.ant-select-disabled {
    .ant-select-selection {
        background-color: #f5f5f5 !important;
        opacity: 1;
        cursor: not-allowed;
        color: rgba(0, 0, 0, 0.25);
    }
}

.ant-input-disabled {
    background-color: #f5f5f5 !important;
    opacity: 1;
    cursor: not-allowed;
    color: rgba(0, 0, 0, 0.25);
}

.borderRadiusRight {
    border-radius: 0 8px 0 0;
}

.borderRadiusLeft {
    border-radius: 0 0 0 8px;
}

.detailsProduct {
    position: relative;

    span {
        position: absolute;
        left: 4px;
        z-index: 99;
    }
}

/*模态框按钮*/
.imgModal {
    .anticon-close {
        color: #000 !important;
        border: none !important;
    }
}

/*产品列表*/
.productDetails {
    .ant-table-body {
        td {
            .icon-inputSub {
                cursor: pointer;
            }
        }
    }

    .icon-tableMore {
        &hover {
            color: #3e4da8 !important;
        }
    }
}

/*随行单*/
.accompanyList {
    .accompanyTitle {
        line-height: 52px;
        background: #f9f9f9;
        text-align: center;
        border-radius: 8px 8px 0px 0px;
        color: #939393;
        position: relative;
        border: 1px solid #efefef;

        .tip {
            position: absolute;
            left: 20px;
        }
    }

    .accompanyUpload {
        border: 1px solid #efefef;
        border-top: none;
        padding: 10px;

        .iconfont {
            font-size: 20px;
        }

        .ant-upload {
            &:hover {
                color: #3e4de8;
            }
        }

        .ant-upload-list {
            width: 100%;
        }

        .ant-upload-list-item {
            padding: 0;
        }
    }
}

/*收缩展开*/
.pageTitle {
    &.estateTitle {
        padding: 0 32px;
        margin: 0;

        .turnon {
            padding: 4px 14px;
        }

        .pageTitle-Btn {
            position: absolute;
            top: -60px;
            right: 24px;
        }
    }

    .detailsTitle {
        float: left;
    }

    .turnon {
        float: left;
        margin-left: 40px;
        font-size: 12px;
        color: #939393;
        cursor: pointer;
        background: #fcfcfc;
        border-radius: 20px;
        padding: 8px 14px;

        &:hover {
            color: #3e4da8;
        }

        .iconfont {
            margin-left: 10px;
            font-size: 10px;
        }
    }
}

/*表格样式*/
.tableTitle {
    margin-top: 20px;
    height: 52px;
    line-height: 52px;
    text-align: center;
    border: 1px solid #efefef;
    border-radius: 8px 8px 0 0;
    border-bottom: none;
    background: #f9f9f9;
    color: #939393;
}

/*无发票列表*/
.addDeatils {
    width: 100%;
    padding: 60px 160px;
    text-align: center;

    h4 {
        font-size: 14px;
        color: #939393;
        padding: 0 0 40px 0;
    }

    .scanInfo {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;

        .scanBor {
            width: 1px;
            height: 100%;
            min-height: 80px;
            display: inline-block;
            background: rgba(236, 236, 236, 1);
        }

        .scanListAudit {
            //   position: relative;
            padding: 12px 40px 12px 94px;
            cursor: pointer;
            box-shadow: none;
            margin-top: 0;

            .scanIcon {
                position: absolute;
                left: 18px;
                top: 12px;
                width: 50px;
                height: 50px;
                border-radius: 25px;
                background: white;
                border: 2px solid rgba(62, 77, 168, 1);
                line-height: 46px;
                justify-content: center;
                align-items: center;
                display: flex;

                .iconfont {
                    color: rgba(251, 199, 115, 1);
                    font-size: 30px;
                }
            }

            &:hover {
                background: rgba(251, 251, 251, 1);
            }

            .scanMain {
                text-align: left;
                width: 100%;

                h3 {
                    font-size: 18px;
                    color: rgba(62, 77, 168, 1);
                }

                p {
                    color: rgba(147, 147, 147, 1);
                    font-size: 14px;
                    margin: 0;
                }
            }
        }
    }
}

/*发票信息*/
.scanListAudit {
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

    .ant-tooltip-placement-top {
        top: 216.8px;
    }

    margin-top: 20px;
    padding: 30px 20px;
    box-shadow: 0px 5px 20px rgba(227, 227, 238, 1);
    border-radius: 8px;
    position: relative;

    .invoiceDelete {
        position: absolute;
        right: 20px;
        top: 10px;
        cursor: pointer;

        .iconfont {
            font-size: 24px;
            color: #cfcfcf;
            line-height: 1;

            &:hover {
                color: #3e4da8;
            }
        }
    }

    .scanListTitle {
        .code {
            margin-left: 10px;
            white-space: nowrap;

            span {
                font-size: 12px;
                color: #939393;
                line-height: 17px;
                position: relative;
                top: -2px;
                margin-right: 10px;
            }

            b {
                font-size: 18px;
                line-height: 33px;
                color: #939393;
            }
        }

        .checkCode {
            margin-left: 10px;
            white-space: nowrap;

            span {
                font-size: 14px;
                color: #3e4da8;
                line-height: 17px;
                margin-right: 10px;
            }

            b {
                font-size: 14px;
                line-height: 33px;
                color: #3e4da8;
            }
        }

        .invoiceLine {
            width: 100%;
            margin-top: 15px;

            div {
                width: 100%;
                height: 1px;
                background: #efefef;
                margin: 4px 0;
            }
        }

        .invoiceType {
            text-align: center;

            h3 {
                color: #3e4da8;
                font-size: 18px;
                font-weight: bold;
                position: relative;
                top: -12px;
                margin-bottom: 0;
            }

            p {
                color: #939393;
                font-size: 14px;
                position: relative;
                top: -10px;
            }
        }
    }
}

/*详情基本信息*/
.invoiceTableManual {
    /*margin-left: 10px;*/
    border: 1px solid #e9e9e9;
    border-right: none;
    border-bottom: none;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    background: #fbfbfb;
    line-height: 56px;
    position: relative;

    .errorInvoice {
        position: absolute;
        right: 150px;
        bottom: 12px;
        line-height: 28px;
        padding: 0 10px;
        color: #f00;
        font-size: 24px;
    }

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

    :global {
        .ant-row {
            margin: 0 !important;
        }

        .ant-col-8 {
            padding: 0 !important;
        }
    }

    .tablecell {
        &>div {
            border-right: 1px solid #e9e9e9;
            border-bottom: 1px solid #e9e9e9;
        }

        .leftcell {
            text-align: right;
            padding: 0 12px;
            font-size: 13px;
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
            padding: 0 12px;
            font-size: 13px;
            line-height: 57px;
            height: 57px;

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

.invoiceTable {
    margin-left: 10px;
    border: 1px solid #e9e9e9;
    border-right: none;
    border-bottom: none;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    background: #fbfbfb;
    line-height: 56px;
    height: auto;

    .tablecell {
        div {
            border: none;
        }

        .leftcell {
            text-align: right;
            padding: 0 12px;
            font-size: 13px;
            color: #34353e;
            border-right: 1px solid #e9e9e9;
            border-bottom: 1px solid #e9e9e9;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .rightcell {
            text-align: left;
            padding: 0 12px;
            height: 57px;
            font-size: 13px;
            line-height: 57px;
            border-right: 1px solid #e9e9e9;
            border-bottom: 1px solid #e9e9e9;
            white-space: nowrap;
            text-overflow: ellipsis;

            .viewImg {
                cursor: pointer;

                &:hover {
                    color: #3e4da8;
                }
            }
        }
    }
}

.emptyScan {
    width: 190px;
    text-align: center;
    margin: 150px auto;

    .iconfont {
        font-size: 105px;
        color: #ececec;
    }

    h5 {
        font-size: 16px;
        font-weight: bold;
        line-height: 22px;
        color: #939393;
    }

    p {
        font-size: 14px;
        line-height: 20px;
        color: #b1b1b1;
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

.ant-table {
    td {
        .icon-success {
            font-size: 18px;
        }

        .ant-input-affix-wrapper {
            width: auto;
        }
    }
}

.basicInfo {
    .viewImg {
        cursor: pointer;
        margin-right: 20px;

        .ant-select-selection {
            max-width: 260px;
        }

        &:hover {
            color: #3e4da8;
        }
    }
}

.tableProduct {
    :global {
        .ant-table {
            table {
                border-top-left-radius: 0 !important;
                border-top-right-radius: 0 !important;
            }
        }
    }
}

.auditOper {
    .ant-popover-inner .ant-popover-inner-content {

        /*padding: 12px;*/
        a {
            padding: 0 0 0 32px;
            width: 100%;
            display: inline-block;
            color: #939393;

            .iconfont {
                padding: 0 12px 0 0;
            }

            &:hover {
                background: rgba(246, 246, 248, 1);
                color: rgba(21, 58, 175, 1);

                .iconfont {
                    color: rgba(21, 58, 175, 1);
                }
            }
        }
    }
}

/* 搜索样式 */
.searchWrap {
    .ant-select-selection--multiple {
        .ant-select-selection__rendered {
            ul {
                li {
                    margin-top: 10px;
                }
            }
        }
    }

    .ant-drawer-content-wrapper {
        background: rgba(251, 251, 251, 1);
        box-shadow: -3px 0px 6px rgba(0, 4, 123, 0.2);

        .ant-drawer-content {
            background: rgba(251, 251, 251, 1);

            .ant-drawer-header {
                border: none;
                background: rgba(251, 251, 251, 1);
                font-size: 14px;
            }

            .ant-drawer-close {
                .anticon {
                    color: rgba(148, 148, 148, 1);

                    &:hover {
                        color: rgba(62, 77, 168, 1);
                    }
                }
            }

            .ant-drawer-body {
                padding: 0 24px 24px 24px;
                height: calc(100% - 54px);

                /*overflow-y: auto;*/
                .searchList {
                    padding: 0 0 40px 0;

                    .ant-calendar-picker {
                        width: 100%;
                        max-width: none;
                    }

                    label {
                        color: rgba(147, 147, 147, 1);
                        font-size: 14px;
                        line-height: 20px;
                        margin: 0 0 8px 0;
                        width: 100%;
                        display: block;
                    }

                    .ant-input {
                        border: 1px solid rgba(233, 233, 233, 1);
                        border-radius: 4px;
                        background: white;
                        height: 44px;
                        line-height: inherit;
                    }

                    .ant-input-disabled {
                        cursor: pointer;
                    }

                    .ant-calendar-range-picker-separator {
                        vertical-align: inherit;
                    }

                    .ant-form-item-control-wrapper {
                        width: 100%;
                    }
                }

                .ant-form {
                    height: 100%;
                    padding: 0 0 60px 0;

                    .searchWrap {
                        height: 100%;
                        overflow-y: auto;

                        .ant-form-item {
                            width: 100%;
                            margin-right: 0;
                        }

                        .ant-select-selection {
                            background: #fff !important;
                            border: 1px solid #ececec !important;

                            .ant-select-selection__placeholder {
                                // color: #bfbfbf;
                            }
                        }

                        .ant-select-selection--single {
                            height: 42px;
                            width: 100%;
                        }

                        .ant-select-selection__rendered {
                            line-height: 42px;
                        }

                        .ant-select-dropdown-menu-item-active {
                            background-color: #e6f7ff !important;
                        }

                        .adInput-input {
                            .begin_date {
                                .anticon-calendar {
                                    color: #3e4da8;
                                }
                            }

                            .ant-form-item,
                            .ant-form-item-control-wrapper,
                            .ant-form-item-control {
                                width: 100%;
                            }

                            .ant-input {
                                width: 100%;
                                height: 44px;
                                background: rgba(252, 252, 252, 1);
                                border: 1px solid rgba(236, 236, 236, 1);
                                opacity: 1;
                                border-radius: 4px;
                            }

                            .ant-input-affix-wrapper .ant-input-suffix {
                                .icon-cancle {
                                    color: rgba(205, 223, 252, 1);
                                    font-size: 24px;
                                }
                            }
                        }
                    }

                    position: relative;

                    .table-page-search-submitButtons {
                        text-align: center;
                        width: 100%;
                        position: absolute;
                        bottom: 0;
                        left: 0;

                        .ant-btn {
                            width: 130px;
                            height: 44px;
                        }
                    }
                }
            }
        }
    }
}
</style>
