<template>
  <div>
    <el-card class="box-card" :body-style="bodyStyle" shadow="none">
      <p>
        <span style="font-size:1.5rem; padding-left: 10px; display:inline-block;">我发布的文章</span>
      </p>
      <el-table :data="blogs" style="width:100%" v-loading = "loading">
        <el-table-column align="center" prop="id" label="Id" width="50"></el-table-column>
        <el-table-column align="center" prop="title" label="标题" width="360"></el-table-column>
        <el-table-column
          align="center"
          prop="createDate"
          label="创建时间"
          width="180"
          :formatter="dateFormatter1"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="modifyDate"
          label="最后修改时间"
          width="180"
          :formatter="dateFormatter2"
        ></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="modifyArticle(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="deleteArticle(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      bodyStyle: { padding: "5px 20px" },
      blogs: [],
      loading:false
    };
  },
  created() {
    let that = this;
    this.loading = true
    this.$axios
      .get("/forward/blog/blog/search/findByPublisherId", {
        params: { publisherId: this.$store.state.userInfo.id }
      })
      .then(res => {
        // console.log(res.data);
        that.blogs = res.data._embedded.blogs;
        this.loading = false 
      })
      .catch(err => {
        this.$message({
          type:"error",
          message:"获取信息失败，请重试"
        })
        this.loading = false 
      });
  },
  methods: {
    deleteArticle(row) {
      let that = this;
      this.$axios
        .delete("/forward/blog/blog/" + row.id)
        .then(res => {
          // console.log(res);
          this.$message({
            type: "success",
            message: "删除成功"
          });
          window.location.reload();
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "请重试"
          });
        });
    },
    dateFormatter1(row, column) {
      console.log(row);
      return row.createDate.replace("T", " ");
    },
    dateFormatter2(row, column) {
      return row.modifyDate.replace("T", " ");
    },
    modifyArticle(row) {
      this.$router.push({
        name: "newArticle",
        query: {
          article: row
        }
      });
    }
  }
};
</script>

<style>
</style>
