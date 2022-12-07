import {iTaskModel} from "../model/TaskModel";
import {iTaskViewWrapper, TaskViewWrapper} from "../view/content/TaksViewWrapper";
import {iNodeController, NodeController} from "./NodeController";

interface iTaskController extends NodeController<iTaskModel, iTaskViewWrapper> {

}

export class TaskController extends NodeController<iTaskModel, TaskViewWrapper> implements iTaskController {

    constructor(nodeModel: iTaskModel, childControllers?: iNodeController[]) {
        super(nodeModel, childControllers);
    }

}
