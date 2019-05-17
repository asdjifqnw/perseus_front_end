<template>
  <div style="height:37rem;">
    <el-card class="box-card" :body-style="bodyStyle" shadow="none">
      <p>
        <span style="font-size:1.5rem; padding-left: 10px; display:inline-block;">我的关注列表</span>
      </p>
      <el-table :data="attentions" style="width:100%" v-loading="loading">
        <el-table-column align="center" prop="followedId" label="用户ID" width="360"></el-table-column>
        <el-table-column
          align="center"
          prop="createDate"
          label="关注时间"
          width="180"
          :formatter="dateFormatter1"
        ></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="noAttention(scope.row)" type="text" size="small">取消关注</el-button>
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
      attentions: [],
      loading: false
    };
  },
  created() {
    let that = this;
    this.loading = true;
    this.$axios
      .get("/forward/userAttention/userAttention/search/findByFollowerId", {
        params: { followerId: this.$store.state.userInfo.id }
      })
      .then(res => {
        console.log(res.data);
        that.attentions = res.data._embedded.userAttentions;
        this.loading = false;
      })
      .catch(err => {
        this.$message({
          type: "error",
          message: "获取信息失败，请重试"
        });
        this.loading = false;
      });
  },
  methods: {
    noAttention(row) {
      let that = this;
      this.$axios
        .delete("/forward/userAttention/userAttention/" + row.id)
        .then(res => {
          // console.log(res);
          this.$message({
            type: "success",
            message: "取消关注成功"
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
      return row.createDate.replace("T", " ");
    },
    dateFormatter2(row, column) {
      return row.modifyDate.replace("T", " ");
    }
  }
};
</script>

<style>
</style>
