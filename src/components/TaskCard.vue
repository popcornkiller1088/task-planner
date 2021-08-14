<template>
<v-card class="pl-4 pr-4">
  <div class="field d-flex">
    <div class="field-title ">Task:</div>
    <div class="field-value pl-2 font-weight-bold">{{ task.title }}</div>
  </div>
  <div class="field d-flex pt-2">
    <div class="field-title">Description:</div>
    <div class="field-value pl-2 font-weight-bold">{{ task.description }}</div>
  </div>
  <div class="field d-flex pt-2">
    <div class="field-title"> Estimated Time:</div>
    <div class="field-value pl-2 font-weight-bold">{{ task.estimatedTime }}</div>
  </div>
  <div class="field d-flex pt-2">
    <div class="field-title"> Labels:</div>
    <div class="field-value pl-2 font-weight-bold">{{ task.labels.join(',') }}</div>
  </div>
  <div class="field d-flex pt-2" v-if="task.attachmentList.length">
    <div class="field-title"> Attachments:</div>
    <div class="field-value pl-2 font-weight-bold">{{ task.attachmentList.length }}</div>
  </div>
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

</style>
