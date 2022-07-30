import * as model from "../src/model/tasks";
import * as db from "../src/model/db";
//use jest hooks to set up database test environment
beforeAll(async () => await db.connect());
afterEach(async () => await db.clear());
afterAll(async () => await db.disconnect());

describe("Task model create", () => {
  it("should create the Task t1 of type testCase for project p1", () => {
    const taskData = { title: "t1", type: "testCase", projectName: "p1" };
    return model.create(taskData).then((newTask) => {
      expect(newTask).toEqual(taskData);
    });
  });
  it("should create the Task t1 of default type for project p1", () => {
    const taskData = { title: "t1", projectName: "p1" };
    return model.create(taskData).then((newTask) => {
      expect(newTask).toEqual({ ...taskData, type: "testCase" });
    });
  });
  it("should create the Task t1 of default type for default project", () => {
    const taskData = { title: "t1" };
    return model.create(taskData).then((newTask) => {
      expect(newTask).toEqual({
        ...taskData,
        type: "testCase",
        projectName: "default",
      });
    });
  });
});

describe("Task model read", () => {
  it("should get tasks t1 and t2 for project p1", async () => {
    const tasksData = [
      await model.create({ title: "t1", type: "testCase", projectName: "p1" }),

      await model.create({ title: "t2", type: "testCase", projectName: "p1" }),
      await model.create({ title: "t3", type: "testCase", projectName: "p2" }),
    ];

    return model.getTasksForProject("p1").then((tasks) => {
      tasks.forEach((task) => {
        expect(task.projectName).toEqual("p1");
      });
    });
  });
  it("should reject with 'project not found' for project p3 that doesn't exist", () => {}); //TODO task model read project not found
});

describe("Task model update", () => {
  it("should change task title from t1 to t2 & type from testCase to refactor", async () => {
    const task = await model.create({
      title: "t1",
      type: "testCase",
      projectName: "p1",
    });
    const newData = { title: "t2", type: "refactor" };
    return model.update(task, newData).then((updatedTask) => {
      expect(updatedTask).toEqual({ ...newData, projectName: "p1" });
    });
  });
  it("should reject with 'task not found' for task t3 that doesn't exist", () => {
    const nonExistentTask = {
      title: "t3",
      type: "testCase",
      projectName: "p1",
    };
    const dummyData = {
      title: "t1",
      type: "testCase",
      projectName: "p1",
    };
    return expect(model.update(nonExistentTask, dummyData)).rejects.toMatch(
      "task not found"
    );
  });
});

//TODO task model delete
describe("Task model delete", () => {
  it("should delete task t1", () => {});
  it("should delete delete tasks t1 & t2 for project p1", () => {});
  it("should reject with 'task not found' for task t3 that doesn't exist", () => {});
  it("should reject with 'project not found' for project p3 that doesn't exist", () => {});
});
