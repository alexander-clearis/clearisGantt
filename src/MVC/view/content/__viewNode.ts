import {MaxBoundsClearis, NodeViewSize, StartEndClearis} from "../../../util/ExtraTypes";
import {useSnapHelper} from "../../controller/SnapController";

/// GENERIC NODE interface to extend component, and acces trough ref
export interface iNodeViewWrapper {
    getAnchorID(): string;
    // updateStartEnd(startEnd: StartEndClearis): void;
    getStartEnd(): StartEndClearis
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
    size: StartEndClearis;
    timeLineLength: number;
    dayPixelLength: number
    getMaxBounds: () => MaxBoundsClearis;
    bindDisplayChildren: (value: boolean) => void;
    previewDragChildren: (delta: number) => void;
    snapController: useSnapHelper

    dateToNumber: (date1?: Date, date2?: Date) => number;
    numberToDate: (value: number) => Date;
    updateOnDrag: (start: Date) => void

    //Dragging
    // onDragStart: (startEnd: StartEndClearis) => void;
    // onDrag:  (startEnd: StartEndClearis) => void;
    // onDragStop:  (startEnd: StartEndClearis) => void


    //todo:
    // getMaxSize: () => {start: number, end: number}
    // onDragMethods...
    // update methods...

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




