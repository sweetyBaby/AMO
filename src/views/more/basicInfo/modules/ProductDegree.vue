<template>
  <div class="degree">
    <a-input-search placeholder="请输入名称搜索" @search="onSearch" v-model="inputName">
      <a-button slot="enterButton">搜索</a-button>
    </a-input-search>
    <div class="card_degree">
      <div class="add_degree">
        <a class="add_cont_degree" href="javascript:;" @click="addDegree">
          <i class="iconfont icon-plus" />
        </a>
        <span class="add">添加</span>
      </div>
      <div style="display:flex" v-for="(item,index) in showCardLinst " :key="index">
        <div
          class="card_contain_degree"
          v-if="item.orUpdate"
          :style="{background:item.status==0?'':'#ececec'}"
        >
          <p class="card_contain">
            <span class="degree_num">{{ item.degree }}D</span>
            <a href="javascript:;" class="ban_btn" v-if="item.status==0" @click="banDegree(item)">禁用</a>
            <a href="javascript:;" class="ban_btn" v-if="item.status==1" @click="useDegree(item)">启用</a>
          </p>
        </div>
        <div class="card_update_degree" v-else>
          <p class="card_contain">
            <a-form layout="inline" :form="form">
              <a-form-item style="width: 100%" has-feedback :validate-status="item.num">
                <a-input placeholder="度数" v-model="item.degree" />
              </a-form-item>
            </a-form>
            <a-tooltip placement="top">
              <template slot="title">
                <span>保存</span>
              </template>
              <a
                href="javascript:;"
                @click="saveDegree(item)"
                class="save"
                style="margin-left:5px;"
              >
                <i class="iconfont icon-save" />
              </a>
            </a-tooltip>
            <a-tooltip placement="top">
              <template slot="title">
                <span>删除</span>
              </template>
              <a class="card_save" href="javascript:;" @click="delelAdd(item)" v-if="item.orDele">
                <i class="iconfont icondele" />
              </a>
            </a-tooltip>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import notification from 'ant-design-vue/es/notification'
export default {
  name: 'ProductDegree',
  props: ['degreeData'],
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {},
  components: {},
  data() {
    return {
      currentIndex: 0,
      newDegreeList: [],
      degree: null,
      showCardLinst: [],
      inputName: null
    }
  },
  mounted() {
    if (this.degreeData.length > 0) {
      this.showCardLinst = this.degreeData.map((item, index) => {
        return {
          orUpdate: true,
          isAdd: false,
          num: 'success',
          orDele: false,
          ...item
        }
      })
    } else {
      this.showCardLinst = []
    }
  },
  methods: {
    delelAdd(item) {
      this.showCardLinst.splice(0, 1)
      this.currentIndex = 0
    },
    onSearch() {
      this.showCardLinst = this.degreeData.map((item, index) => {
        return {
          orUpdate: true,
          isAdd: false,
          num: 'success',
          orDele: false,
          ...item
        }
      })
      if (this.inputName != '' && this.inputName != null) {
        this.showCardLinst = this.showCardLinst.filter(item => {
          if (item.degree == null) {

          } else {
            return item.degree.indexOf(this.inputName) >= 0
          }
        })
      } else {
        this.showCardLinst = this.showCardLinst
      }
    },
    changeDergee(e) {
      this.degree = e.target.value
    },
    banDegree(val) {
      val.status = 1
      const index = this.newDegreeList.findIndex((value, index) => {
        return val.degree == value.degree
      })
      if (index >= 0) {
        this.newDegreeList[index] = val
      } else {
        this.newDegreeList.push(val)
      }
    },
    useDegree(val) {
      val.status = 0
      const index = this.newDegreeList.findIndex((value, index) => {
        return val.degree == value.degree
      })
      if (index >= 0) {
        this.newDegreeList[index] = val
      } else {
        this.newDegreeList.push(val)
      }
    },
    addDegree() {
      const obj = {
        degree: '',
        orUpdate: false,
        num: '',
        status: 0,
        orDele: true
      }
      this.showCardLinst.map((item, index) => {
        if (item.orUpdate == false) {
          this.currentIndex++
          this.saveDegree(item)
        }
      })
      if (this.currentIndex == 0) {
        this.showCardLinst.unshift(obj)
      }
    },
    saveDegree(val) {
      const re = /^(?:0|\-?(?:0\.\d*[1-9]|[1-9]\d*(?:\.\d*[1-9])?))$/
      if (val.degree == '') {
        val.num = 'error'
        notification.error({
          message: '错误',
          description: '度数不能为空！'
        })
      } else if (val.degree) {
        let j = 0
        if (!re.test(val.degree)) {
          val.num = 'error'
          notification.error({
            message: '错误',
            description: '度数只能为纯数字！'
          })
        } else {
          for (let i = 0; i < this.showCardLinst.length; i++) {
            if (val.degree.trim() === this.showCardLinst[i].degree.trim()) {
              j++
            }
          }
          if (j > 1) {
            val.num = 'error'
            notification.error({
              message: '错误',
              description: '度数不能重复'
            })
          } else {
            val.num = 'success'
            this.currentIndex = 0
            val.orUpdate = true
            val.orDele = false
            const index = this.newDegreeList.findIndex((value, index) => {
              return val.degree == value.degree
            })
            if (index >= 0) {
              this.newDegreeList[index] = val
            } else {
              this.newDegreeList.push(val)
            }
          }
        }
      }
    }
  },
  watch: {
    newDegreeList: {
      handler(after, before) {
        this.$emit('getParameter', after, 'degree')
      },
      deep: true
    },
    showCardLinst: {
      handler(after, before) {
        after.map((item, index) => {
          this.$emit('checkSave', after, 'degree')
        })
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.degree {
  .ant-input-affix-wrapper {
    margin-bottom: 20px;
    width: 385px;
    height: 32px;
  }
  .ant-input-suffix {
    .ant-btn {
      background-color: #e9e9e9;
      border-color: #e9e9e9;
    }
  }
  .card_degree {
    display: flex;
    flex-wrap: wrap;
    .add_degree {
      width: 220px;
      height: 84px;
      background: rgba(251, 251, 251, 1);
      border: 1px solid rgba(247, 247, 247, 1);
      opacity: 1;
      border-radius: 8px;
      margin-right: 30px;
      line-height: 84px;
      text-align: center;
      .add {
        color: #cfcfcf;
        margin-left: 18px;
      }
      .add_cont_degree {
        text-decoration: none;
        width: 32px;
        height: 32px;
        border: 2px solid rgba(233, 233, 233, 1);
        border-radius: 50%;
        opacity: 1;
        .icon-plus {
          color: #cfcfcf;
          font-size: 17px;
        }
      }
    }
    .add_degree:hover {
      .add_cont_degree {
        border: 2px solid #3e4da8;
        .icon-plus {
          color: #3e4da8;
        }
      }
      .add {
        color: #3e4da8;
      }
    }
  }

  .card_contain_degree:hover {
    box-shadow: 0px 5px 20px rgba(227, 227, 238, 1);
    .card_contain {
      border-left: 2px solid #fbc773;
    }
  }
  .card_contain_degree {
    padding: 15px;
    width: 220px;
    height: 84px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 20px rgba(246, 246, 248, 1);
    opacity: 1;
    border-radius: 8px;
    margin-right: 30px;
    margin-bottom: 30px;

    .card_contain {
      //   width: 2px;
      height: 54px;
      line-height: 54px;
      //  background:rgba(246,246,248,1);
      opacity: 1;
      border-radius: 4px;
      border-left: 2px solid rgba(246, 246, 248, 1);
      margin: 0px;

      .degree_num {
        margin-left: 44px;
        color: #3e4da8;
        font-weight: 600;
      }
      .ban_btn {
        text-decoration: none;
        color: #b1b1b1;
        margin-left: 60px;
      }
      .ban_btn:hover {
        color: #3e4da8;
      }
    }
  }

  .card_update_degree {
    width: 220px;
    height: 84px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 20px rgba(246, 246, 248, 1);
    opacity: 1;
    border-radius: 8px;
    text-align: center;
    line-height: 58px;
    margin-right: 30px;
    margin-bottom: 30px;
    padding: 5px;
    .card_contain {
      .ant-form-inline {
        display: inline-block;
        width: 50%;
        .ant-form-item-control-wrapper {
          width: 100%;
        }
      }
      .ant-input {
        width: 100%;
      }
      a:hover {
        background: #fbc773;
        .icon-save {
          color: #fff;
        }
        .icondele {
          color: #fff;
        }
      }
      a {
        margin-right: 10px;
        text-align: center;
        width: 38px;
        height: 38px;
        display: inline-block;
        text-decoration: none;
        border-radius: 50%;
        opacity: 1;
        line-height: 38px;
        color: #cfcfcf;
        text-decoration: none;
        vertical-align: text-top;
        .iconfont {
          color: #cfcfcf;
          font-size: 28px;
        }
      }
    }
  }
}
</style>
