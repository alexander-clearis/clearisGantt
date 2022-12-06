import {iGanttNode, iTaskModel} from "../model/TaskModel";
import {MaxBoundsClearis} from "../../util/ExtraTypes";
import {iNodeViewWrapper} from "../view/content/__viewNode";
import React from "react";

export interface iNodeController {
    getID(): string;

    getName(): string;

    getStart(): Date;
    getEnd(): Date;

    getParent(): iNodeController | undefined;
    getChildren(): iNodeController[] | undefined;


    getMaxBounds(): MaxBoundsClearis

}

export class NodeController<T extends iGanttNode> implements iNodeController {
    protected nodeModel: T;
    protected nodeView: React.RefObject<iNodeViewWrapper> = React.createRef<iNodeViewWrapper>()
    protected parent: iNodeController | undefined
    protected children: iNodeController[] | undefined

    constructor(nodeModel: T, parent?: iNodeController, children?: iNodeController[]) {
        this.nodeModel = nodeModel;
        this.parent = parent
        this.children = children;
        this.children?.sort((a, b) => a.getStart().valueOf() <b.getStart().valueOf() ? -1 : a.getStart().valueOf() > b.getStart().valueOf() ? 1 : 0);
    }

    getParent(): iNodeController| undefined {
        return this.parent;
    }
    getChildren(): iNodeController[] | undefined{
        return this.children;
    }

    getName(): string {
        return this.nodeModel.getName();
    }

    getID(): string {
        return this.nodeModel.getID()
    }

    getStart(): Date {
        return this.nodeModel.getStart();
    }
    getEnd(): Date {
        return this.nodeModel.getEnd();
    }

    getMaxBounds = (): MaxBoundsClearis => {
        return {
            EndMax: undefined, EndMin: undefined, StartMax: undefined, StartMin: 0
        }
    }
}

interface iTaskController extends NodeController<iTaskModel> {

}
export class TaskController extends NodeController<iTaskModel>implements iTaskController {



    constructor(nodeModel: iTaskModel, parentController?: iNodeController, childControllers?: iNodeController[]) {
        super(nodeModel, parentController, childControllers);
    }


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

    // public getViewStartEnd(): StartEndClearis {
    //     // return {start: 0, end: 0}
    // }


    //todo is only in parents, and childs...
    // public getMaxBounds(): MaxBoundsClearis {
    //     let maxSize = this.parent?.getViewStartEnd();
    //     let firstChildStartsAt;
    //     let lastChildEndsAt;
    //     if (this.childControllers.length > 0) {
    //         firstChildStartsAt = Math.min(...this.childControllers.map(v => v.getViewStartEnd().start));
    //         lastChildEndsAt = Math.max(...this.childControllers.map(v => v.getViewStartEnd().end));
    //     }
    //
    //     return {
    //         StartMin: maxSize?.start,
    //         StartMax: firstChildStartsAt,
    //         EndMin: lastChildEndsAt,
    //         EndMax: maxSize?.end
    //     }
    // }
}
