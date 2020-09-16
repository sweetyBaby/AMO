<template>
  <div class="pageTitle">
    <a-tabs v-model="activeKey" type="card" @change="handleChange">
      <a-tab-pane tab="发票" key="estateAudit" :closable="false">
        <audit-edit />
      </a-tab-pane>
      <a-tab-pane tab="附件管理" key="estateEnclosure" :closable="false">
        <enclosure :isAuditShow="isShoweclosure" v-if="isShoweclosure" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Perfessional from './Perfessional'
import Enclosure from './Enclosure'
import AuditEdit from '../auditWrap/modules/auditEdit'
import { getStore, setStore } from '@/utils/storage'
export default {
  name: 'PerfessionWrapDetail',
  components: {
    Perfessional,
    Enclosure,
    AuditEdit
  },
  mounted () {
    // this.getFirstLogin()
  },
  data () {
    return {
      activeKey: 'estateAudit',
      isAuditDetail: false,
      isDetail: false,
      isShoweclosure: false
    }
  },
  methods: {
    goBack () {
      // console.info('000-00defdef--9094444878767')
      this.$router.push({
        name: 'PerfessionWrap'
      })
      this.activeKey = 'estateAudit'
      this.isAuditDetail = false
      this.isDetail = false
      this.isShoweclosure = false
    },
    handleChangeInfo () {
      this.isAuditDetail = true
    },
    handleChange (activeKey) {
      if (activeKey === 'estateEnclosure') {
        this.isShoweclosure = true
      } else {
        this.isShoweclosure = false
      }
      this.isDetail = true
    },
    handleBackList () {
      // console.info('222')
      this.isAuditDetail = false
    }
  },
  destroyed () {
    window.removeEventListener('popstate', this.goBack, false)
  }
}
</script>

<style scoped lang="less">
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
