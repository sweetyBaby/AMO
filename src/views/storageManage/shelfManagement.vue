<template>
  <a-card :bordered="false">
    <div class="page_Title">
      <h3>货架管理</h3>
    </div>
    <div class="content">
      <div class="treeManage">
        <p><i class="iconfont icon-root"></i>仓库列表</p>
        <a-tree
          class="draggable-tree"
          :autoExpandParent="autoExpandParent"
          :treeData="treeData"
          :showLine="showLine"
          @select="selectTree"
        />
      </div>
      <div class="huojia">
        <div class="header_top">
          <template>
            <p><i class="iconfont icon-edit"></i>编辑货架</p>
            <!-- 名称 -->
            <p>{{ selectObj }}</p>
          </template>
          <div class="icon_add">
            <i class="iconfont icon-plus" @click="openHJ('add')"></i>
          </div>
        </div>
        <div class="content">
          <a-table
            :columns="columns"
            :dataSource="data"
            :pagination="pagination"
            :locale="{emptyText: '暂无数据'}"
          >
            <template slot="name" slot-scope="text">
              <div class="textTruncate" style="width:200px">{{ text }}</div>
            </template>
            <template slot="action" slot-scope="text">
              <div class="common_action_btns">
                <a-button class="button" size="small" type="default" @click="editColumn()">编辑</a-button>
                <a-button class="button" size="small" type="default" @click="deleteColumn">删除</a-button>
              </div>
            </template>
          </a-table>
        </div>

      </div>
    </div>
    <!-- 显示新增编辑库位弹窗 -->
    <show-location ref="showLocationState" :type="locationType"></show-location>
  </a-card>
</template>

<script>
import moment from 'moment'
import { getAuditList } from '@/api/manage'
import showLocation from './modules/showLocation'
const statusMap = {
  1: {
    status: 'success',
    text: '已审核'
  },
  2: {
    status: 'error',
    text: '未审核'
  }
}
const data = [
  {
    key: '1',
    name: 'asrieuasrieuqwaieuasrieuqwaieuqwaieu',
    leixing: 'daima'
  }
]
const columns = [
  {
    title: '名称',
    dataIndex: 'state',
    width: 100
  },
  {
    title: '编号',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '商铺数量',
    dataIndex: 'number',
  },
  {
    title: '状态',
    dataIndex: '',
  },

  {
    title: '操作',
    width: '150px',
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'ShelfMansge',
  components: {
    showLocation
  },
  data() {
    return {
      // 表格头部
      columns,
      // 表格数据
      data,
      // 分页
      pagination: {},
      // 全部展开
      autoExpandParent: true,
      showLine: true,
      // 树数据
      treeData: [{
        title: 'parent 1',
        key: 'parent 1',
        children: [{
          title: 'parent 1-0',
          key: 'parent 1-01',
          children: [
            { title: 'leaf', key: 'parent 1-0', disableCheckbox: true },
            { title: 'leaf', key: 'parent 1-0111' },
          ],
        }, {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [
            { key: '0-0-1-0', slots: { title: 'title0010' } },
          ],
        }],
      }],
      // 选择的树对象
      selectObj: '',
      locationType: ''
    }
  },
  filters: {
  },
  created() {},
  methods: {
    // 新增编辑库位
    openHJ(type) {
      this.$refs.showLocationState.show()
      this.locationType = type
    },
    // 删除
    deleteColumn() {},
    // 编辑
    editColumn(data) {
      console.log(data)
    },
    // 选择树
    selectTree(selectedKeys, info) {
      console.log(info)
      // this.selectObj = data[0]
    }
  }
}
</script>
<style lang="less" scoped>
.content{
  display: flex;
  .treeManage{

    width:35%;
    i{
      padding-right: 10px;
      color: #4283ff;
      font-size: 20px;
    }
    .draggable-tree{
      height:400px;
      min-height: 400px;
      max-height: 400px;
      overflow: auto;
      border: 1px solid #DBE7FD
    }
  }
  .huojia{
    flex:1;
    .header_top{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .content{
      height:400px;
      min-height: 400px;
      max-height: 400px;
      overflow: auto;
      border: 1px solid #DBE7FD;
      border-left:none;
    }
    .icon_add{
      i{
        color: #4283ff;
        font-size: 18px;
      }
    }
    i{
      padding-right: 10px;
      color: #4283ff;
      font-size: 20px;
    }
  }

}
</style>
<style lang="less">
.treeManage{
  .ant-tree-node-content-wrapper{
    background: #F7FAFF;
    width:180px;
    height:42px!important;
    line-height:42px!important;
  }
  .ant-tree-node-selected{
    background: #4283ff;
  }
  .ant-tree-switcher{
    height:42px!important;
    line-height:42px!important;
  }
}
</style>
