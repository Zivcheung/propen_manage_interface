<template>
  <div class="window-page-wp">
    <topnav></topnav>
    <el-row>
      <el-col :span="18" :offset="3">
        <step
          :active="4"></step>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6" :offset="5">
        <el-form :model="finishInfo">
          <el-form-item label="Exhibition Schedule">
            <el-date-picker
            v-model="finishInfo.schedule"
            value-format="yyyy-M-d"
            type="daterange"
            range-separator="To"
            start-placeholde="Start Date"
            end-placeholde="End Date">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Active Archive Duration">
            <el-input
              v-model="finishInfo.archiveDuration[0]"></el-input>
            M
            <el-input
              v-model="finishInfo.archiveDuration[1]"></el-input>
            Y
          </el-form-item>
          <el-form-item label="Copyright">
            <el-input></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6" :offset="2">
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10" :offset="11">
        <button-group
          @next-stage="nextStageHandler"
          @save="saveHandler"
          :last-step="true"></button-group>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import topnav from 'src/components/common/topnav';
import step from 'src/components/workflow/step';
import buttonGroup from 'src/components/workflow/submitBtnGroup';

export default {
  name: 'wk-finish-page',
  components: {
    topnav,
    step,
    buttonGroup,
  },
  data() {
    return {
      finishInfo: {
        schedule: [],
        archiveDuration: [],
        copyright: '',
      },
    };
  },
  methods: {
    asyncStorage() {
      const sendData = {
        projectId: this.$store.state.workflow.currentProjectId,
        schedule: this.finishInfo.schedule,
        archiveDuration: `${this.finishInfo.archiveDuration[0]}M${this.finishInfo.archiveDuration[1]}Y`,
        copyright: '',
      };
      return this.$$axios.post('/workflow/finishStage', {
        ...sendData,
      });
    },
    saveHandler() {
      this.asyncStorage()
        .then(() => {
        })
        .catch((err) => {
          console.log(err);
          alert('finish transform failed');
        });
    },
    nextStageHandler() {
      this.asyncStorage()
        .then(() => {
          const promise = this.$$axios.post('/publishExhibition', {
            projectId: this.$store.state.workflow.currentProjectId,
          });
          return promise;
        })
        .then(() => {
          this.$router.push({
            path: '/',
          });
        })
        .catch((err) => {
          console.log(err);
          alert('finish transform failed')
        });
    },
  },
};
</script>

<style>

</style>
