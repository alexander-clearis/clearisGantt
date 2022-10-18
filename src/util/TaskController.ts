import { iTask, mockTask } from "./Task";

export interface iTaskController {
  getTasks(): iTask[];

  getTask(id: string): iTask | undefined;

}

export class mockTaskController implements iTaskController {
  private tasks: iTask [] = [
    new mockTask("TAAK UNO", new Date(2019, 3, 6), new Date(2019, 4, 2)),
    new mockTask("TAAK DOS", new Date(2019, 4, 18), new Date(2020, 0, 10)),

    // new mockTask("TAAK TRES", new Date(2020, 4, 1), new Date(2020, 10, 23),
    //   [
    //     new mockTask("T", new Date(2020, 4, 5), new Date(2020, 5, 12)),
    //       new mockTask("R", new Date(2020, 5, 16), new Date(2020, 7, 26)),
    //         new mockTask("E", new Date(2020, 7, 19), new Date(2020, 8, 15)),
    //           new mockTask("S", new Date(2020, 8, 1), new Date(2020, 10, 20)),
    //   ]
    // ),

    new mockTask("TAAK QUATRO", new Date(2019, 6, 2), new Date(2019, 8, 2))
  ];


  getTask(id: string): iTask | undefined {
    return this.tasks.find(value => value.name === id);
  }

  getTasks(): iTask[] {
    return this.tasks;
  }


}