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
                <a @click="handleAll" class="proEmpty"><i class="iconfont icon-checkAll" /></a>
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
      checkAll: false
    }
  },
  methods: {
    changeCheck () {
      this.checkedList = this.productModel.checkList
    },
    getProModel () {
      const params = {
        'productModel': ''
      }
      findProductMo(params).then(res => {
        const proMol = res.data.map(item => item.productModel)
        const index1 = proMol.indexOf('1MTEC30')
        proMol.splice(index1, 1)
        const index2 = proMol.indexOf('EMERALDC')
        proMol.splice(index2, 1)
        // const index3 = proMol.indexOf('HEALON')
        // proMol.splice(index3,1)
        this.modelList = proMol.map(item => {
          return {
            label: item,
            value: item,
            disabled: false
          }
        })
      })
    },
    onChange (checkedList) {
      if (checkedList.length > 0) {
        const arr = []
        for (let i = 0; i < this.modelList.length; i++) {
          if (checkedList.indexOf(this.modelList[i].value) !== -1) {
            arr.push(this.modelList[i].value)
          }
        }
        this.checkedList = arr
        checkedList = arr
      }
      this.indeterminate = !!checkedList.length && (checkedList.length < this.modelList.length)
      this.checkAll = checkedList.length === this.modelList.length
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
      this.$emit('ModelSub', this.checkedList)
    },
    handleCancel () {
      this.$emit('closeMol')
    },
    handleEmpty () {
      this.checkedList = []
    },
    handleAll () {
      this.checkedList = []
      this.modelList.map(item => {
        this.checkedList.push(item.value)
      })
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
      .proEmpty{
        float: right;
        margin-left: 20px;
        color: rgba(147, 147, 147, 1);
        .iconfont{
          font-size: 18px;
        }
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
