<template>
  <el-upload
    class="constructing-page__intro-upload constructing-page__intro-upload--flat"
    v-bind="$attrs"
    :action="`http://localhost:3000/REST/manageSite/workflow/contentVoiceover`"
    :before-upload="audioValidationHandler"
    :on-exceed="voiceoverExceed"
    :limit="1"
    drag>
    <i class="fas fa-music"></i>
    <span>upload your cover image here</span>
  </el-upload>
</template>

<script>
export default {
  name: 'audio-uploader',
  methods: {
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
    voiceoverExceed() {
      alert('please first delete then upload voiceover');
    },
  },
};
</script>

<style></style>
