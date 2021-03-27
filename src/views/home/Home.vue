<template>
  <el-container class="home-wrapper">
<!--    头部-->
    <el-header>
<!--      左侧头像文本-->
      <div>
        <img src="~assets/img/8.jpg" alt="">
        <span>电商管理系统</span>
      </div>
<!--      退出按钮-->
      <el-button type="info" @click="backLogin">退出</el-button>
    </el-header>
    <el-container>
<!--    侧边栏-->
      <el-aside :width="isFold ? '64px':'200px'">
        <div class="fold" @click="fold">|||</div>
        <el-menu
                background-color="#323744"
                text-color="#fff"
                active-text-color="#409efe"
                unique-opened
                :collapse="isFold"
                :collapse-transition="false"
                router
                :default-active="activePath"
        >
<!--          一级菜单-->

          <el-submenu :index="fi.id + ''" v-for="fi in menusList" :key="fi.id">
            <template slot="title" >
              <i :class="iconObj[fi.id]"></i>
              <span class="item-span">{{fi.authName}}</span>
            </template>
<!--            二级菜单-->
              <el-menu-item @click="itemClick('/'+si.path + '')" :index="'/'+si.path " v-for="si in fi.children" :key="si.id" >
                <template slot="title" >
                  <i class="el-icon-menu"></i>
                  <span>{{si.authName}}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
<!--      内容主题-->
      <el-main>
       <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data(){
      return{
        //存放一级菜单的数组
        menusList:[],
        //动态绑定一级菜单图标字体
        iconObj:{
          '125':'iconfont icon-users',
          '103':'iconfont icon-tijikongjian',
          '101':'iconfont icon-shangpin',
          '102':'iconfont icon-danju-tianchong',
          '145':'iconfont icon-baobiao',
        },
        //是否折叠
        isFold:false,
        activePath:''
      }
    },
    created() {
      this.getAsideData()
      this.activePath=window.sessionStorage.getItem('activePath')
    }
    ,
    methods:{
      //监听返回按钮
      backLogin(){
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      //得到菜单栏的数据
      async getAsideData(){
       const{data:res}= await this.$http.get('menus')
        if(res.meta.status!==200)return this.$message.error(res.meta.msg)
        this.menusList=res.data
      },
      //监听菜单栏事件
      fold(){
        this.isFold=!this.isFold
      },
      //监听二级菜单
      itemClick(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath=activePath
      },

    }

  }
</script>

<style lang="less" scoped>
  .home-wrapper{
    height: 100vh;
  }
  .el-header{
    background-color: #373C41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    >div{
      display: flex;
      align-items: center;
      img{
        width: 55px;
        border-radius: 50%;
        border:1px solid gray;
        box-shadow:0 0 10px rgba(0,0,0,0.6);
      }
      span{
        margin-left: 15px;
        font-size: 20px;
        color: #e0e0e0;
      }
    }
}
  .el-aside{
    background-color: #323744;
  }
  .el-main{
    background-color: #EAEDF2;
  }
  .item-span{
    margin-left: 10px;
  }
  .el-menu{
    border-right: none;
  }
  .fold{
    background-color: #4a5064;
    text-align: center;
    letter-spacing: 0.2em;
    line-height: 24px;
    color: #fff;
    font-size: 10px;
    cursor: pointer;
    transition: all 200ms;
  }
  .fold:hover{
    color:#409efe;
    letter-spacing: 0.4em;

  }
</style>
