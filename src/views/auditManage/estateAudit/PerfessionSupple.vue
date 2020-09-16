<template>
  <div class="pageTitle">
    <a-tabs v-model="activeKey" type="card" @change="handleChange">
      <a-tab-pane tab="发票" key="estateAudit" :closable="false">
        <Perfessional @DetailInfo="handleChangeInfo" @ListBack="handleBackList" :type="supple" />
      </a-tab-pane>
      <a-tab-pane tab="附件管理" key="estateEnclosure" :closable="false" v-if="isAuditDetail" >
        <enclosure :type="supple" v-if="isShoweclosure" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Perfessional from './Perfessional'
import Enclosure from './Enclosure'
export default {
  name: 'PerfessionSupple',
  components: {
    Perfessional,
    Enclosure
  },
  mounted () {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, '/auditManage/supplement/PerfessionSupple#detail')
      window.addEventListener('popstate', this.goBack, false)
    }
  },
  data () {
    return {
      activeKey: 'estateAudit',
      isAuditDetail: false,
      supple: 'supple',
      isShoweclosure: false
    }
  },
  methods: {
    goBack () {
      // console.info('000-00defdef--9094444878767')
      this.$router.push({
        name: 'PerfessionSupple'
      })
      this.activeKey = 'estateAudit'
      this.isAuditDetail = false
      this.isDetail = false
      this.isShoweclosure = false
    },
    handleChangeInfo () {
      this.isAuditDetail = true
    },
    handleBackList () {
      // console.info('222')
      this.isAuditDetail = false
    },
    handleChange (activeKey) {
      this.isDetail = true
      this.isShoweclosure = true
    },
  },
  destroyed () {
    window.removeEventListener('popstate', this.goBack, false)
  },
}
</script>

<style scoped lang="less">
  .pageTitle {
    border: none;
    padding: 0;
    margin: 0;
    :global {
      /deep/ .ant-tabs-bar{
        padding: 8px 0 0 94px;
        .ant-tabs-tab{
          border: none;
          background: none;
          color: rgba(147, 147, 147, 1);
          font-size: 14px;
          margin: 0 20px 0 0;
          &-active{
            color: rgba(62, 77, 168, 1);
            padding-bottom: 3px;
            /*border-bottom: 2px solid rgba(62, 77, 168, 1);*/
          }
        }
        .ant-tabs-ink-bar{
          visibility: visible;
          background-color: rgba(62, 77, 168, 1);
        }
      }
    }

  }

</style>
