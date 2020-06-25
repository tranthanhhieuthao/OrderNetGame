import store from '@/store'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default {
  mounted() {
    const isMobile = this.$_isMobile()
    console.log(isMobile)
    console.log(store.state.app.device)
    if (isMobile) {
      store.dispatch('app/toggleDevice', 'mobile')
    } else store.dispatch('app/toggleDevice', 'desktop')
  },
  // watch: {
  //   widthChange() {
  //     console.log('chay vao day la dung')
  //     const isMobile = this.$_isMobile()
  //     if (isMobile) {
  //       store.dispatch('app/toggleDevice', 'mobile')
  //     } else store.dispatch('app/toggleDevice', 'desktop')
  //   }
  // },
  // computed: {
  //   widthChange: {
  //     get() {
  //       return body.getBoundingClientRect().width
  //     }
  //   }
  // },
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
