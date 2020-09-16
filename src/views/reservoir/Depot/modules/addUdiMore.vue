<template>
  <a-modal
    title="批量添加"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading" class="modal-info">
      <a-form layout="inline">
        <p>注：一行为一个码，输入多个码请换行输入，换行按键盘上“Enter”键</p>
        <div class="udiMore">
          <a-textarea
            placeholder="请输入udi码"
            :rows="6"
            @change="handleChange"
          />
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  name: 'AddUdiMore',
  props: ['visible'],
  data() {
    return {
      confirmLoading: false,
      udiMoreList: []
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('udiSub', this.udiMoreList)
    },
    handleCancel() {
      this.$emit('udiCancle')
    },
    // handlePress(e){
    //   // console.info('e.target.value----',e.target.value)
    //   const udiList = e.target.value.split('\n')
    //   // console.info('udiList---',udiList.filter(item => item))
    //   // this.udiMoreList = udiList
    // },
    handleChange(e) {
      // console.info('e.target.value----',e.target.value)
      const udiList = e.target.value.split('\n')
      const newUdiList = this.distinct(udiList.filter(item => item))
      this.udiMoreList = newUdiList
      // console.info('newUdiList---',newUdiList)
    },
    // 去重
    distinct(arr) {
      const result = []
      const obj = {}
      for (const i of arr) {
        if (!obj[i]) {
          result.push(i)
          obj[i] = 1
        }
      }
      // console.info('result---',result)
      return result
    },
  }
}
</script>

<style lang="less">
.udiMore{
  background: rgba(251, 251, 251, 1);
  border: 1px solid rgba(239, 239, 239, 1);
  border-radius:6px;

  overflow-y: auto;
  /*textarea{*/
  /*  background: url("images/textBg.png") repeat;*/
  /*  background-attachment: local;*/
  /*  border: none;*/
  /*  line-height: 52px;*/
  /*  border-radius:0;*/
  /*  font-size: 14px;*/
  /*  color:rgba(52, 53, 62, 1);*/
  /*}*/
}
</style>
