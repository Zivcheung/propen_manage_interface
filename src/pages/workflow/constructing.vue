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
                    :action="`http://localhost:3000/REST/manageSite/workflow/contentIllustration`"
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
                  <el-upload
                    class="constructing-page__intro-upload constructing-page__intro-upload--flat"
                    :action="`http://localhost:3000/REST/manageSite/workflow/contentIllustration`"
                    drag
                    multiple>
                    <i class="fas fa-music"></i>
                    <span>upload your cover image here</span>
                  </el-upload>
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
          @nextPage="nextPageHandler"
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
import { mapState, mapActions } from 'vuex';

export default {
  name: 'wk-construction',
  components: {
    step,
    topnav,
    constructArea,
    imageInput,
    contentTabSection,
    submitBtnGroup,
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
  },
  methods: {
    ...mapActions('workflow', [
      'saveConstructingStage',
    ]),
    nextPageHandler() {
      
    },
    saveHandler() {
      this.saveConstructingStage()
        .catch((err) => {
          alert(err);
        });
      console.log('saved');
    },
  },
  mounted() {
  },

};
</script>

<style src="@/construct-area.css"></style>
<style src="@/constructing-page.css"></style>

