<template>
  <div v-loading="loadling">
    <div class="grid-content" style="padding-bottom:0px;">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#ffffff"
      >
        <!-- style="margin-left:15%;" -->
        <el-menu-item index="1">
          <span class="font-size" @click="recommend">推荐</span>
        </el-menu-item>
        <el-menu-item index="2">
          <span class="font-size">关注</span>
        </el-menu-item>
        <el-menu-item index="3">
          <span class="font-size">热榜</span>
        </el-menu-item>
      </el-menu>
    </div>
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
            <span class="author" @click="getUserProfile(i.publisherId)">{{i.publisherId+":"}}</span>
            <br>
            <span @click="blogDialog(i)">{{i.small}}</span>
            <span>...</span>
            <span id="a" @click="blogDialog(i)">{{"阅读全文"}}</span>
          </span>
          <span v-else>
            <span class="author" @click="getUserProfile(i.publisherId)">{{i.publisherId+":"}}</span>
            <vue-viewer v-model="i.content"/>
            <span id="a" @click="toggle(index)">{{"收起"}}</span>
          </span>
        </span>
        <span v-else>
          <span class="author" @click="getUserProfile(i.publisherId)">{{i.publisherId+":"}}</span>
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
            <el-dropdown style="padding: 1.5rem 0rem 0rem 1.5rem" @command="handleCommand">
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
    <!-- 查看博客 -->
    <el-dialog title="用户个人信息" :visible="userProfileVisible" width="30%" :show-close="false">
      <div v-loading="loading">
        <el-row type="flex" class="row-bg">
          <el-col>
            <el-form ref="form" :model="userProfile" label-width="100px">
              <el-form-item label="用户名： ">{{nickName}}</el-form-item>
              <el-form-item label="个人介绍：">{{userProfile.description}}</el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-button type="mini" @click="userProfileVisible=false" style="float:right;">关闭</el-button>
        <el-button type="mini" @click="attention(userProfile.userAuthId)" v-if="!isAttention">关注</el-button>
        <el-button type="mini" @click="noAttention(userProfile.userAuthId)" v-else>已关注</el-button>
        <el-button type="mini" @click="privateMessage(userProfile.userAuthId)">私信</el-button>
      </div>
    </el-dialog>
    <!-- 查看博客 -->
    <el-dialog :visible="bolgVisible" :fullscreen="true" :show-close="false">
      <el-button
        type="medium"
        @click="checkVoteInfo"
        plain
        style=" position:fixed; margin-left:80%; z-index:998;"
      >查看投票信息</el-button>
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
    <!-- 投票dialog -->
    <el-dialog :visible="voteVisible" :show-close="false" title="投票" v-loading="voteLoading">
      <div v-if="voteVisible">
        <span class="voteTitle">{{voteInfo.title}}</span>
        <br>
        <br>
        <el-checkbox-group v-model="checkedOption" :min="1" :max="voteInfo.choiceAvailableNumber">
          <el-checkbox
            v-for="option in voteOptionInfo"
            :label="option.id"
            :key="option.id"
            :disabled="isVoted"
          >{{option.content}}</el-checkbox>
          <el-button
            size="mini"
            plain
            @click="submitVoteOption"
            :disabled="isVoted"
            style="float:right;margin-left:1rem;"
          >提交</el-button>
          <el-button
            size="mini"
            plain
            @click="checkedOption = []"
            style="float:right"
            :disabled="isVoted"
          >重新选择</el-button>
        </el-checkbox-group>
        <br>
        <br>
        <br>
        <ve-pie :data="chartData" v-if="isVoted"></ve-pie>
      </div>
      <el-button @click="voteDialogClose ">关闭</el-button>
    </el-dialog>
    <!-- 查看评论 -->
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
import test from "../../test.json";
export default {
  data: function() {
    return {
      //默认选项：推荐
      activeIndex: "1",
      //设置卡片样式
      bodyStyle: { padding: "5px 20px" },
      bodyStyle0: { padding: "0px" },
      // 测试文章
      testArticle: test,
      test: this.$route.query.val,
      userProfile: {},
      userProfileVisible: false,
      isAttention: false,
      followererId: "",
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
      voteVisible: false,
      voteInfo: {},
      voteOptionInfo: "",
      voteLoading: false,
      checkedOption: [],
      chartData: {
        columns: ["content", "detail"],
        rows: []
      },
      isVoted: false
    };
  },
  computed: {
    nickName() {
      return this.userProfile.nickName == ""
        ? "该用户还没有设置昵称"
        : this.userProfile.nickName;
    }
  },
  created: function() {
    let i;
    if (this.$store.state.token != "") {
      this.loadling = true;
      this.$axios
        .get("/forward/blog/blog")
        .then(res => {
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
    } else {
      this.$message({ type: "error", message: "请先登录" });
    }
  },
  methods: {
    voteDialogClose() {
      this.voteVisible = false;
      this.voteInfo = {};
      this.voteOptionInfo = "";
      this.voteLoading = false;
      this.checkedOption = [];
      this.chartData = {
        columns: ["content", "detail"],
        rows: []
      };
      this.isVoted = false;
    },
    submitVoteOption() {
      if (this.checkedOption.length == 0) {
        this.$message({ type: "error", message: "至少选择一项" });
        return;
      }
      if (this.checkedOption.length > this.voteInfo.choiceAvailableNumber) {
        this.$message({ type: "error", message: "选多了也不行哦" });
        return;
      }
      for (let i in this.checkedOption) {
        this.$axios
          .post("/forward/vote/voteDetail", {
            voteOption: "/voteOption/" + this.checkedOption[i]
          })
          .then(res => {
            console.log(res.data);
            for(let j in this.voteOptionInfo){
              console.log(this.voteOptionInfo[j])
              if(this.checkedOption[i] == this.voteOptionInfo[j].id){
                console.log("before--"+this.voteOptionInfo[j].detail)
                this.voteOptionInfo[j].detail++
                console.log("after--"+this.voteOptionInfo[j].detail)
              }
              this.$forceUpdate()
            }
            this.isVoted = true

          })
          .catch(err => {
            this.$message({ type: "error", message: "已投票或网络错误" });
          });
      }
    },
    checkVoteInfo() {
      //检查是否有投票数据
      this.$axios
        .get("/forward/vote/vote/search/findByBlogId", {
          params: { blogId: this.dialogBlog.id }
        })
        .then(res => {
          //没有
          if (res.data._embedded.votes.length == 0) {
            this.$message({ type: "error", message: "该文章没有投票" });
          } else {
            //处理投票数据
            this.voteInfo = res.data._embedded.votes[0];
            // 获得投票选项
            this.$axios
              .get("/forward/vote/vote/" + this.voteInfo.id + "/voteOptions")
              .then(res => {
                this.voteOptionInfo = res.data._embedded.voteOptions;
                // 获取选项的票数信息
                for (let i in this.voteOptionInfo) {
                  this.$axios
                    .get("/forward/vote/voteDetail/search/countByVoteOption", {
                      params: {
                        voteOption: "/voteOption/" + this.voteOptionInfo[i].id
                      }
                    })
                    .then(res => {
                      //添加属性detail为票数
                      this.voteOptionInfo[i].detail = res.data;
                      this.$forceUpdate();
                      this.chartData.rows = this.voteOptionInfo;
                      this.voteVisible = true;
                    });
                  // 获取当前用户是否投票以及投了哪些票
                  this.$axios
                    .get(
                      "/forward/vote/voteDetail/search/findByVoterIdAndVoteOption?",
                      {
                        params: {
                          voteOption:
                            "/voteOption/" + this.voteOptionInfo[i].id,
                          voterId: this.$store.state.userInfo.id
                        }
                      }
                    )
                    .then(res => {
                      this.checkedOption.push(this.voteOptionInfo[i].id);
                      this.isVoted = true;
                      this.voteVisible = true;
                    })
                    .catch(err => {});
                }
              });
          }
        });
      this.$forceUpdate();
    },
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
    },
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleCommand(a) {
      // console.log(a);
    },
    recommend() {
      this.$router.replace({ name: "recommend" });
    },
    subscription() {
      this.$router.replace({ name: "subscription" });
    }
  }
};
</script>

<style scoped>
.icon-size {
  display: inline-block;
  font-size: 1.45rem;
  margin-top: 0.25rem;
  margin-left: 5%;
}
.opposeIconWidth {
  margin-left: -0.45rem;
}
.opposeBtn {
  margin-left: -0.01rem;
  width: 2%;
}
.iconWidth {
  margin-left: -0.25rem;
}
.box-card {
  width: 100%;
  min-height: 200px;
}
#a {
  cursor: pointer;
  text-decoration: none;
  color: #0492bd;
}
.cards {
  width: 100%;
  /* padding-bottom: 20px; */
}
.font-size {
  font-size: 1rem;
  padding: 20px;
}
.author {
  font-weight: 700;
  font-size: 1.3rem;
}
.voteTitle {
  font-weight: 700;
  font-size: 1.3rem;
}
</style>
