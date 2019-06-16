<template>
  <div style="position:fixed; width:100%;z-index:999;">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :md="4" :xs="4" :sm="4" :xl="2" :lg="2">
        <img src="../assets/logo.png" style="height:50px; padding-top:6.5px;">
      </el-col>
      <el-col :md="14" :xs="6" :sm="9" :xl="5" :lg="6">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          style="padding-top:8px;"
          background-color="#ffffff"
          v-if="isScroll"
        >
          <el-menu-item index="1" @click="JumpTo('index')">
            <span class="font-size">首页</span>
          </el-menu-item>
          <el-menu-item index="2" @click="JumpTo('Topic')">
            <span class="font-size">话题</span>
          </el-menu-item>
          <el-menu-item index="3" @click="JumpTo('Discover')">
            <span class="font-size">发现</span>
          </el-menu-item>
        </el-menu>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          style="padding-top:8px;"
          background-color="#ffffff"
          v-if="!isScroll"
        >
          <el-menu-item index="1">
            <span class="font-size">推荐</span>
          </el-menu-item>
          <el-menu-item index="2">
            <span class="font-size">关注</span>
          </el-menu-item>
          <el-menu-item index="3">
            <span class="font-size">热榜</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :md="10" :xs="4" :sm="5" :lg="5">
        <div class="grid-content">
          <el-input v-model="keyWord" placeholder="请输入内容" style="padding:1rem;"></el-input>
        </div>
      </el-col>
      <el-col :md="4" :xs="2" :sm="4" :lg="2">
        <div class="grid-content" style="padding-top: 0.85rem;padding-left:2.5rem;">
          <el-button type="primary" @click="search">
            <i class="el-icon-search" style="margin-left: -8px;"></i>&nbsp;&nbsp;&nbsp;搜索
          </el-button>
        </div>
      </el-col>
      <el-col :md="4" :xs="2" :sm="3" :lg="3">
        <el-dropdown
          style="padding: 0.85rem 0rem 0rem 1.5rem"
          v-if="isLogin"
          @command="handleCommand"
        >
          <img :src="avatarURL">
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="homePage">我的主页</el-dropdown-item>
            <el-dropdown-item command="userProfile">设置</el-dropdown-item>
            <el-dropdown-item command="logOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div style="padding: 1.5rem 0rem 0rem 1.5rem">
          <span @click="loginDialogVisible = true" v-if="!isLogin" class="pointer">登录/注册</span>
          <el-dialog
            title="登录"
            :visible="loginDialogVisible"
            width="30%"
            :append-to-body="true"
            :lock-scroll="false"
            :center="true"
          >
            <el-row type="flex" class="row-bg">
              <el-col :lg="lg" v-loading="loading">
                <el-form ref="form" :model="userInfo" label-width="40%">
                  <el-form-item label="用户名： ">
                    <el-input v-model="userInfo.username"></el-input>
                  </el-form-item>
                  <el-form-item label="密码： ">
                    <el-input v-model="userInfo.password" type="password"></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码： " v-if="isRegisiter">
                    <el-input v-model="retypePassword" type="password"></el-input>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button
                type="text"
                @click="isRegisiter = !isRegisiter"
                :disabled="loading"
                style="float:left"
              >{{regisiterButton}}</el-button>
              <el-button
                type="primary"
                @click="login(userInfo)"
                :disabled="loading"
                v-if="!isRegisiter"
              >登录</el-button>
              <el-button type="primary" @click="regisiter(userInfo)" :disabled="loading" v-else>注册</el-button>
              <el-button @click="loginDialogVisible = false" type="text" style="float:right">取 消</el-button>
            </span>
          </el-dialog>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data: function() {
    return {
      //搜索关键词
      keyWord: "",
      //默认激活index
      activeIndex: "1",
      activeIndex2: "1",
      //是否登录
      isLogin: false,
      isScroll: true,
      //登录dialog是否显示
      loginDialogVisible: false,
      //登录信息
      userInfo: {
        username: "",
        password: "",
        client_id: "demo",
        client_secret: "demo_secret",
        grant_type: "password",
        scope: "all"
      },
      isRegisiter: false,
      retypePassword: "",
      //lg对应的登录框偏移量
      lg: { span: "16", offset: "3" },
      userAuthId: "",
      loading: false,
      avatarURL:
        "https://ui-avatars.com/api/?size=32&name=" +
        this.$store.state.userInfo.id
    };
  },
  computed: {
    regisiterButton() {
      return this.isRegisiter ? "登录" : "注册";
    }
  },
  mounted: function() {
    window.addEventListener("scroll", this.handleScroll);
  },
  created: function() {
    // console.log(window.screen.width+" "+window.screen.height)
    //未登录，隐藏下拉菜单，isLogin设置为假
    if (this.$store.state.token == "") {
      this.isLogin = false;
    } else {
      this.isLogin = true;
    }
  },
  methods: {
    regisiter(userInfo) {
      if (userInfo.username == "") {
        this.$message({
          type: "error",
          message: `请输入用户名`
        });
        return;
      } else if (
        userInfo.password != this.retypePassword ||
        userInfo.password == ""
      ) {
        this.$message({
          type: "error",
          message: `两次密码输入不一致`
        });
        return;
      } else {
        this.$axios
          .post("/forward/authorize/user", {
            username: userInfo.username,
            password: userInfo.password
          })
          .then(res => {
            this.$message({
              type: "success",
              message: `注册成功,请登录`
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          });
      }
    },
    search() {},
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    //导航栏跳转
    JumpTo(index) {
      if (index == "index") {
        this.$router.replace({ path: "/" });
      }
      if (index == "Topic") alert(index);
      if (index == "Discover") alert(index);
      // this.$router.push({})
    },
    handleScroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      // console.log(scrollTop);
      if (scrollTop > 150 && this.$route.path == "/") {
        this.isScroll = false;
      } else {
        this.isScroll = true;
      }
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    login(userInfo) {
      let that = this;
      if (userInfo.username == "" || userInfo.password == "") {
        this.$message({
          type: "error",
          message: `请输入用户名和密码`
        });
        return;
      }
      if (userInfo == null) {
        console.log(userInfo);
        this.loginDialogVisible = false;
      } else {
        this.loading = true;
        //登录 根据返回判断状态
        this.$axios
          .post("/forward/authorize/oauth/token", qs.stringify(userInfo))
          .then(res => {
            let token = res.data.token_type + " " + res.data.access_token;
            this.$store.commit("loginSuccess", token);
            this.$axios
              .get("/forward/authorize/me")
              .then(res => {
                console.log(res.data);
                that.userAuthId = res.data.id;
                this.$store.commit("setUserInfo", res.data);
                this.$message({
                  type: "success",
                  message: `登陆成功`
                });
                this.$forceUpdate();
                this.$axios
                  .get(
                    "/forward/userProfile/userProfile/search/findUserProfileByUserAuthId",
                    { params: { userAuthId: that.userAuthId } }
                  )
                  .then(res => {
                    this.loading = false;
                    this.$store.commit("setUserId", res.data.id);
                    window.location.reload();
                  })
                  .catch(err => {
                    this.loading = false;
                    that.loginDialogVisible = false;
                    this.$message({
                      type: "error",
                      message: `请设置您的个人信息`
                    });
                    this.$router.push({
                      path: "/modifyUserInfo",
                      query: {
                        first: true
                      }
                    });
                  });
                // window.location.reload();
              })
              .catch(err => {
                this.$message({
                  type: "error",
                  message: "获取用户信息失败，请稍后再试" + err
                });
                this.loading = false;
                this.$store.commit("logoutSuccess");
              });
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: "用户名或密码错误"
            });
            this.loading = false;
            // window.location.reload();
          });

        // this.$store.commit("loginSuccess", "2333");
        // console.log(this.$store.state.token);
        // this.loginDialogVisible = false;
        // window.location.reload();
      }
    },
    handleCommand(command) {
      switch (command) {
        case "homePage":
          this.$router.push("/HomePage");
          break;
        case "userProfile":
          this.$router.push("/modifyUserInfo");
          break;
        case "logOut":
          this.$store.commit("logoutSuccess");
          window.location.reload();
          break;
      }
    }
  }
};
</script>
<style scoped>
.font-size {
  font-size: 1.2rem;
  padding: 1rem;
}
/* li {
  display: inline;
} */
.el-row {
  padding-bottom: 20px;
}
/* &:last-child {
    margin-bottom: 0;
  } */
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-white {
  background: #ececec;
}
.bg-white-light {
  background: #f8f8f8;
}
s .grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #ffffff;
}
</style>
