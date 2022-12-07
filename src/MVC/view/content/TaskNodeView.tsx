import {MaxBoundsClearis, NodeViewSize} from "../../../util/ExtraTypes";
import React, {createElement} from "react";
import {DraggableData, ResizableDelta, Rnd} from "react-rnd";
import {useXarrow} from "react-xarrows";
import {ResizeDirection} from "re-resizable";


export interface TaskViewProps {
    nodeSize: NodeViewSize
    name: string
    anchorID: string
    onSizeUpdate: (size: NodeViewSize) => void
    getMaxBounds: () => MaxBoundsClearis
    timelineLength: number;
    dayPixelLength: number;
    onClick: () => void;
}

export const TaskNodeView = (props: TaskViewProps) => {

    const updateArrows = useXarrow();
    const RND_WrapperRef: React.RefObject<Rnd> = React.createRef<Rnd>()

    // @ts-ignore
    let maxBounds = props.getMaxBounds();

    const updateBoundsForDragging = () => {
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
            console.log(RND_WrapperRef.current?.state)
        })
    }

    const calculateMaxWidth = (dir: ResizeDirection): number => {
        const currentSize = props.nodeSize

        return (dir === "left") ? (currentSize.x - (maxBounds.StartMinL ?? 0)) + currentSize.width : ((maxBounds.EndMaxR ?? props.timelineLength) - currentSize.x);

    }
    const setMaxBoundsResizeMaxWidth = (dir: ResizeDirection) => {
        // const currentSize = props.nodeSize

        RND_WrapperRef.current?.setState((prevState) => {
            return {
                // ...prevState, maxWidth: calculateMaxWidth(dir), bounds: {left: maxBounds.StartMaxL ?? 0, right: maxBounds.EndMinR ?? props.timelineLength, top: 0, bottom: 0}
                ...prevState,
                maxWidth: calculateMaxWidth(dir),
                bounds: {
                    ...prevState.bounds,
                    left: 200,
                    right: (maxBounds.EndMaxR ?? props.timelineLength) - props.nodeSize.width
                }
            }
        }, () => {
        })
    }


    const onDragStop = async (data: DraggableData) => {
        props.onSizeUpdate({x: Math.round(data.x), width: props.nodeSize.width})
    }

    const useOnResizeBounds = (dir: ResizeDirection, delta: ResizableDelta): void => {
        if (dir === "left") {
            if (maxBounds.StartMaxL && (props.nodeSize.x - delta.width) >= maxBounds.StartMaxL) {
                RND_WrapperRef.current?.resizable?.setState({width: (props.nodeSize.width + props.nodeSize.x) - maxBounds.StartMaxL})
                RND_WrapperRef.current?.updatePosition({x: maxBounds.StartMaxL, y: 0})
            }
        } else if (dir === "right") {
            if (maxBounds.EndMinR && (props.nodeSize.x + props.nodeSize.width + delta.width) <= maxBounds.EndMinR) {
                RND_WrapperRef.current?.resizable?.setState({width: maxBounds.EndMinR - props.nodeSize.x})
                RND_WrapperRef.current?.updatePosition({x: props.nodeSize.x, y: 0})

            }
        }
    }
    // onDragStart: (startEnd: StartEndClearis) => void;
    // onDrag:  (startEnd: StartEndClearis) => void;
    // onDragStop:  (startEnd: StartEndClearis) => void

    return <div className={"NodeBounds"}>
        <Rnd className={"TaskWrapper"}
             ref={RND_WrapperRef}
             bounds={"parent"}
             enableResizing={{left: true, right: true, top: false, bottom: false}}
             size={{width: props.nodeSize.width, height: "100%"}}
             position={{x: props.nodeSize.x, y: 0}}
             onClick={props.onClick}
             dragAxis={"x"}
             minWidth={props.dayPixelLength}
             onDragStart={() => {
                 updateBoundsForDragging();
                 //     //    todo: use snap helper
                 // updateArrows()

             }}
             onDrag={(_e, _data) => {
                 setMaxBoundsDrag();
                 // forceBoundsOnDrag(_data);
                 // todo: updateSnapHelper
                 //     updateArrows()
             }}

             onDragStop={(_e, _data) => {
                 // forceBoundsOnDrag(data);
                 onDragStop(_data);

                 updateArrows()
             }}

             onResizeStart={(_e, dir) => {
                 setMaxBoundsResizeMaxWidth(dir);
             }
             }
             onResize={(_e, _dir, _elementRef, _delta, _position) => {
                 useOnResizeBounds(_dir, _delta);
             }

             }
             onResizeStop={(_e, _dir, _elementRef, _delta) => {
                 useOnResizeBounds(_dir, _delta);
             }
             }


        >
            <div id={props.anchorID} className={"TaskContainer bg-primary"}>
                <p>{props.name}</p>
                <p>x = {props.nodeSize.x}</p>
                <p>width = {props.nodeSize.width}</p>
            </div>
        </Rnd>
    </div>
}
