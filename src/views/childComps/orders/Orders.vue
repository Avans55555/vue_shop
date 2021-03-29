<template>
<div>
<!--  面包屑-->
  <BreadCrumb>
    <span slot="first">订单管理</span>
    <span slot="second">订单列表</span>
  </BreadCrumb>
<!--  卡片-->
  <el-card>
<!--    搜索框-->
    <el-row >
      <el-col :span="8" >
        <el-input placeholder="请输入内容" >
          <el-button  slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
    </el-row>
<!--  表格-->
    <el-table :data="goodList.goods" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="订单编号" prop="order_number"></el-table-column>
      <el-table-column align="center" width="80px" label="订单价格" prop="order_price"></el-table-column>
      <el-table-column align="center" width="90px" label="是否付款">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay ==='0'" size="mini" type="danger">未付款</el-tag>
          <el-tag v-else size="mini" type="success">已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80px" label="是否发货" prop="is_send"></el-table-column>
      <el-table-column align="center" width="160px" label="下单时间" >
        <template slot-scope="scope">
          {{ scope.row.create_time | dateformat('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column align="center" width="140px" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="updateAddress"></el-button>
          <el-button size="mini" type="success" icon="el-icon-location" @click="expressInfoClick"></el-button>
        </template>
      </el-table-column>
    </el-table>

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

<!--    编辑对话框-->
    <el-dialog
            title="修改地址"
            :visible.sync="isUpdateAddress"
            @close="updateDialogClosed"
            width="50%">
      <el-form :model="updateAddressForm" :rules="updateAddressRules" ref="updateAddressForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :props="{expandTrigger: 'hover'}" :options="citydata" v-model="updateAddressForm.address1">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="updateAddressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isUpdateAddress = false">取 消</el-button>
    <el-button type="primary" @click="isUpdateAddress = false">确 定</el-button>
  </span>
    </el-dialog>

<!--    订单信息-->
    <el-dialog
            title="订单信息"
            :visible.sync="isExpressInfo"
            width="50%">
      <el-timeline >
        <el-timeline-item
                :color="activity.color"
                :size="activity.size"
                v-for="(activity, index) in expressInfo"
                :key="index"
                :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isExpressInfo = false">取 消</el-button>
    <el-button type="primary" @click="isExpressInfo = false">确 定</el-button>
  </span>
    </el-dialog>
  </el-card>
</div>
</template>

<script>
  import citydata from "./citydata";
  import BreadCrumb from "components/content/BreadCrumb";
  export default {
    name: "Orders",
    components:{
      BreadCrumb
    },
    created() {
      this.getGoodsList()
    },
    data(){
      return{
        queryInfo:{
          query:'',
          pagenum:1,
          pagesize:10
        },
        goodList:[],
        total:0,
        updateAddressForm:{
          address1:'',
          address2:''
        },
        updateAddressRules:{
          address1:[
            {required: true, message: '请输入商品名称', trigger: 'change'}
          ],
          address2:[
            {required: true, message: '请输入商品名称', trigger: 'change'}
          ]
        },
        isUpdateAddress:false,
        isExpressInfo:false,
        citydata,
        expressInfo:[
          {
            "color":'lightgreen',
            "size":'large',
            "time": "2018-05-10 09:39:00",
            "ftime": "2018-05-10 09:39:00",
            "context": "已签收,感谢使用顺丰,期待再次为您服务",
            "location": ""
          },
          {
            "time": "2018-05-10 08:23:00",
            "ftime": "2018-05-10 08:23:00",
            "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
            "location": ""
          },
          {
            "time": "2018-05-10 07:32:00",
            "ftime": "2018-05-10 07:32:00",
            "context": "快件到达 [北京海淀育新小区营业点]",
            "location": ""
          },
          {
            "time": "2018-05-10 02:03:00",
            "ftime": "2018-05-10 02:03:00",
            "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
            "location": ""
          },
          {
            "time": "2018-05-09 23:05:00",
            "ftime": "2018-05-09 23:05:00",
            "context": "快件到达 [北京顺义集散中心]",
            "location": ""
          },
          {
            "time": "2018-05-09 21:21:00",
            "ftime": "2018-05-09 21:21:00",
            "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
            "location": ""
          },
          {
            "time": "2018-05-09 13:07:00",
            "ftime": "2018-05-09 13:07:00",
            "context": "顺丰速运 已收取快件",
            "location": ""
          },
          {
            "time": "2018-05-09 12:25:03",
            "ftime": "2018-05-09 12:25:03",
            "context": "卖家发货",
            "location": ""
          },
          {
            "time": "2018-05-09 12:22:24",
            "ftime": "2018-05-09 12:22:24",
            "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
            "location": ""
          },
          {
            "time": "2018-05-08 21:36:04",
            "ftime": "2018-05-08 21:36:04",
            "context": "商品已经下单",
            "location": ""
          }
        ],

      }
    },
    methods:{
      async getGoodsList(){
        console.log(this.queryInfo)
        const {data:res}=await this.$http.get('orders',{params:this.queryInfo})
        if(res.meta.status!==200) this.$message.error('请求失败')
        this.goodList=res.data
        this.total=res.data.total
      },
      handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize
        this.getGoodsList()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage
        this.getGoodsList()
      },
      updateAddress(){
        this.isUpdateAddress=true
      },
      updateDialogClosed(){
        this.$refs.updateAddressForm.resetFields()
      },
      async expressInfoClick(){

        this.isExpressInfo = true
      }
    }
  }
</script>

<style scoped>
.el-cascader{
  width: 100%;
}
</style>
