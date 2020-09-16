<template>
  <a-modal
    title="选择型号"
    :width="800"
    :visible="productModel.visible"
    @ok="handleSubmit"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading" class="modal-info">
      <template>
        <div class="proModelWrap">
          <h3>选择型号
              <!--            <small>最多可选10个型号，显示最佳</small>-->
              <span class="errorMessage" v-if="!checkLength">型号不能为空</span>

              <a-tooltip placement="top" >
                <template slot="title">
                  <span>清空</span>
                </template>

                <a @click="handleEmpty" class="proEmpty"><i class="iconfont icon-allRead" /></a>
              </a-tooltip>
              <a-tooltip placement="top" >
                <template slot="title">
                  <span>全选</span>
                </template>
                <a @click="onCheckAllChange" class="proEmpty">
                  <i class="iconfont icon-checkAll"></i>
                </a>
              </a-tooltip>
          </h3>
          <a-checkbox-group :options="modelList" v-model="checkedList" @change="onChange" >
            <span slot="label" slot-scope="{value}">{{ value }}</span>
          </a-checkbox-group>
        </div>
      </template>
    </a-spin>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { retriveNameData, findProductMo, getProductType } from '@/api/basicInfo/hosData'
import { DataFilter } from '@/utils/storage'

export default {
  props: ['productModel'],
  components: {
    STable
  },
  mounted () {
    this.changeCheck()
    this.getProModel()
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      modelList: [],
      checkedList: [],
      indeterminate: true,
      checkAll: false,
      checkLength: true
    }
  },
  methods: {
    changeCheck () {
      console.info('productModel===', this.productModel)
      this.checkedList = this.productModel.checkList
    },
    getProModel () {
      const params = {
        'productModel': ''
      }
      getProductType(params).then(res => {
        const proMol = []
        res.data.map(item => {
          if (item && item !== null) {
            proMol.push(item.productType)
          }
        })
        // console.info('proMol---', proMol)
        // console.info('modelList',this.checkedList)
        this.modelList = proMol.map(item => {
          return {
            label: item,
            value: item,
          }
        })
        this.checkUnable(this.checkedList)
      })
    },
    onChange (checkedList) {
      if (checkedList.length > 0) {
        this.checkLength = true
        const arr = []
        for (let i = 0; i < this.modelList.length; i++) {
          if (checkedList.indexOf(this.modelList[i].value) !== -1) {
            arr.push(this.modelList[i].value)
          }
        }
        this.checkedList = arr
        checkedList = arr
      } else {
        this.checkLength = false
      }
      this.indeterminate = !!checkedList.length && (checkedList.length < this.modelList.length)
      this.checkAll = checkedList.length === this.modelList.length
      this.checkUnable(checkedList)
      // console.info(' this.checkedList----',checkedList)
    },
    checkUnable (checkedList) {
      // console.info('checkedList---', checkedList)
      this.modelList.map(item => {
        if (checkedList.findIndex(obj => obj === item.productModel) !== -1) {
          item.disabled = true
        }
      })
    },
    onCheckAllChange (e) {
      // console.info('this.modelList', this.modelList)
      this.checkedList = this.modelList.map(item => {
        return item.value
      })
      this.checkLength = true
    },
    handleSubmit () {
      const arr = []
      this.modelList.map(item => {
        if (this.checkedList.indexOf(item.value) !== -1) {
          arr.push(item.value)
        }
      })
      this.checkedList = arr
      if (this.checkLength) {
        this.$emit('ModelSub', this.checkedList)
      }
    },
    handleCancel () {
      this.$emit('closeMol')
    },
    handleEmpty () {
      this.checkedList = []
      this.checkLength = false
      this.checkUnable(this.checkedList)
    }
  }
}
</script>
<style lang="less">
  .proModelWrap{
    h3{
      border-bottom: 1px solid rgba(233, 233, 233, 1);
      padding: 0 0 6px 0;
      margin: 0 0 8px 0;
      small{
        color: rgba(147, 147, 147, 1);
        font-size: 12px;
      }
      .errorMessage{
        color: red;
        font-size: 12px;
        padding: 0 0 0 12px;
      }
      .proEmpty{
        float: right;
        color: rgba(147, 147, 147, 1);
        padding: 0 0 0 8px;
      }
    }
    .ant-checkbox-wrapper{
      min-width: 140px;
      padding: 4px 0;
      margin-left: 0;
    }
    .ant-checkbox-group{
      padding: 0 0 24px 0;
    }

  }

</style>
