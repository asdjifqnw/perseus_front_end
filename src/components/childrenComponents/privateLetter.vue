<template>
  <div style="height:37rem;">
    <el-card class="box-card" :body-style="bodyStyle" shadow="none">
      <p>
        <span style="font-size:1.5rem; padding:0px 10px; display:inline-block;">最近联系</span>
        <el-button size="medium" type="primary" plain @click="checkReceive">查看收到的</el-button>
        <el-button size="medium" type="primary" plain @click="checkSend">查看发出的</el-button>
        <span>
          <el-button
            size="medium"
            type="primary"
            plain
            style="float:right;"
            @click="dialogVisible = !dialogVisible"
          >新建私信</el-button>
        </span>
      </p>
      <br>
      <el-card
        class="box-card"
        shadow="none"
        v-for="(item,i) in messages"
        :key="item.id"
        v-loading="loading"
      >
        <span class="message" v-if="item.senderId != id">发送者Id：{{item.senderId}}</span>
        <span class="message" v-if="item.receiverId != id">接受者Id：{{item.receiverId}}</span>
        <span class="message">内容：{{item.content}}</span>
        <span class="message">是否已读：{{item.haveRead}}</span>
        <span
          class="message pointer"
          style="float:right; color:darkblue;"
          @click="deleteMessage(item.id)"
        >删除</span>
      </el-card>
    </el-card>
    <el-dialog title="新建私信" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="message" label-width="80px">
        <el-form-item label="收件人id">
          <el-input v-model="message.receiverId"></el-input>
        </el-form-item>
        <el-form-item label="消息内容">
          <el-input v-model="message.content" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">发 送</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      id: this.$store.state.userInfo.id,
      bodyStyle: { padding: "5px 20px" },
      dialogVisible: false,
      message: { receiverId: "", content: "" },
      messages: [
        { senderId: 1, receiverId: 1, content: "发送的消息", haveRead: false }
      ],
      sendMessages: [],
      receiverMessages: [],
      loading: false
    };
  },
  created() {
    console.log(this.$route.query.id);
    if (this.$route.query.id != null) {
      this.message.receiverId = this.$route.query.id;
      this.$forceUpdate();
      this.dialogVisible = true;
    } else {
      this.loading = true;
      this.$axios
        .get("/forward/privateMessage/privateMessage/search/findBySenderId", {
          params: { senderId: this.$store.state.userInfo.id }
        })
        .then(res => {
          this.messages = res.data._embedded.privateMessages;
          this.allMessages = res.data._embedded.privateMessages;
          this.loading = false;
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "获取信息失败，请重试"
          });
          this.loading = false;
        });
    }
  },
  methods: {
    checkSend() {
      this.$axios
        .get("/forward/privateMessage/privateMessage/search/findBySenderId", {
          params: { senderId: this.$store.state.userInfo.id }
        })
        .then(res => {
          this.$message({ type: "success", message: "查询成功" });
          this.messages = res.data._embedded.privateMessages;
        })
        .catch(err => {
          this.$message({ type: "error", message: "查询失败" });
        });
      this.$forceUpdate();
    },
    checkReceive() {
      this.$axios
        .get("/forward/privateMessage/privateMessage/search/findByReceiverId", {
          params: { receiverId: this.$store.state.userInfo.id }
        })
        .then(res => {
          this.$message({ type: "success", message: "查询成功" });
          this.messages = res.data._embedded.privateMessages;
        })
        .catch(err => {
          this.$message({ type: "error", message: "查询失败" });
        });
      this.$forceUpdate();
    },
    deleteMessage(id) {
      this.$axios
        .delete("/forward/privateMessage/privateMessage/" + id)
        .then(res => {
          this.$message({ type: "success", message: "删除成功" });
          window.location.reload();
        })
        .catch(err => {
          this.$message({ type: "error", message: "请重试" });
        });
    },
    submit() {
      this.$axios
        .post("/forward/privateMessage/privateMessage", this.message)
        .then(res => {
          console.log(res);
          this.$message({ type: "success", message: "发送成功" });
          this.dialogVisible = false;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
.message {
  display: inline-block;
  padding: 1rem;
}
</style>
