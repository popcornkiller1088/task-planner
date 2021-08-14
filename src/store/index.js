import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    task: [
      {
        id: 1,
        title: '1111111',
        description: 'asdasd',
        estimatedTime: '02:15',
        labels: ['Programming'],
        status: 'PENDING',
        order: 0,
        attachments: []
      },
      {
        id: 2,
        title: '22222',
        description: 'asdasd',
        estimatedTime: '02:15',
        labels: ['Programming'],
        status: 'PENDING',
        order: 1,
        attachments: []
      },
      {
        id: 3,
        title: '333333',
        description: 'asdasd',
        estimatedTime: '02:15',
        labels: ['Programming'],
        status: 'PENDING',
        order: 2,
        attachments: []
      },
      {
        id: 4,
        title: '444444',
        description: 'asdasd',
        estimatedTime: '02:15',
        labels: ['Programming'],
        status: 'PENDING',
        order: 3,
        attachments: []
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
      console.log(payload);
      // eslint-disable-next-line
      let target = state.task.find((task) => task.id === parseInt(payload.id, 0));
      console.log(target);
      Object.assign(target, payload);
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    getTaskByStatus: (state) => (status) => state.task.filter((task) => task.status === status).sort((a, b) => a.order - b.order),
    getTaskById: (state) => (id) => state.task.find((task) => task.id === id),
    getTotalTaskLength: (state) => () => state.task.length
  }
});
