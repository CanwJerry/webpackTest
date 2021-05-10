<template>
  <div>
    <h2 class="cl">{{ message }}</h2>
    <button @click="btnclick">按钮</button>
  </div>
</template>

<script>
export default {
  name: "Capp",
  data() {
    return {
      message: "helloVue",
    };
  },
  methods: {
    btnclick() {
      console.log("这是啥");
    },
  },
};
</script>
<style lang='less' scoped>
  .cl{
    color: magenta;
  }
</style>
