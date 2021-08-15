import Vue from 'vue';
import Vuex from 'vuex';
import searchTask from '@/utils/searchTask';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    task: [
      {
        id: 1,
        title: 'The standard Lorem Ipsum passage',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
        estimatedTime: '02:15',
        labels: ['Programming'],
        status: 'PENDING',
        order: 0,
        attachmentList: [],
        comments: []
      },
      {
        id: 2,
        title: 'Finibus Bonorum',
        description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab',
        estimatedTime: '02:15',
        labels: ['Programming'],
        status: 'PENDING',
        order: 1,
        attachmentList: [],
        comments: []
      },
      {
        id: 3,
        title: 'Section 1.10.33 of "de Finibus',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas',
        estimatedTime: '02:15',
        labels: ['Programming'],
        status: 'PENDING',
        order: 2,
        attachmentList: [],
        comments: []
      },
      {
        id: 4,
        title: 'On the other hand',
        description: 'we denounce with righteous indignation and dislike men who are so begu',
        estimatedTime: '02:15',
        labels: ['Programming'],
        status: 'PROCESSING',
        order: 3,
        attachmentList: [],
        comments: ['this is urgent']
      },
      {
        id: 5,
        title: 'Lorem Ipsum',
        description: 'it. Sed eu justo sed odio accumsan aliquam mattis sed libero. Sed',
        estimatedTime: '02:15',
        labels: ['Programming'],
        status: 'DONE',
        order: 3,
        attachmentList: [],
        comments: ['this is urgent']
      }
    ],
  },
  mutations: {
    updateStatus(state, payload) {
      const targetTask = state.task.find((task) => task.id === parseInt(payload.key, 0));
      targetTask.status = payload.status;
      targetTask.order = 99;

      const tasks = state.task.sort((a, b) => a.order - b.order);
      state.task = tasks.map((task, index) => ({ ...task, order: index }));
    },

    swapOrder(state, payload) {
      const dragged = state.task.find((task) => task.id === parseInt(payload[0], 0));
      const target = state.task.find((task) => task.id === parseInt(payload[1], 0));

      const sameGroup = dragged.status === target.status;

      // - Different Group
      if (!sameGroup) {
        dragged.status = target.status;
        dragged.order = target.order + 0.5;

        // - Same Group
      } else if (target.order > dragged.order) {
        dragged.order = target.order + 0.5;
      } else if (target.order < dragged.order) {
        dragged.order = target.order - 0.5;
      } else {
        const storedOrder = dragged.order;
        dragged.order = target.order;
        target.order = storedOrder;
      }

      const tasks = state.task.sort((a, b) => a.order - b.order);
      state.task = tasks.map((task, index) => ({ ...task, order: index }));
    },

    updateTaskById(state, payload) {
      // eslint-disable-next-line
      let target = state.task.find((task) => task.id === parseInt(payload.id, 0));
      Object.assign(target, payload);
    },

    removeTaskById(state, payload) {
      state.task.forEach((task, index) => {
        if (task.id === parseInt(payload.id, 0)) {
          state.task.splice(index, 1);
        }
      });
    },

    addComment(state, payload) {
      // eslint-disable-next-line
      let target = state.task.find((task) => task.id === parseInt(payload.id, 0));
      target.comments.push(payload.comments);
    },

    addTask(state, payload) {
      state.task.push(payload);
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    getTaskByStatus: (state) => (status) => state.task.filter((task) => task.status === status).sort((a, b) => a.order - b.order),
    getTaskById: (state) => (id) => state.task.find((task) => task.id === parseInt(id, 0)),
    getTotalTaskLength: (state) => () => state.task.length,
    searchTask: (state) => (input) => searchTask(input, state.task),
    checkIfTaskExist: (state) => (id) => state.task.find((task) => task.id === parseInt(id, 0))
  }
});
