<template>
  <div>
    <el-card class="box-card" :body-style="bodyStyle" shadow="none">
      <p>
        <span>文章标题：</span>
        <el-input
          v-model="article.title"
          placeholder="请输入标题"
          style="display:inline-block;width:30rem;;"
        ></el-input>&nbsp;
        <el-button type="primary" plain @click="dialogVisible = true">上传图片</el-button>
        <el-button type="primary" plain @click="voteDialogVisible = true">添加投票</el-button>
      </p>
      <el-dialog title="确认信息" :visible="reviewBlogVisble" width="50%" :show-close="false">
        <el-card style="font-size:1rem" shadow="none">
          <span v-if="patchArticle.id!=''" class="blod">您修改了一篇文章</span>
          <span v-else class="blod">您创建了一篇新文章</span>
          <br>
          <span>文章标题: &nbsp;&nbsp;</span>
          <span class="blod">{{article.title}}</span>
          <br>
          <br>
          <span v-if="voteInfo.title!= ''">
            <span class="blod">有一个投票被创建在此文章:&nbsp;&nbsp;</span>
            <br>
            <span>
              投票标题: &nbsp;&nbsp;
              <span class="blod">{{voteInfo.title}}</span>
            </span>
          </span>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button @click="reviewBlogVisble = false">取 消</el-button>
          <el-button type="primary" @click="submit">提 交</el-button>
        </span>
      </el-dialog>

      <!-- 投票 -->
      <el-dialog title="添加投票" :visible="voteDialogVisible" width="30%" :show-close="false">
        <el-row>
          <el-col :lg="6">
            <span>投票标题:</span>
          </el-col>
          <el-col :lg="18">
            <el-input v-model="voteInfo.title" size="small"></el-input>
          </el-col>
        </el-row>
        <br>
        <el-row>
          <el-col :lg="6">
            <span>投票选项</span>
          </el-col>
          <el-col :lg="12">
            <el-input v-model="voteOption.content" size="small"/>
          </el-col>
          <el-col :lg="5" :offset="1">
            <el-button
              @click="addVoteOption"
              plain
              size="small"
              :disabled="voteOption.content==''"
            >添加选项</el-button>
          </el-col>
        </el-row>
        <br>
        <el-card shadow="none" v-for="(item,i) in voteOptions" :key="i">
          <span>选项{{i+1}}:&nbsp;&nbsp;{{item.content}}</span>
          <el-button @click="deleteVoteOption(i)" size="mini" style="float:right">删除</el-button>
        </el-card>
        <div class="block">
          <span class="demonstration">可以选择的选项数</span>
          <el-slider v-model="voteInfo.choiceAvailableNumber" :min="1" :max="maxChoiceNumber"></el-slider>
        </div>
        <el-col>
          <el-col :lg="6">
            <span class="demonstration">截止日期&nbsp;&nbsp;</span>
          </el-col>
          <el-col :lg="18">
            <el-date-picker
              v-model="voteInfo.endDate"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd HH:mm:ss"
              size="small"
            ></el-date-picker>
          </el-col>
        </el-col>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="checkVoteInfo">保 存</el-button>
        </span>
      </el-dialog>

      <el-dialog title="上传图片" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <!-- <span>这是一段信息</span> -->
        <el-upload
          action="http://127.0.0.1:8888/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="smallDialogVisible" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt>
        </el-dialog>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <div style="height:100%;">
        <vue-editor v-model="article.content" v-if="screenHeight > 1079" style="height:42rem;"></vue-editor>
        <vue-editor v-model="article.content" v-else style="height:25rem;"></vue-editor>
      </div>
      <div>
        <p>
          <el-button type="primary" class="btn-padding" plain @click="reviewBlog">提交</el-button>
          <el-button type="primary" class plain :disabled="save" @click="SaveDraft">{{content}}</el-button>
        </p>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      article: {
        title: "",
        content: " "
      },
      //卡片样式
      bodyStyle: { padding: "5px 20px" },
      //获取显示器高度
      screenHeight: "",
      //dialog是否显示
      dialogVisible: false,
      voteDialogVisible: false,
      reviewBlogVisble: false,
      //小的dialog和URL
      dialogImageUrl: "",
      smallDialogVisible: false,
      content: "保存至草稿箱",
      //自动提交时间
      // totalTime: 31,
      // canClick: true, //添加canClick
      save: false,
      patchArticle: {
        id: "",
        title: "",
        content: ""
      },
      voteInfo: {
        title: "",
        blogId: "",
        choiceAvailableNumber: 1,
        endDate: ""
      },
      voteOption: { vote: "", content: "" },
      voteOptions: [],
      maxChoiceNumber: 1
    };
  },
  computed: {},
  created: function() {
    let article = this.$route.query.article;
    if (article != null) {
      this.patchArticle.id = article.id;
      this.article.content = article.content;
      this.article.title = article.title;
    }
    // if(this.$route.query.article!=null)
  },
  mounted: function() {
    // alert(window.screen.height)
    this.screenHeight = window.screen.height;
  },
  methods: {
    checkVoteInfo() {
      if (this.voteInfo.title == "") {
        this.$message({ type: "error", message: "请输入投票标题" });
        return;
      }
      if (this.voteOptions.length < 2) {
        this.$message({ type: "error", message: "选项至少要两个" });
        return;
      }
      if (this.voteInfo.endDate == "") {
        this.$message({ type: "error", message: "请选择截止时间" });
        return;
      }
      this.$message({ type: "success", message: "保存成功，请不要刷新页面" });
      this.voteDialogVisible = false;
    },
    deleteVoteOption(i) {
      this.voteOptions.splice(i, 1);
    },
    addVoteOption() {
      if (this.voteOption.content == "") {
        this.$message({ type: "error", message: "请填写投票选项" });
        return;
      }
      this.voteOptions.push(Object.assign({}, this.voteOption));
      this.voteOption.content = "";
      this.maxChoiceNumber = this.voteOptions.length;
    },
    SaveDraft() {
      if (this.article.title != "" && this.article.content != " ") {
        let that = this;
        this.content = "保存中";
        this.save = true;
        this.canClick = false;
        if (this.patchArticle.id == "") {
          this.$axios
            .post("/forward/blog/draft", this.article)
            .then(res => {
              if (res.data.title == that.article.title) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                that.patchArticle.id = res.data.id;
                this.save = false;
                this.content = "保存至草稿箱";
              }
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: "服务器太慢了，等会试试吧"
              });
              this.save = false;
              this.content = "保存至草稿箱";
            });
        } else {
          this.patchArticle.title = this.article.title;
          this.patchArticle.content = this.article.content;
          this.$axios
            .patch("/forward/blog/draft/" + this.patchArticle.id, this.article)
            .then(res => {
              if (res.data.title == that.article.title) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                this.save = false;
                this.content = "保存至草稿箱";
              }
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: "服务器太慢了，等会试试吧"
              });
              this.save = false;
              this.content = "保存至草稿箱";
            });
        }
      } else {
        this.$message({
          type: "error",
          message: "请输入标题或者内容"
        });
      }
    },
    reviewBlog() {
      if (this.article.title == null) {
        this.$message({ type: "error", message: "请输入标题" });
        return;
      }
      this.reviewBlogVisble = true;
    },
    submit() {
      let that = this;
      if (this.patchArticle.id == "") {
        this.$axios
          .post("/forward/blog/blog", this.article)
          .then(res => {
            this.$message({
              type: "success",
              message: "文章提交成功，请等待提交投票信息"
            });
            console.log(res.data);
            if (this.voteInfo.title != "") {
              this.voteInfo.blogId = res.data.id;
              this.$axios
                .post("/forward/vote/vote", this.voteInfo)
                .then(res => {
                  // this.$message({
                  //   type: "success",
                  //   message: "投票提交成功"
                  // });
                  console.log(res.data);
                  for (let i in this.voteOptions) {
                    console.log("now pushing" + this.voteOptions[i]);
                    //设置选项所属id
                    this.voteOptions[i].vote = "/vote/" + res.data.id;
                    this.$axios
                      .post("/forward/vote/voteOption", this.voteOptions[i])
                      .then(res => {
                        console.log(res);
                      });
                  }
                });
            }
            // window.location.reload();
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: "服务器太慢了，等会试试吧"
            });
          });
      } else {
        this.$axios
          .patch("/forward/blog/blog/" + this.patchArticle.id, this.article)
          .then(res => {
            this.$message({
              type: "success",
              message: "修改提交成功，请等待"
            });
            console.log(res.data);
            if (this.voteInfo.title != "") {
              this.voteInfo.blogId = this.patchArticle.id;
              this.$axios
                .post("/forward/vote/vote", this.voteInfo)
                .then(res => {
                  // this.$message({
                  //   type: "success",
                  //   message: "投票提交成功"
                  // });
                  console.log(res.data);
                  for (let i in this.voteOptions) {
                    console.log("now pushing" + this.voteOptions[i]);
                    //设置选项所属id
                    this.voteOptions[i].vote = "/vote/" + res.data.id;
                    this.$axios
                      .post("/forward/vote/voteOption", this.voteOptions[i])
                      .then(res => {
                        console.log(res);
                      });
                  }
                });
            }
            // window.location.reload();
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: "服务器太慢了，等会试试吧"
            });
          });
      }
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.smallDialogVisible = true;
    },
    //意外关闭提示
    handleClose(done) {
      this.$confirm("投票信息将会丢失，确认关闭？")
        .then(_ => {
          this.voteDialogVisible = false;
          this.voteInfo.title = "";
          this.voteOption.content = "";
          this.voteOptions = [];
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>
<style scoped>
.btn-padding {
  margin-left: 36%;
}
.blod {
  font-weight: 700;
}
</style>
