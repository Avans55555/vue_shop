<template>
  <div class="login-wrapper">
    <div class="login_box">
<!--      头像-->
      <div class="avatar">
        <img src='~assets/logo.png' alt="">
      </div>
<!--      表单-->
      <el-form ref="loginFormRef" :model="inputForm" :rules="loginFormRules"   class="login_form">
<!--          用户名-->
        <el-form-item class="user" prop="username">
          <el-input v-model="inputForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
<!--          密码-->
        <el-form-item  prop="password">
          <el-input v-model="inputForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm" >重置</el-button>

        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        inputForm:{
          username:'admin',
          password:'123456'
        },
        loginFormRules:{
          //校验用户名
          username:[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          //校验密码
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      resetForm(){
         // this.$refs.loginFormRef.resetField
        this.$refs.loginFormRef.resetFields();
      },
      login(){
        this.$refs.loginFormRef.validate(async valId=>{
          if(!valId)return false
         const {data:res}= await this.$http.post('login',this.inputForm);
          if(res.meta.status!==200) return this.$message.error('登录失败')
            this.$message.success('登录成功')
          console.log(res)
          window.sessionStorage.setItem('token',res.data.token)
          this.$router.push('/home')
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.login-wrapper{
  background-color: #2b4b6b;
  height:100vh;
  position: relative;
}
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .avatar{
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #e0e0e0;
      box-shadow: 0 0 5px rgba(0,0,0,0.5);
    }
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding:0 30px;
    box-sizing: border-box;
  }
</style>
