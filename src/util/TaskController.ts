import {iTask, mockTask} from "./TaskModel";
import {v4 as uuid} from "uuid";

export interface iTaskController {
    getAllTasks(): iTask[];

    getTask(id: string): iTask | undefined;

    getTasks(ids: string[]): iTask[]

}

export abstract class TaskController implements iTaskController {
    protected tasks: iTask[];

    constructor(tasks: iTask[]) {
        this.tasks = tasks;
    }

    getTask(id: string): iTask | undefined {

        return this.tasks.find(value => value.getID() === id);
    }

    getTasks(ids: string[]): iTask[] {
        const r: iTask[] = []
        for (let i = 0; i < ids.length; i++) {
            const c = this.getTask(ids[i]);
            if (c) {
                r.push(c)
            }
        }
        return r;
    }

    getAllTasks(): iTask[] {
        return this.tasks;
    }

}

export class mockTaskController extends TaskController implements iTaskController {
    constructor() {
        super(mockTaskController.generateMockTask());
    }

    private static generateMockTask(): iTask[] {

        const parentID = uuid();
        const childIds = [uuid(), uuid(), uuid(), uuid()];
        const allTasks = [
            new mockTask(uuid(), "TAAK UNO", new Date(2019, 0, 1), new Date(2019, 1, 1)),
            new mockTask(uuid(), "TAAK DOS", new Date(2019, 0, 1), new Date(2019, 1, 1)),
            new mockTask(parentID, "TAAK TRES", new Date(2019, 1, 1), new Date(2019, 6, 1)),
            new mockTask(uuid(), "TAAK QUATRO", new Date(2019, 7, 12), new Date(2020, 1, 1)),
            new mockTask(childIds[0], "T", new Date(2019, 0, 1), new Date(2019, 1, 1)),
            new mockTask(childIds[1], "R", new Date(2019, 0, 1), new Date(2019, 1, 1)),
            new mockTask(childIds[2], "E", new Date(2019, 0, 1), new Date(2019, 1, 1)),

            new mockTask(childIds[3], "S", new Date(2019, 0, 1), new Date(2019, 1, 1))
        ];
        allTasks[2].addChildren(...[allTasks[4], allTasks[5], allTasks[6], allTasks[7]])
        allTasks[4].setParent(allTasks[2]);
        allTasks[5].setParent(allTasks[2]);
        allTasks[6].setParent(allTasks[2]);
        allTasks[7].setParent(allTasks[2]);
        return allTasks;
    }


}