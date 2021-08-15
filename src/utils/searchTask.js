export default function (input, tasksArr) {
  if (!input || input.length === 0) {
    return tasksArr;
  }

  return tasksArr.filter(task => {
    if (task.title.includes(input) || task.description.includes(input) || task.labels.includes(input)) {
      return true;
    }

    task.labels.forEach((label) => {
      if (label.includes(input)) {
        return true;
      }
      return null;
    });
    return false;
  });
}
