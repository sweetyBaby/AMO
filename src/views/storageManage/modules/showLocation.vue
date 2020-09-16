<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <div class="show_header">
      <div class="flex_box">
        <p class="label">所属仓库</p>
        <p class="title">仓库一</p>
      </div>
      <div class="flex_box">
        <p class="label">所属货架</p>
        <p class="title">A区001</p>
      </div>
    </div>
    <div class="show_content">
      <a-form
        :form="form"
      >
        <a-form-item label="库位编号">
          <a-input
            v-decorator="[
              'KWCode',
              {
                rules: [{ required: true, message: '库位编号不能为空' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="库位名称">
          <a-input
            v-decorator="[
              'KWname',
              {
                rules: [{ required: true, message: '库位名称不能为空' }],
              }
            ]"
          />
        </a-form-item>
        <a-button
          type="primary"
          html-type="submit"
        >
          Submit
        </a-button>
      </a-form>
    </div>
    <template slot="footer">
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" @click="handleSave">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

export default {
  name: 'ShowModal',
  data () {
    return {
      visible: false,
      confirmLoading: false
    }
  },
  props: [
    'type'
  ],
  computed: {
    title() {
      if (this.type == 'add') {
        return '新增'
      } else if (this.type == 'edit') {
        return '编辑'
      }
    }
  },
  methods: {
    handleCancel () {
      // clear form & currentStep
      this.visible = false
    },
    show() {
      this.visible = true
    },
    // 确认保存
    handleSave() {}
  }
}
</script>
<style lang="less" scoped>
.show_header{
  display: flex;
  // justify-content: space-between;
  border-bottom: 1px solid#E5F0FF;
  padding-bottom: 20px;
  margin: 0 10px;
  p{
    margin: 0;
  }
  .flex_box{
    width:50%;
  }
  .label{
    color: #9FACC3;
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:400;
    height:19px;
    line-height:19px
  }
  .title{
    height:24px;
    font-size:18px;
    font-family:Microsoft YaHei;
    font-weight:bold;
    line-height:24px;
    color:#2F3C5D;
  }
}
</style>
