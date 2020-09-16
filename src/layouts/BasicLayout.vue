<template>
  <a-layout :class="['layout', device]">
    <!-- SideMenu -->
    <a-drawer
      v-if="isMobile()"
      placement="left"
      :wrapClassName="`drawer-sider ${navTheme}`"
      :closable="false"
      :visible="collapsed"
      @close="drawerClose"
    >
      <side-menu
        mode="inline"
        :menus="menus"
        theme="light"
        :collapsed="false"
        :collapsible="true"
        @menuSelect="menuSelect"
      ></side-menu>
    </a-drawer>

    <side-menu
      v-else-if="isSideMenu()"
      mode="inline"
      :menus="menus"
      theme="light"
      :collapsed="collapsed"
      :collapsible="true"
    ></side-menu>

    <a-layout
      :class="[layoutMode, `content-width-${contentWidth}`]"
      :style="{ paddingLeft: contentPaddingLeft, background: '#fff', minHeight: '100vh'}"
    >
      <!-- layout header -->
      <global-header
        :mode="layoutMode"
        :menus="menus"
        theme="light"
        :collapsed="collapsed"
        :device="device"
        @toggle="toggle"
      />
      <!-- layout content -->
      <a-layout-content
        :style="{ height: '100%', paddingTop: fixedHeader ? '80px' : '0', marginTop:'-60px' }"
      >
        <!--                <multi-tab></multi-tab>-->
        <transition name="page-transition">
          <route-view />
        </transition>
      </a-layout-content>
      <setting-drawer v-if="!production"></setting-drawer>
    </a-layout>
  </a-layout>
</template>

<script>
import { triggerWindowResizeEvent } from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'
import config from '@/config/defaultSettings'

import RouteView from './RouteView'
import MultiTab from '@/components/MultiTab'
import SideMenu from '@/components/Menu/SideMenu'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
import SettingDrawer from '@/components/SettingDrawer'
import { asyncRouterMap } from '@/config/router.config.js'

import { Modal } from 'ant-design-vue'
export default {
  name: 'BasicLayout',
  mixins: [mixin, mixinDevice],
  components: {
    RouteView,
    MultiTab,
    SideMenu,
    GlobalHeader,
    GlobalFooter,
    SettingDrawer
  },
  data () {
    return {
      mesageLis: [],
      websock: null,
      production: config.production,
      // navTheme: config.navTheme,
      collapsed: true,
      menus: []
      // TitleSelect:meta.title
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters
    }),
    contentPaddingLeft () {
      if (!this.fixSidebar || this.isMobile()) {
        return '0'
      }
      if (this.sidebarOpened) {
        return '320px'
      }
      return '80px'
    }
  },
  watch: {
    sidebarOpened (val) {
      this.collapsed = !val
    }
  },
  created () {
    this.axios.post('index/fetchIndexInfos').then(res => {})
    let hasRoute = 0
    let newRoute = ''
    this.menus = this.mainMenu.find(item => item.path === '/').children
    console.info('this.menus===', this.menus)
    const routeList = this.mainMenu[0].children
    const currentRoute = this.$router.currentRoute.path
    const newPath = currentRoute.split('/')
    // console.info('currentRoute====',newPath[3])
    if (newPath[3].indexOf('_Detail') === -1 && newPath[3].indexOf('_Edit') === -1) {
      routeList.map((item, index) => {
        item.children.map((second, i) => {
          second.children.map((third, j) => {
            if (index === 0 && i === 0 && j === 0) {
              newRoute = third.path
            }
            if (third.path === currentRoute) {
              hasRoute = 1
            }
          })
        })
      })
    }

    // console.info('hasRoute---',hasRoute)
    if (hasRoute === 0) {
      this.$router.push({ path: newRoute })
    }

    if (this.$router.currentRoute.path === '/') {
      this.$router.push({
        path: '/dashboard/home/homePage'
      })
      this.collapsed = true
      this.setSidebar(false)
      triggerWindowResizeEvent()
    }
    if (this.$router.currentRoute.path === '/dashboard/home/homePage') {
      // this.sidebarOpened = false
      this.collapsed = true
      this.setSidebar(false)
      triggerWindowResizeEvent()
    } else {
      this.collapsed = !this.sidebarOpened
    }
    var formData = new FormData()
    formData.append('propKey', 'innovamed.ws.cluster.route.url')
    this.axios.post('boot/fetchProperty', formData).then(res => {
      this.initWebSocket(res.data)
    })
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
  },
  methods: {
    initWebSocket (val) {
      console.log(val)
      console.log('建立连接')
      // 初始化weosocket
      const wsuri = val + this.$store.state.user.info.distCode
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage // 客户端接收服务端数据时触发
      this.websock.onopen = this.websocketonopen // 连接建立时触发
      this.websock.onerror = this.websocketonerror // 通信发生错误时触发
      this.websock.onclose = this.websocketclose // 连接关闭时触发
    },
    websocketonopen () {
      // 连接建立之后执行send方法发送数据
      const actions = { test: '12345' }
      this.websocketsend(JSON.stringify(actions))
    },
    websocketonerror () {
      // 连接建立失败重连
      console.log('连接失败')
      this.initWebSocket()
    },
    websocketonmessage (e) {
      // 数据接收
      // console.log(val);
      const redata = JSON.parse(e.data)
      this.mesageList = redata

      this.mesageList.map((item, index) => {
        const h = this.$createElement
        const newContent = item.noticeContent.split('<br/>')
        this.$notification['success']({
          class: 'noticeStyle',
          message: h('h4', {}, item.noticeTitle),
          description: h(
            'div',
            {},
            newContent.map(item => {
              return h('p', item)
            })
          ),
          duration: 4
        })
      })
    },

    websocketsend (Data) {
      // 数据发送
      this.websock.send(Data)
    },

    websocketclose (e) {
      // 关闭
      console.log('断开连接', e)
    },
    ...mapActions(['setSidebar']),
    toggle () {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
      triggerWindowResizeEvent()
      this.$store.dispatch('changeSidebar')
    },
    paddingCalc () {
      let left = ''
      if (this.sidebarOpened) {
        left = this.isDesktop() ? '320px' : '80px'
      } else {
        left = (this.isMobile() && '0') || ((this.fixSidebar && '80px') || '0')
      }
      return left
    },
    menuSelect () {
      if (!this.isDesktop()) {
        this.collapsed = false
      }
    },
    drawerClose () {
      this.collapsed = false
    }
  }
}
</script>

<style lang="less">
@import url("../components/global.less");

/*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */
.noticeStyle {

    // padding: 0 16px 0 32px;
    .ant-notification-notice-description {
      max-height: 320px;
      overflow-y: auto;
      > div {
        padding-right: 10px;
        p {
          margin: 0;
        }
      }
    }
  }

.ant-layout {
  overflow: hidden;
}
.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
