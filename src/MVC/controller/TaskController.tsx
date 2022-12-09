import {iTaskModel} from "../model/TaskModel";
import {iTaskViewWrapper, TaskViewWrapper} from "../view/content/TaksViewWrapper";
import {iNodeController, NodeController} from "./NodeController";

interface iTaskController extends NodeController<iTaskModel, iTaskViewWrapper> {
    updateOnResize(newStart?: Date, newEnd?: Date): void
}

export class TaskController extends NodeController<iTaskModel, TaskViewWrapper> implements iTaskController {

    constructor(nodeModel: iTaskModel, childControllers?: iNodeController[]) {
        super(nodeModel, childControllers);
    }

    public updateOnResize = (newStart?: Date, newEnd?: Date): void => {
        this.resizeStartEnd(newStart ?? this.getStart(), newEnd ?? this.getEnd());
    }
    protected resizeStartEnd(newStart: Date, newEnd: Date): void {
        this.nodeModel.setStartEnd(newStart, newEnd);
        this.updateViewStartEnd(newStart, newEnd);
    }
}
