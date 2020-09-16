<template>
  <div>
    <div class="pageTitle">
      <a-row :gutter="24">
        <a-col :md="16" :sm="24">
          <h3>{{ SNtitle }}</h3>
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
            <span class="titleBtn" @click="handleSubmit">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>保存</span>
                </template>
                <i class="iconfont icon-save"></i>
              </a-tooltip>
            </span>
            <!-- <span class="titleBtn">
                        <a-tooltip placement="top">
                            <template slot="title">
                                <span>取消</span>
                            </template>
                            <i class="iconfont icon-cancle"></i>
                        </a-tooltip>
            </span>-->
          </div>
        </a-col>
      </a-row>
    </div>
    <a-form layout="inline" :form="form">
      <a-row :gutter="16" type="flex" justify="space-between" align="top">
        <a-col :md="8" :sm="12">
          <div class="proNewBorder">
            <div class="addInput" :class="[!orUpdata?'ban_update':'']">
              <div class="addInput-title">
                <small class="ban_small" v-if="!orUpdata">不可修改</small>
                <small v-else>*</small>
                <span>经销商名称</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    :disabled="!orUpdata"
                    v-decorator="['distName', { rules: [{ required: false, message: '输入经销商名称', whitespace: true }]}]"
                    placeholder="输入经销商名称"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput" :class="[!orUpdata?'ban_update':'']">
              <div class="addInput-title">
                <small class="ban_small" v-if="!orUpdata">不可修改</small>
                <small v-else>*</small>
                <span>经销商代码</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    :disabled="!orUpdata"
                    v-decorator="['distCode', { rules: [{ required: false, message: '请输入经销商代码！', whitespace: true }]}]"
                    placeholder="请输入经销商代码"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <!-- <small>*</small> -->
                <span>联系人</span>
              </div>
              <div class="adInput-input">
                <div style="margin-bottom: 16px">
                  <a-form-item style="width: 100%" has-feedback>
                    <a-input
                      v-decorator="['contacts', { rules: [{ required: false, message: '请输入联系人！', whitespace: true }]}]"
                      placeholder="请输入联系人"
                      style="width: 100%"
                    />
                  </a-form-item>
                </div>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <!-- <small>*</small> -->
                <span>联系电话</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['contactPhone', { rules: [{ required: false, message: '请输入正确联系方式！', whitespace: true,pattern:/^1[3|4|5|7|8][0-9]\d{8}$/ }]}]"
                    placeholder="请输入联系电话"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>

            <div class="addInput" :class="[!orUpdata?'ban_update':'']">
              <div class="addInput-title">
                <small class="ban_small" v-if="!orUpdata">不可修改</small>
                <small v-else>*</small>
                <span>所属地址</span>
              </div>
              <div class="adInput-input">
                <!-- <area-select
                  v-model="privinceData"
                  size="large"
                  @change="handleProvince"
                  :data="pca"
                  icon="icon-arrow-down "
                />-->
                <a-form-item style="width: 45%" has-feedback>
                  <a-input
                    :disabled="!orUpdata"
                    v-decorator="['province', { rules: [{ required: false, message: '输入所在省', whitespace: true }]}]"
                    placeholder="输入所在省"
                    style="width: 100%"
                  />
                </a-form-item>
                <a-form-item style="width: 45%;float:right;" has-feedback>
                  <a-input
                    :disabled="!orUpdata"
                    v-decorator="['city', { rules: [{ required: false, message: '输入所在城市', whitespace: true }]}]"
                    placeholder="输入所在城市"
                    style="width: 100%; "
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput" :class="[!orUpdata?'ban_update':'']">
              <div class="addInput-title">
                <small class="ban_small" v-if="!orUpdata">不可修改</small>
                <!-- <small v-else>*</small> -->
                <span>详细地址</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    :disabled="!orUpdata"
                    v-decorator="['address', { rules: [{ required: false, message: '请输入医院名称！', whitespace: true }]}]"
                    placeholder="请输入医院名称"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :md="8" :sm="12">
          <div class="proNewBorder">
            <div class="addInput">
              <div class="addInput-title">
                <!-- <small>*</small> -->
                <span>微信</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['contactWechat', { rules: [{ required: false, message: '请输入微信！', whitespace: true }]}]"
                    placeholder="请输入微信"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput" :class="[!orUpdata?'ban_update':'']">
              <div class="addInput-title">
                <small class="ban_small" v-if="!orUpdata">不可修改</small>
                <small v-else></small>
                <span>统一社会信用代码</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    :disabled="!orUpdata"
                    v-decorator="['creditCode', { rules: [{ required: false, message: '请输入统一社会信用代码！', whitespace: true }]}]"
                    placeholder="请输入统一社会信用代码"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <span>年度可置换污损金额</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['totalExchange', { rules: [{ required: false, message: '输入年度可置换污损金额', whitespace: true ,pattern:/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/}]}]"
                    placeholder="输入年度可置换污损金额"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <!-- <small>*</small> -->
                <span>地区</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <!-- <a-input
                    v-decorator="['regionName', { rules: [{ required: false, message: '输入地区', whitespace: true }]}]"
                    placeholder="输入地区"
                    style="width: 100%"
                  />-->
                  <a-select
                    v-decorator="['regionName', { rules: [{ required: false, message: '请选择医院所在地区', whitespace: true }]}]"
                    placeholder="请选择医院所在地区"
                    style="width: 100%"
                  >
                    <a-select-option
                      :value="item.dictCode"
                      v-for="(item,index) in hospitalArea"
                      :key="index"
                    >{{ item.dictName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <!-- <small>*</small> -->
                <span>联系人邮箱</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['contactEmail', { rules: [{ required: false, message: '请输入联系人正确邮箱！', whitespace: true ,pattern:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}]}]"
                    placeholder="请输入联系人邮箱"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <!-- <small>*</small> -->
                <span>备注信息</span>
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['remark', { rules: [{ required: false, message: '输入备注信息', whitespace: true }]}]"
                    placeholder="输入备注信息"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :md="8" :sm="12">
          <div class="proNewBorder">
            <div class="addInput">
              <div class="addInput-title">
                <small>*</small>
                <span>营业执照</span>
              </div>
              <div class="adInput-input">
                <template>
                  <div class="clearfix">
                    <a-upload
                      action="/amo/dist/picUpload"
                      listType="picture-card"
                      :fileList="fileList1"
                      @preview="handlePreview"
                      @change="handleChangePicture"
                      :headers="headerUpload"
                    >
                      <div v-if="fileList1.length < 1">
                        <i class="iconfont iconzu11"></i>
                        <div class="ant-upload-text">点击上传</div>
                      </div>
                    </a-upload>
                    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                      <img alt="example" style="width: 100%" :src="previewImage" />
                    </a-modal>
                  </div>
                </template>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <small>*</small>
                <span>二类备案凭证</span>
              </div>
              <div class="adInput-input">
                <template>
                  <div class="clearfix">
                    <a-upload
                      action="/amo/dist/picUpload"
                      listType="picture-card"
                      :fileList="fileList2"
                      @preview="handlePreview2"
                      @change="handleChangePicture2"
                      :headers="headerUpload"
                    >
                      <div v-if="fileList2.length < 1">
                        <i class="iconfont iconzu11"></i>
                        <div class="ant-upload-text">点击上传</div>
                      </div>
                    </a-upload>
                    <a-modal :visible="previewVisible2" :footer="null" @cancel="handleCancel2">
                      <img alt="example" style="width: 100%" :src="previewImage2" />
                    </a-modal>
                  </div>
                </template>
              </div>
            </div>
            <div class="addInput">
              <div class="addInput-title">
                <small>*</small>
                <span>经营资质</span>
              </div>
              <div class="adInput-input">
                <template>
                  <div class="clearfix">
                    <a-upload
                      action="/amo/dist/picUpload"
                      listType="picture-card"
                      :fileList="fileList3"
                      @preview="handlePreview3"
                      @change="handleChangePicture3"
                      :headers="headerUpload"
                    >
                      <div v-if="fileList3.length < 1">
                        <i class="iconfont iconzu11"></i>
                        <div class="ant-upload-text">点击上传</div>
                      </div>
                    </a-upload>
                    <a-modal :visible="previewVisible3" :footer="null" @cancel="handleCancel3">
                      <img alt="example" style="width: 100%" :src="previewImage3" />
                    </a-modal>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-form>
    <div class="operation_records">
      <template>
        <span class="operation_btn">修改历史</span>
        <div class="operation_vertical"></div>
        <a-steps direction="vertical" size="small" :current="1">
          <a-step
            status="wait"
            v-for="(item , index) in historyRecord"
            :key="index"
            :title="item.updateBy"
          >
            <span slot="description">
              <span
                style="margin-left:5px"
              >{{ moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
              <a
                href="javascript:;"
                style="margin-left:14px;fontSize:12px"
                @click="retriveHistory(item,index)"
              >查看记录</a>
            </span>
            <a-icon type="clock-circle" slot="icon" />
          </a-step>
        </a-steps>
        <a-button
          class="operation_btn"
          v-if="moreBtn"
          @click="historyList('more')"
          :loading="loading"
        >加载更多</a-button>
      </template>
    </div>
    <a-drawer
      title="查看修改"
      placement="right"
      @close="onSearchClose"
      :visible="isShowSearch"
      wrapClassName="searchWrap"
      width="340"
    >
      <div class="cotain_hitory">
        <div class="now_details">
          <label class="history_title">经销商名称</label>
          <p class="history_details">{{ this.nowTable.distName }}</p>
        </div>
        <div class="after_details" v-if="this.beforeTable.distName">
          <label class="after_title">修改前经销商名称</label>
          <p class="after_contain">{{ this.beforeTable.distName }}</p>
        </div>
        <div class="now_details">
          <label class="history_title">经销商代码</label>
          <p class="history_details">{{ this.nowTable.distCode }}</p>
        </div>
        <div class="after_details" v-if="this.beforeTable.distCode">
          <label class="after_title">修改前经销商代码</label>
          <p class="after_contain">{{ this.beforeTable.distCode }}</p>
        </div>
        <div class="now_details">
          <label class="history_title">联系人</label>
          <p class="history_details">{{ this.nowTable.contacts }}</p>
        </div>
        <div class="after_details" v-if="this.beforeTable.contacts">
          <label class="after_title">修改前联系人</label>
          <p class="after_contain">{{ this.beforeTable.contacts }}</p>
        </div>
        <div class="now_details">
          <label class="history_title">联系电话</label>
          <p class="history_details">{{ this.nowTable.contactPhone }}</p>
        </div>
        <div class="after_details" v-if="this.beforeTable.contactPhone">
          <label class="after_title">修改前联系电话</label>
          <p class="after_contain">{{ this.beforeTable.contactPhone }}</p>
        </div>
        <div class="now_details">
          <label class="history_title">微信</label>
          <p class="history_details">{{ this.nowTable.contactWechat }}</p>
        </div>
        <div class="after_details" v-if="this.beforeTable.contactWechat">
          <label class="after_title">修改前微信</label>
          <p class="after_contain">{{ this.beforeTable.contactWechat }}</p>
        </div>
        <div class="now_details">
          <label class="history_title">统一社会信用代码</label>
          <p class="history_details">{{ this.nowTable.credit_code }}</p>
        </div>
        <div class="after_details" v-if="this.beforeTable.credit_code">
          <label class="after_title">修改前统一社会信用代码</label>
          <p class="after_contain">{{ this.beforeTable.credit_code }}</p>
        </div>
        <div class="now_details">
          <label class="history_title">年度可置换污损金额</label>
          <p class="history_details">{{ this.nowTable.totalExchange }}</p>
        </div>
        <div class="after_details" v-if="this.beforeTable.totalExchange">
          <label class="after_title">修改前年度可置换污损金额</label>
          <p class="after_contain">{{ this.beforeTable.totalExchange }}</p>
        </div>
        <div class="now_details">
          <label class="history_title">地区</label>
          <p class="history_details">{{ this.nowTable.regionName }}</p>
        </div>
        <div class="after_details" v-if="this.beforeTable.regionName">
          <label class="after_title">修改前地区</label>
          <p class="after_contain">{{ this.beforeTable.regionName }}</p>
        </div>
        <div class="now_details">
          <label class="history_title">联系人邮箱</label>
          <p class="history_details">{{ this.nowTable.contactEmail }}</p>
        </div>
        <div class="after_details" v-if="this.beforeTable.contactEmail">
          <label class="after_title">修改前联系人邮箱</label>
          <p class="after_contain">{{ this.beforeTable.contactEmail }}</p>
        </div>
        <div class="now_details">
          <label class="history_title">备注信息</label>
          <p class="history_details">{{ this.nowTable.remark }}</p>
        </div>
        <div class="after_details" v-if="this.beforeTable.remark">
          <label class="after_title">修改前备注信息</label>
          <p class="after_contain">{{ this.beforeTable.remark }}</p>
        </div>
        <div class="now_details">
          <label class="history_title">营业执照</label>
          <p class="history_img">
            <img :src="this.nowTable.qualificationPic1" />
          </p>
        </div>
        <div class="after_details" v-if="this.beforeTable.qualificationPic1">
          <label class="after_title">修改前营业执照</label>
          <p class="after_img">
            <img :src="this.beforeTable.qualificationPic1" />
          </p>
        </div>
        <div class="now_details">
          <label class="history_title">二类备案凭证</label>
          <p class="history_img">
            <img :src="this.nowTable.qualificationPic2" />
          </p>
        </div>
        <div class="after_details" v-if="this.beforeTable.qualificationPic2">
          <label class="after_title">修改前二类备案凭证</label>
          <p class="after_img">
            <img :src="this.beforeTable.qualificationPic2" />
          </p>
        </div>
        <div class="now_details">
          <label class="history_title">经营资质</label>
          <p class="history_img">
            <img :src="this.nowTable.qualificationPic3" />
          </p>
        </div>
        <div class="after_details" v-if="this.beforeTable.qualificationPic3">
          <label class="after_title">修改前经营资质</label>
          <p class="after_img">
            <img :src="this.beforeTable.qualificationPic3" />
          </p>
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import moment from 'moment'
import {
  retriveHost,
  addDealersData,
  modifyRecordDealers,
  detailsHistory
} from '@/api/basicInfo/hosData'
import { AreaSelect } from 'vue-area-linkage'
import { pca, pcaa } from 'area-data'
import notification from 'ant-design-vue/es/notification'
export default {
  name: 'AddDealersHost',
  props: ['tableData'],
  privinceData: [],
  components: {
    AreaSelect
    // moment,
  },
  data() {
    return {
      addBtn: true,
      headerUpload: {
        Authorization: 'Bearer' + this.$store.state.user.token
      },
      isShowSearch: false,
      historyRecord: [],
      hospitalArea: [],
      orUpdata: true, // true可以修改 false时不可修改
      SNtitle: '',
      pca,
      pcaa,
      previewVisible: false,
      previewVisible2: false,
      previewVisible3: false,
      previewImage: '',
      previewImage2: '',
      previewImage3: '',
      fileList: [],
      fileList2: [],
      fileList3: [],
      fileList1: [], // 图片的信息
      upList1: [], // 图片的地址
      upList2: [], // 图片的地址
      upList3: [], // 图片的地址
      privinceData: [],
      nowTable: {},
      beforeTable: {},
      moreBtn: false,
      loading: false
    }
  },
  // 创建前的生命周期
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {
    this.getHostAllData()
  },
  mounted() {
    // 蚂蚁金服的验证规则
    if (this.tableData.id) {
      // 调用修改记录的接口

      this.historyList()
      this.orUpdata = false
      this.SNtitle = '修改经销商主数据'
      this.form.setFieldsValue({
        contacts: this.tableData.contacts,
        contactPhone: this.tableData.contactPhone,
        distCode: this.tableData.distCode,
        distName: this.tableData.distName,
        province: this.tableData.province,
        city: this.tableData.city,
        address: this.tableData.address,
        regionName: this.tableData.regionCode,
        contactEmail: this.tableData.contactEmail,
        contactWechat: this.tableData.contactWechat,
        creditCode: this.tableData.creditCodee,
        remark: this.tableData.remark,
        totalExchange: this.tableData.totalExchange
      })
      const picList = [
        this.tableData.qualificationPic1,
        this.tableData.qualificationPic2,
        this.tableData.qualificationPic3
      ]
      picList.map((item, index) => {
        if (item) {
          const fileCode = item.split('/')
          this.fileList.push({
            uid: -index,
            name: fileCode[fileCode.length - 1],
            status: 'done',
            url: item
          })
          //    this.fileList1[0] = this.fileList[0];
          //    this.fileList2[0] = this.fileList[1];
          //    this.fileList3[0] = this.fileList[2];
        }
      })
      if (this.fileList[0]) {
        this.fileList1[0] = this.fileList[0]
        this.upList1[0] = this.fileList[0].url
      }
      if (this.fileList[1]) {
        this.fileList2[0] = this.fileList[1]
        this.upList2[0] = this.fileList[1].url
      }
      if (this.fileList[2]) {
        this.fileList3[0] = this.fileList[2]
        this.upList3[0] = this.fileList[2].url
      }
    } else {
      this.SNtitle = '新增销商主数据'
    }
  },
  methods: {
    moment,
    // 修改记录的查询
    historyList(val) {
      const caode = {
        distCode: this.tableData.distCode
      }
      if (val === 'more') {
        this.loading = true
      }
      modifyRecordDealers(caode).then(res => {
        if (res.message === 'SUCCESS') {
          //   console.log(res);
          //   this.historyRecord = res.data;
          if (val === 'more') {
            this.historyRecord = res.data
            this.loading = false
            this.moreBtn = false
          } else if (res.data.length > 5) {
            this.moreBtn = true
            this.historyRecord = res.data.slice(0, 5)
          } else {
            this.moreBtn = false
            this.historyRecord = res.data
          }
        }
      })
    },
    // desInfo(item) {
    //     return (
    //       <div>
    //         <span style="margin-left:5px">{this.moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
    //         <a href="javascript:;" style="margin-left:14px;fontSize:12px" >
    //           查看记录
    //         </a>
    //       </div>
    //     );
    // },
    onSearchClose() {
      this.isShowSearch = false
    },

    retriveHistory(item, index) {
      this.isShowSearch = true
      this.nowTable = item
      let beforeTable = {}
      if (this.historyRecord.length - 1 === index) {
        beforeTable = {}
      } else {
        beforeTable = this.historyRecord[index + 1]
      }
      this.CheckDiff(this.nowTable, beforeTable)
    },

    CheckDiff(now, after) {
      var nowData = Object.getOwnPropertyNames(now)
      var afterData = Object.getOwnPropertyNames(after)
      if (afterData.length == 0) {
        this.beforeTable = {}
      } else {
        for (var i = 0; i < nowData.length; i++) {
          var propName = nowData[i]
          if (now[propName] !== after[propName]) {
            this.beforeTable[propName] = after[propName]
          }
        }
      }

      console.log(this.beforeTable)
    },
    getHostAllData() {
      const params = {
        dictType: '3'
      }
      retriveHost(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.hospitalArea = res.data
        }
      })
    },

    handleProvince(val) {
      console.info('已选择', val)
    },
    // 上传图片
    handleCancel() {
      this.previewVisible = false
      this.upList1[0] = ''
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChangePicture({ fileList }) {
      const uplist = []
      this.fileList1 = fileList
      fileList.map(file => {
        if (file.response) {
          uplist.push(file.response.data[0].filePath)
        }
      })
      this.upList1 = uplist
      if (fileList.length > 0) {
        if (fileList[0].status == 'uploading') {
          if (fileList[0].size > 6335458) {
            notification.error({
              message: '上传失败',
              description: '图片大小不能超过5MB'
            })
            this.upList1 = []
            this.fileList1 = []
          }
        }
      }
    },

    handleCancel2() {
      this.previewVisible2 = false
      this.upList2[0] = ''
    },
    handlePreview2(file) {
      this.previewImage2 = file.url || file.thumbUrl
      this.previewVisible2 = true
    },
    handleChangePicture2({ fileList }) {
      const uplist = []
      this.fileList2 = fileList
      fileList.map(file => {
        if (file.response) {
          uplist.push(file.response.data[0].filePath)
        }
      })
      this.upList2 = uplist
      if (fileList.length > 0) {
        if (fileList[0].status == 'uploading') {
          if (fileList[0].size > 6335458) {
            notification.error({
              message: '上传失败',
              description: '图片大小不能超过5MB'
            })
            this.upList2 = []
            this.fileList2 = []
          }
        }
      }
    },

    handleCancel3() {
      this.previewVisible3 = false
      this.upList3[0] = ''
    },
    handlePreview3(file) {
      this.previewImage3 = file.url || file.thumbUrl
      this.previewVisible3 = true
    },
    handleChangePicture3({ fileList }) {
      const uplist = []
      this.fileList3 = fileList
      fileList.map(file => {
        if (file.response) {
          uplist.push(file.response.data[0].filePath)
        }
      })
      this.upList3 = uplist
      if (fileList.length > 0) {
        if (fileList[0].status == 'uploading') {
          if (fileList[0].size > 6335458) {
            notification.error({
              message: '上传失败',
              description: '图片大小不能超过5MB'
            })
            this.upList3 = []
            this.fileList3 = []
          }
        }
      }
    },

    // 提交数据
    handleSubmit(e) {
      if (this.addBtn) {
        e.preventDefault()
        let params = {}

        this.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.addBtn = false
            params = {
              id: this.tableData.id,
              distName: values.distName,
              contacts: values.contacts,
              contactPhone: values.contactPhone,
              contactEmail: values.contactEmail,
              contactWechat: values.contactWechat,
              address: values.address,
              remark: values.remark,
              distCode: values.distCode,
              qualificationPic1: this.upList1[0],
              qualificationPic2: this.upList2[0],
              qualificationPic3: this.upList3[0],
              city: values.city,
              province: values.province,
              totalExchange: values.totalExchange,
              regionCode: values.regionName,
              creditCode: values.creditCode,
              sysOrgCode: this.tableData.sysOrgCode
            }
            console.log(params)
            this.updateDetails(params)
          }
        })
      }
    },

    updateDetails(params) {
      addDealersData(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.$emit('handleNewPro', false)
        } else {
          this.addBtn = true
          notification.error({
            message: '错误',
            description: res.message
          })
        }
      })
    },
    // 返回到主页面 子组件调用父组件的方法
    handleBack() {
      this.$emit('handleNewPro', false)
    },

    handleProvince(val) {
      console.info('已选择', val)
    },

    handleChange(value) {
      console.log(`selected ${value}`)
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>
<style lang="less">
// 查看历史纪录样式
.cotain_hitory {
  font-size: 14px;
  font-family: PingFang SC;
  p {
    margin: 0;
  }
  .now_details {
    margin-bottom: 15px;
    .history_title {
      color: rgba(147, 147, 147, 1);
      opacity: 1;
      margin-bottom: 5px;
    }
    .history_details {
      color: rgba(52, 53, 62, 1);
      opacity: 1;
      font-weight: 500;
    }
    .history_img {
      width: 120px;
      height: 120px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .after_details {
    margin-bottom: 15px;
    .after_title {
      color: rgba(225, 120, 119, 1);
      opacity: 1;
      margin-bottom: 5px;
    }
    .after_contain {
      color: rgba(225, 120, 119, 1);
      opacity: 1;
      font-weight: 500;
    }
    .after_img {
      width: 120px;
      height: 120px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
/* //新增页面边框 */

.proNewBorder {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 20px rgba(172, 173, 183, 0.2);
  opacity: 1;
  border-radius: 4px;
  padding: 30px 40px;
  margin-top: 20px;

  .proNew-title {
    color: rgba(84, 97, 130, 1);
    font-size: 14px;
    height: 36px;
    width: 100%;
    display: inline-block;

    .iconfont {
      color: rgba(66, 131, 255, 1);
      font-size: 26px;
    }

    span {
      float: left;
      line-height: 36px;
      font-size: 16px;
    }
  }

  /* 不可修改时的样式 */
  .ban_update {
    .addInput-title {
      .ban_small {
        float: right;
        color: rgba(62, 77, 168, 1) !important;
        opacity: 1;
      }
    }

    .adInput-input {
      .ant-input {
        background: rgba(236, 236, 236, 1) !important;
        color: rgba(193, 193, 193, 1) !important;
        opacity: 1 !important;
      }
    }
  }

  .addInput {
    margin-bottom: 30px;

    .addInput-title {
      padding: 0 0 8px 0;
      font-size: 14px;

      span {
        color: rgba(84, 97, 130, 1);
      }

      small {
        color: #e17877;
        margin-right: 5px;
        float: left;

        &.addInput-tips {
          color: rgba(170, 174, 185, 1);
        }
      }
    }
  }

  .adInput-input {
    .begin_date {
      .anticon-calendar {
        color: #3e4da8;
      }
    }

    .ant-select-selection--single {
      height: 42px;
    }

    .ant-select-selection__rendered {
      line-height: 42px;
    }

    .ant-form-item,
    .ant-form-item-control-wrapper,
    .ant-form-item-control {
      width: 100%;
      margin-right: 0px;
    }

    .ant-select-selection {
      background: rgba(252, 252, 252, 1) !important;
      border: 1px solid #ececec !important;
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

  /* 城市2级联动样式 */
  .area-select-wrap {
    display: flex;
    flex-wrap: nowrap;

    .area-select {
      background: #fcfcfc;
      border: 1px solid #ececec;
      color: rgba(159, 172, 195, 1);
      height: 42px;
      width: 50%;
      line-height: 42px;
      display: inline-block;
      position: relative;

      .area-select-icon {
        font-family: "iconfont";
        font-style: normal;
        position: absolute;
        right: 16px;
        top: 0;

        &:before {
          content: "\e64b";
        }
      }

      &:first-child {
        margin-left: 0;
      }

      .area-selected-trigger {
        width: 100%;
        padding: 0 12px;
        display: inline-block;
      }

      .area-selectable-list-wrap {
        position: absolute;
        margin: -15px 0 0 0;
        width: 100%;
      }

      .area-selectable-list {
        border: 1px solid #ececec;
        width: 100%;
        margin: 12px 0 0 0;
        padding: 0;
        list-style: none;
        z-index: 9999;
        position: absolute;
        background: #fcfcfc;
        max-height: 130px;
        overflow-y: auto;

        li {
          padding: 0 12px;
          cursor: pointer;
          line-height: 32px;
        }
      }
    }
  }

  /* 上传图片 */
  .clearfix {
    .ant-upload-list-item-info {
      span {
        width: 100%;
        height: 100%;
      }
    }
    .ant-upload-select-picture-card i {
      font-size: 32px;
      color: #999;
    }

    .ant-upload-select-picture-card {
      .ant-upload-text {
        margin-top: 8px;
        color: #666;
      }
    }

    .ant-upload-select-picture-card {
      width: 119px;
      height: 119px;

      .ant-upload-text {
        margin-top: 0px;
        color: #b6b3b3;
      }
    }

    .ant-upload-list-picture-card {
      /* width: 100%; */
      .ant-upload-list-item-error {
        border: 0;
      }

      .ant-upload-list-item {
        margin-right: 10px;
        margin-bottom: 10px;
        background: rgba(252, 252, 252, 1);
        border: 1px solid rgba(236, 236, 236, 1);
        opacity: 1;
        border-radius: 4px;
      }

      .ant-upload-list-item {
        width: 119px;
        height: 119px;

        padding: 0;
      }
    }
  }
}

/* 操作记录 */
.operation_records {
  a {
    text-decoration: none;
  }
  margin-top: 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 20px rgba(172, 173, 183, 0.2);
  opacity: 1;
  border-radius: 8px;
  padding: 37px 35px 30px 40px;

  .operation_vertical {
    width: 1px;
    height: 21px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(236, 236, 236, 1);
    opacity: 1;
    margin-left: 13px;
    margin-bottom: 5px;
    margin-top: 5px;
  }

  .operation_btn {
    color: #3e4da8;
    text-align: center;
    line-height: 34px;
    display: block;
    width: 96px;
    height: 34px;
    background: rgba(246, 246, 246, 1);
    opacity: 1;
    border-radius: 22px;
  }

  .ant-steps {
    .ant-steps-item {
      height: 90px;

      .ant-steps-item-title {
        font-size: 14px;
        font-family: PingFang SC;
        color: rgba(52, 53, 62, 1);
        opacity: 1;
        margin-bottom: 10px;
      }
    }

    .ant-steps-icon {
      color: rgba(236, 236, 236, 1) !important;
    }
  }
}
</style>
