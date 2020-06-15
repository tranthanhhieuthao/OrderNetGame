import store from '@/store'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default {
  mounted() {
    const isMobile = this.$_isMobile()
    console.log(isMobile)
    console.log(store.state.app.device)
    if (isMobile) {
      console.log('chay vao day')
      store.dispatch('app/toggleDevice', 'mobile')
    } else store.dispatch('app/toggleDevice', 'desktop')
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile() {
      const rect = body.getBoundingClientRect()
      console.log(rect.width)
      return rect.width - 1 < WIDTH
    }
  }
}
