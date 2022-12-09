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
    previewDragChildren: (delta: number) => void
    updateOnDrag: (newStart: Date) => void

    updateStartEndDelta(deltaStart: number, deltaEnd: number): void

    display(): boolean;

    setDisplay(value: boolean): void;

    displayChildren(): boolean;

    getStartEndView(): StartEndClearis | undefined

    getMaxBounds: () => MaxBoundsClearis;

    getViewRef(): RefObject<iNodeViewWrapper>

    getFirstChild(): iNodeController | undefined;
    getLastChild(): iNodeController | undefined;

}

export abstract class NodeController<M extends iGanttNode, V extends iNodeViewWrapper> implements iNodeController {
    protected nodeModel: M;
    protected nodeView: React.RefObject<V> = React.createRef<V>();
    protected parent: iNodeController | undefined
    protected children: iNodeController[] | undefined

    protected _display: boolean = true
    protected _displayChildren: boolean = false;


    public static Nodes: iNodeController[] = [];

    public static getNodes() {
        return this.Nodes;
    }

    public static getNode(id: string): iNodeController | undefined {
        return this.Nodes.find(node => node.getID() === id);
    }

    constructor(nodeModel: M, children?: iNodeController[]) {
        NodeController.Nodes.push(this)

        this.nodeModel = nodeModel;
        this.children = children;
        this.children?.sort((a, b) => a.getStart().valueOf() < b.getStart().valueOf() ? -1 : a.getStart().valueOf() > b.getStart().valueOf() ? 1 : 0);
        this.children?.forEach(child => {
            child.addParent(this)
            child.setDisplay(this._displayChildren)
        })
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

    public updateOnDrag = (newStart: Date): void => {
        let delta = newStart.valueOf() - this.getStart().valueOf();
        const newEnd = new Date(this.getEnd().valueOf() + delta);
        this.setStartEnd(newStart, newEnd)
    }


    protected setStartEnd(newStart: Date, newEnd: Date): void {
        const deltaStart = newStart.valueOf() - this.getStart().valueOf();
        const deltaEnd = newEnd.valueOf() - this.getEnd().valueOf();
        this.nodeModel.setStartEnd(newStart, newEnd);
        this.updateViewStartEnd(newStart, newEnd);
        this.updateChildrenStartEnd(deltaStart, deltaEnd);
    }

    // DO NOT CALL ON SELF!
    public updateStartEndDelta(deltaStart: number, deltaEnd: number): void {
        const newStart = new Date(this.getStart().valueOf() + deltaStart);
        const newEnd = new Date(this.getEnd().valueOf() + deltaEnd);

        this.nodeModel.setStartEnd(newStart, newEnd);
        this.updateChildrenStartEnd(deltaStart, deltaEnd);
        this.updateViewStartEnd(newStart, newEnd)
    }

    protected updateViewStartEnd(start: Date, end: Date): void {
        this.nodeView.current?.updateStartEndDate(start, end);
    }

    private updateChildrenStartEnd(deltaStart: number, deltaEnd: number): void {
        this.children?.forEach(child => child.updateStartEndDelta(deltaStart, deltaEnd))
    }


    getAnchorID(): string {
        return this.nodeView.current?.getAnchorID() ?? "UNDEFINED REF";
    }

    public display(): boolean {
        return this._display;
    }

    public setDisplay(value: boolean): void {
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
    previewDragChildren = (delta: number): void => {
        this.children?.forEach(child => {
            if (child.display()) {
                child.getViewRef()?.current?.viewShift(delta);
                child.previewDragChildren(delta);
            }
        })
    }

    getStartEndView(): StartEndClearis | undefined {
        return this.nodeView.current?.getStartEnd()
    }

    getMaxBounds = (): MaxBoundsClearis => {
        const parentStartEnd = this.parent?.getStartEndView();
        const firstChild = this.getFirstChild()?.getStartEndView();
        const last = this.children?.[this.children?.length - 1].getStartEndView();
        return {
            StartMinL: parentStartEnd?.start,
            StartMaxL: firstChild?.start,
            EndMinR: last?.end,
            EndMaxR: parentStartEnd?.end
        }
    }

    getFirstChild = (): iNodeController | undefined => {
        return this.children?.[0]
    }

    getLastChild = (): iNodeController | undefined => {
        return this.children?.[this.children?.length - 1]
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
