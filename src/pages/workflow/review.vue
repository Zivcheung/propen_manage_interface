<template>
  <div class="window-page-wp">
    <topnav></topnav>
    <div class="width-wp">
      <el-row class="breadcrumb">
        <el-col :span="18" :offset="3">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>Curation</el-breadcrumb-item>
            <el-breadcrumb-item>Constructing</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
      <el-row class="curation-step">
        <el-col :span="18" :offset="3">
          <step
            :active="3"></step>
        </el-col>
      </el-row>
      <el-row class="review-placeholder">
        <el-col :span="18" :offset="3">
          <div class="review-placeholder__image"></div>
        </el-col>
      </el-row>
      <el-row class="curation-submitbtns">
        <el-col :span="10" :offset="11">
          <button-group
            @next-stage="nextStageHandler"></button-group>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import topnav from 'src/components/common/topnav';
import step from 'src/components/workflow/step';
import buttonGroup from 'src/components/workflow/submitBtnGroup';

export default {
  name: 'wk-review-page',
  components: {
    topnav,
    step,
    buttonGroup,
  },
  methods: {
    nextStageHandler() {
      this.$store.dispatch('workflow/updateStageToNext')
        .then(() => {
          this.$router.push({
            path: 'finish',
          });
        })
        .catch((err) => {
          console.log(err);
          alert('next stage moving failed')
        });
    },
  },
};
</script>

<style src="@/review-page.css"></style>
<style src="@/width-wp.css"></style>
