<template>
<v-container>

  <div class="header">
    <h2 class="text-center">Progress</h2>
    <v-progress-linear :value="getCompletePecent() * 100" color="amber" striped height="30">
      <h4>Done {{getTaskByStatus('DONE').length}} out of {{ getTotalTaskLength()}} </h4>
    </v-progress-linear>
  </div>

  <div class="panel my-6 pl-3 pr-4 d-flex">
    <v-btn class="mt-3 mr-4" @click="newTask"><v-icon class="pr-2">mdi-folder-plus</v-icon>Add Task</v-btn>
    <v-autocomplete label="Search Task"
      prepend-icon="mdi-magnify"
      :search-input.sync="searchInput"
      :items="searchTask(searchInput)"
      v-model="selectedBoard"
      item-text="title" no-filter return-object clearable
    >
      <template v-slot:item="data">
          <v-list-item-content>
            <v-list-item-title v-html="data.item.title"></v-list-item-title>
            <v-list-item-subtitle >
              {{ data.item.description }}  labels: {{ data.item.labels.join(', ') }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </template>
    </v-autocomplete>
  </div>

  <div class="board-wrapper">
    <v-row>
      <v-col cols="12" md="4" v-for="(status, index) in boards" :key="index">
        <v-card class="board">
          <h3 class="board-title text-center pb-3">{{ status }} {{getTaskByStatus(status).length}}/{{ getTotalTaskLength()}} ({{ getTaskByStatus(status).length /  getTotalTaskLength() | percentage}})</h3>
          <div class="task-wrapper" @dragover.prevent @drop.prevent="drop($event, status)">
            <div class="task-wrapper-inner" v-for="(task) in getTaskByStatus(status)" :key="task.id" draggable="true"
                @dragstart="dragStart($event, task.id)"
                @drop.stop.prevent="taskDrop($event, task.id)"
                @click="openCard(task.id)"
              >
                <TaskCard :task="task"></TaskCard>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>

  <!-- DIALOG -->
  <div class="text-center">
    <v-dialog v-model="dialog" width="500" scrollable>
      <TaskEdit :id="selectId" @close="dialog = false" :mode="editMode"></TaskEdit>
    </v-dialog>
  </div>

</v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import TaskCard from '@/components/TaskCard.vue';
import TaskEdit from '@/components/TaskEdit.vue';

export default {
  components: {
    TaskCard,
    TaskEdit
  },
  data() {
    return {
      dialog: false,
      searchInput: '',
      dragPreview: '',
      selectId: '',
      editMode: 'new',
      boards: ['PENDING', 'PROCESSING', 'DONE'],
      selectedBoard: {}
    };
  },
  methods: {
    ...mapMutations(['updateStatus', 'swapOrder']),

    dragStart(e, key) {
      e.dataTransfer.setData('key', key);
    },

    drop(e, status) {
      this.updateStatus({ key: e.dataTransfer.getData('key'), status });
    },

    taskDrop(e, targetKey) {
      this.swapOrder([e.dataTransfer.getData('key'), targetKey]);
    },

    getCompletePecent() {
      return this.getTaskByStatus('DONE').length / this.getTotalTaskLength();
    },

    newTask() {
      this.selectId = new Date().getTime();
      this.editMode = 'new';
      this.dialog = true;
    },

    openCard(id) {
      this.selectId = id;
      this.editMode = 'edit';
      this.dialog = true;
    }
  },
  computed: {
    ...mapGetters(['getTaskByStatus', 'getTotalTaskLength', 'searchTask', 'checkIfTaskExist'])
  },
  mounted() {
    console.log(this.checkIfTaskExist(this.$route.params.taskId));
    if (this.$route.params.taskId && this.checkIfTaskExist(this.$route.params.taskId)) {
      this.openCard(this.$route.params.taskId);
    }
  },
  watch: {
    selectedBoard(task) {
      this.openCard(task.id);
    }
  }
};
</script>

<style lang="sass" scoped>
.header
  background: #ebecf0
  padding: 0 10px 10px
  border-radius: 5px

.panel
  background: #ebecf0
  border-radius: 5px
  max-width: 800px

.task-wrapper
  min-height: 200px

.board.v-card
  background: #ebecf0
  padding: 10px 10px 20px 10px

.board-title
  user-select: none

.task-wrapper-inner
  & + &
    margin-top: 10px
</style>
