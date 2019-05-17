<template>
  <div class="window-page-wp constructing-page">
    <topnav></topnav>
    <!-- main section -->
    <el-row>
      <el-col :span="18" :offset="3">
        <step :active="2"></step>
      </el-col>
      <el-col :span="18" :offset="3">
        <construct-area :tabNames="['Abstract','Content']">
          <template v-slot:tab-1>
            <el-row>
              <el-col class="construct-area__intro" :offset="1" :span="8">
                <div>
                  <el-upload
                    class="constructing-page__intro-upload"
                    :action="`http://localhost:3000/REST/manageSite/workflow/coverImage`"
                    :data="projectInfo"
                    :file-list="coverImageFileList"
                    :on-success="coverImageSuccessHandler"
                    :on-remove="coverImageRemoveHandler"
                    :before-upload="coverImageValidateHandler"
                    :on-exceed="() => uploadExceed(1)"
                    :limit="1"
                    drag
                    multiple>
                    <i class="fas fa-image"></i>
                    <i class="fab fa-youtube"></i>
                    <div>upload your cover image here</div>
                    <div slot='tip'>
                      jpg/png files with a size less than 2mb
                    </div>
                  </el-upload>
                </div>
                <div>Voice Over</div>
                <div>
                  <audio-uploader
                    :data = "projectInfo"
                    :on-success="voiceoverUploadSuccessHandler"
                    :on-remove="voiceoverUploadRemove"
                    :file-list="introVoiceover">
                  </audio-uploader>
                </div>
              </el-col>
              <el-col class="construct-area__intro" :offset="2" :span="12">
                <div>Abstract</div>
                <el-input
                  type="textarea"
                  placeholder="write abstract here"
                  maxlength="2000"
                  show-word-limit
                  v-model="abstract"
                  resize="none"
                  :autosize="{ minRows:25, maxRows: 25}"
                  :height="1000"
                  >
                </el-input>
              </el-col>
            </el-row>
          </template>
          <template v-slot:tab-2>
            <content-tab-section>
            </content-tab-section>
          </template>
        </construct-area>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6" :offset="15">
        <submit-btn-group
          @next-stage="nextStageHandler"
          @save="saveHandler"
          >
        </submit-btn-group>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import step from 'src/components/workflow/step';
import topnav from 'src/components/common/topnav';
import constructArea from 'src/components/workflow/constructArea';
import imageInput from 'src/components/workflow/imageInput';
import contentTabSection from 'src/components/workflow/contentTabSection';
import submitBtnGroup from 'src/components/workflow/submitBtnGroup';
import { mapState, mapActions, mapMutations } from 'vuex';
import audioUploader from 'src/components/workflow/audioUploader';

export default {
  name: 'wk-construction',
  components: {
    step,
    topnav,
    constructArea,
    imageInput,
    contentTabSection,
    submitBtnGroup,
    audioUploader,
  },
  computed: {
    ...mapState('workflow', [
      'currentProject',
    ]),
    abstract: {
      get() {
        return this.currentProject.introduction;
      },
      set(content) {
        this.$store.commit('workflow/setIntroduction', content);
      },
    },
    introVoiceover() {
      const url = this.currentProject.introVoiceover;
      if (!url) return [];
      return [{ url }];
    },
    projectInfo() {
      return {
        project: this.currentProject.title,
        sectionName: '__introduction__',
      };
    },
    coverImageFileList() {
      const cover = this.currentProject.coverImage;
      return cover ? [{ url: cover }] : [];
    },
  },
  methods: {
    ...mapMutations('workflow', [
      'setIntroVoiceover',
      'setCoverImage',
    ]),
    ...mapActions('workflow', [
      'saveConstructingStage',
      'loadConstructingStage',
      'saveAndNextStage',
      'deleteAddedFile',
    ]),
    nextStageHandler() {
      this.saveAndNextStage('constructing')
        .then(() => {
          console.log('move to next stage');
          this.$router.push({
            path: '/review',
          });
        })
        .catch(() => {
          alert('saving and stage updating failed');
        });
    },
    saveHandler() {
      this.saveConstructingStage()
        .catch((err) => {
          alert(err);
        });
      console.log('saved');
    },
    voiceoverUploadSuccessHandler(res) {
      this.setIntroVoiceover(res.url);
    },
    voiceoverUploadRemove(file) {
      // cavet: the before upload validation will call remove on defult
      if (file.status !== 'success') return;
      this.deleteAddedFile({
        type: 'IntroVoiceOver',
      });
    },
    uploadExceed(num) {
      alert(`the maximum upload number is ${num}, please first delete previous files`);
    },
    coverImageSuccessHandler(res) {
      this.setCoverImage(res.url);
    },
    coverImageRemoveHandler(file) {
      // cavet: the before upload validation will call remove on defult
      if (file.status !== 'success') return;
      this.deleteAddedFile({
        type: 'CoverImage',
      });
    },
    coverImageValidateHandler(file) {
      const maxSize = 30 * 1024 * 1024; // 100mb
      if (file.type !== 'image/png' &&
          file.type !== 'image/jpg' &&
          file.type !== 'image/jpeg') {
        alert('only accept png, jpg and jpeg image format');
        return false;
      }
      if (file.size > maxSize) {
        alert('max 20mb size limt exceed');
        return false;
      }
      return true;
    },
  },
  created() {
    this.loadConstructingStage()
      .catch((err) => {
        console.log(err);
        alert('load constructing content failed');
      });
  },

};
</script>

<style src="@/construct-area.css"></style>
<style src="@/constructing-page.css"></style>

