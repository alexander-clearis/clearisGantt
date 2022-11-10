import React, {createElement, FunctionComponent, useState} from "react";
import {DraggableData, Rnd} from "react-rnd";
import {iTimeline} from "../../../../util/ITimeline";
import {useXarrow} from "react-xarrows";
import {iTaskController} from "../../../../util/TaskController";
import {renderTaskState} from "../TimeScale/TaskLayer";
import {DraggableEvent} from "react-draggable";


export interface TaskProps {
    defaultState: renderTaskState;
    taskController: iTaskController
    timeline: iTimeline;
    onToggleChildren: () => void;
}

type posAndWidthState = {
    x: number,
    width: number
}

//TASK VIEW
export const TaskView: FunctionComponent<TaskProps> = (props) => {
    const updateArrow = useXarrow();
    const elemID = "Task-A-" + props.defaultState.task.getID();
    const getOriginalX = props.timeline.relativePosistion(props.defaultState.task.getStart());
    const getOriginalWidth = props.timeline.lengthOnTimeLine(props.defaultState.task.getStart(), props.defaultState.task.getEnd());
    const rndRef = React.useRef<Rnd>(null);

    const [posAndWidth] = useState<posAndWidthState>({width: getOriginalWidth, x: getOriginalX});

    const getDefault = (): { x: number, y: number, width: number | string, height: number | string } => {
        return {
            x: posAndWidth.x,
            y: 0,
            width: posAndWidth.width,
            height: "100%"
        }
    }

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
        snapOnDrag(data);
    }

    const snapOnDrag = (data: DraggableData): void => {
        if (rndRef) {
            rndRef.current?.updatePosition({x: props.timeline.snapToScale(data.x), y: 0})
        }
    }



    return <div className={"TaskBounds"}>

        <Rnd className={"TaskWrapper"}
             bounds={"parent"}
             enableResizing={{left: true, right: true}}
             default={getDefault()}
             onResize={updateArrow}
             onDrag={(): void => {
                 updateArrow();
             }}
             onDragStop={(e, data): void => {
                 updateArrow();
                 onDragStop(e, data)
             }}
             onResizeStop={updateArrow}
             ref={rndRef}

        >
            <div id={elemID} className={"TaskContainer bg-primary"}>
                <p onClick={toggleChildren}>{props.defaultState.task.getName()}</p>
                <span style={{border: "1px solid red"}}>A</span>
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
