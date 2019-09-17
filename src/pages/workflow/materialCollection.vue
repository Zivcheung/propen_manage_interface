<template>
  <div class="window-page-wp">
    <topnav></topnav>
    <div class="width-wp">
      <el-row class="breadcrumb">
        <el-col :span="18" :offset="3">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>Curation</el-breadcrumb-item>
            <el-breadcrumb-item>Material Collection</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
      <el-row class="curation-step">
        <el-col :span="18" :offset="3">
          <step :active="1"></step>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" :offset="3">
          <div>Prebuild List</div>
        </el-col>
        <el-col :span="3" class="curation-section">
          <el-select v-model="selectedTemplateOpt"
            :disabled="templateDisabled"
            size="mini">
            <el-option
              v-for="option in templateOptions"
              :key="option"
              :label="option"
              :value="option">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2" :offset="2">
          <el-button size="mini" type="primary"
            @click="loadTemplateHandler"
            :disabled="templateDisabled">Load Template</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="3">
          <div>Material Collection List</div>
          <el-table
            :data="worksheet"
            class="fit-parent-wp"
            >
            <el-table-column prop="name" label="Name" min-width="100" fixed>
            </el-table-column>
            <el-table-column prop="description" label="Description" min-width="400">
            </el-table-column>
            <el-table-column prop="state" label="State" min-width="200">
              <template v-slot:default="scope">
                <el-tag size="mini"
                  @click="click(scope)"
                  :type="getStateTagTheme(scope.row.state)">
                  {{scope.row.state}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Operations" min-width="100" fixed="right">
              <template v-slot:default="scope">
                <el-button type="text"
                  @click="pushCollectingState(scope.$index)"
                  :disabled="scope.row.state === 'completed'">Push</el-button>
                <el-button type="text">Edit</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <el-row class="curation-submitbtns">
        <el-col :span="10" :offset="11">
          <button-group @save="savePageHandler"
            @next-stage="nextStageHandler"
            :disable-next-stage="disableNextStage"
            ></button-group>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import topnav from 'src/components/common/topnav';
import step from 'src/components/workflow/step';
import buttonGroup from 'src/components/workflow/submitBtnGroup';

export default {
  name: 'wkMaterialCollection',
  components: {
    topnav,
    step,
    buttonGroup,
  },
  mixins: [

  ],
  data() {
    return {
      worksheet: [],
      templateOptions: [],
      selectedTemplateOpt: '',
      templateDisabled: false,
    };
  },
  computed: {
    disableNextStage() {
      return !this.completeValidation();
    },
  },
  methods: {
    disableTemplateSelection() {
      this.templateDisabled = true;
    },
    loadTemplateFromServer() {
      this.$$axios.get('workflow/templateOptions')
        .then((res) => {
          this.templateOptions = res.data.optionList;
        })
        .catch(() => {
          alert('template option load error');
        });
    },
    loadTemplateHandler() {
      const templateName = encodeURIComponent(this.selectedTemplateOpt);
      this.$$axios.get('workflow/materialTemplate', {
        params: {
          templateName,
        },
      })
        .then((res) => {
          // loader required
          this.worksheet = res.data.template;
          console.log('template loaded');
        })
        .catch(() => {
          alert('template loading error')
        });
    },
    pushCollectingState(index) {
      const stateList = [
        'unsubmitted',
        'submitted',
        'completed',
      ];
      const currentStateIndex = stateList.indexOf(this.worksheet[index].state);
      this.worksheet[index].state = stateList[currentStateIndex + 1];
    },
    getStateTagTheme(state) {
      let type = '';
      switch (state) {
        case 'completed':
          type = 'success';
          break;
        case 'submitted':
          type = 'warning';
          break;
        case 'unsubmitted':
          type = 'danger';
          break;
        default:
          console.error('unexpexted submit state appears in worksheet');
      }
      return type;
    },
    completeValidation() {
      const progressList = this.worksheet.map(row => row.state);
      // edge case: empty collection list, not even started yet
      if (progressList.length === 0) return false;

      const unfinished = progressList.some(state => state !== 'completed');
      return !unfinished;
    },
    savePageHandler() {
      this.$$axios.post('/workflow/saveCollectionList', {
        projectId: this.$store.state.workflow.currentProjectId,
        collectionList: this.worksheet,
      })
        .then(() => {
          // saved notification
        })
        .catch(() => {
          alert('save failed');
        });
    },
    nextStageHandler() {
      this.$$axios.post('/workflow/saveCollectionList', {
        projectId: this.$store.state.workflow.currentProjectId,
        collectionList: this.worksheet,
      })
        .then(() => {
          console.log('next stage');
          return this.$store.dispatch('workflow/updateStageToNext');
        })
        .then(() => {
          this.$router.push({
            path: 'constructing',
          });
        })
        .catch(() => {
          alert('save and next stage failed');
        });
    },
  },
  created() {
    this.$store.dispatch('workflow/loadMaCollectionStage')
      .then((res) => {
        if (!res) {
          this.loadTemplateFromServer();
          return;
        }
        this.disableTemplateSelection();
        this.worksheet = res;
      })
      .catch(() => {
        alert('previous collection list load failed');
      });
  },
};
</script>

<style src="@/width-wp.css"></style>
