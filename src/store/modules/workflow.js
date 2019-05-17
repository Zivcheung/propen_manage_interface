import uuid from 'uuid';
import axios from 'src/utils/mainAxios';
import { capitalize } from 'src/utils/utils';

const state = {
  currentProjectId: '',
  currentProject: {
    title: '',
    currentStage: '',
    authors: [],
    authorType: 'team',
    coverImage: '',
    introVoiceover: '',
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
  resetProjectState(state) {
    state.currentProjectId = '';
    state.currentProject = {
      title: '',
      currentStage: '',
      authors: [],
      authorType: 'team',
      coverImage: '',
      voiceOver: '',
      introduction: '',
      tableOfContent: [
      ],
      pages: [],
    };
  },
  // Unique identifier
  setProjectId(state, id) {
    state.currentProjectId = id;
  },
  setStage(state, stage) {
    state.currentProject.currentStage = stage;
  },
  // create stage
  setTitle(state, title) {
    state.currentProject.title = title;
  }, 
  setAuthors(state, authors) {
    state.currentProject.authors = authors;
  },
  setAuthorType(state, type) {
    state.currentProject.authorType = type;
  },
  // constructing stage
  setCoverImage(state, imagePath) {
    state.currentProject.coverImage = imagePath;
  },
  removeCoverImage(state, imagePath) {
    state.currentProject.coverImage = '';
  },
  setIntroVoiceover(state, audioPath) {
    state.currentProject.introVoiceover = audioPath;
  },
  removeIntroVoiceover(state) {
    state.currentProject.introVoiceover = '';
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
      s3Key: payload.s3Key,
    };
    page.illustrations.push(img);
  },
  removeIllustration(state, payload) {
    const page = state.currentProject.pages.find(p => p.pageId === payload.pageId);
    _.remove(page.illustrations, item => item.name === payload.name);
  },
  addContentVoiceover(state, payload) {
    const page = state.currentProject.pages.find(p => p.pageId === payload.pageId);
    const voiceover = payload.url
    page.voiceover = voiceover;
  },
  removeVoiceover(state, payload) {
    const page = state.currentProject.pages.find(p => p.pageId === payload.pageId);
    page.voiceover = '';
  },
  // convenient function to hand power to client
  callbackUpdate(state, cb) {
    cb(state);
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
  setConstructingStage(state, payload) {
    Object.assign(state.currentProject, {
      ...payload,
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
  saveCreateStage({ state, commit }) {
    const currentProject = state.currentProject;
    const data = {
      projectId: state.currentProjectId,
      title: currentProject.title,
      currentStage: currentProject.currentStage || 'create',
      authors: currentProject.authors,
      authorType: currentProject.authorType,
    };
    // error handling should be handled in components
    return axios.post('workflow/projectAndCreate', data)
      .then((res) => {
        commit('setProjectId', res.data.projectId);
        return Promise.resolve(res);
      });
  },
  saveConstructingStage(context) {
    const currentProject = context.state.currentProject;
    const constructingData = {
      projectId: context.state.currentProjectId,
      introduction: currentProject.introduction,
      introVoiceover: currentProject.introVoiceover,
      coverImage: currentProject.coverImage,
      pages: currentProject.pages,
      tableOfContent: currentProject.tableOfContent,
    };
    console.log(constructingData);
    return axios.put('/workflow/constructContent', constructingData);
  },
  updateStageToNext({ state, commit, dispatch }) {
    const stages = [
      'create',
      'material_collection',
      'constructing',
      'review',
      'finish',
      'completed',
    ];
    const currentStage = state.currentProject.currentStage;
    const index = stages.indexOf(currentStage);
    if (index >= 5) throw new Error('stage out of range');
    // update store
    commit('setStage', stages[index + 1]);
    // update database
    return axios.post('/workflow/updateStage', {
      projectId: state.currentProjectId,
      stage: state.currentProject.currentStage,
    });
  },
  saveAndNextStage({ state, commit, dispatch }, _stage) {
    if (!_stage) throw new Error('saveAndNextStage should receive a stage name param');
    let stage;
    switch (_stage) {
      case 'create':
        stage = 'CreateStage';
        break;
      case 'material collection':
        stage = 'MaterialCollectionStage';
        break;
      case 'constructing':
        stage = 'ConstructingStage';
        break;
      case 'review':
        stage = 'ReviewStage';
        break;
      case 'finish':
        stage = 'FinishStage';
        break;
      default:
        throw new Error('saveAndNextStage accepts only suitable stage name');
    }
    async function run() {
      if (!state.currentProjectId) {
        // first init project by finishing create stage case
        // set stage to materialcollectin then save
        commit('setStage', 'material_collection');
        await dispatch(`save${stage}`);
      } else {
        const p1 = dispatch(`save${stage}`);
        const p2 = dispatch('updateStageToNext');
        await p1;
        await p2;
      }
    }
    return run();
  },
  setCreateStage({ commit }, payload) {
    commit('setAuthorType', payload.authorType);
    commit('setTitle', payload.title);
    commit('setAuthors', payload.authors);
    commit('setStage', payload.stage);
  },
  loadCreateStage(context) {
    return axios.get('/workflow/createStage', {
      params: {
        projectId: context.state.currentProjectId,
      },
    })
      .then((res) => {
        const d = res.data;
        context.dispatch('setCreateStage', d);
      });
  },
  loadMaCollectionStage(context) {
    return axios.get('/workflow/materialCollection', {
      params: {
        projectId: context.state.currentProjectId,
      },
    })
      .then((res) => {
        const d = res.data;
        if (!d) return null;

        return d.collectionList;
      });
  },
  loadConstructingStage(context) {
    return axios.get('/workflow/constructingStage', {
      params: {
        projectId: context.state.currentProjectId,
      },
    })
      .then((res) => {
        const d = res.data;
        if (!res) return;
        context.commit('setConstructingStage', d);
      });
  },
  deleteAddedFile(context, payload) {
    const currentProject = context.state.currentProject;
    let page;
    // condition to exclude intro page
    if (payload.pageId) {
      page = context.state.currentProject.pages.find(item => item.pageId === payload.pageId);
      // delete fileList ref
      context.commit(`remove${payload.type}`, {
        name: payload.name,
        pageId: payload.pageId,
      });
    } else {
      context.commit(`remove${payload.type}`);
    }
    let removedKey;
    switch (payload.type) {
      case 'Illustration':
        removedKey = page.illustrations.find(item => item.name === payload.name).s3Key;
        break;
      case 'Voiceover':
        removedKey = page.voiceover.replace(/^.*resources\//, '');
        removedKey = decodeURIComponent(removedKey);
        break;
      case 'CoverImage':
        removedKey = currentProject.coverImage.replace(/^.*resources\//, '');
        break;
      case 'IntroVoiceover':
        removedKey = currentProject.introVoiceover.replace(/^.*resources\//, '');
        break;
      default:
        removedKey = page.illustrations.find(item => item.name === payload.name).s3Key;
    }
    if (!removedKey) throw new Error();
    // delete remote Storage
    axios.delete('workflow/contentUpload', {
      params: {
        key: encodeURIComponent(removedKey),
      },
    })
      .catch((err) => {
        console.log(err);
        alert('file DeleteError please contact');
      });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
