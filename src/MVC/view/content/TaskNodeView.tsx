import {MaxBoundsClearis, NodeViewSize, StartEndClearis, timeXvalue} from "../../../util/ExtraTypes";
import React, {createElement} from "react";
import {DraggableData, ResizableDelta, Rnd} from "react-rnd";
import {ResizeDirection} from "re-resizable";
import {SnapPoint, useSnapHelper} from "../../controller/SnapController";


export interface nodeViewProps {
    nodeSize: NodeViewSize
    name: string
    anchorID: string
    getMaxBounds: () => MaxBoundsClearis
    timelineLength: number;
    dayPixelLength: number;
    useSnapHelper: useSnapHelper;
    onDrag: (newPos: number) => void
    onDragStop: (timeXvalue: timeXvalue) => void

}
export interface TaskViewProps extends nodeViewProps{
    onResizeStop: (dir: ResizeDirection, pos: timeXvalue) => void
}
export const TaskNodeView = (props: TaskViewProps) => {
    const RND_WrapperRef: React.RefObject<Rnd> = React.createRef<Rnd>()

    // @ts-ignore
    let maxBounds = props.getMaxBounds();

    const getBounds = () => {
        maxBounds = props.getMaxBounds()
        setMaxBoundsDrag();
    };
    const setMaxBoundsDrag = () => {
        RND_WrapperRef.current?.setState((prevState) => {
            return {
                ...prevState,
                bounds: {
                    left: maxBounds.StartMinL ?? 0,
                    right: (maxBounds.EndMaxR ?? props.timelineLength) - props.nodeSize.width,
                    top: 0,
                    bottom: 0
                }
            }
        }, () => {
        })
    }

    const calculateMaxWidth = (dir: ResizeDirection): number => {
        const currentSize = props.nodeSize
        return (dir === "left") ? (currentSize.x - (maxBounds.StartMinL ?? 0)) + currentSize.width : ((maxBounds.EndMaxR ?? props.timelineLength) - currentSize.x);
    }
    const setMaxBoundsResize = (dir: ResizeDirection) => {

        RND_WrapperRef.current?.setState((prevState) => {
            return {
                // ...prevState, maxWidth: calculateMaxWidth(dir), bounds: {left: maxBounds.StartMaxL ?? 0, right: maxBounds.EndMinR ?? props.timelineLength, top: 0, bottom: 0}
                ...prevState,
                maxWidth: calculateMaxWidth(dir),
            }
        }, () => {
        })
    }


    const calculateResizeStartEnd = (dir: ResizeDirection, delta?: ResizableDelta): StartEndClearis => {
        if (delta) {
            return (dir === "left") ? {
                start: props.nodeSize.x - delta.width,
                end: props.nodeSize.x + props.nodeSize.width
            } : {
                start: props.nodeSize.x,
                end: props.nodeSize.x + props.nodeSize.width + delta.width
            }
        } else {
            return {
                start: props.nodeSize.x,
                end: props.nodeSize.x + props.nodeSize.width
            }
        }
    }
    const useOnResizeBoundsCorrection = (dir: ResizeDirection, startEnd: StartEndClearis): StartEndClearis => {
        if (dir === "left" && maxBounds.StartMaxL) {
            //check if left out of bounds.
            if (validLeftResize(startEnd.start) === false) {
                RND_WrapperRef.current?.resizable?.setState({width: (props.nodeSize.width + props.nodeSize.x) - maxBounds.StartMaxL})
                RND_WrapperRef.current?.updatePosition({x: maxBounds.StartMaxL, y: 0})
                return {
                    start: maxBounds.StartMaxL,
                    end: startEnd.end
                }
            } else {
                return startEnd;
            }
        } else if (dir === "right" && maxBounds.EndMinR) {
            if (validRightResize(startEnd.end) === false) {
                RND_WrapperRef.current?.resizable?.setState({width: maxBounds.EndMinR - props.nodeSize.x})
                RND_WrapperRef.current?.updatePosition({x: props.nodeSize.x, y: 0})
                return {
                    start: startEnd.start,
                    end: maxBounds.EndMinR
                }
            } else {
                return startEnd
            }
        }
        return startEnd
    }
    const validLeftResize = (x: number): boolean => {
        return !(maxBounds.StartMaxL != undefined && x >= maxBounds.StartMaxL);
    }
    const validRightResize = (x: number): boolean => {
        return !(maxBounds.EndMinR != undefined && x <= maxBounds.EndMinR);
    }

    const closestToSnap = (pos: number, snapPoint: SnapPoint): timeXvalue => {
        const deltaBefore = pos - snapPoint.before.x
        const deltaAfter = snapPoint.after.x - pos
        return (deltaBefore <= deltaAfter) ? snapPoint.before : snapPoint.after;
    }
    const onDragShowSnap = (x: number): void => {
        props.useSnapHelper.showSnapHelper(closestToSnap(x, props.useSnapHelper.getSnapOnDrag(x)).x)
    }


    const onResizeShowSnap = (dir: ResizeDirection, startEnd: StartEndClearis) => {
        const resizePoint = (dir === "left") ? startEnd.start : startEnd.end
        props.useSnapHelper.showSnapHelper(closestToSnap(resizePoint, props.useSnapHelper.getSnapOnDrag(resizePoint)).x)
    }

    const onDragStop = (data: DraggableData): void => {
        props.useSnapHelper.hideHelper()
        props.onDragStop(closestToSnap(data.x, props.useSnapHelper.getSnapOnDrag(data.x)));
    }
    const onResizeStop = (dir: ResizeDirection, startEnd: StartEndClearis): void => {
        const resizePoint = (dir === "left") ? startEnd.start : startEnd.end
        props.onResizeStop(dir, closestToSnap(resizePoint, props.useSnapHelper.getSnapOnDrag(resizePoint)))
        props.useSnapHelper.hideHelper()

    }
    return <div className={"NodeBounds"}>
        <Rnd className={"TaskWrapper"}
             ref={RND_WrapperRef}
             bounds={"parent"}
             enableResizing={{left: true, right: true, top: false, bottom: false}}
             size={{width: props.nodeSize.width, height: "100%"}}
             position={{x: props.nodeSize.x, y: 0}}

             dragAxis={"x"}
             minWidth={props.dayPixelLength}

             onDragStart={(_e, _data) => {
                 getBounds();
                 onDragShowSnap(_data.x);

                 // _e.preventDefault()

             }}
             onDrag={(_e, _data) => {
                 setMaxBoundsDrag();
                 onDragShowSnap(_data.x);
                 props.onDrag(_data.x)
                 _e.preventDefault()

             }}

             onDragStop={(_e, _data) => {
                 onDragStop(_data);
                 // _e.preventDefault()
                 // _e.stopPropagation();
             }}

             onResizeStart={(_e, _dir) => {
                 setMaxBoundsResize(_dir);
                 const newStrartEnd = useOnResizeBoundsCorrection(_dir, calculateResizeStartEnd(_dir));
                 onResizeShowSnap(_dir, newStrartEnd)
             }}
             onResize={(_e, _dir, _elementRef, _delta) => {
                 const newStrartEnd = useOnResizeBoundsCorrection(_dir, calculateResizeStartEnd(_dir, _delta));
                 onResizeShowSnap(_dir, newStrartEnd)
             }}
             onResizeStop={(_e, _dir, _elementRef, _delta) => {
                 const newStartEnd = useOnResizeBoundsCorrection(_dir, calculateResizeStartEnd(_dir, _delta));
                 onResizeStop(_dir, newStartEnd)
             }}
        >

            <div id={props.anchorID} className={"TaskContainer bg-primary"}  draggable={false}

            >
                <p>{props.name}</p>
                <p>x = {props.nodeSize.x}</p>
                <p>width = {props.nodeSize.width}</p>
            </div>
        </Rnd>
    </div>
}
