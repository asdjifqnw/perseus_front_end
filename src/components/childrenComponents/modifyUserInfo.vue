<template>
  <el-card class="box-card" style="height:35rem;">
    <el-row>
      <el-col :lg="19">
        <el-form
          style="padding-top:4rem;"
          :model="userProfile"
          :rules="rules"
          ref="userProfile"
          label-width="150px"
          class="demo-ruleForm"
        >
          <el-form-item label-width="40%">
            <span v-if="first==true" style="color:red;font-size:2rem;">请设置用户信息后继续</span>
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="userProfile.nickName"></el-input>
          </el-form-item>
          <el-form-item label="个性签名" prop="description">
            <el-input v-model="userProfile.description" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label-width="50%">
            <el-button type="primary" @click="onSubmit('userProfile')">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  data: () => ({
    first: null,
    userProfile: {
      nickName: "",
      description: ""
    },
    rules: {
      nickName: [
        { required: true, message: "请输入昵称", trigger: "blur" },
        { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
      ],
      description: [
        { required: true, message: "请输入个性签名", trigger: "blur" },
        { max: 200, message: "长度在 200 个字符以内", trigger: "blur" }
      ]
    }
  }),
  created() {
    this.first = this.$route.query.first;
  },
  methods: {
    onSubmit(userProfile) {
      this.$refs[userProfile].validate(valid => {
        if (valid) {
          this.$axios
            .post("/forward/userProfile/userProfile", this.userProfile)
            .then(res => {
              if (res.data.description == this.userProfile.description) {
                this.$message({
                  type: "success",
                  message: "提交成功"
                });
                this.$router.push("/");
              } else {
                this.$message({
                  type: "error",
                  message: "请稍后重试"
                });
              }
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: "请稍后重试"
              });
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style>
.box-card {
  width: 95%;
}
</style>
