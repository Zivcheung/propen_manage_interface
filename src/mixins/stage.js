export default {
  methods: {
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
  },
};
