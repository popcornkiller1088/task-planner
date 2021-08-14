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
    <v-autocomplete label="search"></v-autocomplete>
  </div>

  <div class="board-wrapper">
    <v-row>
      <v-col cols="12" md="4" v-for="(status, index) in boards" :key="index">
        <v-card class="board">
          <h3 class="board-title text-center pb-3">{{ status }} {{getTaskByStatus(status).length}}/{{ getTotalTaskLength()}} ({{ getCompletePecent() | percentage}})</h3>
          <div class="task-wrapper" @dragover.prevent @drop.prevent="drop($event, status)">
            <div class="task-wrapper-inner" v-for="(task) in getTaskByStatus(status)" :key="task.id" draggable="true"
                @dragstart="dragStart($event, task.id)"
                @drop.stop.prevent="taskDrop($event, task.id)"
                @click="previewTask = task.id; editMode = 'edit'; dialog = true; "
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
      <TaskEdit :id="previewTask" @close="dialog = false" :mode="editMode"></TaskEdit>
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
      dragPreview: '',
      previewTask: 3,
      editMode: 'new',
      boards: ['PENDING', 'PROCESSING', 'DONE']
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
      this.previewTask = new Date().getTime();
      this.editMode = 'new';
      this.dialog = true;
    }
  },
  computed: {
    ...mapGetters(['getTaskByStatus', 'getTotalTaskLength']),
  },
  mounted() {
  },
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

.task-wrapper
  min-height: 200px

.board.v-card
  background: #ebecf0
  padding: 10px 10px 20px 10px

.task-wrapper-inner
  & + &
    margin-top: 10px
</style>
