<template>
  <div class="window-page-wp">
    <topnav></topnav>
    <el-row>
      <el-col :span="18" :offset="3">
        <step
          :active="3"></step>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10" :offset="11">
        <button-group
          @next-stage="nextStageHandler"></button-group>
      </el-col>
    </el-row>
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

<style>

</style>
