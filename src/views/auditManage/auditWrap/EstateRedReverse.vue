<template>
  <div class="pageTitle">
    <red-reverse-wrap :redReverseData="redReverseData" />
  </div>
</template>

<script>
import RedReverseWrap from './RedReverseWrap'

export default {
  name: 'PerfessionWrap',
  components: {
    RedReverseWrap,

  },
  mounted() {
  },
  data() {
    return {
      redReverseData: {
        title: '配送商红冲销量',
        type: 'estate'
      }

    }
  },
  methods: {

  },
  destroyed() {
  }
}
</script>

<style lang="less" scoped>
.pageTitle {
    border: none;
    padding: 0;
    margin: 0;

    :global {
        /deep/ .ant-tabs-bar {
            padding: 8px 0 0 94px;

            .ant-tabs-tab {
                border: none;
                background: none;
                color: rgba(147, 147, 147, 1);
                font-size: 14px;
                margin: 0 20px 0 0;

                &-active {
                    color: rgba(62, 77, 168, 1);
                    padding-bottom: 3px;
                    /*border-bottom: 2px solid rgba(62, 77, 168, 1);*/
                }
            }

            .ant-tabs-ink-bar {
                visibility: visible;
                background-color: rgba(62, 77, 168, 1);
            }
        }
    }
}
</style>
