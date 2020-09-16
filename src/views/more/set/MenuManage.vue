<template>
  <a-card :bordered="false">
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="24" :sm="24">
          <h3>菜单设计</h3>
        </a-col>
      </a-row>
    </div>
    <div class="menu">
      <a-form layout="inline" :form="form">
        <a-row>
          <a-col :md="6" :sm="24">
            <div class="proNew-title">
              <i class="iconfont icon-root" />
              <span>菜单</span>
            </div>
          </a-col>
          <a-col :md="2" :sm="12">
            <div class="proNew-title">
              <i class="iconfont icon-edit" />
              <span></span>
            </div>
          </a-col>
          <a-col :md="16" :sm="24">
            <div class="proNew-title">
              <i class="iconfont icon-edit" />
              <span>编辑菜单</span>
            </div>
          </a-col>
        </a-row>
        <a-row style="display: flex;">
          <a-col :md="6" :sm="24" style="flex-grow:1;">
            <div class="proNew">
              <div class="role_check">
                <a-tree
                  showLine
                  @expand="onExpand"
                  :expandedKeys="expandedKeys"
                  :autoExpandParent="autoExpandParent"
                  v-model="checkedKeys"
                  @select="onSelect"
                  :selectedKeys="selectedKeys"
                  :treeData="treeList"
                />
              </div>
            </div>
          </a-col>
          <a-col :md="2" :sm="12" style="flex-grow: 1;text-align: center;line-height: 500px;">
            <div>
              <i class="iconfont icon-menuSet" style="color:#3E4DA8;" ></i>
            </div>
          </a-col>
          <a-col :md="16" :sm="24" style="flex-grow:1;">
            <div class="proNew">
              <div class="proNew-title">
                <span>{{ menuTitle }}</span>

                <div class="icons-list pageTitle-Btn">
                  <span class="titleBtn" @click="handleAddMenu">
                    <a-tooltip placement="top">
                      <template slot="title">
                        <span>新增</span>
                      </template>
                      <i class="iconfont icon-plus"></i>
                    </a-tooltip>
                  </span>
                </div>
              </div>
              <div class="addInput">
                <s-table
                  ref="table"
                  size="default"
                  rowKey="key"
                  :columns="columns"
                  :data="loadData"
                >
                  <span slot="action" slot-scope="text, record">
                    <template>
                      <div class="align-right">
                        <a-button size="small" type="primary" @click="showModal(record)">编辑</a-button>
                        <a-button size="small" type="default" @click="showDeleteConfirm(record)">删除</a-button>
                      </div>
                    </template>
                  </span>
                </s-table>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <create-form
      v-if="visible"
      :title="modalTitle"
      :visibleData="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :modalData="editData"
    ></create-form>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getMenuDesign } from '@/api/manage'
import {
  getMenuList,
  getMenuDatas,
  saveNewMenu,
  deleteMenu
} from '@/api/storage'
import CreateForm from './modules/CreateForm'
import { DataFilter } from '@/utils/storage'
const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' }
        ]
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' }
        ]
      },
      {
        title: '0-0-2',
        key: '0-0-2'
      }
    ]
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' }
    ]
  },
  {
    title: '0-2',
    key: '0-2'
  }
]

export default {
  name: 'MenuManage',
  components: {
    STable,
    CreateForm
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  mounted() {
    this.getTreeData()
  },
  data() {
    return {
      isNewRole: false,
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: ['0-0-0'],
      selectedKeys: [],
      selectedLevel: '',
      parentNo: '',
      queryParam: {
        parentNo: '0-0',
        page: 1,
        size: 10
      },
      treeList: [],
      menuTitle: '视力康系统',
      visible: false,
      editData: {},
      modalTitle: '',
      // loadData:[],
      columns: [
        {
          title: '名称',
          dataIndex: 'menuName',
          align: 'center'
        },
        {
          title: 'url',
          dataIndex: 'menuUrl',
          align: 'center'
        },
        {
          title: '编码',
          dataIndex: 'menuNo',
          align: 'center'
        },
        {
          title: '排序',
          dataIndex: 'menuOrder',
          align: 'center'
        },
        {
          title: '操作',
          width: '150px',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        // console.log('loadData.parameter', parameter)
        return getMenuDatas(Object.assign(this.queryParam, parameter)).then(
          res => {
            const menuList = DataFilter(res, 'menu')
            return menuList
          }
        )
      },
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: {
          show: true,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false
    }
  },
  watch: {
    checkedKeys(val) {
      console.log('onCheck', val)
    }
  },
  methods: {
    tableOption() {
      if (!this.optionAlertShow) {
        this.options = {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = []
            }
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },
    handleEdit(val) {
      console.info(val)
    },
    handleOk(params) {
      // console.info(params);
      this.visible = false
      this.handleNewMenu(params)
    },
    showModal(val) {
      this.editData = val
      this.modalTitle = '编辑菜单'
      this.visible = true
    },
    handleAddMenu() {
      let level
      if (this.selectedLevel === null) {
        level = 0
      } else {
        level = this.selectedLevel + 1
      }
      this.editData = {
        level: level,
        parentNo: this.parentNo
      }
      this.modalTitle = '新增菜单'
      this.visible = true
    },
    handleCancel() {
      this.visible = false
    },
    showDeleteConfirm(val) {
      const _that = this
      this.$confirm({
        title: '删除弹框',
        content: '确定删除该菜单？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          console.log('OK', val)
          const params = {
            menuNo: val.menuNo
          }
          deleteMenu(params).then(res => {
            if (res.message === 'SUCCESS') {
              _that.queryParam.parentNo = val.parentNo
              _that.getTreeData()
              _that.expandedKeys.push(val.parentNo)
              _that.selectedKeys.push(val.parentNo)
              _that.$refs.table.refresh()
            }
          })
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    onExpand(expandedKeys) {
      // console.log('onExpand', expandedKeys)
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(checkedKeys) {
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys
      if (selectedKeys[0] !== '0') {
        this.queryParam.parentNo = selectedKeys[0]
      } else {
        delete this.queryParam['parentNo']
      }

      this.menuTitle = info.node.dataRef.title
      this.selectedLevel = info.node.dataRef.level
      this.parentNo = info.node.dataRef.key
      this.$refs.table.refresh()
    },
    getTreeData(expandKeys) {
      const params = {}
      getMenuList(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.treeList = [{ ...res.data }]
          if (!expandKeys) {
            this.expandedKeys = ['0-0', '0-0-0']
          }
        }
      })
    },
    getMenuData() {
      const params = {
        parentNo: '0-0',
        page: 1,
        size: 10
      }
      getMenuDatas(params).then(res => {
        const menuList = DataFilter(res, 'menu')
        this.loadData = menuList
      })
    },
    handleNewMenu(params) {
      // console.info('this.expandedKeys====',this.expandedKeys)
      saveNewMenu(params).then(res => {
        if (res.message === 'SUCCESS') {
          this.queryParam.parentNo = params.parentNo
          this.expandedKeys.push(params.parentNo)
          this.selectedKeys.push(params.parentNo)
          this.getTreeData(this.expandedKeys)
          this.$refs.table.refresh()
        }
      })
    }
  }
}
</script>

<style lang="less">
.align-right {
  text-align: right;
  .ant-btn-primary {
  }
  .ant-btn-primary {
    background: #fbfbfb !important;
    color: #3e4da8 !important;
    box-shadow: none;
  }
  .ant-btn-primary:hover {
    background: #ececec !important;
  }
  .ant-btn-default:hover {
    background: #ececec !important;
  }
  .ant-btn-default {
    background: #fbfbfb !important;
    color: #3e4da8 !important;
    box-shadow: none;
  }
  button {
    margin: 0 0 0 8px;
    font-size: 14px;
    color: rgba(139, 174, 222, 1);
    line-height: 19px;
    background: #fbfbfb !important;
    border: none;
    &:hover {
      background: rgba(17, 137, 249, 1);
      color: white;
    }
  }
}
.proNew {
  overflow-y: scroll;
  height: 600px;
  padding: 16px 32px;
  background: rgba(252, 252, 252, 1) !important;
  border: 1px solid rgba(236, 236, 236, 1) !important;
  box-shadow: 0 0 0 0 !important;
  .addInput {
    margin: 16px 0 0 0;
  }
}
.proNew-title {
  color: rgba(84, 97, 130, 1);
  font-size: 16px;
  height: 36px;
  width: 100%;
  display: inline-block;
  .iconfont {
    color: rgba(66, 131, 255, 1);
    font-size: 26px;
  }
  span {
    float: left;
    line-height: 36px;
    font-size: 16px;
  }
}

.menu {
  padding: 30px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 20px rgba(172, 173, 183, 0.2);
  opacity: 1;
  border-radius: 8px;
  .ant-tree.ant-tree-show-line li span.ant-tree-switcher {
    background: #fcfcfc;
  }
  ul {
    li {
      .ant-tree-node-content-wrapper:hover {
        background: #ececec;
      }
      .ant-tree-node-selected {
        background: #ececec !important;
      }
    }
  }
}
</style>
