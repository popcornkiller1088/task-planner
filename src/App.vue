<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>

<style lang="sass">
body .theme--light.v-application
  background: #7474bf
  background: -webkit-linear-gradient(to right, #7474bf, #348ac7)
  background: linear-gradient(to right, #7474bf, #348ac7)
</style>
