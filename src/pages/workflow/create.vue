<template>
  <div class="createpage">
    <topnav></topnav>
    <div class="width-wp">
      <el-row class="breadcrumb">
        <el-col :span="18" :offset="3">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>Curation</el-breadcrumb-item>
            <el-breadcrumb-item>Create</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
      <el-row class="curation-step">
        <el-col :span="18" :offset="3">
          <step :active="0"></step>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="3">
          <div class="createpage__input-cluster">
            <el-form label-position="top">
              <el-form-item label="Project Name">
                <el-input v-model="x_title"></el-input>
              </el-form-item>
              <el-form-item label="Author Type">
                <el-radio-group v-model="x_authorType">
                  <el-radio label="solo" >Solo</el-radio>
                  <el-radio label="team" >Team</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Author(s)">
                <el-select
                  v-model="x_authors"
                  multiple
                  :multiple-limit="x_authorType == 'team' ? 20 : 1"
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
      <el-row>
        <el-col :span="20" :offset="1">
          <submit-btn-group @save="saveHandler" @next-stage="saveAndNextHandler"></submit-btn-group>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import topnav from 'src/components/common/topnav';
import step from 'src/components/workflow/step';
import submitBtnGroup from 'src/components/workflow/submitBtnGroup';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'createPage',
  components: {
    topnav,
    submitBtnGroup,
    step,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState('workflow', [
      'currentProject',
    ]),
    x_title: {
      get() {
        return this.currentProject.title;
      },
      set(value) {
        this.setTitle(value);
      },
    },
    x_authors: {
      get() {
        return this.currentProject.authors;
      },
      set(value) {
        this.setAuthors(value);
      },
    },
    x_authorType: {
      get() {
        return this.currentProject.authorType;
      },
      set(value) {
        this.setAuthorType(value);
      },
    },
  },
  methods: {
    ...mapMutations('workflow', [
      'setProjectId',
      'setTitle',
      'setAuthors',
      'setAuthorType',
    ]),
    ...mapActions('workflow', [
      'saveCreateStage',
      'saveAndNextStage',
    ]),
    saveHandler() {
      console.log('saving create');
      this.saveCreateStage()
        .then(() => {
          // loading
          console.log('create is saved');
        })
        .catch(() => {
          alert('saving failed');
        });
    },
    saveAndNextHandler() {
      this.saveAndNextStage('create')
        .then(() => {
          console.log('move to next stage');
          this.$router.push({
            path: '/material_collection',
          });
        })
        .catch(() => {
          alert('saving and stage updating failed');
        });
    },
  },
  watch: {
    x_authorType() {
      this.setAuthors([]);
    },
  },
  mounted() {
    const projectId = this.$store.state.workflow.currentProjectId;
    // continous to work
    if (projectId) {
      this.$store.dispatch('workflow/loadCreateStage')
        .catch(() => {
          alert('load project failed');
        });
    }
  },
};
</script>

<style src="@/width-wp.css"></style>

