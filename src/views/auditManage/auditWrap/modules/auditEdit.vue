<template>
  <a-card :bordered="false">
    <div>
      <audit-add @manualInput="scanBack" @save="handleSave" :invoiceType="invoiceType" :editData="detailData" v-if="isAdd"></audit-add>
      <audit-detail v-else @auditEdit="handleEdit" @goback="scanBack" :detailsDataProp="detailData" :invoiceType="invoiceType"></audit-detail>
    </div>
  </a-card>
</template>

<script>
import AuditAdd from './auditAdd'
import AuditDetail from './auditDetail'
import {
  getStore,
  setStore
} from '@/utils/storage'
import moment from 'moment'
export default {
  name: 'AuditEdit',
  components: {
    AuditAdd,
    AuditDetail
  },
  props: ['detailsDataProp'],
  computed: {
    checkStyle() {
      if (this.detailsDataProp.verifyStatus === '03') {
        return 'iconcheckPass'
      } else if (this.detailsDataProp.verifyStatus === '02') {
        return 'iconCheckUnpass'
      } else if (this.detailsDataProp.verifyStatus === '01') {
        if (this.detailsDataProp.verifyErrCode === '1108') {
          return 'iconNationTax'
        }
        return 'iconCheckAbnormal'
      }
    }
  },
  created() {
    this.getFirstLogin()
  },
  data() {
    return {
      invoiceType: {
        invoiceType: 1
      },
      addType: null,
      isAdd: true,
      titleData: {},
      queryParam: {
        page: 1,
        size: 10
      },
      accompanyList: {
        param: {
          correlationId: ''
        }
      },
      uploadData: {
        fileType: 1,
        uploadType: 1,
        correlationId: ''
      },
      detailData: {},
    }
  },
  methods: {
    moment,
    getFirstLogin() {
      const invoiceInfo = getStore('EstateId')
      const invoiceEdit = getStore('AUDITEDIT')
      console.log('0916 invoiceInfo=', invoiceInfo)
      if (invoiceEdit && invoiceEdit.isEdit) {
        this.detailData = invoiceEdit
        this.isAdd = true
      } else {
        this.detailData = invoiceInfo
        this.isAdd = false
      }
    },
    scanBack() {
      this.$router.push({
        name: 'AuditManage'
      })
    },
    handleSave(data) {
      this.detailData = data.invoice
      this.isAdd = false
    },
    handleEdit() {
      setStore('AUDITEDIT', this.titleData)
      this.isAdd = true
    }
  },
  watch: {
    $route(to, from) {
      const _that = this
      if (to.name.indexOf('_Edit') !== -1 || to.name.indexOf('_Detail') !== -1) {
        _that.isAdd = true
        _that.getFirstLogin()
      }
    }
  }
}
</script>

<style scoped>
</style>
