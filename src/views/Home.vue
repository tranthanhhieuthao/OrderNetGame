<template>
  <div class="home">
    <register msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import register from '@/components/register'
export default {
  name: 'Home',
  components: {
    register
  }
}
</script>
