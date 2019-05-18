<template>
  <div style="height:37rem;">
    <el-card class="box-card" :body-style="bodyStyle" shadow="none">
      <p>
        <span style="font-size:1.5rem; padding-left: 10px; display:inline-block;">我的收藏</span>
      </p>
      <el-card
        class="box-card"
        shadow="none"
        v-for="(item,i) in collections"
        :key="item.id"
        v-loading="loading"
      >
        <span class="message">博客Id：{{item.blogId}}</span>
        <span
          class="message pointer"
          style="float:right; color:darkblue;"
          @click="deleteCollection(item.id)"
        >删除</span>
        <span
          class="message pointer"
          style="float:right; color:darkblue;"
          @click="checkBlog(item)"
        >查看博客&nbsp;&nbsp;</span>
      </el-card>
    </el-card>
    <el-dialog
      :visible="bolgVisible"
      :fullscreen="true"
      :show-close="false"
      v-loading="blogLoading"
      :append-to-body="true"
    >
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
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      bodyStyle: { padding: "5px 20px" },
      collections: [{ id: 1 }],
      loading: false,
      bolgVisible: false,
      dialogBlog: {
        title: "文章偏题",
        content: "文章内容",
        createDate: "2019-12-12 00:00:00",
        modifyDate: "2019-12-12 00:00:00"
      },
      blogLoading: false
    };
  },
  created() {
    this.loading = true;
    this.$axios
      .get("/forward/additionalData/userLikeHistory/search/findByCreatorId", {
        params: { creatorId: this.$store.state.userInfo.id }
      })
      .then(res => {
        console.log(res);
        this.collections = res.data._embedded.userLikeHistories;
        // console.log(res.data._embedded.comments);
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
        // window.location.reload();
      });
  },
  methods: {
    deleteCollection(id) {
      this.$axios
        .delete("/forward/additionalData/userLikeHistory/" + id)
        .then(res => {
          this.$message({ type: "success", message: "删除成功！" });
          window.location.reload()
        })
        .catch(err => {
          this.$message({ type: "error", message: "网路错误，请重试" });
        });
    },
    checkBlog(comment) {
      this.bolgVisible = true;
      this.blogLoading = true;
      this.$axios.get("/forward/blog/blog/" + comment.blogId).then(res => {
        console.log(res);
        this.dialogBlog = res.data;
        this.blogLoading = false;
      });
    }
  }
};
</script>

<style>
</style>
