<template>
<v-card>
  <v-card-title> {{ mode === 'new' ? 'New Task' : 'Edit Task' }} </v-card-title>
  <v-card-text>
    <v-form ref="form" v-model="valid" >
      <v-text-field v-model="taskDetails.title" label="Title" prepend-icon="mdi-format-title" :rules="[rules.required]" ></v-text-field>
      <v-textarea v-model="taskDetails.description" label="Description" prepend-icon="mdi-text" :rules="[rules.required]" rows="2" auto-grow></v-textarea>

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
          format="24hr"
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
        truncate-length="40"
        hide-input
        ref="fileInput"
      ></v-file-input>

      <template v-if="taskDetails.attachmentList">
        <div class="attachment-amount" @click="$refs.fileInput.$refs.input.click()()">total attachments: {{ taskDetails.attachmentList.length }}</div>
        <div class="attachment-wrapper">
          <div class="attachment-thumb" v-for="(attachment,i) in taskDetails.attachmentList" :key="i" aria-label="asdasd">
            <span> {{ attachment.name }}</span>
            <div class="attachment-delete" @click="removeAttachment(i)"> <v-icon color="red">mdi-delete</v-icon></div>
          </div>
        </div>
      </template>
    </v-form>

    <h4 class="pt-2">Comments:</h4>

    <div class="comment-new d-flex pt-4 align-center"  v-for="(comment, i) in taskDetails.comments" :key="i">
      <v-avatar color="indigo" size="40">
        <span class="white--text text-h6">KC</span>
      </v-avatar>
      <div class="pl-2"> {{ comment }} </div>
    </div>

    <div class="comment-new d-flex pt-4">
      <v-avatar color="indigo" size="40">
        <span class="white--text text-h6">KC</span>
      </v-avatar>
      <v-textarea class="ml-2" rows="2" label="leave a comment" v-model="comment" @keyup.enter.prevent="addComment()" outlined auto-grow></v-textarea>
    </div>

  </v-card-text>

  <v-card-actions>
    <v-btn depressed color="error" @click="$emit('close')">Cancel</v-btn>
    <v-btn depressed color="error" @click="remove" v-if="mode === 'edit'">delete</v-btn>
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
    timeMenu: false,
    comment: ''
  }),
  methods: {
    ...mapMutations(['updateTaskById', 'addTask', 'removeTaskById', 'addComment']),
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
          status: '',
          order: 99,
          attachmentList: [],
          comments: []
        };
        this.$refs.form.resetValidation();
      }
    },
    remove() {
      this.removeTaskById(this.taskDetails);
      this.$emit('close');
    },
    addComment() {
      this.taskDetails.comments.push(this.comment);
      // this.addComment({ id: this.id, comments: this.comment });
      this.comment = '';
    }
  },
  computed: {
    ...mapGetters(['getTaskById', 'search']),
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
  margin: -25px 0 10px 33px

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
