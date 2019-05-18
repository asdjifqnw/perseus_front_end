<template>
  <div style="height:37rem;">
    <el-card class="box-card" :body-style="bodyStyle" shadow="none">
      <p>
        <span style="font-size:1.5rem; padding-left: 10px; display:inline-block;">草稿箱</span>
      </p>
      <el-table :data="drafts" style="width:100%" v-loading="loading">
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
            <el-button @click="modifyDraft(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="deleteDraft(scope.row)" type="text" size="small">删除</el-button>
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
      drafts: [],
      loading:false
    };
  },
  created() {
    let that = this;
    this.loading = true
    this.$axios
      .get("/forward/blog/draft/search/findByPublisherId", {
        params: { publisherId: this.$store.state.userInfo.id }
      })
      .then(res => {
        that.drafts = res.data._embedded.drafts;
        this.loading = false
      })
      .catch(err => {
        this.$message({type:"error",message:"获取信息失败!"})
        this.loading = false
      });
  },
  methods: {
    deleteDraft(row) {
      let that = this;
      this.$axios
        .delete("/forward/blog/draft/" + row.id)
        .then(res => {
          // console.log(res);
          this.$message({
            type: "success",
            message: "删除成功"
          });
          window.location.reload()
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
    modifyDraft(row) {
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
