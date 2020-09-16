<template>
  <a-card :bordered="false">
    <a-spin tip="文件保存中，请稍等..." class="uploading" v-show="loadingSpin"></a-spin>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>医院授权关系详情</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="hancleBack()">
              <a-tooltip placement="top" v-model="isBackShow">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back"/>
              </a-tooltip>
            </span>
          </div>
        </a-col>
      </a-row>
    </div>
    <a-form layout="inline" :form="form">
      <div class="basicBorder">
        <a-row :gutter="24">
          <a-col span="8">
            <label for class="basicTitle">医院名称</label>
            <div class="basicInfo">
              {{ proWrap.hosName }}
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">医院代码</label>
            <div class="basicInfo">
              {{ proWrap.hosCode }}
            </div>
          </a-col>
          <a-col span="8">
            <!--            <label for class="basicTitle">备注</label>-->
            <!--            <div class="basicInfo">-->
            <!--              {{ proWrap.remark }}-->
            <!--            </div>-->
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">经销商名称</label>
            <div class="basicInfo">
              {{ proWrap.distName }}
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">经销商代码</label>
            <div class="basicInfo">
              {{ proWrap.distCode }}
            </div>
          </a-col>

          <a-col span="8">
            <label for class="basicTitle leftCell">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>经销商所属大区</span>
                </template>
                经销商所属大区
              </a-tooltip>
            </label>
            <div class="basicInfo">
              {{ proWrap.dictName }}
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">生效日期</label>
            <div class="basicInfo">
              {{ proWrap.effectiveDateBegin }}
            </div>
          </a-col>
          <a-col span="8">
            <label for class="basicTitle">失效日期</label>
            <div class="basicInfo">
              {{ proWrap.effectiveDateEnd }}
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="basicBorder newHosSales" v-if="modelData.length > 0">
        <div class="newHosTitle">
          <h3><span>*</span>授权产品型号</h3>
          <!--          <div class="basicInfo">-->
          <!--            <div class="selectType">-->
          <!--              <div class="proModel">-->
          <!--                <span v-if="modelData.length === 0">点击选择产品型号</span>-->
          <!--                <a-tag-->
          <!--                    v-else-->
          <!--                    v-for="(item,index) in modelData.slice(0,3)"-->
          <!--                    :key="index"-->
          <!--                >-->
          <!--                  {{ item.productType }}-->
          <!--                </a-tag>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
        <a-row :gutter="24" v-for="(product,index) in modelData">
          <a-col span="24">
            <label for class="basicTitle">型号</label>
            <div class="basicInfo">
              <a-input
                v-model="product.productType"
                placeholder="型号"
                :style="{ width:'240px'}"
                :disabled="true"
              ></a-input>
            </div>
            <label for class="basicTitle">生效日期</label>
            <div class="basicInfo">
              <a-form-item style="width: 100%" has-feedback>
                <a-month-picker
                  placeholder="选择生效月份"
                  :value="product.effectiveDateBegin"
                  :format="dateFormat"
                  :disabled="true"
                ></a-month-picker>
              </a-form-item>
            </div>
            <label for class="basicTitle">失效日期</label>
            <div class="basicInfo">
              <a-form-item style="width: 100%" has-feedback>
                <a-month-picker
                  placeholder="选择失效月份"
                  :value="product.effectiveDateEnd"
                  :format="dateFormat"
                  :disabled="true"
                ></a-month-picker>
              </a-form-item>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-form>
  </a-card>
</template>

<script>
import DhEmpty from '@/views/comPublic/DhEmpty'
import moment from 'moment'
import { STable } from '@/components'
import { DataFilter, exportTable, getParamsFromStore, getStore } from '@/utils/storage'
import { getWareList, userDistRange } from '@/api/depot/wareHouse'
import { relationDetail } from '@/api/basicInfo/hosData'

export default {
  name: 'RelationShipDetail',
  components: {
    DhEmpty,
    STable
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.getFirst()
  },
  data () {
    return {
      title: '新增订单',
      loadingSpin: false,
      isEmpty: false,
      isChooseModel: false,
      modelObj: {},
      queryParam: {
        page: 1,
        size: 10
      },
      proWrap: {},
      isDocData: null,
      dateFormat: 'YYYY-MM',
      remark: '',
      modelData: [],
      changModel: '',
      isBackShow: false
    }
  },
  methods: {
    handleChange (e) {
      // console.info('e-----', e)
      this.proWrap.distCode = e
      this.distList.map(item => {
        if (item.distCode === e) {
          this.proWrap.distName = item.distName
        }
      })
    },
    handleEdit (record) {
      const orderInfo = JSON.parse(getParamsFromStore('ORDERINFO'))
      this.isAdd = true
      this.editData = {
        visible: false,
        distCode: orderInfo.distCode,
        distName: orderInfo.distName,
        type: 'edit',
        ...record
      }
    },
    getFirst () {
      const detailData = getStore('RELATIONDETAIL')
      console.info('detailData===', detailData)
      this.proWrap.distCode = detailData.distCode
      this.proWrap.distName = detailData.distName
      this.proWrap.hosName = detailData.hosName
      this.proWrap.hosCode = detailData.hosCode
      this.proWrap.effectiveDateBegin = detailData.effectiveDateBegin
      this.proWrap.effectiveDateEnd = detailData.effectiveDateEnd
      this.proWrap.remark = detailData.remark
      this.proWrap.dictName = detailData.dictName
      this.isDocData = true
      this.isDocDataEnd = true
      const params = {
        id: detailData.id
      }
      relationDetail(params).then(res => {
        // console.info('res----', res.data)
        this.modelData = res.data
      })
    },

    hancleBack () {
      this.$router.push({
        name: 'RelationShip'
      })
      this.isBackShow = false
      this.modelData = []
      this.proWrap = {
        effectiveDateBegin: null,
        effectiveDateEnd: null,
        distCode: undefined,
        hosCode: null,
        dictName: '',
        remark: ''
      }
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'RelationShip_Detail') {
        this.getFirst()
      }
    }
  }
}
</script>

<style scoped lang="less">
  .typeName {
    padding: 0 0 16px 0;
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

  .tableBtn {
    :global {
      .ant-popover-content {
        padding: 0;
        min-width: 160px;

        a {
          width: 100%;
          padding: 0 0 0 32px;
          color: rgba(147, 147, 147, 1);
          display: inline-block;
          box-sizing: border-box;
          height: 38px;
          line-height: 38px;

          .iconfont {
            font-size: 19px;
            color: rgba(147, 147, 147, 1);
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
  }

  .orderInfo {
    padding: 24px 0 0 0;
  }

  //上传中
  .uploading {
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0, 0, 0, 0.65);
    z-index: 99;
    left: 0;
    top: 0;

    .ant-spin-text {
      color: #fff;
      position: relative;
      top: 250px;
    }

    .ant-spin-dot {
      top: 250px;

      i {
        background-color: #fff;
      }
    }
  }

  /*详情基本信息 */
  .basicBorder {
    border: 1px solid rgba(233, 233, 233, 1);
    overflow: hidden;
    background: rgba(251, 251, 251, 1);

    > .ant-row {
      margin-top: -4px;

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
          &.leftCell{
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          /*span {*/
          /*  color: rgba(225, 120, 119, 1);*/
          /*  padding: 0 8px 0 0;*/
          /*}*/
        }

        .basicInfo {
          flex-grow: 1;
          width: 70%;
          border-left: 1px solid rgba(233, 233, 233, 1);
          border-right: 1px solid rgba(233, 233, 233, 1);
          display: inline-block;
          padding: 12px;
          color: rgba(52, 53, 62, 1);
          line-height: 36px;

          &:nth-child(3n) {
            border-right: none;
          }

          .basicBase {
            line-height: 32px;
          }
        }
      }
    }

    .ant-input-affix-wrapper {
      border: none;
    }

    .ant-input,
    .ant-select-selection {
      background: white;
      border: 1px solid rgba(233, 233, 233, 1);
      border-radius: 4px;
    }

    &.newHosSales {
      .newHosTitle {
        width: 100%;
        display: inline-block;
        border-bottom: 1px solid rgba(233, 233, 233, 1);

        h3 {
          color: rgba(156, 156, 158, 1);
          font-size: 14px;
          font-weight: bold;
          padding: 16px 40px;
          margin: 0;
          float: left;

          span {
            color: rgba(225, 120, 119, 1);
            padding: 0 8px 0 0;
          }
        }
        .basicInfo{
          float: right;
          margin: 12px 12px 8px 0;
          display: inline-block;
        }
        .newPro {
          float: right;
          border: none;
          background: none !important;
          padding: 0 40px;
          line-height: 54px;
          border-left: 1px solid rgba(233, 233, 233, 1);
          display: inline-block;

          .iconfont {
            font-size: 20px;
            color: rgba(207, 207, 207, 1);
            cursor: pointer;
          }

          &:hover {
            .iconfont {
              color: rgba(62, 77, 168, 1);
            }
          }
        }
        .selectType{
          background: #fff;
          border: 1px solid rgba(233, 233, 233, 1);
          display: block;
          padding: 8px;
          border-radius: 4px;
        }
      }

      > .ant-row > div {
        .basicInfo {
          border: none;
        }

        .newProWrap {
          width: 100%;
          display: inline-block;
          margin-right: -12px;
          margin-left: -12px;

          .newPro {
            float: right;
            border: none;
            background: none !important;
            padding: 0 40px;
            line-height: 54px;
            border-left: 1px solid rgba(233, 233, 233, 1);
            display: inline-block;

            .iconfont {
              font-size: 20px;
              color: rgba(207, 207, 207, 1);
              cursor: pointer;
            }

            &:hover {
              .iconfont {
                color: rgba(62, 77, 168, 1);
              }
            }
          }
        }
      }
    }
  }

  .newHosSales {
    margin: 24px 0;
  }
  .scanEmpty{
    width: 100%;
    text-align: center;
    padding: 70px 160px;

    h4{
      color: rgba(147, 147, 147, 1);
      font-size: 14px;
      padding: 0 0 40px 0;
    }
    .scanInfo{
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-around;
      .scanBor{
        width: 1px;
        height: 100%;
        min-height: 80px;
        display: inline-block;
        background: rgba(236, 236, 236, 1);
      }
      .scanList{
        position: relative;
        padding: 12px 40px 12px 94px;
        .scanIcon{
          position: absolute;
          left: 18px;
          top: 12px;
          width: 50px;
          height: 50px;
          border-radius:25px;
          background: white;
          border: 2px solid rgba(62, 77, 168, 1);
          line-height: 46px;
          .iconfont{
            color: rgba(251, 199, 115, 1);
            font-size: 30px;
          }
        }
        &:hover{
          background: rgba(251, 251, 251, 1);
        }
        .scanMain{
          text-align: left;
          width: 100%;
          h3{
            font-size: 18px;
            color: rgba(62, 77, 168, 1);
          }
          p{
            color: rgba(147, 147, 147, 1);
            font-size: 14px;
            margin: 0 ;
          }
        }
      }
    }

  }
</style>
