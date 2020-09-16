<template>
  <div>
    <div class="pageTitle">
      <a-row :gutter="48">
        <a-col :md="16" :sm="24">
          <h3>新增角色管理</h3>
        </a-col>
        <a-col :md="8" :sm="24">
          <div class="icons-list pageTitle-Btn">
            <span class="titleBtn" @click="handleBack()">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>返回</span>
                </template>
                <i class="iconfont icon-back"></i>
              </a-tooltip>
            </span>
            <span class="titleBtn" @click="handleSubmit">
              <a-tooltip placement="top">
                <template slot="title">
                  <span>保存</span>
                </template>
                <i class="iconfont icon-save"></i>
              </a-tooltip>
            </span>
            <!-- <span class="titleBtn">
            <a-tooltip placement="top">
              <template slot="title">
                <span>取消</span>
              </template>
              <i class="iconfont icon-cancle"></i>
            </a-tooltip>
            </span>-->
          </div>
        </a-col>
      </a-row>
    </div>
    <a-form layout="inline" :form="form">
      <div class="proNewBorder">
        <!-- <div class="proNew-title">
          <i class="iconfont icon-infor" />
          <span>用户基本信息</span>
        </div>-->
        <a-row :gutter="24">
          <a-col :md="8" :sm="24">
            <div class="addInput">
              <div class="addInput-title">
                <span>角色名称</span>
                <!-- <small>*</small> -->
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['roleName', { rules: [{ required: true, message: '请输入用户名！', whitespace: true }]}]"
                    style="width: 100%"
                    placeholder="用户名"
                  />
                </a-form-item>
              </div>
            </div>
          </a-col>
          <a-col :md="8" :sm="24">
            <div class="addInput">
              <div class="addInput-title">
                <span>角色描述</span>
                <!-- <small>*</small> -->
              </div>
              <div class="adInput-input">
                <a-form-item style="width: 100%" has-feedback>
                  <a-input
                    v-decorator="['roleDes', { rules: [{ required: true, message: '请输入角色描述！', whitespace: true }]}]"
                    style="width: 100%"
                    placeholder="请输入角色描述"
                  />
                </a-form-item>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="containTree">
        <a-row style="display: flex;">
          <a-col span="7" style="flex-grow: 1;">
            <div>
              <div class="role-title">
                <i class="iconfont icon-infor" />
                <span class="tree_title">配置菜单角色权限</span>
                <div class="tree_node">
                  注：此项目选择是否展示"
                  <span>页面</span>"
                </div>
              </div>
              <div class="role_check">
                <a-tree
                  checkable
                  @expand="onExpand"
                  :expandedKeys="expandedKeys"
                  :autoExpandParent="autoExpandParent"
                  v-model="checkedKeys"
                  @select="onSelect"
                  :selectedKeys="selectedKeys"
                  :treeData="treeList"
                  @check="treeCheck"
                />
              </div>
            </div>
          </a-col>
          <a-col span="2" style="flex-grow: 1;text-align: center;line-height: 500px;">
            <div>
              <i class="iconfont icon-menuSet" style="color:#3E4DA8;" />
            </div>
          </a-col>
          <a-col span="15" style="flex-grow: 1;">
            <div class="role_right">
              <!-- <div class="proNew-title">{{menuTitle}}页面按钮配置</div>
              <p class="tree_node">
                注：此项目选择是否展示"
                <span>页面</span>"
              </p>-->
              <div class="role-title">
                <i class="iconfont icon-infor" />
                <span class="tree_title">{{ menuTitle }}页面按钮配置</span>
                <div class="tree_node">
                  注：此项目选择是否展示"
                  <span>页面的按钮</span>"
                </div>
              </div>
              <div class="roleBtn">
                <template v-if="showMsg">
                  <div v-for="item in menuSubList" class="roleBorder">
                    <div class="roleBorderTitle">
                      <a-checkbox
                        :indeterminate="item.indeterminate"
                        @change="onCheckAllChange(item)"
                        :checked="item.checkAll"
                        @click="item.checkAll = !item.checkAll"
                      >{{ item.title }}</a-checkbox>
                    </div>
                    <br />
                    <div v-for="menu in item.newBtn" class="menuLeft">
                      <a-checkbox
                        @change="onChange(item)"
                        :checked="menu.isactive"
                        @click="menu.isactive = !menu.isactive"
                        :defaultValue="defaultVal"
                      >{{ menu.title }}</a-checkbox>
                      <!--<a-checkbox-group :options="plainOptions" @change="onChange" />-->
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div style="text-align: center; position: relative;top: 30%;"><img src="../../../assets/roleMsg.png"/>
                                                                                <p style="color:#939393;">请先勾选左边“配置角色菜单权限”</p>
                  </div>
                </template>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-form>
  </div>
</template>

<script>
import { getMenuList, getMenuRole, addMenuList } from '@/api/storage'
import { DataFilter } from '@/utils/storage'

export default {
  name: 'AddNewPro',
  props: ['roleData'],
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    this.getTreeData()
    this.form.setFieldsValue({
      roleName: this.roleData.roleName,
      roleDes: this.roleData.roleDes
    })
  },
  data () {
    // console.info("roleDataEdit---", this.roleData);
    return {
      showMsg: false,
      addBtn: true,
      queryParam: {},
      treeList: [],
      indeterminate: true,
      checkAll: false,
      autoExpandParent: true,
      expandedKeys: [],
      checkedKeys: [],
      selectedKeys: [],
      menuTitle: '权限管理',
      checkedMenu: [],
      checkedList: [],
      menuSubList: [],
      menuCheck: [],
      checkTabList: [],
      defaultVal: ['0-0-0-0', '0-0-0-1']
    }
  },
  methods: {
    handleChange (val) {
      console.info('val---', val)
    },
    handleBack () {
      this.$emit('handleBack', false)
    },
    handleLineSel (val) {
      let inputVal
      this.prolistData.map(tag => {
        if (tag.id === val) {
          inputVal = tag.name
        }
      })
      let lineTag = this.lineTag
      if (inputVal && lineTag.indexOf(inputVal) === -1) {
        lineTag = [...lineTag, inputVal]
      }
      Object.assign(this, {
        lineTag
      })
    },
    handleClose (removedTag) {
      const tags = this.lineTag.filter(tag => tag !== removedTag)
      this.lineTag = tags
    },
    handleSubmit (e) {
      e.preventDefault()
      const _that = this
      const treeAllList = this.treeList
      if (Array.isArray(this.checkedKeys) && this.checkedKeys.length > 0) {
        this.checkedKeys.map(item => {
          treeAllList[0].children.map(second => {
            if (second.key === item && !_that.menuCheck.includes(second.id)) {
              _that.menuCheck.push(second.id)
            }
            second.children.map(third => {
              if (third.key === item && !_that.menuCheck.includes(third.id)) {
                _that.menuCheck.push(third.id)
                if (!_that.menuCheck.includes(second.id)) {
                  _that.menuCheck.push(second.id)
                }
              }
              third.children.map(four => {
                if (four.key === item && !_that.menuCheck.includes(four.id)) {
                  _that.menuCheck.push(four.id)
                  if (!_that.menuCheck.includes(third.id)) {
                    _that.menuCheck.push(third.id)
                  }
                  if (!_that.menuCheck.includes(second.id)) {
                    _that.menuCheck.push(second.id)
                  }
                }
                four.children.map(btn => {
                  // 按钮层
                  if (btn.key === item && !_that.menuCheck.includes(btn.id)) {
                    if (!_that.menuCheck.includes(four.id)) {
                      _that.menuCheck.push(four.id)
                    }
                    _that.menuCheck.push(btn.id)
                  }
                })
              })
            })
          })
        })
      }
      // this.checkTabList.map(item => {
      //   item.data.map(tab => {
      //     tab.newBtn.map(btn => {
      //       if (btn.isactive && this.menuCheck.indexOf(btn.id) === -1) {
      //         this.menuCheck.push(btn.id)
      //       }
      //     })
      //   })
      // })
      const newList = this.menuCheck.map(menu => {
        return {
          id: menu
        }
      })
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const newParams = {
            roleName: values.roleName,
            roleDes: values.roleDes,
            list: newList,
            roleId: this.roleData.id
          }
          // console.info('newList-----',newList)
          this.handleAddMenu(newParams)
        }
      })
    },

    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },

    treeCheck (checkMenu, nodes) {
      // console.log('======',nodes);
      const chechedMenu = nodes.node.dataRef.key
      const MenuChecked = nodes.checked
      const newSubList = this.menuSubList
      if (MenuChecked === false) {
        newSubList.map(item => {
          if (item.key === chechedMenu) {
            item.indeterminate = false
            item.checkAll = false
            item.newBtn.forEach(menu => {
              menu.isactive = false
            })
          }
        })
      }
    },
    onSelect (selectedKeys, info) {
      // console.info('selectedKeys===',selectedKeys)
      if (info === undefined || info.node.dataRef.level === 0) {
        this.showMsg = false
      } else {
        this.showMsg = true
      }
      this.selectedKeys = selectedKeys
      const checkAlready = []
      this.checkTabList.map(item => {
        if (item.key === selectedKeys[0]) {
          checkAlready.push(item.key)
        }
      })
      if (checkAlready.length > 0) {
        this.checkTabList.map(item => {
          if (item.key === selectedKeys[0]) {
            this.menuSubList = item.data
          }
        })
      } else {
        let selectLevel = ''
        let selectId = ''
        let newCheckList = []
        this.treeList[0].children.map(item => {
          item.children.map(menu => {
            if (menu.key === selectedKeys[0]) {
              newCheckList = menu
              selectLevel = menu.level
              selectId = menu.id
            }
          })
        })
        if (selectLevel === 1) {
          this.menuTitle = newCheckList.title
          const newSubs = newCheckList.children.map(item => {
            let checkLen = 0
            const newBtn = item.children.map(btn => {
              if (this.defaultVal.includes(btn.key)) {
                checkLen = checkLen + 1
                return {
                  isactive: true,
                  ...btn
                }
              }
              return {
                isactive: false,
                ...btn
              }
            })
            return {
              checkAll: checkLen > 0 && checkLen === item.children.length,
              indeterminate: checkLen > 0 && checkLen < item.children.length,
              parentId: newCheckList.id,
              newBtn,
              ...item
            }
          })
          this.menuSubList = newSubs
          this.checkTabList.push({
            key: selectedKeys[0],
            data: this.menuSubList,
            id: selectId
          })
        }
      }
      // console.info('----',this.checkTabList)
    },
    onChange (checkList) {
      const _that = this
      const menuCheck = []
      const newCheckKey = checkList.key
      const checkI = this.checkedKeys.indexOf(newCheckKey)
      const newCheckList = this.checkedKeys
      // 添加父级ID
      checkList.newBtn.forEach(item => {
        if (item.isactive === true && menuCheck.indexOf(item.id) < 0) {
          // 添加选中按钮id
          // console.info('item.id---',item.id)
          menuCheck.push(item.id)
          // 选中可以添加
          if (newCheckList.indexOf(item.key) === -1) {
            newCheckList.push(item.key)
          }
        } else if (item.isactive === false) {
          // 选中可以删除
          if (newCheckList.includes(item.key)) {
            const newIndex = newCheckList.findIndex(check => check === item.key)
            newCheckList.splice(newIndex, 1)
          }
        }
      })
      // 右侧按钮选中效果
      checkList.indeterminate = menuCheck.length > 0 && checkList.children.length > menuCheck.length
      checkList.checkAll = checkList.children.length === menuCheck.length
      // 添加左侧选中效果
      if (checkI < 0 && menuCheck.length > 0) {
        this.checkedKeys.push(newCheckKey)
      }
    },
    onCheckAllChange (menuList) {
      // console.info('menuList---', menuList)
      menuList.indeterminate = false
      if (this.checkedKeys.indexOf(menuList.key) < 0 && menuList.checkAll) {
        this.checkedKeys.push(menuList.key)
      }
      // else if (!menuList.checkAll && this.checkedKeys.indexOf(menuList.key) !== -1) {
      //   const newIndex = this.checkedKeys.findIndex(checkKey => checkKey === menuList.key)
      //   this.checkedKeys.splice(newIndex, 1)
      // }
      menuList.newBtn.forEach(menu => {
        menu.isactive = menuList.checkAll
        if (this.checkedKeys.indexOf(menu.key) < 0) {
          this.checkedKeys.push(menu.key)
        } else if (this.checkedKeys.indexOf(menu.key) !== -1 && !menu.isactive) {
          const newIndex = this.checkedKeys.findIndex(checkKey => checkKey === menu.key)
          this.checkedKeys.splice(newIndex, 1)
        }
      })
    },
    getTreeData () {
      const params = {}
      getMenuList(params).then(res => {
        // console.info('getMenuList---',res)
        if (res.message === 'SUCCESS') {
          const getMenuList = JSON.parse(JSON.stringify(res.data))
          getMenuList.children.map(second => {
            second.children.map(third => {
              third.children.map(menus => {
                // console.info('menus---',menus)
                if (menus.menuUrl.indexOf('_Edit') !== -1 || menus.menuUrl.indexOf('_Detail') !== -1) {
                  // console.info('menus---',menus)
                  menus.disabled = true
                  menus.disableCheckbox = false
                }
              })
            })
          })
          this.treeList = [{ ...getMenuList }]
          this.expandedKeys = ['0-0', '0-0-0']
          this.selectedKeys = ['0-1-0']
          this.getMenuRole()
        }
      })
    },

    getMenuRole () {
      let params = {}
      if (this.roleData.id) {
        params = {
          roleId: this.roleData.id
        }
        getMenuRole(params).then(res => {
          // console.info('getMenuRole---',res)
          const CheckList = res.data.map(item => {
            return item.menuNo
          })
          if (CheckList !== '') {
            const newSelect = CheckList[0].split('-')
            this.checkedKeys = CheckList
            this.defaultVal = CheckList
            this.expandedKeys = [newSelect[0] + '-' + newSelect[1]]
            for (let i = 0; i++; i < newSelect.length - 1) {
              this.selectedKeys = this.selectedKeys + newSelect[i] + '-'
            }
          }
          this.onSelect(this.selectedKeys)
        })
      }
    },
    handleAddMenu (val) {
      // console.info('val----',val)
      addMenuList(val).then(res => {
        // console.info(res)
        if (res.message === 'SUCCESS') {
          this.$emit('handleBack', false)
        }
      })
    }
  }
}
</script>
<style lang="less">
//新增页面边框
.proNewBorder {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 5px 20px rgba(172, 173, 183, 0.2);
  opacity: 1;
  border-radius: 4px;
  padding: 30px 40px;
  margin-top: 20px;

  .role-title {
    color: #34353e;
    font-size: 14px;
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
      font-size: 14px;
      color: #34353e;
    }
  }

  /* 不可修改时的样式 */
  .ban_update {
    .addInput-title {
      .ban_small {
        float: right;
        color: rgba(62, 77, 168, 1) !important;
        opacity: 1;
      }
    }

    .adInput-input {
      .ant-input {
        background: rgba(236, 236, 236, 1) !important;
        color: rgba(193, 193, 193, 1) !important;
        opacity: 1 !important;
      }
    }
  }

  .addInput {
    margin-bottom: 30px;

    .addInput-title {
      padding: 0 0 8px 0;
      font-size: 14px;

      span {
        color: #939393;
      }

      small {
        color: #e17877;
        margin-right: 5px;
        float: left;

        &.addInput-tips {
          color: rgba(170, 174, 185, 1);
        }
      }
    }
  }

  .adInput-input {
    /* >input {
                background: rgba(247, 250, 255, 1);
                border: 1px solid rgba(205, 223, 252, 1);
                color: rgba(159, 172, 195, 1);
            } */
    .ant-calendar-picker {
      max-width: 100% !important;
    }
    .begin_date {
      .anticon-calendar {
        color: #3e4da8;
      }
    }

    .ant-select-selection--single {
      height: 42px;
    }

    .ant-select-selection__rendered {
      line-height: 42px;
    }

    .ant-form-item,
    .ant-form-item-control-wrapper,
    .ant-form-item-control {
      width: 100%;
    }

    .ant-select-selection {
      background: rgba(252, 252, 252, 1) !important;
      border: 1px solid #ececec !important;
    }

    .ant-input {
      width: 100%;
      height: 44px;
      background: rgba(252, 252, 252, 1);
      border: 1px solid rgba(236, 236, 236, 1);
      opacity: 1;
      border-radius: 4px;
    }

    .ant-input-affix-wrapper .ant-input-suffix {
      .icon-cancle {
        color: rgba(205, 223, 252, 1);
        font-size: 24px;
      }
    }
  }
}

.ant-form-inline .ant-form-item-with-help {
  margin: 0;
}

.roleBorder {
  padding: 24px 0;
  &:first-child {
    padding: 0 0 24px 0;
  }
  .roleBorderTitle {
    border-bottom: 1px solid #ececec;
    padding: 0 0 8px 0;
    font-size: 16px;
    font-weight: bold;
  }
}
.menuLeft {
  display: inline-block;
}

/*控制按钮不显示*/
.ant-tree {
  > li > ul > li > ul > li > ul > li > span.ant-tree-switcher {
    visibility: hidden;
  }
}

.containTree {
  width: 100%;
  background: #ffffff;
  -webkit-box-shadow: 0px 5px 20px rgba(172, 173, 183, 0.2);
  box-shadow: 0px 5px 20px rgba(172, 173, 183, 0.2);
  opacity: 1;
  border-radius: 8px;
  padding: 30px 30px;
  margin-top: 20px;
  .role_check {
    // overflow-x: scroll;
    overflow-y: scroll;
    height: 361px;
    background: rgba(252, 252, 252, 1);
    border: 1px solid rgba(236, 236, 236, 1);
    opacity: 1;
    border-radius: 4px;
    margin-top: 21px;
    padding: 33px 41px;
    .ant-tree li {
      .ant-tree-title {
        color: #939393;
      }
      .ant-tree-node-selected {
        background-color: #ececec;
      }
      .ant-tree-node-content-wrapper:hover {
        background: #ececec;
      }
    }
  }
  .role-title {
    .tree_title {
      color: #34353e;
      opacity: 1;
    }
    .tree_node {
      margin-bottom: 0px;
      font-size: 14px;
      span {
        color: #3e4da8;
      }
    }
  }

  .role_right {
    .roleBtn {
      padding: 30px;
      overflow-y: scroll;
      margin-top: 21px;
      height: 361px;
      background: rgba(252, 252, 252, 1);
      border: 1px solid rgba(236, 236, 236, 1);
      opacity: 1;
      border-radius: 4px;
      .ant-checkbox-wrapper {
        color: #49494b;
        font-weight: 500;
      }
    }
  }
}
</style>
