<template>
  <div class="home">
    <register msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import createUser from '@/components/createUser.vue'
import register from '@/components/register'
export default {
  name: 'Home',
  components: {
    createUser,
    register
  }
}
</script>
