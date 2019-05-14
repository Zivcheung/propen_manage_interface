<template>
  <div class="submit-btn-group">
    <el-button @click="$emit('save')" type="primary">Save</el-button>
    <el-button @click="$emit('nextStage')" type="primary">Next Stage</el-button>
    <el-button @click="cancelClickHandler" type="danger">Abort</el-button>
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

<style src="@/submit-btn-group.css"></style>
