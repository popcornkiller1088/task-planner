<template>
<v-card class="px-4 py-2">
  <div class="field">
    <div class="field-title ">Task:</div>
    <div class="field-value pl-2 font-weight-bold">{{ task.title }}</div>
  </div>
  <div class="field">
    <div class="field-title">Description:</div>
    <div class="field-value pl-2 font-weight-bold">{{ task.description }}</div>
  </div>
  <div class="field">
    <div class="field-title">Estimated Time:</div>
    <div class="field-value pl-2 font-weight-bold">{{ task.estimatedTime }}</div>
  </div>
  <div class="field">
    <div class="field-title">Labels:</div>
    <div class="field-value pl-2 font-weight-bold">{{ task.labels.join(', ') }}</div>
  </div>
  <div class="field" v-if="task.attachmentList.length">
    <div class="field-title">Attachments:</div>
    <div class="field-value pl-2 font-weight-bold">{{ task.attachmentList.length }}</div>
  </div>
</v-card>
</template>

<script>
export default {
  name: 'TaskCard',
  props: ['task'],
};
</script>

<style lang="sass" >
.field
  display: table-row

.field-title
  width: 100px
  font-size: .8rem

.field-value
  font-size: .9rem

.field-title, .field-value
  display: table-cell
</style>
