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
            new mockTask(uuid(), "TAAK UNO", new Date(2019, 3, 1), new Date(2019, 4, 1)),
            new mockTask(uuid(), "TAAK DOS", new Date(2019, 4, 18), new Date(2020, 0, 10)),
            new mockTask(parentID, "TAAK TRES", new Date(2019, 4, 1), new Date(2020, 10, 23)),
            new mockTask(uuid(), "TAAK QUATRO", new Date(2019, 6, 2), new Date(2019, 8, 2)),
            new mockTask(childIds[0], "T", new Date(2019, 4, 5), new Date(2020, 5, 12)),
            new mockTask(childIds[1], "R", new Date(2019, 5, 16), new Date(2020, 7, 26)),
            new mockTask(childIds[2], "E", new Date(2019, 7, 19), new Date(2020, 8, 15)),

            new mockTask(childIds[3], "S", new Date(2019, 8, 1), new Date(2020, 10, 20))
        ];
        allTasks[2].addChildren(...[allTasks[4], allTasks[5], allTasks[6], allTasks[7]])
        allTasks[4].setParent(allTasks[2]);
        allTasks[5].setParent(allTasks[2]);
        allTasks[6].setParent(allTasks[2]);
        allTasks[7].setParent(allTasks[2]);
        return allTasks;
    }


}