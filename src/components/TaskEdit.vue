<template>
<v-card>
  <v-card-title> {{ mode === 'new' ? 'New Task' : 'Edit Task' }} </v-card-title>
  <v-card-text>
    <v-form ref="form" v-model="valid" >
      <v-text-field v-model="taskDetails.title" label="Title" prepend-icon="mdi-format-title" :rules="[rules.required]"></v-text-field>
      <v-text-field v-model="taskDetails.description" label="Description" prepend-icon="mdi-text" :rules="[rules.required]"></v-text-field>

      <v-menu
        ref="menu"
        v-model="timeMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="time"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="taskDetails.estimatedTime"
            label="Estimated Time"
            prepend-icon="mdi-clock-time-four-outline"
            readonly
            v-bind="attrs"
            v-on="on"
            :rules="[rules.required]"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="timeMenu"
          v-model="taskDetails.estimatedTime"
          full-width
          @click:minute="$refs.menu.save(taskDetails.estimatedTime)"
        ></v-time-picker>
      </v-menu>

      <v-select :items="['PENDING', 'PROCESSING', 'DONE']" label="Status" v-model="taskDetails.status" prepend-icon="mdi-list-status" :rules="[rules.required]">
        <template v-slot:item="{ item, attrs, on }">
          <v-list-item v-bind="attrs"  v-on="on" >
            <v-list-item-title
              :id="attrs['aria-labelledby']"
              v-text="item">
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-select>

      <v-combobox
        v-model="taskDetails.labels"
        :items="labelItems"
        multiple
        clearable
        label="Labels"
        prepend-icon="mdi-label"
      >
      </v-combobox>

      <v-file-input
        accept="image/*"
        label="Attachments"
        :clearable="false"
        @change="fileInputChange"
      ></v-file-input>

      <template v-if="taskDetails.attachmentList">
        <div class="attachment-amount">total attachments: {{ taskDetails.attachmentList.length }}</div>
        <div class="attachment-wrapper">
          <div class="attachment-thumb" v-for="(attachment,i) in taskDetails.attachmentList" :key="i" aria-label="asdasd">
            <span> {{ attachment.name }}</span>
            <div class="attachment-delete" @click="removeAttachment(i)"> <v-icon color="red">mdi-delete</v-icon></div>
          </div>
        </div>
      </template>
    </v-form>
  </v-card-text>

  <v-card-actions>
    <v-btn depressed color="error" @click="$emit('close')">Cancel</v-btn>
    <v-btn depressed color="error" @click="submit">save</v-btn>
  </v-card-actions>

</v-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'TaskCard',
  props: ['id', 'mode'],
  data: () => ({
    valid: false,
    rules: {
      required: value => !!value || 'Required.',
    },
    labelItems: ['Programming', 'Design', 'Vue', 'Vuetify'],
    taskDetails: {},
    time: null,
    timeMenu: false
  }),
  methods: {
    ...mapMutations(['updateTaskById', 'addTask']),
    fileInputChange(event) {
      this.taskDetails.attachmentList.push(event);
    },
    removeAttachment(index) {
      this.taskDetails.attachmentList.splice(index, 1);
    },
    submit() {
      this.$refs.form.validate();
      if (this.valid) {
        if (this.mode === 'new') {
          this.addTask(this.taskDetails);
          this.$emit('close');
        } else {
          this.updateTaskById(this.taskDetails);
          this.$emit('close');
        }
      }
    },
    loadPresets() {
      if (this.mode !== 'new') {
        this.$refs.form.resetValidation();
        this.taskDetails = { ...this.getTaskById(this.id) };
      } else {
        this.taskDetails = {
          id: this.id,
          title: '',
          description: '',
          estimatedTime: '',
          labels: [],
          status: [],
          order: 99,
          attachmentList: []
        };
        this.$refs.form.resetValidation();
      }
    }
  },
  computed: {
    ...mapGetters(['getTaskById']),
  },
  mounted() {
    this.loadPresets();
  },
  watch: {
    id() {
      this.loadPresets();
    }
  }
};
</script>

<style lang="sass" scoped>
.attachment-amount
  margin: -20px 0 10px 33px

.attachment-wrapper
  display: grid
  margin-left: 33px

  .attachment-thumb
    text-align: left
    position: relative
    overflow: hidden
    display: flex
    align-items: center

    & + .attachment-thumb
      padding-top: 10px

    span
      text-decoration: underline
      flex: 1
      word-break: break-all
      max-width: calc(100% - 20px)

  .attachment-delete
    cursor: pointer
    width: 30px
    text-align: right

.v-card__actions
  justify-content: space-around

  button
    width: 100px

</style>
