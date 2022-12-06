import {MaxBoundsClearis, NodeViewSize, StartEndClearis} from "../../../util/ExtraTypes";

/// GENERIC NODE interface to extend component, and acces trough ref
export interface iNodeViewWrapper {
    getAnchorID(): string;
    updateSize(startEnd: StartEndClearis): void;
    getStartEnd(): StartEndClearis
}

//// wrapper component props
export interface NodeViewWrapperProps {
    //TaskControllerProps
    name: string;
    id: string;
    display: boolean;
    size: StartEndClearis;

    //Dragging
     getMaxBounds: () => MaxBoundsClearis
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
    nodeSize: NodeViewSize


}

////// GENERIC VIEW
export interface NodeViewState {
    display: boolean;
    size: NodeViewSize

    //Dragging

}




