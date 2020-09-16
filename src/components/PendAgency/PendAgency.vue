<template>
  <div class="agency">
    <div class="agency_top">
      <h3>{{ agencyData.noticeTitle }}</h3>
      <div class="agencyInfo">
        <p v-html="agencyData.noticeContent">{{ agencyData.noticeContent }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PendAgency',
  props: ['agencyData']
}
</script>

<style lang="less">
    .agency:hover{
        box-shadow:0px 5px 20px rgba(172,173,183,0.76);
    }
  .agency{
    padding: 20px 30px;
    border-left: 2px solid rgba(62, 77, 168, 1);
    margin: 0 0 20px 0;
    background: white;
    box-shadow: 0px 3px 20px rgba(172,173,183,0.2);
    border-radius: 4px;
    .agency_top{
      width: 100%;
      h3{
          font-weight: bold;
          color:#3E4DA8;
      }
      span.agencyIcon{
        width: 46px;
        height: 46px;
        background: rgba(66, 131, 255, 1);
        border-radius: 23px;
        float: left;
        text-align: center;
        line-height: 46px;
        font-size: 16px;
        color: white;
      }
      .agencyInfo{
        p{
          font-size: 14px;
          color: rgba(177, 177, 177, 1);
          margin: 0;
        }
        h3{
          font-size: 14px;
        }
        .iconfont{
          color: rgba(209, 214, 227, 1);
          float: left;
        }
        span{
          padding: 0 0 0 12px;
          float: left;
          &.pad-r-md{
            padding-right: 24px;
          }
        }
      }
    }
  }
</style>
