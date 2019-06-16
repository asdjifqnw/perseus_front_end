<template>
  <div style="padding-top:6.2rem; border-radius: 4px;">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :xs="15" :sm="15" :md="16" :lg="15" :xl="11">
        <el-card class="box-card" :body-style="bodyStyle0" style="width:98.3%">
          <el-col :span="24">
            <!-- 子路由 -->
            <!-- <div v-if="this.$store.state.token==''">
              <span class="login_font">登录发现更多精彩内容</span>
              <img src="../assets/index.png" style="width:80%; padding:2.5rem 5rem 2rem 5.5rem; ">
            </div>
            <router-view v-else :key="activeDate"/> -->
            <router-view/>
          </el-col>
        </el-card>
      </el-col>

      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="4">
        <div class="grid-content" style="position:fixed; width:auto; z-index:998;">
          <el-card class="box-card1">
            <i class="el-icon-edit first pointer" @click="newArtice"></i>
            <i class="el-icon-time iconWidth pointer" @click="comment"></i>
            <i class="el-icon-service iconWidth pointer" @click="privateLetter"></i>
            <br>
            <br>
            <span class="three-Font pointer" @click="newArtice">编写文章</span>&nbsp;&nbsp;&nbsp;
            <span class="three-Font pointer" @click="comment">评论回复</span>&nbsp;&nbsp;&nbsp;
            <span class="three-Font pointer" @click="privateLetter">查看私信</span>
            <br>
            <br>
            <div class="line"></div>
            <br>
            <span style="padding-left:7%;">
              <i class="iconfont icon-size" @click="drafts">&#xe64f;</i>
              <span class="pointer" @click="drafts">&nbsp;&nbsp;&nbsp;我的草稿箱</span>
            </span>
          </el-card>
          <el-card class="box-card1" style="margin-top:0.65rem;">
            <span @click="ListMyArticles">
              <i class="iconfont icon-size">&#xe618;</i>
              <span class="right-font-size pointer">&nbsp;&nbsp;&nbsp;我的文章</span>
            </span>
            <br>
            <span @click="ListMyAttentions">
              <i class="iconfont icon-size">&#xe60f;</i>
              <span class="right-font-size pointer">&nbsp;&nbsp;&nbsp;我的关注</span>
            </span>
            <br>
            <span @click="ListMyCollections">
              <i class="iconfont icon-size">&#xe687;</i>
              <span class="right-font-size pointer">&nbsp;&nbsp;&nbsp;我的收藏</span>
            </span>
            <br>
            <span>
              <i class="iconfont icon-size">&#xe64c;</i>
              <span class="right-font-size pointer">&nbsp;&nbsp;&nbsp;联系我们</span>
            </span>
            <br>
            <span>
              <i class="iconfont icon-size">&#xe6d5;</i>
              <span class="right-font-size pointer">&nbsp;&nbsp;&nbsp;版权服务中心</span>
            </span>
          </el-card>
          <el-card
            class="box-card1"
            style="margin-top:0.65rem;height:250px;"
            v-if="screenHeight > 1079"
          >
            <span>
              <i class="el-icon-time" style="font-size: 1.0rem;">&nbsp;&nbsp;&nbsp;最近浏览</i>
            </span>
          </el-card>
          <div style="display:inline-block;margin-top:0.65rem;color: #77839c">
            &nbsp;小开开·在线博客系统
            <br>&nbsp;应用工作申请·开通博客机构号
            <br>&nbsp;侵权举报网上有害信息举报专区
            <br>&nbsp;违法和不良信息举报：010-82333333
            <br>&nbsp;电信与服务业务经营许可证
            <br>&nbsp;网络文化经营许可证
            <br>&nbsp;联系我们 © 2019 
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      activeDate: " " + new Date(),
      activeIndex: "1",
      //设置卡片样式
      bodyStyle: { padding: "5px 20px" },
      bodyStyle0: { padding: "0px" },
      screenHeight: ""
    };
  },
  created: function() {},
  mounted: function() {
    this.screenHeight = window.screen.height;
  },
  methods: {
    ListMyCollections() {
      this.$router.push({ name: "ListMyCollections" });
    },
    drafts() {
      this.$router.push({ name: "drafts" });
    },
    comment() {
      this.$router.push({ name: "comment" });
    },
    privateLetter() {
      this.$router.push({ name: "privateLetter" });
    },
    newArtice() {
      // console.log(this.$store.state.newArticle);
      this.$router.push({ name: "newArticle" });
    },
    ListMyArticles() {
      this.$router.push({ name: "ListMyArticles" });
    },
    ListMyAttentions() {
      this.$router.push({ name: "ListMyAttentions" });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login_font {
  display: inline-block;
  width: 100%;
  height: 100%;
  color: #0492bd;
  font-size: 2rem;
  text-align: center;
  padding-top: 2.5rem;
}
.iconfont path {
  fill: rgb(255, 255, 255);
}
.icon-size {
  font-size: 1.2rem;
}
.right-font-size {
  display: inline-block;
  margin: 5px;
  font-size: 1rem;
  /* color: #77839c; */
}
a {
  text-decoration: none;
  color: #0492bd;
}
.cards {
  width: 100%;
  /* padding-bottom: 20px; */
}
.three-Font {
  font-size: 1rem;
}
.first {
  padding-left: 1.07rem;
  font-size: 1.8rem;
}
.iconWidth {
  font-size: 1.8rem;
  padding-left: 3rem;
  padding-top: 0.8rem;
}

s .grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 100%;
  min-height: 200px;
}
.box-card1 {
  width: 100%;
}
.line {
  height: 1px;
  background: #dbdbdb;
  transform: scaleY(0.5);
}
</style>
