<template>
<div>
<!--  面包屑-->
  <BreadCrumb>
    <span slot="first">商品管理</span>
    <span slot="second">商品列表</span>
  </BreadCrumb>
<!--  卡片视图-->
  <el-card>
    <el-row :gutter='20'>
      <el-col :span="8" >
        <el-input placeholder="请输入内容" v-model="queryInfo.query"  clearable @clear="getGoodsList">
          <el-button  @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addGoods">添加商品</el-button>
      </el-col>
    </el-row>
<!--  表格-->
    <el-table :data="goodsList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column width="95px" label="商品价格(元)" prop="goods_price"></el-table-column>
      <el-table-column width="70px" label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column width="170px" label="商品创建时间" >
        <template slot-scope="scope">
          {{ scope.row.add_time | dateformat('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column width="130px" label="操作" >
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="updateGoods(scope.row)"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteGoods(scope.row.goods_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>

<!--    修改页面-->
    <el-dialog
            title="修改商品"
            :visible.sync="isUpdateGoods"
            width="50%">
      <el-form :model="updateGoodForm" :rules="updateGoodRules" ref="updateGoodForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input  v-model="updateGoodForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="updateGoodForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="updateGoodForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="updateGoodForm.goods_number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isUpdateGoods = false">取 消</el-button>
    <el-button type="primary" @click="isUpdateConfirm">确 定</el-button>
  </span>
    </el-dialog>

<!--    分页-->
    <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total" background>
    </el-pagination>
  </el-card>
</div>
</template>

<script>
  import BreadCrumb from "components/content/BreadCrumb";
  export default {
    name: "Goods",
    components:{
      BreadCrumb
    },
    data(){
      return{
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:10
      },
        goodsList:[],
        total:0,
        isUpdateGoods:false,
        updateGoodForm:{
          goods_name:'',
          goods_price:0,
          goods_weight:0,
          goods_number:0,
        },
        updateGoodRules:{
          goods_name: [
            {required: true, message: '请输入商品名称', trigger: 'change'}
          ],
          goods_price: [
            {required: true, message: '请输入商品价格', trigger: 'change'}
          ],
          goods_weight: [
            {required: true, message: '请输入商品重量', trigger: 'change'}
          ],
          goods_number: [
            {required: true, message: '请输入商品数量', trigger: 'change'}
          ],
          goods_cat: [
            {required: true, message: '请选择商品分类', trigger: 'change'}
          ]
        },
        cateId:null,
        goods_cat:null

      }
    },
    created() {
      this.getGoodsList()
    },
    computed: {
      // isCateId() {
      //   if (this.goods_cat.length === 3) {
      //     return this.goods_cat[2]
      //   } else {
      //     return null
      //   }
      // }
    },
    methods:{
      //获取商品列表
      async getGoodsList(){
       const{data:res}=await this.$http.get('goods',{params:this.queryInfo})
        console.log(res)
        // this.queryInfo.query=res.goods_name
        this.goodsList=res.data.goods
        this.total=res.data.total
      },
      //页面最大数据
      handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize
        this.getGoodsList()
      },
      //当前页面
      handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage
        this.getGoodsList()
      },
      //删除商品
      async deleteGoods(id){
        const result=await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(result=='cancel') return this.$message.info('取消删除成功')
        const{data:res}=await this.$http.delete(`goods/${id}`)
        if(res.meta.status!==200) this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getGoodsList()
      },
      // 点击添加按钮跳转到添加商品页面
      addGoods(){
        this.$router.push('/add')
      },
      async updateGoods(row){
        const {data:res}=await this.$http.get(`goods/${row.goods_id}`)
        if(res.meta.status!==200) this.$message.error('获取失败')
        this.updateGoodForm.goods_name=res.data.goods_name
        this.updateGoodForm.goods_price=res.data.goods_price
        this.updateGoodForm.goods_weight=res.data.goods_weight
        this.updateGoodForm.goods_number=res.data.goods_number
        this.cateId=row.goods_id
        this.goods_cat=res.data.goods_cat
        this.isUpdateGoods=true
      },
       isUpdateConfirm(){
       this.$refs.updateGoodForm.validate(async valid=>{
          if(!valid)return this.$message.error('修改失败')
         const {data:res}= await  this.$http.put(`goods/${this.cateId}`,{
            goods_name:this.updateGoodForm.goods_name,
            goods_price:this.updateGoodForm.goods_price,
            goods_number:this.updateGoodForm.goods_number,
            goods_weight:this.updateGoodForm.goods_weight,
            goods_cat:this.goods_cat.split(',')[2]
          })
         if(res.meta.status!==200)return this.$message.error('修改失败')
         this.$message.success('修改成功')
         this.isUpdateGoods=false
         this.getGoodsList()
        })
      }
    }
  }
</script>

<style scoped>

</style>
