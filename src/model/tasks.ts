import { model, Schema } from "mongoose";

export interface TaskInterface {
  title: string;
  projectName?: string;
  type?: string;
  owner?: string;
  _id?: string;
}

const TaskSchema = new Schema<TaskInterface>({
  title: { type: String, required: true, unique: true },
  projectName: { type: String, required: true, default: "default" },
  type: {
    type: String,
    required: true,
    default: "testCase",
    enum: ["testCase", "nullTestCase", "refactor"],
  },
  owner: { type: String, required: false },
});

const TaskModel = model("Task", TaskSchema);

export function create(taskData: TaskInterface) {
  return new Promise<TaskInterface>((resolve, reject) => {
    const newTask = new TaskModel(taskData);
    newTask.save((error) => {
      if (error) reject(error);
      resolve({
        title: newTask.title,
        projectName: newTask.projectName,
        type: newTask.type,
      });
    });
  });
}

export function getTasksForProject(projectName: string) {
  return new Promise<TaskInterface[]>((resolve, reject) => {
    TaskModel.find(
      { projectName },
      "title type projectName",
      (error, tasks) => {
        if (error) reject(error);
        // tasks.map((task) => {
        //   task.;
        // });
        resolve(
          tasks.map((task) => {
            return {
              title: task.title,
              projectName: task.projectName,
              type: task.type,
            };
          })
        );
      }
    );
  });
}
export function update(task: TaskInterface, newData: TaskInterface) {
  return new Promise<TaskInterface>((resolve, reject) => {
    TaskModel.updateOne(task, newData, {}, (error, updateResult) => {
      if (error) return reject(error);
      if (updateResult.modifiedCount === 0) return reject("task not found");
      TaskModel.findOne(
        newData,
        "title type projectName",
        {},
        (error, updatedTask) => {
          if (error) reject(error);

          resolve({
            title: updatedTask!.title,
            projectName: updatedTask!.projectName,
            type: updatedTask!.type,
          });
        }
      );
    });
  });
}
