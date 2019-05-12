<template>
  <div class="wkSubmitBtnGrout">
    <el-button @click="$emit('confirm')" type="primary">Confirm</el-button>
    <el-button @click="cancelClickHandler" type="danger">Cancel</el-button>
  </div>
</template>

<script>
export default {
  name: 'wkSubmitBtnGroup',
  methods: {
    cancelClickHandler() {
      // todo: create dialog to re assuare.
      this.$router.push({ path: '/' });
    },
  },
};
</script>

<style>

</style>
