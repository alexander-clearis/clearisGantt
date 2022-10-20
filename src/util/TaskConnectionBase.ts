import {iTask} from "./TaskModel";
import React from "react";

export class TaskConnectionBase {
    private _parent: iTask;
    private _child: iTask;
    private _ref: React.RefObject<any> = React.createRef();


    constructor(parent: iTask, child: iTask) {
        this._parent = parent;
        this._child = child;
    }

    get parent(): iTask {
        return this._parent;
    }

    get child(): iTask {
        return this._child;
    }

    get ref(): React.RefObject<unknown> {
        return this._ref;
    }
}