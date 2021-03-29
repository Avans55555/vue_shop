<template>
  <div>
<!--    面包屑-->
    <BreadCrumb>
      <span slot="first">数据统计</span>
      <span slot="second">数据报表</span>
    </BreadCrumb>
<!--  卡片区-->
    <el-card>
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import _ from 'lodash'
  import BreadCrumb from "components/content/BreadCrumb";
  export default {
    name: "Reports",
    components:{
      BreadCrumb
    },
    data(){
      return{
        option : {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    async mounted() {
      var myChart = echarts.init(document.getElementById('main'));

      const{data:res}=await this.$http.get('reports/type/1')
      if(res.meta.status!==200) this.$message.error('请求失败')


    const result=_.merge(res.data,this.option)
      myChart.setOption(result);
    }
  }
</script>

<style scoped>

</style>
