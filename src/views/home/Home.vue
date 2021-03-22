<template>
  <div>
    <el-button type="info" @click="backLogin">退出</el-button>
  </div>
</template>

<script>
  export default {
    name: "Home",
    methods:{
      backLogin(){
        window.sessionStorage.clear()
        this.$router.push('/login')
      }
    }

  }
</script>

<style scoped>

</style>