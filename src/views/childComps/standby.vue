<template>
  <!--      表格-->

  <!--      <tree-table :data="cateList"-->
  <!--                  border-->
  <!--                  :selection-type="false"-->
  <!--                  :expand-type="false"-->
  <!--                  :show-index="true"-->
  <!--                  index-text="#"-->
  <!--                  :columns="columns">-->
  <!--&lt;!&ndash;        是否有效模板&ndash;&gt;-->
  <!--        <template #isOk="scope">-->
  <!--          <i style="color: lightgreen" v-if="scope.row.cat_deleted===false" class="el-icon-success"></i>-->
  <!--          <i style="color: red" v-else class="el-icon-error"></i>-->
  <!--        </template>-->
  <!--&lt;!&ndash;        排序模板&ndash;&gt;-->
  <!--        <template #order="scope">-->
  <!--          <el-tag v-if="scope.row.cat_level===0" type="primary" size="mini">一级</el-tag>-->
  <!--          <el-tag v-else-if="scope.row.cat_level===1" type="success" size="mini">二级</el-tag>-->
  <!--          <el-tag v-else type="danger" size="mini">三级</el-tag>-->
  <!--        </template>-->
  <!--&lt;!&ndash;        操作模板&ndash;&gt;-->
  <!--        <template #opt="scope">-->
  <!--          <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>-->
  <!--          <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>-->
  <!--        </template>-->
  <!--      </tree-table>-->
</template>

<script>
  export default {
    name: "standby",
    data(){
      return{
        // columns: [
        //   {
        //     label: '分类名称',
        //     prop: 'cat_name'
        //   },
        //   {
        //     label: '是否有效',
        //     type: 'template',
        //     template: 'isOk',
        //   },
        //   {
        //     label: '排序',
        //     type: 'template',
        //     template: 'order',
        //   },
        //   {
        //     label: '操作',
        //     type: 'template',
        //     template: 'opt',
        //   }
        // ],
      }
    }
  }
</script>

<style scoped>

</style>
