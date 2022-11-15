import React, {createElement, FunctionComponent, useState} from "react";
import {DraggableData, Position, ResizableDelta, Rnd} from "react-rnd";
import {iTimeline} from "../../../../util/ITimeline";
import {useXarrow} from "react-xarrows";
import {iTaskController} from "../../../../util/TaskController";
import {renderTaskState} from "../TimeScale/TaskLayer";
import {DraggableEvent} from "react-draggable";
import {ResizeDirection} from "re-resizable";
import {SnapPoint, TimeInterval} from "../../../../util/FriendlyTimeline";


export interface TaskProps {
    defaultState: renderTaskState;
    taskController: iTaskController
    timeline: iTimeline;
    onToggleChildren: () => void;

    showSnapHelper: () => void;
    updateSnapHelper: (snappoint: SnapPoint) => void;
    hideSnapHelper: () => void;
}

//TASK VIEW
export const TaskView: FunctionComponent<TaskProps> = (props) => {
    const updateArrow = useXarrow();
    const elemID = "Task-A-" + props.defaultState.task.getID();
    const rndRef = React.useRef<Rnd>(null);

    const getOriginalTimelineInteval = (): TimeInterval => {
        return new TimeInterval(
            props.defaultState.task.getStart(),
            props.timeline.relativePosition(props.defaultState.task.getStart()),
            props.defaultState.task.getEnd(),
            props.timeline.lengthOnTimeLine(props.defaultState.task.getStart(), props.defaultState.task.getEnd())
        );
    }
    const [timelineIntervalState, setTimelineIntervalState] = useState<TimeInterval>(getOriginalTimelineInteval)
    const toggleChildren = (): void => {
        props.defaultState.displayChildren = !props.defaultState.displayChildren;
        setDisplayChildren(props.defaultState, props.defaultState.displayChildren);
        props.onToggleChildren();
    }
    const setDisplayChildren = (state: renderTaskState, display: boolean): void => {
        if (state.children) {
            for (let i = 0; i < state.children.length; i++) {
                state.children[i].display = display;
                setDisplayChildren(state.children[i], display)
            }
        }
    }


    const onDragStop = (_e: DraggableEvent, data: DraggableData): void => {
        setTimelineIntervalState(snapOnDrag(data));
    }
    const onResizeStop = (_data: ResizeDirection, _delta: ResizableDelta, _position: Position): void => {
        setTimelineIntervalState(snapOnResize(_data, _delta))
    }

    const snapOnDrag = (data: DraggableData): TimeInterval => {
        //check if pos changed state!
        const currentState = timelineIntervalState;
        console.log(data)
        if (true) {
            const closestToStart = props.timeline.findNearestSnap(data.x);
            const closestToEnd = props.timeline.findNearestSnap(data.x + currentState.lengthInPixels);
            let deltaStart = closestToStart.position.position - data.x;
            if (deltaStart < 0) {
                deltaStart = deltaStart * -1;
            }
            let deltaEnd = closestToEnd.position.position - (data.x + currentState.lengthInPixels);
            if (deltaEnd < 0) {
                deltaEnd = deltaEnd * -1;
            }

            // if (deltaStart < deltaEnd) {
            const snapPoint = closestToStart.snapOn();
            const newEndTime = new Date(snapPoint.date.valueOf() + currentState.lengthInMs);
            const newTI = new TimeInterval(snapPoint.date, snapPoint.position, newEndTime, currentState.lengthInPixels)
            return newTI;
            // } else {
            //     const snapTo = closestToEnd.snapBefore()
            //     const newStartTime = new Date(snapTo.date.valueOf() - currentState.lengthInMs);
            //     const newTI = new TimeInterval(newStartTime, snapTo.position - currentState.lengthInPixels, snapTo.date, currentState.lengthInPixels)
            //     return newTI;
            // }

        }
        return currentState;
    }
    const snapOnResize = (data: ResizeDirection, delta: ResizableDelta): TimeInterval => {
        const currentState = timelineIntervalState;
        console.log(data, delta)
        if (delta.width !== 0) {
            if (data === "left") {
                const closestToLeft = props.timeline.findNearestSnap((currentState.start.position - delta.width));
                const snapTo = closestToLeft.snapOn();
                if (snapTo.date.valueOf() >= currentState.end.date.valueOf()) {
                    return currentState;
                } // eigenlijk niet, moet naar begin van interval
                const newTI = new TimeInterval(snapTo.date, snapTo.position, currentState.end.date, currentState.end.position - snapTo.position);
                return newTI;
            } else {
                const closestToRight = props.timeline.findNearestSnap((currentState.end.position + delta.width));
                const snapTo = closestToRight.snapBefore();
                if (snapTo.date <= currentState.start.date) {
                    return currentState;
                } // eigenlijk niet, moet naar eind van interval.
                const newTI = new TimeInterval(currentState.start.date, currentState.start.position, snapTo.date, snapTo.position - currentState.start.position);
                return newTI;
            }
            //left is start.
            //right is end.
        }
        return currentState;
    }
    const findSnapOnResize = (data: ResizeDirection, delta: ResizableDelta): SnapPoint => {
        const currentState = timelineIntervalState;
        if (data === "left") {

            const closestToLeft = props.timeline.findNearestSnap((currentState.start.position - delta.width));
            // const snapTo = closestToLeft.snapOn();
            // if (snapTo.date.valueOf() >= currentState.end.date.valueOf()) {
            //     return undefined;
            // }
            // eigenlijk niet, moet naar begin van interval
            return closestToLeft;
        } else {
            const closestToRight = props.timeline.findNearestSnap((currentState.end.position + delta.width));
            // const snapTo = closestToRight.snapBefore();
            // if (snapTo.date <= currentState.start.date) {
            //     return undefined;
            // }
            return closestToRight;
        }
        //left is start.
        //right is end.

    }


    return <div className={"TaskBounds"}>

        <Rnd className={"TaskWrapper"}
             bounds={"parent"}
             enableResizing={{left: true, right: true}}
            //             default={getDefault()}
             size={{width: timelineIntervalState.lengthInPixels, height: "100%"}}
             position={{x: timelineIntervalState.start.position, y: 0}}

             onResizeStart={props.showSnapHelper}

             onResize={(_e, dir, _elementRef, delta): void => {

                 props.updateSnapHelper(findSnapOnResize(dir, delta));
                 updateArrow()
             }}
             onDrag={(): void => {
                 updateArrow();
             }}
             onDragStop={(e, data): void => {
                 onDragStop(e, data)
                 updateArrow();
             }}
             onResizeStop={(_e, data, _elementRef, delta, position) => {
                 onResizeStop(data, delta, position);
                 props.hideSnapHelper();
                 updateArrow();
             }

             }
             ref={rndRef}

        >
            <div id={elemID} className={"TaskContainer bg-primary"}>
                <p onClick={toggleChildren}>{props.defaultState.task.getName()}</p>
            </div>

        </Rnd>
    </div>;


// const returnChildren = (): ReactNode[] => {
//     const r: ReactNode[] = [];
//     const children = props.task.getChildren()
//     if (renderChildren) {
//         if (children) {
//
//             const sortedChildren = children.sort((t1, t2) => {
//                 if (t1.getStart().getTime() > t2.getStart().getTime()) {
//                     return 1
//                 } else if (t1.getStart().getTime() < t2.getStart().getTime()) {
//                     return -1
//                 }
//                 return 0
//             })
//
//             for (let i = 0; i < sortedChildren.length; i++) {
//                 r.push(TaskView({
//                     taskController: props.taskController,
//                     task: sortedChildren[i],
//                     timeline: props.timeline
//                 }))
//             }
//         }
//     }
//
//     return r;
// }

//if display return... else return null
//return the children of the task.
}
