<template>
  <div>
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
  export default {
    name: "UserUpdateUsers",
    props:{
      usersId:{
        type:Number
      }
    },
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
        total: 0,
        isUpdateUser: false,
        updateForm: {},
        userList: [],
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
    methods:{
      async getUsersList() {
        const {data: res} = await this.$http.get('users', {params: this.queryInfo})
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.userList = res.data.users
        this.total = res.data.total
      },
      async updateUser() {
        const {data: res} = await this.$http.get('users/' + parseInt(this.usersId))
        console.log(res)
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
    }
  }
</script>

<style scoped>

</style>
