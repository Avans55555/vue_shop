<template>
  <div>
    <!--   面包屑-->
    <BreadCrumb>
      <span slot="first">权限管理</span>
      <span slot="second">角色列表</span>
    </BreadCrumb>
    <!--   卡片-->
    <el-card>
      <!--     添加商品-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoles=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!--     表格-->
      <el-table :data="roleData" border stripe>
        <el-table-column type="expand">
          <template v-slot:default="scope">
            <el-row :class="['bdbottom',i1===0 ? 'bdtop' : '','center'] " v-for="(item1,i1) in scope.row.children"
                    :key="item1.id">
              <!--             一级-->
              <el-col :span="5">
                <el-tag @close="tagClose(scope.row,item1.id)"
                        closable>
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--             右半部分-->
              <el-col :span="19">
                <el-row :class="[i2===0 ? '' : 'bdtop','center','pt']" v-for="(item2,i2) in item1.children"
                        :key="item2.id">
                  <!--                 二级-->
                  <el-col :span="6">
                    <el-tag @close="tagClose(scope.row,item2.id)"
                            closable type="success">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!--                 三级-->
                  <el-col :span="18">
                    <el-tag @close="tagClose(scope.row,item3.id)"
                            closable
                            type="warning"
                            v-for="(item3,i3) in item2.children"
                            :key="item3.id">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRoles(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRoles(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="setRight(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--   添加角色-->
    <el-dialog
            title="添加角色"
            :visible.sync="addRoles"
            width="50%"
            @close="dialogClosed"
    >
      <el-form ref="addRolesForm" :rules="addRolesRules" :model="addRole" label-width="80px">
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item prop="roleDesc" label="角色描述">
          <el-input v-model="addRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addRoles=false">取 消</el-button>
    <el-button type="primary" @click="confirmClick">确 定</el-button>
  </span>
    </el-dialog>
    <!--   更改角色-->
    <el-dialog
            title="修改角色信息"
            :visible.sync="isUpdateRole"
            width="50%"
            @close="updateDialogClosed">
    <span>
      <el-form :rules="updateRules" ref="updateForm" :model="updateForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="updateForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="updateForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
    </span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isUpdateRole = false">取 消</el-button>
    <el-button type="primary" @click="isUpdateRoles">确 定</el-button>
  </span>
    </el-dialog>
    <!--   分配权限-->
    <el-dialog
            title="分配权限"
            :visible.sync="isSetRight"
            width="50%"
            @close="setRightClosed">
      <el-tree :data="rightsData"
               :props="treeProps"
               default-expand-all
               show-checkbox
               node-key="id"
               ref="setRights"
               :default-checked-keys="defaultArray">
      </el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isSetRight = false">取 消</el-button>
    <el-button type="primary" @click="setRightSuccess()">
      确 定
    </el-button>
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
    data() {
      return {
        roleData: [],
        updateForm: {},
        rightsData:[],
        addRoles: false,
        isUpdateRole: false,
        isSetRight:false,
        roleID:'',
        addRole: {
          roleName: '',
          roleDesc: ''
        },
        addRolesRules: {
          //添加角色验证规则
          roleName: [
            {required: true, message: '请输入角色名', trigger: 'blur'},
            {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
          ],
          roleDesc: [
            {required: true, message: '请输入角色描述', trigger: 'blur'},
            {min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur'}
          ]
        },
          //更该角色验证规则
        updateRules: {
          roleName: [
            {required: true, message: '请输入角色名', trigger: 'blur'},
            {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
          ],
          roleDesc: [
            {required: true, message: '请输入角色描述', trigger: 'blur'},
            {min: 3, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur'}
          ]
        },
        //展开树结构的规则
        treeProps:{
          children: 'children',
          label: 'authName'
        },
        //默认展开的数组
        defaultArray:[]
      }
    },
    name: "Roles",
    created() {
      this.getRoleData()
    },
    methods: {
      //获取角色列表
      async getRoleData() {
        const {data: res} = await this.$http.get('roles')
        if (res.meta.status !== 200) return this.$message.error('获取失败')
        this.roleData = res.data
      },
      //监听添加角色的关闭
      dialogClosed() {
        this.$refs.addRolesForm.resetFields()
      },
      //添加角色的确认按钮监听
      confirmClick() {
        this.$refs.addRolesForm.validate(async valid => {
          if (!valid) return
          // 校验通过发起网络请求添加新用户
          const {data: res} = await this.$http.post('roles', this.addRole)
          if (res.meta.status !== 201) {
            return this.$message.error('添加角色失败')
          }
          this.$message.success('角色添加成功')
          this.addRoles = false
          this.getRoleData()
        })
      },
      //监听更改角色的关闭
      updateDialogClosed() {
        this.$refs.updateForm.resetFields()
      },
      //修改角色信息的信息获取
      async editRoles(roleID) {

        const {data: res} = await this.$http.get('roles/' + roleID)
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.error)
        }
        this.updateForm = res.data
        this.isUpdateRole = true
      },
      //修改角色信息确定按钮监听
      isUpdateRoles() {
        this.$refs.updateForm.validate(async valid => {
          if (!valid) return
          //发起修改数据请求
          const {data: res} = await this.$http.put('roles/' + this.updateForm.roleId,
              {roleName: this.updateForm.roleName, roleDesc: this.updateForm.roleDesc})
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success('修改成功')
          this.isUpdateRole = false
          this.getRoleData()
        })
      },
      //删除角色
      async deleteRoles(id) {
        const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (result == 'cancel') {
          return this.$message.info('已经取消删除')
        }

        const {data: res} = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) {

          this.$message.error('删除错误')
        }
        this.$message.success('删除成功')
        this.getRoleData()
      },
      //关闭tag监听
      async tagClose(role, rightId) {
        const tagResult = await this.$confirm('此操作将永久删除该角色权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (tagResult !== 'confirm') {
          return this.$message.info('取消删除成功')
        }
        const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        role.children = res.data
      },
      //监听分配权限
      async setRight(role){
        this.roleID=role.id
        console.log(this.roleID)
      const {data:res} =  await this.$http.get('rights/tree')
        if(res.meta.status!==200) return this.$message.error('获取失败')
        this.rightsData=res.data

        this.getDefaultArr(role,this.defaultArray)
        this.isSetRight=true
      },
      //创建一个递归函数来获得所有的三级节点数组
      getDefaultArr(role,arr){
        if(!role.children){
          return arr.push(role.id)
        }

        role.children.forEach(item=>{
            // arr.push(item.id)
          this.getDefaultArr(item,arr)
        })
      },
      //监听分配权限关闭
      setRightClosed(){
        this.defaultArray=[]
      },
      async setRightSuccess(roleID){
        const rightArr=[
            ...this.$refs.setRights.getCheckedKeys(),
            ...this.$refs.setRights.getHalfCheckedKeys()
        ]
          const isStr=rightArr.join(',')
        const{data:res}=await this.$http.post(`roles/${this.roleID}/rights`,{rids:isStr})
        if(res.meta.status!==200)return this.$message.error('更新权限失败')
        this.$message.success('更新权限成功')
        this.isSetRight=false
        this.getRoleData()
      }
    }
  }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }

  .pt {
    padding-top: 15px;
  }

  .bdtop {

    border-top: 1px solid #e0e0e0;
  }

  .bdbottom {
    border-bottom: 1px solid #e0e0e0;
  }

  .center {
    display: flex;
    align-items: center;
  }
</style>
