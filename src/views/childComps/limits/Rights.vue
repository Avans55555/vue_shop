<template>
  <div>
    <!--    面包屑-->
    <BreadCrumb>
      <span slot="first">权限管理</span>
      <span slot="second">权限列表</span>
    </BreadCrumb>

<!--    卡片-->
    <el-card >
      <el-table :data="rightDataList">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope" >
            <el-tag v-if="scope.row.level=='0'">等级一</el-tag>
            <el-tag v-else-if="scope.row.level=='1'" type="success">等级二</el-tag>
            <el-tag v-else type="warning">等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import BreadCrumb from "components/content/BreadCrumb";
  export default {
    components:{
      BreadCrumb
    },
    name: "Rights",
    data(){
      return{
        rightDataList:[]
      }
    },
    created() {
      this.getRightData()
    },
    methods:{
      async getRightData(){
        const {data:res}=await this.$http.get('rights/list')
        this.rightDataList=res.data
        console.log(this.rightDataList)
      }
    }
  }
</script>

<style scoped>

</style>
