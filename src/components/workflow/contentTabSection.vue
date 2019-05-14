<template>
  <div class="fit-parent-wp content-panel" ref='wrapper'>
    <el-row class="content-panel__form">
      <el-col :span="12" :offset="3">
        <div>
          <div>Illustrations</div>
            <el-upload
              class="constructing-page__intro-upload"
              :action="`http://localhost:3000/REST/manageSite/workflow/contentIllustration`"
              :data="projectInfo"
              :file-list="imageList"
              :on-success="illustrationUploadSucessHandler"
              :on-remove="illustrationRemoveHandler"
              :before-upload="illustrationValidateHandler"
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
      </el-col>
      <el-col :span="7" :offset="1">
        <div>
          <div>Description</div>
            <el-input
              type="textarea"
              placeholder="write abstract here"
              v-model="descriptionText"
              maxlength="1000"
              show-word-limit
              resize="none"
              :autosize="{ minRows:10, maxRows: 10}"
              >
            </el-input>
        </div>
        <div>
          <div>Voice Over</div>
            <el-upload
              class="constructing-page__intro-upload constructing-page__intro-upload--flat"
              :action="`http://localhost:3000/REST/manageSite/workflow/contentVoiceover`"
              :data="projectInfo"
              :on-success="voiceoverUploadSuccessHandler"
              :on-remove="voiceoverUploadRemove"
              :before-upload="audioValidationHandler"
              :file-list="voiceoverOfPage"
              :limit="1"
              :on-exceed="voiceoverExceed"
              drag>
              <i class="fas fa-music"></i>
              <span>upload your cover image here</span>
            </el-upload>
        </div>
      </el-col>
    </el-row>
    <div class="content-panel__toc-wp">
      <el-menu class="content-panel__tableofcontent"
        default-active="0-0"
        :collapse="tocCollapse"
        text-color="#fff"
        active-text-color="#0075ff"
        background-color="#262626"
        :collapse-transition="false"
        >
        <el-submenu v-for="(section, i) in orgnizedPages"
          :key="section[0].sectionName"
          :index="`${i}`">
          <!-- submenu -->
          <template slot="title">
            <i class="fas fa-egg"></i>
            <span slot="title"
              contenteditable
              @focus="renameSectionHandler"
              @input="renameSectionHandler"
              @blur="()=>{submitRenameToStoreHandler(i, section[0].sectionName)}">
              {{section[0].sectionName}}
            </span>
          </template>
          <!-- submenu item-->
          <el-menu-item v-for="(page, j) in section"
            :index="`${i}-${j}`"
            :key="page.pageNumber"
            @click="() => {choosePageHandler(page)}"
            >
            <i class="iconfont iconfried-egg"></i>
            <span slot="title">
              {{page.pageNumber}}
            </span>
            <i class="fas fa-plus content-panel__page-delete"
              @click="deletePageHandler(page.pageId, section)"></i>
          </el-menu-item>
          <!-- add page-->
          <div class="content-panel__add-page" @click="addPage(section[0].sectionName)">
            <i class="fas fa-plus"></i>
            <span>new page</span>
          </div>
        </el-submenu>
        <div class="content-panel__add-section" @click="() => addNewSectionHandler()">
          <i class="fas fa-plus"></i>
          <span>new section</span>
        </div>
      </el-menu>
      <div class="content-panel__toc-toggle"
        :class="{'is-collapsed': tocCollapse}"
        @click="tableOfContentOpenHandler">
        <i class="fas fa-plus"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  name: 'wkContentTabSection',
  data() {
    return {
      pageNumber: 0,
      tocCollapse: true,
      toc: [],
      renameValue: '',
      currentPage: {
        sectionName: '',
        pageId: '',
      },
    };
  },
  computed: {
    ...mapState('workflow', [
      'currentProject',
    ]),
    ...mapGetters('workflow', [
      'orgnizedPages',
    ]),
    currentPageIndex() {
      if (!this.currentPage.sectionName && !this.currentPage.pageId) {
        return '0-0';
      }
      const toc = this.currentProject.tableOfContent;
      const sectionIndex = toc.indexOf(this.currentPage.sectionName);
      const pageIndex = this.currentProject.pages
        .find(item => item.pageId === this.currentPage.pageId).pageNumber;

      return `${sectionIndex}-${pageIndex - 1}`;
    },
    descriptionText: {
      get() {
        return this.currentProject.pages
          .find(page => page.pageId === this.currentPage.pageId).description;
      },
      set(value) {
        this.callbackUpdate((state) => {
          const page = state.currentProject.pages
            .find(p => p.pageId === this.currentPage.pageId);
          page.description = value;
        });
      },
    },
    imageList() {
      const page = this.currentProject.pages.find(p => p.pageId === this.currentPage.pageId);
      return page.illustrations;
    },
    voiceoverOfPage() {
      const page = this.findCurrentPage();
      if (!page.voiceover) return [];
      return [{ url: page.voiceover }];
    },
    projectInfo() {
      return {
        project: this.currentProject.title,
        sectionName: this.currentPage.sectionName,
      };
    },
  },
  methods: {
    ...mapMutations('workflow', [
      'setTableOfContent',
      'callbackUpdate',
      'renameTOCSection',
      'initEmptySection',
      'addIllustration',
      'removeIllustration',
      'addContentVoiceover',
      'addPage',
      'removePage',
    ]),
    ...mapActions('workflow', [
      'deleteAddedIllustration',
    ]),
    findCurrentPage() {
      const page = this.currentProject.pages.find(p => p.pageId === this.currentPage.pageId);
      return page;
    },
    tableOfContentOpenHandler() {
      this.tocCollapse = !this.tocCollapse;
    },
    addNewSectionHandler() {
      const toc = this.currentProject.tableOfContent.slice();
      const numberOfNew = this.currentProject.tableOfContent.filter(item => item.indexOf('new section') >= 0);
      const appendText = numberOfNew.length > 0 ? `(${numberOfNew.length})` : '';
      toc.push(`new section${appendText}`);
      this.setTableOfContent(toc);
      this.initEmptySection();
    },
    deletePageHandler(pageId, section) {
      if (section.length === 1) {
        // todo: remove section
        return;
      }
      const deleteIndex = section.findIndex(item => item.pageId === pageId);
      this.removePage(pageId);
      // reset current page to prev one
      if (deleteIndex === 0) {
        this.currentPage.sectionName = section[deleteIndex + 1].sectionName;
        this.currentPage.pageId = section[deleteIndex + 1].pageId;
      } else {
        this.currentPage.sectionName = section[deleteIndex - 1].sectionName;
        this.currentPage.pageId = section[deleteIndex - 1].pageId;
      }
    },
    renameSectionHandler(e) {
      this.renameValue = e.target.innerText;
    },
    submitRenameToStoreHandler(index, sectionName) {
      const opt = {
        value: this.renameValue,
        index,
        sectionName,
      };
      this.renameTOCSection(opt);
    },
    initFirstSection() {
      // if the porject is brand new, create first section
      const toc = this.currentProject.tableOfContent;
      let newToc;
      if (toc.length === 0) {
        newToc = ['your first section'];
        this.setTableOfContent(newToc);
        this.initEmptySection();
      }
    },
    defaultActiveFirst() {
      const firstSection = this.currentProject.tableOfContent[0];
      const firstPage = this.currentProject.pages
        .find(p => p.sectionName === firstSection && p.pageNumber === 1);
      this.currentPage.sectionName = firstPage.sectionName;
      this.currentPage.pageId = firstPage.pageId;
    },
    choosePageHandler(p) {
      this.currentPage.pageId = p.pageId;
      this.currentPage.sectionName = p.sectionName;
    },
    // image ajax area
    illustrationValidateHandler(file) {
      const name = file.name;
      const page = this.findCurrentPage();
      const dupName = page.illustrations.some(item => item.name === name);
      if (dupName) {
        alert('please not upload the same file');
        return false;
      }
      return true;
    },
    audioValidationHandler(file) {
      const maxSize = 100 * 1024 * 1024; // 100mb
      if (file.type !== 'audio/mp3' && file.type !== 'audio/x-m4a') {
        alert('only accept mp3 and m4a audio format');
        return false;
      }
      if (file.size > maxSize) {
        alert('max 100mb size limt exceed');
        return false;
      }
      return true;
    },
    illustrationUploadSucessHandler(res, file) {
      const payload = {
        pageId: this.currentPage.pageId,
        name: file.name,
        url: res.url,
        s3Key: res.s3Key,
      };
      this.addIllustration(payload);
    },
    illustrationRemoveHandler(file) {
      if (file.status !== 'success') return;
      // delete in page reference
      this.deleteAddedIllustration({
        name: file.name,
        pageId: this.currentPage.pageId,
        type: 'Illustration',
      });
    },
    voiceoverUploadRemove(file) {
      if (file.status !== 'success') return;
      this.deleteAddedIllustration({
        type: 'Voiceover',
        name: file.name,
        pageId: this.currentPage.pageId,
      });
    },
    voiceoverExceed() {
      alert('please first delete then upload voiceover');
    },
    voiceoverUploadSuccessHandler(res, file) {
      const payload = {
        pageId: this.currentPage.pageId,
        name: file.name,
        url: res.url,
      };
      this.addContentVoiceover(payload);
    },
  },
  created() {
    this.initFirstSection();
    this.initEmptySection();
    this.defaultActiveFirst();
  },
  updated() {
    console.log('updated');
  },
};
</script>

<style src="@/content-panel.css"></style>
