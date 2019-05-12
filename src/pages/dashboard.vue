<template>
  <div class="page-wp">
    <topnav></topnav>
    <el-breadcrumb class='' separator="/">
      <el-breadcrumb-item>dashbaord</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <el-row>
      <el-col :span="8" v-for="(o,index)"></el-col>
    </el-row> -->
    <step></step>
  </div>
</template>

<script>
import topnav from '../components/common/topnav';
import step from '../components/workflow/step';

export default {
  name: 'dashboard',
  components: {
    topnav,
    step,
  },
  data() {
    return {

    };
  },
  methods: {
    
  },
};
</script>

<style>

</style>
