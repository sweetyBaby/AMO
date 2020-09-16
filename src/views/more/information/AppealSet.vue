<template>
  <a-card :bordered="false" v-if="!isAdd ">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>申诉设置</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleAdd()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>新增关账设置</span>
                </template>
                <i class="iconfont icon-plus" />
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleSearch()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>展开搜索</span>
                </template>
                <i class="iconfont icon-search" />
              </a-tooltip>
            </span>
          </div>
        </a-col>
      </a-row>
    </div>
    <div v-if="!isEmpty">
      <a-drawer
        title="搜索条件"
        placement="right"
        @close="onSearchClose"
        :visible="isShowSearch"
        wrapClassName="searchWrap"
        width="340"
      >
        <a-form layout="inline">
          <div class="searchWrap">
            <div class="searchList">
              <label for>经销商名称</label>
              <a-select
                placeholder="请选择经销商名称"
                style="width: 100%"
                v-model="queryParam.distCode"
                :filterOption="filterOption"
                showSearch
              >
                <a-select-option
                  v-for=" (item,index) in distList"
                  :value="item.distCode"
                  :key="index"
                >{{ item.distName }}</a-select-option>
              </a-select>
            </div>
            <div class="searchList">
              <label for>库位名称</label>
              <a-input placeholder="输入库位名称" style="width: 100%" v-model="queryParam.code" />
            </div>
          </div>
          <span class="table-page-search-submitButtons">
            <a-button type="primary" size="small" @click="retriveTable">查询</a-button>
            <a-button style="margin-left: 8px" size="small" @click="() => queryParam = {}">重置</a-button>
          </span>
        </a-form>
      </a-drawer>
      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :pageSize="queryParam.size"
        :locale="{emptyText:emptyText}"
      >
        <!-- <span slot="isPrimary" slot-scope="text">
          <span :status-map="orPrimary">{{orPrimary[text].text}}</span>
        </span>
        <span slot="type" slot-scope="text">
          <span :status-map="typeWareHouse">{{typeWareHouse[text].text}}</span>
        </span>-->
        <!-- <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span> -->
        <span slot="action" slot-scope="text, record">
          <a-popover placement="bottomRight" overlayClassName="tableBtn" v-if="record.type!=2">
            <template slot="title">
              <a href="javascript:;" @click="handleAdd(record)" v-if="hasPermission('edit')">
                <i class="iconfont icon-table-edit" />编辑
              </a>
              <a href="javascript:;" @click="deleData(record)" v-if="record.isPrimary=='0' && hasPermission('delete')">
                <i class="iconfont icon-tableEmpty" />删除
              </a>
              <a
                href="javascript:;"
                @click="mainBlank(record)"
                v-if="record.isPrimary=='0'&&record.type=='1' && hasPermission('mainHost')"
              >
                <i class="iconfont icon-use" />更新为主库
              </a>
            </template>
            <span>
              <i class="iconfont icon-tableMore" style="font-size:28px" />
            </span>
          </a-popover>
        </span>
      </s-table>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'CloseAccount'
}
</script>

<style scoped>

</style>
