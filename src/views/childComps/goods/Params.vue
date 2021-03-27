<template>
  <div>
    <!--  面包屑-->
    <BreadCrumb>
      <span slot="first">商品管理</span>
      <span slot="second">参数列表</span>
    </BreadCrumb>
    <!--  卡片视图-->
    <el-card>
      <el-alert
              title="注意：只允许为第三级分类设置相关参数！"
              type="warning"
              :closable="false"
              show-icon>
      </el-alert>

      <el-row class="cat_top">
        <el-col>
          <span>选择商品分类：</span>
          <!--        联级选择器-->
          <el-cascader
                  v-model="selectKeys"
                  clearable
                  :options="cateList"
                  :props="propsConfig"
                  @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleTagsClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button :disabled="isSelected" type="primary" size="mini" @click="isAddParams=true">添加参数</el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--                展开项-->
                <el-tag closable v-for="(item,i) in scope.row.attr_vals"
                        :key="i"
                        @close="tagClose(i,scope.row)"
                        type="success">
                        {{item}}
                </el-tag>
                <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                           @click="ediParamsClick(scope.row.attr_id)"></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete"
                           @click="deleteParamsClick(scope.row.attr_id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button :disabled="isSelected" type="primary" size="mini" @click="isAddParams=true">添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--                展开项-->
                <el-tag closable v-for="(item,i) in scope.row.attr_vals"
                        :key="i"
                        @close="tagClose(i,scope.row)"
                        type="success">
                  {{item}}
                </el-tag>
                <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag"
                           size="small"
                           @click="showInput(scope.row)">
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                           @click="ediParamsClick(scope.row.attr_id)"></el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete"
                           @click="deleteParamsClick(scope.row.attr_id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加会话框 -->
    <el-dialog
            :title="'添加'+dialogText"
            :visible.sync="isAddParams"
            @close="addParamsDialogClosed"
            width="50%">
      <el-form :model="addParamsForm" :rules="addParamsFormRules" ref="addParamsForm" label-width="100px"
               class="demo-ruleForm">
        <el-form-item :label="dialogText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isAddParams = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
            :title="'修改'+dialogText"
            :visible.sync="isEdiParams"
            @close="ediParamsDialogClosed"
            width="50%">
      <el-form :model="ediParamsForm" :rules="ediParamsFormRules" ref="ediParamsForm" label-width="100px"
               class="demo-ruleForm">
        <el-form-item :label="dialogText" prop="attr_name">
          <el-input v-model="ediParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isEdiParams = false">取 消</el-button>
    <el-button type="primary" @click="ediParams">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  import BreadCrumb from "components/content/BreadCrumb";

  export default {
    components: {
      BreadCrumb
    },
    name: "Params",
    created() {
      this.getCateList()
    },
    data() {
      return {
        //分类列表
        cateList: [],
        //props的配置
        propsConfig: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        //选择项双向绑定
        selectKeys: [],
        //点击的名字
        activeName: 'many',
        //动态参数 含有attr_id attr_name attr_sel
        // attr_vals attr_writer attr_id
        manyTableData: [],
        //静态属性
        onlyTableData: [],
        //添加dialog的隐藏和显示
        isAddParams: false,
        //编辑dialog的隐藏和显示
        isEdiParams: false,
        //添加input的绑定数据
        addParamsForm: {
          attr_name: ''
        },
        //编辑input的绑定数据
        ediParamsForm: {
          attr_name: ''
        },
        //添加规则
        addParamsFormRules: {
          attr_name: [
            {required: true, message: `请输入需要添加的名称`, trigger: 'blur'},
            {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
          ]
        },
        //编辑规则
        ediParamsFormRules: {
          attr_name: [
            {required: true, message: `请输入需要修改的名称`, trigger: 'blur'},
            {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
          ]
        },
      }
    },
    computed: {
      //添加按钮显示的条件
      isSelected() {
        return this.selectKeys.length !== 3
      },
      //获取商品id
      cateId() {
        if (this.selectKeys.length === 3) {
          return this.selectKeys[2]
        } else {
          return null
        }
      },
      //动态选择会话框的标题
      dialogText() {
        if (this.activeName === 'many') {
          return '动态参数'
        } else {
          return '静态属性'
        }
      }
    },
    methods: {
      //获取分类列表
      async getCateList() {
        const {data: res} = await this.$http.get('categories')
        if (res.meta.status !== 200) this.$message.error('获取失败')
        this.cateList = res.data
      },
      //监听联级选择器改变
      handleChange() {
        this.getCateParams()
      },
      //点击tags的标签
      handleTagsClick() {
        this.getCateParams()
      },
      //获取参数
      async getCateParams() {
        if (this.selectKeys.length !== 3) {
          this.selectKeys = []
          this.onlyTableData=[]
          this.manyTableData=[]
          return
        }
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,
            {params: {sel: this.activeName}})
        if (res.meta.status !== 200) return this.$message.error('获取失败')
        //通过遍历将attr_vals 里的字符串变成数组以便后续遍历展示
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ?
          item.attr_vals.split(' ') : []
          item.inputVisible=false
          item.inputValue=''

        })
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      },
      //监听添加参数会话框的关闭
      addParamsDialogClosed() {
        this.$refs.addParamsForm.resetFields()
      },
      //添加参数
      addParams() {
        this.$refs.addParamsForm.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`,
              {attr_name: this.addParamsForm.attr_name, attr_sel: this.activeName})
          if (res.meta.status !== 201) return this.$message.error('添加失败')
          this.$message.success('添加成功')
          this.getCateParams()
          this.isAddParams = false
        })
      },
      //
      //监听修改参数会话框的关闭
      ediParamsDialogClosed() {
        this.$refs.ediParamsForm.resetFields()
      },
      //编辑按钮的点击
      async ediParamsClick(id) {

        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
          params: {attr_sel: this.activeName}
        })
        if (res.meta.status !== 200) return this.$message.error('请求失败')
        this.ediParamsForm = res.data
        this.isEdiParams = true
      },
      //修改参数
      ediParams() {
        this.$refs.ediParamsForm.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.ediParamsForm.attr_id}`,
              {attr_name: this.ediParamsForm.attr_name, attr_sel: this.activeName})
          if (res.meta.status !== 200) this.$message.error('修改失败')
          this.$message.success('修改成功')
          this.getCateParams()
          this.isEdiParams = false
        })
      },
      //删除参数
      async deleteParamsClick(id) {
        const result = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (result == 'cancel') {
          this.$message.info('取消删除成功')
          return
        }
        const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
        if (res.meta.status !== 200) this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getCateParams()

      },
      //键盘按下回车键,或者失去焦点监听
      handleInputConfirm(row) {
        //如果输入的是空的或者不合法则重置并返回
        if(row.inputValue.trim().length===0){
          row.inputValue=''
          row.inputVisible = false
          return
        }
        //处理正确的内容
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue=''
        row.inputVisible = false
        this.saveAttrValue(row)

      },
      //修改数据请求
      async saveAttrValue(row){
        const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id},`,{
          attr_name:row.attr_name,
          attr_sel:row.attr_sel,
          attr_vals:row.attr_vals.join(' ')
        })
        if(res.meta.status!==200)return this.$message.error('修改失败')
        this.$message.success('修改成功')

      },
      showInput(show) {
        show.inputVisible=true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //监听tag关闭
      tagClose(i,row){
        row.attr_vals.splice(i,1)
        this.saveAttrValue(row)
      }
    },

  }
</script>

<style scoped>
  .cat_top {
    margin: 15px 10px;
  }

  .el-button {
    margin-bottom: 10px;
  }

  .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .input-new-tag {
    width: 100px;
  }
</style>
