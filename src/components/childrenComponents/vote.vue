<template>
  
</template>
<script>
export default {
  props: {
    voteInfo: {},
    voteOptionInfo: "",
    myOption: ""
  },
  data() {
    return {
      // checkedOption: this.$props.myOption,
      // chartData: {
      //   columns: ["content", "detail"],
      //   rows: this.$props.voteOptionInfo
      // }
    };
  },
  computed: {
  },
  methods: {
  //   submitVoteOption() {
  //     if (this.checkedOption.length == 0) {
  //       this.$message({ type: "error", message: "至少选择一项" });
  //       return;
  //     }
  //     if (this.checkedOption.length > this.voteInfo.choiceAvailableNumber) {
  //       this.$message({ type: "error", message: "选多了也不行哦" });
  //       return;
  //     }
  //     for (let i in this.checkedOption) {
  //       this.$axios
  //         .post("/forward/vote/voteDetail", {
  //           voteOption: "/voteOption/" + this.checkedOption[i]
  //         })
  //         .then(res => {
  //           this.$props.myOption.push(this.checkedOption[i]);
  //           console.log(res.data);
  //         })
  //         .catch(err => {
  //           this.$message({ type: "error", message: "已投票或网络错误" });
  //         });
  //     }
  //   }
  }
};
</script>

<style>
.voteTitle {
  font-weight: 700;
  font-size: 1.3rem;
}
</style>
