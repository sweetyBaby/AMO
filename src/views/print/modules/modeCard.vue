<template>
  <div class="modecard">
    <a-input v-model="cardData.name" placeholder="输入" style="width: 100%" >
      <i class="iconfont icon-cancle" slot="suffix" />
    </a-input>
  </div>
</template>

<script>
export default {
  props: ['cardData'],
  name: 'ModeCard',
  data () {
    return {
      edit: false
    }
  }
}
</script>

<style lang="less">
  .modecard{
    display: inline-block;
    padding: 8px 12px;
    float: left;
  }

</style>
