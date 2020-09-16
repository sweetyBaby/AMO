import Menu from 'ant-design-vue/es/menu'
import Icon from 'ant-design-vue/es/icon'

const { Item, SubMenu } = Menu

export default {
  name: 'SMenu',
  props: {
    menu: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      openKeys: [],
      selectedKeys: [],
      cachedOpenKeys: [],
      menuIcon: '',
      lastChild: null
    }
  },
  computed: {
    rootSubmenuKeys: vm => {
      const keys = []
      vm.menu.forEach(item => keys.push(item.path))
      return keys
    }
  },
  created () {
    this.updateMenu()
  },
  watch: {
    collapsed (val) {
      if (val) {
        this.cachedOpenKeys = this.openKeys.concat()
        this.openKeys = []
      } else {
        this.openKeys = this.cachedOpenKeys
      }
    },
    $route: function () {
      this.updateMenu()
    }
  },
  methods: {
    // select menu item
    onOpenChange (openKeys, event) {
      if (Array.isArray(openKeys && openKeys.length > 0) && !this.collapsed) {
        return false
      }
      // 在水平模式下时执行，并且不再执行后续
      if (this.mode === 'horizontal') {
        this.openKeys = openKeys
        return
      }
      // 非水平模式时
      // console.info('this.rootSubmenuKeys---',this.rootSubmenuKeys)
      const latestOpenKey = openKeys.find(key => !this.openKeys.includes(key))

      // console.info('latestOpenKey---',latestOpenKey)
      if (!this.rootSubmenuKeys.includes(latestOpenKey)) {
        let newMenuKey = []
        if (!this.collapsed) {
          newMenuKey = openKeys[1].split('/')
        }
        if (!latestOpenKey && !this.collapsed && newMenuKey.length > 2) {
          return false
        }
        this.openKeys = openKeys

        this.openKeys = openKeys
      } else if (!this.collapsed) {
        const { menu } = this
        const selectedMenu = menu.filter(item => item.path === latestOpenKey)
        this.getLastChild(selectedMenu[0])
        this.$router.push(this.lastChild.path)
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    updateMenu () {
      const routes = this.$route.matched.concat()
      const routesName = this.$route.meta.permission[0]
      // console.info('routesName---', routesName)
      if (routesName.indexOf('_Detail') === -1 && routesName.indexOf('_Edit') === -1) {
        if (routes.length >= 4 && this.$route.meta.hidden) {
          routes.pop()
          this.selectedKeys = [routes[2].path]
        } else {
          this.selectedKeys = [routes.pop().path]
        }
      } else {
        let newRoute = ''
        if (routesName.indexOf('_Detail') > -1) {
          newRoute = this.$route.path.replace('_Detail', '')
        } else {
          newRoute = this.$route.path.replace('_Edit', '')
        }
        routes.pop()
        this.selectedKeys = [newRoute]
      }
      // console.info('this.selectedKeys--',this.selectedKeys)
      const openKeys = []
      if (this.mode === 'inline') {
        routes.forEach(item => {
          openKeys.push(item.path)
        })
      }
      this.collapsed ? (this.cachedOpenKeys = openKeys) : (this.openKeys = openKeys)
    },
    getLastChild (menu) {
      // console.info('menu---',menu)
      if (menu.children && Array.isArray(menu.children) && menu.children.length > 0) {
        this.lastChild = menu.children[0]
        this.getLastChild(menu.children[0])
      }
    },
    // render
    renderItem (menu) {
      if (!menu.hidden) {
        return menu.children && !menu.hideChildrenInMenu ? this.renderSubMenu(menu) : this.renderMenuItem(menu)
      }
      return null
    },
    renderMenuItem (menu) {
      // console.info('menuo0000000=-==', menu)
      const target = menu.meta.target || null
      const tag = target && 'a' || 'router-link'
      const props = { to: { name: menu.name } }
      const attrs = { href: menu.path, target: menu.meta.target }
      const metaIcon = menu.meta.icon
      if (!metaIcon || (metaIcon && metaIcon.indexOf('_Detail') === -1)) {
        return (
          <Item {...{ key: menu.path }}>
            <tag {...{ props, attrs }}>
              {this.renderIcon(menu.meta.icon)}
              <span>{menu.meta.title}</span>
            </tag>
          </Item>
        )
      }
      return null
    },
    renderSubMenu (menu) {
      const menuKey = menu.key.split('-')
      // console.info('menu---',menuKey)
      const itemArr = []
      if (!menu.hideChildrenInMenu) {
        menu.children.forEach(item => itemArr.push(this.renderItem(item)))
      }
      if (menuKey.length < 3 && !this.collapsed) {
        // console.info('this.collapsed ---',this.collapsed )
        return (
          <SubMenu {...{ key: menu.path }}>
            <a-tooltip placement="top" slot="title">
              <template slot="title">
                <span>{menu.meta.title}</span>
              </template>
              <span class="menuTitle">{this.renderIcon(menu.meta.icon)}</span>
            </a-tooltip>
            {itemArr}
          </SubMenu>
        )
      }
      return (
        <SubMenu {...{ key: menu.path }}>
          <span slot="title">
            {this.renderIcon(menu.meta.icon)}
            <span>{menu.meta.title}</span>
          </span>
          {itemArr}
        </SubMenu>
      )
    },
    renderIcon (icon) {
      if (icon === 'none' || icon === undefined) {
        return null
      }
      const props = {}
      typeof (icon) === 'object' ? props.component = icon : props.type = icon
      return (
        <i class={'iconfont icon-' + icon} />
      )
    }
  },
  render () {
    const { mode, theme, menu } = this
    const props = {
      mode: mode,
      theme: theme,
      openKeys: this.openKeys,
      openAnimation: ''
    }
    const on = {
      select: obj => {
        this.selectedKeys = obj.selectedKeys
        this.$emit('select', obj)
      },
      openChange: this.onOpenChange
    }
    const menuTree = menu.map(item => {
      if (item.hidden) {
        return null
      }
      return this.renderItem(item)
    })
    // {...{ props, on: on }}
    return (
      <Menu vModel={this.selectedKeys} {...{ props, on: on }}>
        {menuTree}
      </Menu>
    )
  }
}
