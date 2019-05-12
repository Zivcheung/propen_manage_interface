import uuid from 'uuid';

const state = {
  currentProject: {
    title: 'test',
    currentStage: '',
    projectId: '',
    authors: [],
    authorType: '',
    coverImage: '',
    voiceOver: '',
    introduction: '',
    tableOfContent: [
    ],
    pages: [
      // {
      //   sectionName: String,
      //   pageNumber: Number,
      //   pageId: uuid,     todo: it need tobe repalced with ObjectId by mongodb
      //   illustrations: [String],
      //   description: String,
      //   voiceOver: String,
      // },
    ],
  },
};

const mutations = {
  setProjectId(state, id) {
    state.currentProject.ProjectId = id;
  },
  setCreateStep(state, createData) {
    Object.assign(state, {
      ...createData,
    });
  },
  setIntroImage(state, imagePath) {
    state.coverImage = imagePath;
  },
  setPageImageArray(state, opt) {
    const currentSection = opt.sectionName;
    const currentPage = opt.pageNumber;
    state.pages.find((ele) => {
      const match = ele.sectionName === currentSection &&
        ele.pageNumber === currentPage;
      return match;
    });
  },
  setConstructingContent(state, content) {
    Object.assign(state, {
      ...content,
    });
  },
  setIntroduction(state, content) {
    state.currentProject.introduction = content;
  },
  setTableOfContent(state, toc) {
    state.currentProject.tableOfContent = toc;
  },
  addIllustration(state, payload) {
    const page = state.currentProject.pages.find(p => p.pageId === payload.pageId);
    const img = {
      url: payload.url,
      name: payload.name,
    };
    page.illustrations.push(img);
  },
  removeIllustration(state, payload) {
    const page = state.currentProject.pages.find(p => p.pageId === payload.pageId);
    _.remove(page.illustrations, item => item.url === payload.url);
  },
  addContentVoiceover(state, payload) {
    const page = state.currentProject.pages.find(p => p.pageId === payload.pageId);
    const voiceover = payload.url
    page.voiceover = voiceover;
  },
  // convenient function to hand power to client
  callbackUpdate(state, cb) {
    cb(state);
    console.log(state);
  },
  // change toc and also sync all its pages
  renameTOCSection(state, opt) {
    const index = opt.index;
    const sectionName = opt.sectionName;
    const newName = opt.value;
    // update all pages first
    state.currentProject.pages.forEach((item) => {
      if (item.sectionName === sectionName) {
        item.sectionName = newName;
      }
    });
    state.currentProject.tableOfContent[index] = newName;
  },
  addPage(state, section) {
    // payload whole page object;
    let newPageNumber = 0;
    const allPages = state.currentProject.pages;
    const pageNumbers = allPages.reduce((acc, current) => {
      if (current.sectionName === section) {
        acc.push(current.pageNumber);
      }
      return acc;
    }, []);
    // sort to find a gap in it
    pageNumbers.sort((a, b) => a - b);
    pageNumbers.some((n) => {
      const d = n - newPageNumber;
      // gaps in pagenumber
      if (d > 1) {
        newPageNumber++;
        return true;
      }

      newPageNumber = n;
      return false;
    });
    const pageObject = {
      sectionName: section,
      pageNumber: newPageNumber + 1,
      pageId: uuid.v4(),
      illustrations: [],
      description: '',
      voiceover: '',
    };
    state.currentProject.pages.push(pageObject);
    console.log(state.currentProject.pages);
  },
  removePage(state, pageId) {
    // payload : {pageId};
    const allPages = state.currentProject.pages;
    const deleteIndex = allPages.findIndex(item => item.pageId === pageId);

    allPages.forEach((p) => {
      if (p.sectionName === allPages[deleteIndex].sectionName) {
        p.pageNumber > allPages[deleteIndex].pageNumber && p.pageNumber--;
      }
    });
    state.currentProject.pages.splice(deleteIndex, 1);
  },
  // initiate Pages to let all section at least have one page though it is empty
  initEmptySection(state) {
    const curProject = state.currentProject;
    curProject.tableOfContent.forEach((sectionName) => {
      const pages = curProject.pages.filter(page => page.sectionName === sectionName);
      // initialize empty section
      if (pages.length === 0) {
        curProject.pages.push({
          sectionName,
          pageNumber: 1,
          pageId: uuid.v4(),
          illustrations: [],
          description: '',
          voiceover: '',
        });
      }
      return pages;
    });
  },
};

const getters = {
  orgnizedPages: (state) => {
    const curProject = state.currentProject;
    const toc = curProject.tableOfContent.map((sectionName) => {
      const pages = curProject.pages.filter(page => page.sectionName === sectionName);
      return pages;
    });
    return toc;
  },
};

const actions = {
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
