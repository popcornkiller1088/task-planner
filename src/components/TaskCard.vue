<template>
<v-card class="task">
 Task: {{ task.title }}<br/>Description: {{ task.description }}<br/>Estimated Time: {{ task.estimatedTime }}
</v-card>
</template>

<script>
export default {
  name: 'TaskCard',
  props: ['task'],

  data: () => ({

  }),
};
</script>
<style lang="sass" >
.task.v-card
  padding: 0 20px

</style>
