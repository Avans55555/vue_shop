<template>
  <div>
    <!--    面包屑-->
    <BreadCrumb>
      <span slot="first">商品管理</span>
      <span slot="second">商品分类</span>
    </BreadCrumb>
    <!--    卡片-->
    <el-card>
      <!--      添加分类按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!--      表格-->
      <el-table
              :data="cateList"
              style="width: 100%;margin-bottom: 20px;"
              row-key="cat_id"
              border
              lazy
              :load="load"
              :tree-props="{children:'children', hasChildren: 'hasChildren'}">
        <el-table-column type="index" label="#">
        </el-table-column>
        <!--        设置树状展开 prop一定要设置对-->
        <el-table-column
                prop="cat_name"
                label="分类名称"
                width="180">
        </el-table-column>
        <el-table-column label="是否有效">
          <!--          是否有效  √ ×-->
          <template slot-scope="scope">
            <i style="color: lightgreen" v-if="scope.row.cat_deleted===false" class="el-icon-success"></i>
            <i style="color: red" v-else class="el-icon-error"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <!--          等级通过 tag图标的展示-->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level===0" type="primary" size="mini">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level===1" type="success" size="mini">二级</el-tag>
            <el-tag v-else type="danger" size="mini">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--            编辑按钮-->
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="updateCateList(scope.row)"></el-button>
            <!--            删除按钮-->
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteCateList(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      页码-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="1"
              :page-sizes="[3, 5, 15, 20]"
              :page-size="this.cateInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="this.total">
      </el-pagination>
      <!--      添加分类对话框-->
      <el-dialog
              title="添加分类"
              :visible.sync="isAddCate"
              @close="addCateDialogClose"
              width="40%">
        <el-form :model="addCateForm" :rules="addCateRules" ref="addCateForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
                    v-model="selectKeys"
                    :options="parentCate"
                    :props="parentCateConfig"
                    clearable
                    @change="parentCateChange"></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="isAddCate = false">取 消</el-button>
    <el-button type="primary" @click="addCateConfirm">确 定</el-button>
  </span>
      </el-dialog>
      <!--      更改分类列表-->
      <el-dialog
              title="修改分类"
              :visible.sync="isUpdateCate"
              width="50%">
        <el-form :rules="updateCateFormRule" ref="updateCateForm" :model="updateCateForm" label-width="80px">
          <el-form-item prop="cat_name" label="分类名称">
            <el-input v-model="updateCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="isUpdateCate = false">取 消</el-button>
    <el-button type="primary" @click="isUpdateCateConfirm">确 定</el-button>
  </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import BreadCrumb from "components/content/BreadCrumb";

  export default {
    components: {
      BreadCrumb
    },
    name: "Categories",
    data() {
      return {
        //dialog是否显示
        isAddCate: false,
        //update是否显示
        isUpdateCate: false,
        cateId: null,
        //获取商品分类数组
        cateList: [],
        //分类表单数据对象
        addCateForm: {
          cat_name: '',
          //分类父ID 如果要添加1级分类，则父分类Id应该设置为 0
          cat_pid: 0,
          //分类层级 0表示一级分类；1表示二级分类；2表示三级分类
          cat_level: 0
        },
        updateCateForm: {
          cat_name: ''
        },
        //需要展开的商品列表数组
        parentCate: [],
        //选中项绑定的值 父级分类的ID数组
        selectKeys: [],
        //联级选择器配置
        parentCateConfig: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
          checkStrictly: true
        },
        cateInfo: {
          type: 3,
          pagenum: 0,
          pagesize: 5
        },
        total: 0,
        addCateRules: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
            {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
          ]
        },
        updateCateFormRule: {
          cat_name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
            {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      //获取当前分类
      async getCateList() {
        const {data: res} = await this.$http.get('categories', {params: this.cateInfo})
        if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
        this.cateList = res.data.result
        this.total = res.data.total
        // console.log(this.total)
        // console.log(this.cateList)
      },
      //最大页数
      handleSizeChange(newSize) {
        this.cateInfo.pagesize = newSize
        this.getCateList()
      },
      //当前页面
      handleCurrentChange(newPage) {
        this.cateInfo.pagenum = newPage
        this.getCateList()

      },
      //懒加载
      load(tree, treeNode, resolve) {
        setTimeout(() => {
          resolve(this.cateList)
        }, 1000)
      },
      //添加分类按钮监听
      addCate() {
        this.getParentCate()
        this.isAddCate = true
      },
      //定义一个获取父级分类请求
      async getParentCate() {
        const {data: res} = await this.$http.get('categories', {params: {type: 2}})
        // console.log(res.data)
        this.parentCate = res.data
      },
      //监听联级选择器的改变
      parentCateChange() {
        //当父级分类数组的长度大于一则要判断数组的最后一个是多少
        //来决定新加分类的等级和id
        if (this.selectKeys.length > 0) {
          this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
          this.addCateForm.cat_level = this.selectKeys.length
          return
        } else {
          this.addCateForm.cat_pid = 0
          this.addCateForm.cat_level = 0
        }
      },
      //添加分类确定按钮监听
      addCateConfirm() {
        this.$refs.addCateForm.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.post('categories', this.addCateForm)
          if (res.meta.status !== 201) return this.$message.error('添加失败')
          this.$message.success('添加成功')
          this.getCateList()
          this.isAddCate = false
        })

        // console.log(this.addCateForm)
      },
      //会话关闭监听
      addCateDialogClose() {
        this.$refs.addCateForm.resetFields()
        this.selectKeys = []
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      },
      //编辑按钮
      async updateCateList(cate) {
        const {data: res} = await this.$http.get(`categories/${cate.cat_id}`)
        this.cateId = res.data.cat_id
        console.log(this.cateId)
        this.updateCateForm.cat_name = res.data.cat_name
        this.isUpdateCate = true
      },
      //编辑按钮确定
      isUpdateCateConfirm() {
        this.$refs.updateCateForm.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.put(`categories/${this.cateId}`, {cat_name: this.updateCateForm.cat_name})
          if (res.meta.status !== 200) return this.$message.error('修改失败')
          this.$message.success('修改成功')

          this.getCateList()

          this.isUpdateCate = false
        })
      },
      async deleteCateList(id) {
        const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (result == 'cancel') {
          return this.$message.info('取消删除成功')
        }
        const {data: res} = await this.$http.delete('categories/' + id.cat_id)
        if (res.meta.status !== 200) this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getCateList()
      }
    }
  }
</script>

<style scoped>
  .el-cascader {
    width: 100%;
  }
</style>
