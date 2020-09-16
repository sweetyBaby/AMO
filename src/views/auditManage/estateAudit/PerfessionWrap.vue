<template>
  <div class="pageTitle">
    <Perfessional @DetailInfo="handleChangeInfo" @ListBack="handleBackList" :detail="isDetail" />
  </div>
</template>

<script>
import Perfessional from './Perfessional'
import Enclosure from './Enclosure'
import {
  getStore,
  setStore
} from '@/utils/storage'
export default {
  name: 'PerfessionWrap',
  components: {
    Perfessional,
    Enclosure
  },
  mounted() {
    // this.getFirstLogin()
  },
  data() {
    return {
      activeKey: 'estateAudit',
      isAuditDetail: false,
      isDetail: false,
      isShoweclosure: false
    }
  },
  methods: {
    getFirstLogin() {
      const EstateDetail = getStore('EstateId')
      console.info('EstateDetail---', EstateDetail)
      if (EstateDetail.InvoiceId) {
        this.isAuditDetail = true
        this.isShoweclosure = true
        this.isDetail = true
      } else {
        this.isAuditDetail = false
        this.isShoweclosure = false
      }
    },
    goBack() {
      // console.info('000-00defdef--9094444878767')
      this.$router.push({
        name: 'PerfessionWrap'
      })
      this.activeKey = 'estateAudit'
      this.isAuditDetail = false
      this.isDetail = false
      this.isShoweclosure = false
    },
    handleChangeInfo() {
      this.isAuditDetail = true
    },
    handleChange(activeKey) {
      this.isDetail = true
      this.isShoweclosure = true
    },
    handleBackList() {
      // console.info('222')
      this.isAuditDetail = false
    }
  },
  destroyed() {
    window.removeEventListener('popstate', this.goBack, false)
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
