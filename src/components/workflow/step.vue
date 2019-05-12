<template>
  <el-steps :active='active'>
    <el-step title="Create"></el-step>
    <el-step title="Material Collection"></el-step>
    <el-step title="Constructing"></el-step>
    <el-step title="Review"></el-step>
    <el-step title="Finish"></el-step>
  </el-steps>
</template>

<script>
export default {
  name: 'step',
  props: {
    active: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  methods: {
    // need to create click event for each step inorder to return to previous page
  },
};
</script>

<style></style>
