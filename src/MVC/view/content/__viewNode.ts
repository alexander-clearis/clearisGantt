import {MaxBoundsClearis, NodeViewSize, StartEndViewClearis} from "../../../util/ExtraTypes";
import {useSnapHelper} from "../../controller/SnapController";
import {iNodeController} from "../../controller/NodeController";

/// GENERIC NODE interface to extend component, and acces trough ref
export interface iNodeViewWrapper {
    getAnchorID(): string;
    // updateStartEnd(startEnd: StartEndClearis): void;
    getStartEnd(): StartEndViewClearis
    updateStartEndDate(start: Date, end: Date): void;
    display(value: boolean): void
    viewShift(delta: number): void
}

//// wrapper component props
export interface NodeViewWrapperProps {
    //TaskControllerProps
    name: string;
    id: string;
    displayChildren: boolean;
    display: boolean;
    size: StartEndViewClearis;
    timeLineLength: number;
    dayPixelLength: number
    getMaxBounds: () => MaxBoundsClearis;
    bindDisplayChildren: (value: boolean) => void;
    previewDragChildren: (delta: number) => void;
    snapController: useSnapHelper
    getChildControllers: () => iNodeController[] | undefined
    dateToNumber: (date1?: Date, date2?: Date) => number;
    numberToDate: (value: number) => Date;
    updateOnDrag: (start: Date) => void
    onClick: () => void
}

//// wrapper comp state
export interface NodeViewWrapperState {
    display: boolean
    displayChildren: boolean
    nodeSize: NodeViewSize
    deltaShift: number;

}

////// GENERIC VIEW
export interface NodeViewState {
    display: boolean;
    size: NodeViewSize

    //Dragging

}




