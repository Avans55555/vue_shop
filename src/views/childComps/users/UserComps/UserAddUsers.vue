<template>
  <div>
    <!--  添加用户对话框-->
    <el-dialog
            title="添加用户"
            :visible.sync="addUsers"
            width="50%"
            @close="dialogClosed"
    >
      <el-form ref="addUserForm" :rules="addUserRules" :model="addUser" label-width="80px">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="用户密码">
          <el-input v-model="addUser.password"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="用户邮箱">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="用户电话">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="cancelAdd">取 消</el-button>
    <el-button type="primary" @click="confirmClick">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "UserAddUsers",
    created() {
      this.getUsersList()
    },
    data(){
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
      return{
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        userList: [],
        addUsers:false,
        isUpdateUser: false,
        //添加用户表单
        addUser: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
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
      }

    },
    methods:{
      async getUsersList() {
        const {data: res} = await this.$http.get('users', {params: this.queryInfo})
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.userList = res.data.users
        this.total = res.data.total
      },
      cancelAdd(){
        this.addUsers=false
      },
      dialogClosed() {
        this.$refs.addUserForm.resetFields()
      },
      confirmClick() {
        this.$refs.addUserForm.validate(async valid => {
          if (!valid) return
          // 校验通过发起网络请求添加新用户
          const {data: res} = await this.$http.post('users', this.addUser)
          if (res.meta.status !== 201) {
            return this.$message.error('添加用户失败')
          }
          this.$message.success('用户添加成功')
          this.addUsers = false
          this.getUsersList()
        })
      },
    }
  }
</script>

<style scoped>

</style>
