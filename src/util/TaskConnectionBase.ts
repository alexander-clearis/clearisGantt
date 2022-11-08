import {iTask} from "./TaskModel";
import React from "react";

export interface iTaskConnection {
    getParent(): iTask
    getChild(): iTask
    getRef(): React.RefObject<unknown>
}

export class TaskConnectionBase implements iTaskConnection{
    private _parent: iTask;
    private _child: iTask;
    private _ref: React.RefObject<any> = React.createRef();


    constructor(parent: iTask, child: iTask) {
        this._parent = parent;
        this._child = child;
    }

    getParent(): iTask {
        return this._parent;
    }

    getChild(): iTask {
        return this._child;
    }

    getRef(): React.RefObject<unknown> {
        return this._ref;
    }
}