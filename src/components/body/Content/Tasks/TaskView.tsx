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

    const findSnapOnDrag = (data: DraggableData): SnapPoint => {
        return props.timeline.findNearestSnap(data.x)
    }
    const snapOnDrag = (data: DraggableData): TimeInterval => {
        //check if pos changed state!
        const currentState = timelineIntervalState;
        console.log(data)
        if (true) {
            const closestToStart = props.timeline.findNearestSnap(data.x);

            const snapPoint = closestToStart.snapOn();
            const newEndTime = new Date(snapPoint.date.valueOf() + currentState.lengthInMs);
            const newTI = new TimeInterval(snapPoint.date, snapPoint.position, newEndTime, currentState.lengthInPixels)
            return newTI;
        }
        return currentState;
    }
    const snapOnResize = (data: ResizeDirection, delta: ResizableDelta): TimeInterval => {
        const currentState = timelineIntervalState;
        if (delta.width !== 0) {
            if (data === "left") {
                const snapTo = findSnapOnResize(data, delta).snapOn();
                const newTI = new TimeInterval(snapTo.date, snapTo.position, currentState.end.date, currentState.end.position - snapTo.position);
                return newTI;
            } else {
                const snapTo = findSnapOnResize(data, delta).snapBefore();
                const newTI = new TimeInterval(currentState.start.date, currentState.start.position, snapTo.date, snapTo.position - currentState.start.position);
                return newTI;
            }
        }
        return currentState;
    }
    const findSnapOnResize = (data: ResizeDirection, delta: ResizableDelta): SnapPoint => {
        const currentState = timelineIntervalState;
        if (data === "left") {

            const closestToLeft = props.timeline.findNearestSnap((currentState.start.position - delta.width));

            if (currentState.end.date.valueOf() <= closestToLeft.snapOn().date.valueOf()) {
                return props.timeline.findNearestSnap(props.timeline.relativePosition(props.timeline.scaleMode().relativeScaleType().dateByIndex(closestToLeft.snapOn().date, -1)
                ))

            }

            return closestToLeft;
        } else {
            const closestToRight = props.timeline.findNearestSnap((currentState.end.position + delta.width));
            if (currentState.start.date.valueOf() >= closestToRight.snapOn().date.valueOf()) {
                console.log(currentState.start.date)
                return props.timeline.findNearestSnap(props.timeline.relativePosition(props.timeline.scaleMode().relativeScaleType().dateByIndex(closestToRight.snapOn().date, 1)
                ))
            }
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

             onResizeStart={
                 (_e, dir): void => {
                     props.updateSnapHelper(findSnapOnResize(dir, {width: 0, height: 0}))
                     props.showSnapHelper()

                 }

             }

             onResize={(_e, dir, _elementRef, delta): void => {

                 props.updateSnapHelper(findSnapOnResize(dir, delta));
                 updateArrow()
             }}
             onResizeStop={(_e, data, _elementRef, delta, position) => {
                 onResizeStop(data, delta, position);
                 props.hideSnapHelper();
                 updateArrow();
             }

             }
             onDragStart={(_e, data): void => {
                 props.updateSnapHelper(findSnapOnDrag(data));
                 props.showSnapHelper()
             }}
             onDrag={(_e, data ): void => {
                 props.updateSnapHelper(findSnapOnDrag(data));
                 updateArrow();
             }}
             onDragStop={(e, data): void => {
                 onDragStop(e, data)
                 props.hideSnapHelper()
                 updateArrow();
             }}
             ref={rndRef}

        >
            <div id={elemID} className={"TaskContainer bg-primary"}>
                <p onClick={toggleChildren}>{props.defaultState.task.getName()}</p>
            </div>

        </Rnd>
    </div>;
}
