<template>
  <a-modal
    :title="title"
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
          <h3>{{ content }}
              <span class="errorMessage" v-if="!checkLength">{{ tips }}</span>
              <a-tooltip placement="top" >
                <template slot="title">
                  <span>清空</span>
                </template>
                <a @click="handleEmpty" class="proEmpty"><i class="iconfont icon-allRead" /></a>
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
import { retriveNameData, findProductMo } from '@/api/basicInfo/hosData'
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
      checkLength: true,
      isChooseType: true,
      isChooseDegree: false,
      title: '选择型号',
      content: '请选择型号',
      tips: '型号不能为空！'
    }
  },
  methods: {
    changeCheck () {
      // console.info('productModel===', this.productModel)
      this.checkedList = this.productModel.checkList
    },
    getProModel () {
      // console.info('this.productModel---', this.productModel)
      if (this.productModel.type === 'model') {
        this.isChooseType = true
        this.isChooseDegree = false
        this.title = '选择型号'
        this.content = '请选择型号'
        this.tips = '型号不能为空！'
        this.productModel.model.map(item => {
          this.modelList.push({
            label: item.productModel,
            value: item.productModel,
            id: item.crgdProductId,
            disabled: false
          })
        })
      } else {
        this.isChooseDegree = true
        this.isChooseType = false
        this.title = '选择度数'
        this.content = '请选择度数'
        this.tips = '度数不能为空！'
        this.productModel.degreeList.map(item => {
          if (this.productModel.checkList.findIndex(obj => obj === item.degree) !== -1) {
            this.modelList.push({
              label: item.degree,
              value: item.degree,
              disabled: true
            })
          } else {
            this.modelList.push({
              label: item.degree,
              value: item.degree,
              disabled: false
            })
          }
        })
      }
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
      // console.info('this.checkedList---', this.checkedList)
      // if (checkedList.length >= 10) {
      //   this.modelList.map(item => {
      //     if (checkedList.indexOf(item.value) !== -1) {
      //       item.disabled = false
      //     } else {
      //       item.disabled = true
      //     }
      //   })
      // } else {
      this.modelList.map(item => {
        if (this.productModel.checkList.findIndex(obj => obj === item.value) === -1) {
          item.disabled = false
        }
      })
      // }
    },
    onCheckAllChange (e) {
      Object.assign(this, {
        checkedList: e.target.checked ? this.modelList : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    handleSubmit () {
      const arr = []
      this.modelList.map(item => {
        if (this.checkedList.indexOf(item.value) !== -1) {
          arr.push(item.value)
        }
      })
      this.checkedList = arr
      const params = {
        type: this.productModel.type,
        list: arr
      }
      if (this.checkLength) {
        this.$emit('ModelSub', JSON.stringify(params))
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
