import {MaxBoundsClearis, NodeViewSize, StartEndClearis} from "../../../util/ExtraTypes";

/// GENERIC NODE interface to extend component, and acces trough ref
export interface iNodeViewWrapper {
    getAnchorID(): string;
    updateSize(startEnd: StartEndClearis): void;
    getStartEnd(): StartEndClearis

    display(value: boolean): void
    // displayChildren(value: boolean): void;
    // setDisplay(value: boolean): void;
    // setDisplayChildren(value: boolean): void;
    // display(): boolean;
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


}

////// GENERIC VIEW
export interface NodeViewState {
    display: boolean;
    size: NodeViewSize

    //Dragging

}




