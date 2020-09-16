<template>
  <a-card :bordered="false">
    <div class="depotEmpty">
      <a-row :gutter="16">
        <a-col span="8" class="depotStep">
          <div class="depotImg">

          </div>
          <h3>第一步添加或导入</h3>
          <p>
            先点击页面右上角“...”图标或“+”图标，添加一条产品入库，或点击下方绿色按钮添加产品入库
          </p>
          <a @click="handlleAdd"> <a-button type="success">添加</a-button></a>
        </a-col>
      </a-row>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'DepotEmpty'
}
</script>

<style scoped>

</style>
