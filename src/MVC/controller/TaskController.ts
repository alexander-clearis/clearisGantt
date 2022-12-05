import {iGanttNode, iTaskModel} from "../model/TaskModel";
import {MaxBoundsClearis, StartEndClearis} from "../../util/ExtraTypes";

export interface iNodeController {
    getID(): string;

    getName(): string;

    getStart(): Date;
    getEnd(): Date;

    getParent(): iNodeController | undefined;
}

export class NodeController<T extends iGanttNode> implements iNodeController {
    protected nodeModel: T;
    protected parent: iNodeController | undefined

    constructor(nodeModel: T, parent?: iNodeController) {
        this.nodeModel = nodeModel;
        this.parent = parent
    }

    getParent(): iNodeController| undefined {
        return this.parent;
    }

    getName(): string {
        return this.nodeModel.getID();
    }

    getID(): string {
        return this.nodeModel.getID()
    }

    getStart(): Date {
        return this.nodeModel.getStart();
    }
    getEnd(): Date {
        return this.nodeModel.getStart();
    }


}


export class TaskController extends NodeController<iTaskModel> {
    private static TaskControllers: TaskController[] = [];

    public static GetTaskControllers(): TaskController[] {
        return TaskController.TaskControllers;
    }

    constructor(nodeModel: iTaskModel, parentController: TaskController, childControllers: TaskController[]) {
        super(nodeModel);
        TaskController.TaskControllers.push(this)

        this.parentController = parentController;
        this.childControllers = childControllers;
    }

    private parentController?: TaskController;
    private childControllers: TaskController[];


    public getID(): string {
        return this.nodeModel.getID();
    }

    public getName(): string {
        return this.nodeModel.getName();
    }

    public getStart(): Date {
        return this.nodeModel.getStart();
    }

    public getEnd(): Date {
        return this.nodeModel.getEnd();
    }

    public getChildControllers(): TaskController[] {
        return this.childControllers;
    }

    public getViewStartEnd(): StartEndClearis {
        return {start: 0, end: 0}
    }

    //todo is only in parents, and childs...
    public getMaxBounds(): MaxBoundsClearis {
        let maxSize = this.parentController?.getViewStartEnd();
        let firstChildStartsAt;
        let lastChildEndsAt;
        if (this.childControllers.length > 0) {
            firstChildStartsAt = Math.min(...this.childControllers.map(v => v.getViewStartEnd().start));
            lastChildEndsAt = Math.max(...this.childControllers.map(v => v.getViewStartEnd().end));
        }

        return {
            StartMin: maxSize?.start,
            StartMax: firstChildStartsAt,
            EndMin: lastChildEndsAt,
            EndMax: maxSize?.end
        }
    }
}
