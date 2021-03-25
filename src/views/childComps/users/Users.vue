<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片-->
    <el-card class="box-card">
      <!--    搜索框-->
      <el-row :gutter="20">
        <el-col :span="9">
          <div class="grid-content bg-purple">
            <el-input v-model="queryInfo.query" clearable @clear="getUsersList">
              <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="addUserClick">添加用户</el-button>
          </div>
        </el-col>
      </el-row>
      <!--    表格-->
      <el-table :data="userList" stripe border>
        <el-table-column label="#" type="index">
        </el-table-column>
        <el-table-column label="姓名" prop="username">
        </el-table-column>
        <el-table-column label="邮箱" prop="email">
        </el-table-column>
        <el-table-column label="电话" prop="mobile">
        </el-table-column>
        <el-table-column label="角色" prop="role_name">
        </el-table-column>
        <el-table-column label="状态">
          <template v-slot:default="slotProps">
            <el-switch v-model="slotProps.row.mg_state" @change="userStatus(slotProps.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
<!--            编辑按钮-->
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="updateUser(scope.row.id)"></el-button>
<!--            删除按钮-->
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
<!--            分配角色按钮-->
            <el-tooltip :enterable="false" class="item" effect="dark" content="分配角色" placement="top">
              <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--    分页-->
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
<!--  添加用户-->
    <UserAddUsers ref="addUser" />
    <!--  修改用户信息对话框-->
    <el-dialog
            title="修改用户信息"
            :visible.sync="isUpdateUser"
            width="50%"
            @close="updateDialogClosed">
    <span>
      <el-form :rules="updateRules" ref="updateForm" :model="updateForm" label-width="70px">
        <el-form-item label="用户名">
          <el-input disabled v-model="updateForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="updateForm.mobile"></el-input>
        </el-form-item>
      </el-form>
    </span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isUpdateUser = false">取 消</el-button>
    <el-button type="primary" @click="isUpdateUsers">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import UserAddUsers from "./UserComps/UserAddUsers";
  export default {
    name: "Users",
    components:{
      UserAddUsers,
    },
    created() {
      this.getUsersList()
    },
    data() {
      //校验邮箱
      const checkEmail = (rule, value, cb) => {
        const regExp = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
        if (regExp.test(value)) {
          return cb()
        }
        cb(new Error('请输入合法的邮箱'))
      }
      //校验手机
      const checkMobile = (rule, value, cb) => {
        const regExp = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
        if (regExp.test(value)) {
          return cb()
        }
        cb(new Error('请输入合法的电话号码'))
      }
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        userList: [],
        total: 0,
        isUpdateUser: false,
        //添加用户表单
        addUser: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        //修改用户
        updateForm: {},
        //设置表单规则
        addUserRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入移动电话', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}
          ]
        },
        updateRules: {
          email: [
            {required: true, message: '请输入正确邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入正确电话', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      addUserClick(){
        this.$refs.addUser.addUsers=true
      },
      //获取用户列表
      async getUsersList() {
        const {data: res} = await this.$http.get('users', {params: this.queryInfo})
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.userList = res.data.users
        this.total = res.data.total
      },
      //设置一页的内容数量
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getUsersList()
      },
      //设置页码
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getUsersList()
      },
      //修改用户状态
      async userStatus(userInfo) {
        // console.log(userInfo)
        const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        if (res.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error('修改状态失败')
        }
        this.$message.success(res.meta.msg)
      },
      //  修改用户信息
      async updateUser(usersId) {
        const {data: res} = await this.$http.get('users/' + usersId)
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.error)
        }
        this.updateForm = res.data
        this.isUpdateUser = true
      },
      isUpdateUsers() {
        this.$refs.updateForm.validate(async valid => {
          if (!valid) return
          //发起修改数据请求
          const {data: res} = await this.$http.put('users/' + this.updateForm.id,
              {email: this.updateForm.email, mobile: this.updateForm.mobile})
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success('修改成功')
          this.isUpdateUser = false
          this.getUsersList()
        })
      },
      updateDialogClosed() {
        this.$refs.updateForm.resetFields()
      },
      async deleteUser(id){
        const result=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if(result=='cancel') {
          return this.$message.info('已经取消删除')
        }

        const {data:res}=await this.$http.delete('users/'+id)
        if(res.meta.status!==200){

            this.$message.error('删除错误')
          }
          this.$message.success('删除成功')
          this.getUsersList()
      }
    }
  }
</script>

<style scoped>

</style>
