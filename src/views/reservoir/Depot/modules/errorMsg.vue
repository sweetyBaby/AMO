<template>
  <a-card :bordered="false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>{{ pageTitle }}</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleBack()">
              <a-tooltip placement="top" v-model="showTool">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back" />
              </a-tooltip>
            </span>
          </div>
        </a-col>
      </a-row>
    </div>
    <div>
      <s-table
        :columns="columns"
        :data="Newstatus==='success'?susseLoadData :loadData"
        rowKey="key"
        ref="table"
        size="default"
        :locale="{emptyText:emptyText}"
      >
        <span slot="status" slot-scope="data, record">
          <span v-if="Newstatus === 'success'">
            <a @click="errorTip(record)">{{data}}</a>
          </span>
          <span v-else>{{data}}</span>
        </span>
      </s-table>
    </div>
  </a-card>
</template>

<script>
import DhEmpty from "@/views/comPublic/DhEmpty";
import { STable } from "@/components";
import {
  DataFilter,
  saveParamsFromStore,
  getParamsFromStore,
  getStore
} from "@/utils/storage";
import { ErrorMsg, susseMsg } from "@/api/depot/depot";

const columns2 = [
  {
    title: "文件编号",
    key: "reportHisId",
    dataIndex: "reportHisId",
    width: "20%"
  },
  {
    title: "描述",
    key: "errorDesc",
    dataIndex: "errorDesc",
    width: "60%",
    scopedSlots: { customRender: "status" }
  },
  {
    title: "错误所在行",
    key: "errorIndex",
    dataIndex: "errorIndex"
  }
];

const columns1 = [
  {
    title: "文件编号",
    key: "reportHisId",
    dataIndex: "reportHisId",
    width: "20%"
  },
  {
    title: "单号",
    key: "docNo",
    dataIndex: "docNo",
    width: "60%",
    scopedSlots: { customRender: "status" }
  },
  {
    title: "处理结果",
    key: "result",
    dataIndex: "result"
  }
];
export default {
  name: "errorMsg",
  components: {
    STable,
    DhEmpty
  },
  props: ["errorData"],
  data() {
    return {
      showTool: false,
      emptyText: <dh-empty />,
      queryParam: {},
      params: {},
      pageTitle: "",
      parentCom: "",
      columns: [],
      Newstatus: null,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return ErrorMsg(Object.assign(this.queryParam, parameter)).then(res => {
          const ErrorMsgList = DataFilter(res, "error");
          return ErrorMsgList;
        });
      },
      susseLoadData: parameter => {
        return susseMsg(Object.assign(this.queryParam, parameter)).then(res => {
          const ErrorMsgList = DataFilter(res, "error");
          return ErrorMsgList;
        });
      }
    };
  },
  created() {
    this.getFirst();
  },
  methods: {
    handleBack() {
      this.$router.push({
        name: this.parentCom,
        params: this.params
      });
      this.showTool = false;
    },

    errorTip(val) {
      let pathTo = "Delivery_Detail";
      let params = val.documentProductList;
      this.$router.push({
        name: pathTo,
        params: {
          proInfo:{
             ...params,
          },
         pageTitle:'文件详情',
          ...this.queryParam,
        }
      });
      val.isTootip = false;
      // console.info('val---',val)
    },

    getFirst() {
      const getParams = getStore("ERRORDETAIL");

      this.pageTitle = getParams.pageTitle;
      this.Newstatus = getParams.newStatus;

      if (this.Newstatus === "success") {
        this.columns = columns1;
      } else {
        this.columns = columns2;
      }
      this.queryParam.reportHisId = getParams.id;
      this.parentCom = getParams.parentCom;
      this.params = {
        ...getParams
      };
    }
  },
  watch: {
    $route(to, from) {
      if (to.name.indexOf("_Detail") !== -1) {
        this.$refs.table.refresh(false);
        this.getFirst();
      }
    }
  }
};
</script>

<style>
</style>