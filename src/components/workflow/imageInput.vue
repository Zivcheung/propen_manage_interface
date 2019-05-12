<template>
  <div class="imageinput" :class="[`imageinput--${size}`,]">
    <div class="imageinput__placeholder">
      <p class="imageinput__placeholder-text">{{placeHolder}}</p>
      <div class="imageinput__placeholder-icon">
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'imageInput',
  props: {
    size: {
      type: String,
      default: 'medium',
    },
    placeHolder: {
      type: String,
      default: 'upload your image here',
    },
  },

};
</script>

<style src=""></style>
