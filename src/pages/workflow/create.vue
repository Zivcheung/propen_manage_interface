<template>
  <div class="createpage">
    <topnav></topnav>
    <el-row>
      <el-col>
        <step :active="0"></step>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div class="createpage__input-cluster">
          <el-form :model = "projectForm" label-position="top">
            <el-form-item label="Project Name">
              <el-input v-model="projectForm.title"></el-input>
            </el-form-item>
            <el-form-item label="Author Type">
              <el-radio-group v-model="projectForm.authorType">
                <el-radio label="solo">Solo</el-radio>
                <el-radio label="team">Team</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Author(s)">
              <el-select v-model="projectForm.authors"
                :multiple="projectForm.authorType === 'team'"
                filterable
                allow-create
                default-first-option
                placeholder="Add designer or team members">
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <submit-btn-group @confirm="submitAll"></submit-btn-group>
  </div>
</template>

<script>
import topnav from 'src/components/common/topnav';
import step from 'src/components/workflow/step';
import submitBtnGroup from 'src/components/workflow/submitBtnGroup';
import { mapMutations } from 'vuex';

export default {
  name: 'createPage',
  components: {
    topnav,
    submitBtnGroup,
    step,
  },
  data() {
    return {
      projectForm: {
        title: '',
        authors: [],
        authorType: 'solo',
      },
    };
  },
  methods: {
    ...mapMutations('workflow', [
      'setProjectId',
    ]),
    submitAll() {
      const sendData = {
        ...this.projectForm,
      };
      this.$$axios.post('workflow/projectAndCreate', sendData)
        .then((res) => {
          this.setProjectId('setProjectId', res.data.projectId);
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
};
</script>

<style>

</style>
