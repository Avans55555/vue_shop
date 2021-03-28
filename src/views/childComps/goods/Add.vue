<template>
  <div>
    <!--    面包屑-->
    <BreadCrumb>
      <span slot="first">商品导航</span>
      <span slot="second">商品添加</span>
    </BreadCrumb>

    <!--  卡片视图-->
    <el-card>
      <!--    提示信息-->
      <el-alert
              title="添加商品信息"
              type="info"
              center
              :closable="false"
              show-icon>
      </el-alert>
      <!--    步骤条-->
      <el-steps :space="200" :active="activeIndex * 1" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--    标签页-->
      <el-form :model="addGoodsForm" :rules="addGoodsRules" ref="addGoodsForm" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="toNextActive" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_name">
              <el-input type="number" v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_name">
              <el-input type="number" v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_name">
              <el-input type="number" v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                      v-model="addGoodsForm.goods_cat"
                      :options="cateList"
                      :props="cateListConfig"
                      @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals" >
                <el-checkbox border v-for="(cb,i) in item.attr_vals" :key="i" :label="cb"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
                    :action="uploadUrl"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :headers="headerObj"
                    :on-success="handleSuccess"
                    list-type="picture-card">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodsForm.goods_introduce">

            </quill-editor>
            <el-button type="primary" @click="add"> 添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
<!--    图片预览对话框-->
    <el-dialog
            title="图片预览"
            :visible.sync="isImageShow"
            width="50%">
      <el-image
              class="showImage"
              :src="previewUrl">
      </el-image>
    </el-dialog>
  </div>
</template>

<script>
  //导入lodash用来实现深拷贝
  import _ from 'lodash'
  import BreadCrumb from "components/content/BreadCrumb";

  export default {
    name: "Add",
    components: {
      BreadCrumb
    },
    data() {
      return {
        activeIndex: '0',
        addGoodsForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          goods_cat: [],
          //上传的图片临时路径
          pics:[],
          attrs:[],
          goods_introduce:''
        },
        //定义规则
        addGoodsRules: {
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
        //  商品分类
        cateList: [],
        //分类id
        cateListValue: {},
        cateListConfig: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        manyTableData: [],
        onlyTableData:[],
        uploadUrl:'http://www.ysqorz.top:8888/api/private/v1/upload',
        headerObj:{
          Authorization:window.sessionStorage.getItem('token')
        },
        previewUrl:'http://www.ysqorz.top:8888/',
        isImageShow:false,
      }
    },
    created() {
      this.getCateList()


    },
    computed: {
      cateId() {
        if (this.addGoodsForm.goods_cat.length === 3) {
          return this.addGoodsForm.goods_cat[2]
        } else {
          return null
        }
      }
    },
    methods: {
      //  获取商品分类
      async getCateList() {
        const {data: res} = await this.$http.get('categories')
        if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
        this.cateList = res.data
      },
      //联级选择器发生改变
      handleChange() {
        if (this.addGoodsForm.goods_cat.length !== 3) {
          this.addGoodsForm.goods_cat = []
        }
        console.log(this.addGoodsForm.goods_cat)
      },
      toNextActive(activeName, oldActiveName) {
        if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
          this.$message.error('请先选择商品分类')
          return false
        }
      },
      //当tab被点击时
      async tabClicked() {
        if (this.activeIndex === '1') {
          const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
            params: {sel: 'many'}
          })
          if (res.meta.status !== 200) return this.$message.error('请求失败')
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ?
                [] : item.attr_vals.split(',')
          })
          this.manyTableData = res.data
        }else if(this.activeIndex === '2'){
          const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
            params: {sel: 'only'}
          })
          if(res.meta.status!==200)return this.$message.error('请求失败')
          this.onlyTableData=res.data
          console.log(this.onlyTableData)
        }

      },
      // 点击图片处理事件
      handlePreview(file){
        console.log(file)
        if(this.previewUrl!=='http://www.ysqorz.top:8888/'){
          this.previewUrl='http://www.ysqorz.top:8888/'
        }
        this.previewUrl += file.response.data.tmp_path
        this.isImageShow=true
      },
      //图片关闭事件
      handleRemove(file){
        //用findIndex方法 对比删掉的临时路径和addGoodsForm里的pics的路径得到索引
        const index =this.addGoodsForm.pics.findIndex(item=>{
          item.pics=file.response.data.tmp_path
        })
        //通过索引将那一项数组删除
        this.addGoodsForm.pics.splice(index,1)
      },
      handleSuccess(response){
        const picInfo={
          pics:response.data.tmp_path
        }
        this.addGoodsForm.pics.push(picInfo)
        console.log(this.addGoodsForm)
      },
      add(){
        this.$refs.addGoodsForm.validate(async valid=>{
          if(!valid) return this.$message.error('请填写表单必填项')
          //实现深拷贝
          // const from =JSON.parse(JSON.stringify(this.addGoodsForm))
          const form=_.cloneDeep(this.addGoodsForm)
          form.goods_cat=form.goods_cat.join(',')
          //处理动态参数
          this.manyTableData.forEach(item=>{
            const attrInfo={attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')}
            this.addGoodsForm.attrs.push(attrInfo)
          })
          //处理静态属性
          this.onlyTableData.forEach(item=>{
            const attrInfo={attr_id:item.attr_id,attr_value:item.attr_vals}
            this.addGoodsForm.attrs.push(attrInfo)
          })
          form.attrs=this.addGoodsForm.attrs
          console.log(form)

          //  发起添加商品请求
          const{data:res} =await this.$http.post('goods',form)
          if(res.meta.status!==201)return this.$message.error('添加失败')
          this.$message.success('添加成功')
          this.$router.push('/goods')
        })


      }
    }
  }
</script>

<style scoped>
.el-checkbox{
  margin: 0 10px 0 0  !important;
}
  .showImage{
    width: 100%;
  }

  .el-button{
    margin-top: 10px;
  }
</style>
