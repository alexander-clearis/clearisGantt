import React, {RefObject} from "react";
import {iNodeViewWrapper} from "../view/content/__viewNode";
import {iGanttNode} from "../model/TaskModel";
import {MaxBoundsClearis, StartEndClearis} from "../../util/ExtraTypes";

export interface iNodeController {
    getID(): string;

    getName(): string;

    getStart(): Date;

    getEnd(): Date;

    addParent(parent: iNodeController): void;

    getParent(): iNodeController | undefined;

    getChildren(): iNodeController[] | undefined;

    getAnchorID(): string;

    bindDisplayChildren: (value: boolean) => void

    display(): boolean;

    setDisplay(value: boolean): void;

    displayChildren(): boolean;

    getStartEndView(): StartEndClearis | undefined

    getMaxBounds(): MaxBoundsClearis;

    getViewRef(): RefObject<iNodeViewWrapper>
}

export abstract class NodeController<M extends iGanttNode, V extends iNodeViewWrapper> implements iNodeController {
    protected nodeModel: M;
    protected nodeView: React.RefObject<V> = React.createRef<V>();
    protected parent: iNodeController | undefined
    protected children: iNodeController[] | undefined

    protected _display: boolean = true
    protected _displayChildren: boolean = false;


    constructor(nodeModel: M, children?: iNodeController[]) {
        this.nodeModel = nodeModel;
        this.children = children;
        this.children?.sort((a, b) => a.getStart().valueOf() < b.getStart().valueOf() ? -1 : a.getStart().valueOf() > b.getStart().valueOf() ? 1 : 0);
        this.children?.forEach(child => {
            child.addParent(this)
            child.setDisplay(this._displayChildren)
        })
    }

    getAnchorID(): string {
        return this.nodeView.current?.getAnchorID() ?? "UNDEFINED REF";
    }

    addParent(parent: iNodeController) {
        this.parent = parent;
    }

    getParent(): iNodeController | undefined {
        return this.parent;
    }

    getChildren(): iNodeController[] | undefined {
        return this.children;
    }

    display(): boolean {
        return this._display;
    }

    setDisplay(value: boolean): void {
        if (this._display != value) {
            this._display = value;
            this.nodeView.current?.display(value);

            if (value === true && this._displayChildren === true) {
                this.children?.forEach(child => child.setDisplay(true))
            }
            if (value === false) {
                this.children?.forEach(child => child.setDisplay(false))
            }
        }
    }


    displayChildren(): boolean {
        return this._displayChildren;
    }

    bindDisplayChildren = (value: boolean): void => {
        if (value != this._displayChildren) {
            this._displayChildren = value;
            this.children?.forEach(child => child.setDisplay(value))
        }
    }

    getStartEndView(): StartEndClearis | undefined {
        return this.nodeView.current?.getStartEnd()
    }

    getMaxBounds = (): MaxBoundsClearis => {
        const parentStartEnd = this.parent?.getStartEndView();
        const firstChild = this.children?.[0].getStartEndView();
        const last = this.children?.[this.children?.length - 1].getStartEndView();
        return {
            StartMinL: parentStartEnd?.start,
            StartMaxL: firstChild?.start,
            EndMinR: last?.end,
            EndMaxR: parentStartEnd?.end
        }
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

    getViewRef(): RefObject<V> {
        return this.nodeView;
    };
}

