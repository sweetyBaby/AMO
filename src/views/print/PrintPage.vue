<template>
  <a-card :bordered="false">
    <div class="page-header-index-wide pad-md">
      <div class="page_Title">
        <h3>打印模板设置</h3>
      </div>
      <div class="printMode">
        <mode-card v-for="item in modeDatas" :cardData="item" :key="item.key" />
      </div>
      <div class="printTable">
        <table class="table table-striped">
          <thead class="thead-dark">
            <draggable v-model="headers" tag="tr">
              <th v-for="header in headers" :key="header" scope="col">
                {{ header }}
              </th>
            </draggable>
          </thead>
          <tbody>
            <tr v-for="item in list" :key="item.name">
              <td v-for="header in headers" :key="header">{{ item[header] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </a-card>
</template>

<script>
import ModeCard from './modules/modeCard'
import { STable } from '@/components'
import draggable from 'vuedraggable'
const modeDatas = [
  {
    name: '单据号码',
    key: 'modeCode'
  },
  {
    name: '单据日期',
    key: 'modetime'
  },
  {
    name: '单据类型',
    key: 'modeType'
  },
  {
    name: '库位',
    key: 'modeNum'
  },
  {
    name: '医院',
    key: 'modeHos'
  },
]
export default {
  name: 'PrintPage',
  components: {
    ModeCard,
    draggable,
    STable
  },
  data() {
    return {
      modeDatas,
      headers: ['id', 'name', 'sport'],
      list: [
        { id: 1, name: 'Abby', sport: 'basket' },
      ],
      dragging: false
    }
  }
}
</script>

<style lang="less">
  .pad-md{
    padding: 24px;
  }
  .printMode{
    width: 100%;
    padding: 0 0 16px 0;
    display: inline-block;
  }
  .printTable{
    width: 100%;
  }
</style>
