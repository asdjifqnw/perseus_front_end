<template>
  <div>
    <el-card
      class="box-card"
      :body-style="bodyStyle"
      shadow="hover"
      style="background: linear-gradient(#DDDDDD, white);"
      v-loading="headLoading"
    >
      <el-row style="padding:2rem;">
        <el-col :lg="6" :offset="1">
          <img :src="avatarURL" id="img">
        </el-col>
        <el-col :lg="12">
          <span class="userInfo">{{authorProfile.nickName}}</span>
          <br>
          <span class="userInfo" style="font-size:1.2rem;">用户ID：{{authorProfile.userAuthId}}</span>
          <br>
          <span class="userInfo" style="font-size:1.2rem;">{{authorProfile.description}}</span>
        </el-col>
        <el-col :lg="5">
          <el-card>
            <span class="attition">粉丝：&nbsp;{{followeds}}</span>
            <span class="attition">关注：&nbsp;{{followers}}</span>
          </el-card>
          <br>
          <el-button plain type="small" :disabled="isSelf" v-if="isAttention" @click="noAttention(followererId)">已关注</el-button>
          <el-button plain type="small" :disabled="isSelf" v-else @click="attention(followedId)">关注</el-button>
          <el-button plain type="small" :disabled="isSelf" @click="privateMessage(userId)">私信</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#ffffff"
      style="padding-left:1rem;"
    >
      <!-- style="margin-left:15%;" -->
      <el-menu-item index="1">
        <span class="font-size" @click="ListBlog">文章</span>
      </el-menu-item>
      <el-menu-item index="2">
        <span class="font-size">评论</span>
      </el-menu-item>
      <el-menu-item index="3">
        <span class="font-size">投票</span>
      </el-menu-item>
    </el-menu>
    <div class="cards" v-for="(i,index) in testArticle.blogs" :key="index">
      <el-card class="box-card" :body-style="bodyStyle" shadow="hover">
        <p>
          <span
            class="pointer"
            style="font-size: 1.3rem; font-weight: bold;"
            @click="blogDialog(i)"
          >{{i.title}}</span>
        </p>
        <!-- 判断是否存在small，如果不存在则为短回答，存在为长回答 -->
        <!-- 判断是否为打开状态，如果为否则加上...并且显示阅读全文 -->
        <span v-if="i.small != null">
          <span v-if="!i.isOpen" class="pointer">
            <span class="author">{{i.publisherId+":"}}</span>
            <br>
            <span @click="blogDialog(i)">{{i.small}}</span>
            <span>...</span>
            <span id="a" @click="blogDialog(i)">{{"阅读全文"}}</span>
          </span>
          <span v-else>
            <span class="author">{{i.publisherId+":"}}</span>
            <vue-viewer v-model="i.content"/>
            <span id="a" @click="toggle(index)">{{"收起"}}</span>
          </span>
        </span>
        <span v-else>
          <span class="author">{{i.publisherId+":"}}</span>
          <vue-viewer v-model="i.content"/>
        </span>
        <div style="padding-bottom:10px; padding-top:0px;">
          <span @click="checkComment(i)">
            <i class="iconfont icon-size pointer">&#xe60c;</i>
            <span class="pointer">&nbsp;评论</span>
          </span>
          <span @click="collection(i)">
            <i class="iconfont icon-size pointer">&#xe687;</i>
            <span class="pointer">&nbsp;收藏</span>
          </span>
          <span>
            <i class="iconfont icon-size pointer">&#xe88b;</i>
            <span class="pointer">&nbsp;感谢</span>
          </span>
          <span>
            <i class="iconfont icon-size pointer">&#xe6c3;</i>
            <span class="pointer">&nbsp;分享</span>
          </span>
          <span>
            <el-dropdown style="padding: 1.5rem 0rem 0rem 1.5rem">
              <span class="el-dropdown-link">
                <i class="iconfont icon-size">&#xe69b;</i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="isNotUseful">没有帮助</el-dropdown-item>
                <el-dropdown-item command="disLike">不感兴趣</el-dropdown-item>
                <el-dropdown-item command="warnReport">举报</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
      </el-card>
    </div>

    <el-dialog :visible="bolgVisible" :fullscreen="true" :show-close="false">
      <el-button
        type="medium"
        @click="bolgVisible=false"
        plain
        style=" position:fixed; margin-left:90%; z-index:998;"
      >关闭</el-button>
      <div v-loading="loading">
        <el-row type="flex" class="row-bg">
          <el-col>
            <span class="pointer" style="font-size: 1.3rem; font-weight: bold;">{{dialogBlog.title}}</span>
            <br>
            <br>
            <vue-viewer v-model="dialogBlog.content"/>
            <span
              class="pointer"
              style="font-size: 0.9rem; font-weight: bold;"
            >创建时间:{{dialogBlog.createDate}}</span>
            <br>
            <span
              class="pointer"
              style="font-size: 0.9rem; font-weight: bold;"
            >最后修改时间:{{dialogBlog.modifyDate}}</span>
            <br>
            <br>
            <br>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog
      title="评论"
      :visible="commentVisible"
      width="40%"
      :show-close="false"
      :before-close="clearCommnets"
    >
      <el-button type="mini" @click="clearCommnets" style="float:right">关闭</el-button>
      <div v-loading="commentLoading">
        <el-row type="flex" class="row-bg">
          <el-col :span="20">
            <span style="display:block; font-size:1.0rem;">请输入你的评论:</span>
            <br>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-col :span="20">
            <el-input v-model="comment.content"></el-input>
          </el-col>
          <el-col :span="3" :offset="1">
            <el-button @click="sendComment">发送</el-button>
          </el-col>
        </el-row>
      </div>
      <span
        style="text-align:center;display:block;padding-top:10px; "
        class="pointer"
        @click="findByBlogId"
      >展开评论</span>
      <div v-if="commentsVisible" v-loading="commentsLoading">
        <el-card shadow="none" v-for="(i,index) in comments" :key="index">
          <span style="font-size:1.2rem;">
            <span style="font-weight: bold;" class="pointer">{{i.senderId+" : "}}</span>
            {{i.content}}
          </span>
          <br>
          <br>
          <span style="float:right;">{{"评论日期 : "+i.createDate.replace("T"," ")}}</span>
        </el-card>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1",
      bodyStyle: { padding: "5px 20px" },
      //主页用户信息
      userId: "",
      authorProfile: {
        nickName: "用户昵称",
        description: "用户个性签名",
        userAuthId: "获取中"
      },
      avatarURL: "",
      testArticle: {},
      userProfile: {},
      userProfileVisible: false,
      isAttention: false,
      followererId: "",
      followedId:"",
      loadling: false,
      loading: false,
      bolgVisible: false,
      dialogBlog: {
        id: "",
        title: "",
        content: "",
        publisherId: "",
        createDate: "",
        modifyDate: ""
      },
      commentLoading: false,
      commentVisible: false,
      comment: { blogId: "", content: "" },
      comments: [
        { senderId: 1, contnet: "评论内容", createDate: "2019-04-27 05:52:55" }
      ],
      commentsVisible: false,
      commentsLoading: false,
      followers: "获取中",
      followeds: "获取中",
      isSelf: false,
      headLoading: false
    };
  },
  computed: {
    nickName() {
      return this.userProfile.nickName == ""
        ? "该用户还没有设置昵称"
        : this.userProfile.nickName;
    }
  },
  created() {
    let i;
    let id = "";
    console.log(this.$route.query.id);
    this.$route.query.id == null
      ? (id = this.$store.state.userInfo.id)
      : (id = this.$route.query.id);
    this.avatarURL = "https://ui-avatars.com/api/?size=128&name=" + id;
    this.followedId = id
    this.userId = id;
    if (this.$route.query.id == null) this.isSelf = true;
    this.headLoading = true;
    this.$axios
      .get(
        "/forward/userProfile/userProfile/search/findUserProfileByUserAuthId",
        { params: { userAuthId: id } }
      )
      .then(res => {
        this.authorProfile = res.data;
        this.headLoading = false;
      });
    this.$axios
      .get("/forward/userAttention/userAttention/search/countByFollowedId", {
        params: { followedId: id }
      })
      .then(res => {
        this.followeds = res.data;
        this.headLoading = false;
      });
    this.$axios
      .get("/forward/userAttention/userAttention/search/countByFollowerId", {
        params: { followerId: id }
      })
      .then(res => {
        this.followers = res.data;
        this.headLoading = false;
      });
    if (this.isSelf == false) {
      this.$axios.get(
        "/forward/userAttention/userAttention/search/findByFollowedIdAndFollowerId",
        { params: { followedId: id, followerId: this.$store.state.userInfo.id } }
      ).then(res=>{
        this.isAttention = true
        this.followererId = res.data.id
      }).catch(err=>{
        if(err.response.status == 404){
          this.isAttention = false
        }else 
        this.$message({type:"error",message:"获取关注信息失败,请刷新重试"})
      })
    }

    this.$axios
      .get("/forward/blog/blog/search/findByPublisherId", {
        params: { publisherId: id }
      })
      .then(res => {
        // console.log(res);
        this.testArticle = res.data._embedded;
        for (i = 0; this.testArticle.blogs[i] != null; i++) {
          var temp = this.testArticle.blogs[i];
          temp.newParam = "isOpen";
          temp.isOpen = false;
          if (temp.content.length > 200) {
            //添加新键值对 small，为回答的缩写
            temp.newParam = "small";
            temp.small = temp.content.substr(0, 200);
          }
        }
        this.loadling = false;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    newAttition(){

    },
    ListBlog() {},

    handleCommand() {},

    clearCommnets(done) {
      this.comments = [
        { senderId: 1, contnet: "评论内容", createDate: "2019-04-27 05:52:55" }
      ];
      this.commentsVisible = false;
      this.commentVisible = false;
      this.comment.content = "";
    },
    findByBlogId() {
      if (this.comment.blogId == "") {
        this.$message({
          type: "error",
          message: "出现问题，请重试"
        });
        return;
      }
      console.log(this.commentsVisible);
      this.commentsVisible = !this.commentsVisible;
      console.log(this.commentsVisible);
      if (this.commentsVisible) {
        this.commentsLoading = true;
        this.$axios
          .get("/forward/comment/comment/search/findByBlogId", {
            params: { blogId: this.comment.blogId }
          })
          .then(res => {
            // console.log(res);
            this.comments = res.data._embedded.comments;
            this.commentsLoading = false;
          })
          .catch(err => {
            console.log(err);
            this.commentsLoading = false;
          });
      }
    },
    sendComment() {
      if (this.comment.blogId == "" || this.comment.content == "") {
        this.$message({
          type: "error",
          message: "请填写内容"
        });
        return;
      }
      this.commentLoading = true;
      this.$axios
        .post("/forward/comment/comment", this.comment)
        .then(res => {
          this.$message({ type: "success", message: "发送成功！" });
          this.commentLoading = false;
        })
        .catch(error => {
          this.$message({ type: "error", message: "您已经评论过啦" });
          this.commentLoading = false;
        });
    },
    collection(blog) {
      this.$message({ type: "success", message: "收藏中，请耐心等待" });
      this.$axios
        .post("/forward/additionalData/userLikeHistory", { blogId: blog.id })
        .then(res => {
          this.$message({ type: "success", message: "收藏成功" });
        })
        .catch(err => {
          if (err.response.status == 409) {
            this.$message({ type: "error", message: "您已收藏" });
          } else this.$message({ type: "error", message: "网络错误" });
        });
    },
    checkComment(blog) {
      this.commentVisible = true;
      this.history(blog.id);
      this.comment.blogId = blog.id;
    },
    blogDialog(blog) {
      this.bolgVisible = true;
      this.history(blog.id);
      this.dialogBlog = blog;
    },
    privateMessage(id) {
      this.$router.push({ path: "/privateLetter", query: { id: id } });
    },
    getUserProfile(id) {
      let that = this;
      that.userProfileVisible = true;
      this.loading = true;
      this.$axios
        .get(
          "/forward/userProfile/userProfile/search/findUserProfileByUserAuthId",
          { params: { userAuthId: id } }
        )
        .then(res => {
          that.userProfile = res.data;
          this.$axios
            .get(
              "/forward/userAttention/userAttention/search/findByFollowedId",
              { params: { followedId: id } }
            )
            .then(res => {
              if (res.data._embedded.userAttentions.length != 0) {
                that.isAttention = true;
                that.followererId = res.data._embedded.userAttentions[0].id;
              }
              that.loading = false;
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          this.$message({ type: "error", message: "网络错误" });
          that.userProfileVisible = false;
          this.loading = false;
        });
    },
    attention(id) {
      this.loading = true;
      this.$axios
        .post("/forward/userAttention/userAttention", { followedId: id })
        .then(res => {
          this.$message({ type: "success", message: "关注成功" });
          this.followererId = res.data.id;
          this.isAttention = true;
          this.loading = false;
          this.$forceUpdate();
        })
        .catch(err => {
          this.$message({ type: "error", message: "网络错误" });
          this.loading = false;
        });
    },
    noAttention(id) {
      this.loading = true;
      this.$axios
        .delete("/forward/userAttention/userAttention/" + this.followererId)
        .then(res => {
          this.$message({ type: "success", message: "取消关注成功" });
          this.isAttention = false;
          this.loading = false;
          this.$forceUpdate();
        })
        .catch(err => {
          this.$message({ type: "error", message: "网络错误" });
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
#img {
  border: solid 0.5rem #ffffff;
}
.userInfo {
  display: inline-block;
  font-size: 1.8rem;
  padding-top: 0.85rem;
}
.attition {
  display: inline-block;
  margin-left: 1rem;
}
.icon-size {
  display: inline-block;
  font-size: 1.45rem;
  margin-top: 0.25rem;
  margin-left: 5%;
}
#a {
  cursor: pointer;
  text-decoration: none;
  color: #0492bd;
}
</style>
