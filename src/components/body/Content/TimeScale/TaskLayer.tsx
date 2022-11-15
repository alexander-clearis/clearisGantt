import {createElement, Fragment, FunctionComponent, ReactNode, useReducer, useState} from "react";
import {propsGCService} from "../../../../util/propsGCService";
import {TaskView} from "../Tasks/TaskView";
import {Xwrapper} from "react-xarrows";
import {iTask} from "../../../../util/TaskModel";
import {TaskConnectorParentcChild} from "../Tasks/TaskConnectorParentcChild";
import {TaskConnectionBase} from "../../../../util/TaskConnectionBase";
import {TimeMarker} from "./TimeMarker";
import {SnapPoint, SnapType} from "../../../../util/FriendlyTimeline";

export interface TaskLayerProps extends propsGCService {
    zIndex: number;
    SnapHelper: TimeMarker;
}

export interface renderTreeState {
    renderTaskStateTree: renderTaskState[];
}

export type renderTaskState = {
    display: boolean,
    task: iTask,
    children: renderTaskState[] | undefined;
    displayChildren: boolean;
}

export const TaskLayer: FunctionComponent<TaskLayerProps> = (props) => {


    const renderSnapHelper = (): void => {
        props.SnapHelper.display(true);
    }
    const updateSnapHelper = (snappoint: SnapPoint): void => {
        props.SnapHelper.changePos(snappoint.snapOn().position);
    }
    const removeSnapHelper = (): void => {
        // props.SnapHelper.display(false);
    }

    function generateRenderTaskState(task: iTask, display: boolean): renderTaskState {
        return {
            display: display,
            task: task,
            displayChildren: false,
            children: task.getChildren()?.map(value => generateRenderTaskState(value, false)).sort((t1, t2) => {
                if (t1.task.getStart().getTime() > t2.task.getStart().getTime()) {
                    return 1
                } else if (t1.task.getStart().getTime() < t2.task.getStart().getTime()) {
                    return -1
                }
                return 0
            })
        }
    }

    function initStateTree(): renderTaskState[] {
        const renderableTasks = props.GC_Service.taskController().getAllTasks().filter(value =>
            value.getParent() == undefined
        ).sort((t1, t2) => {
            if (t1.getStart().getTime() > t2.getStart().getTime()) {
                return 1
            } else if (t1.getStart().getTime() < t2.getStart().getTime()) {
                return -1
            }
            return 0
        });
        const renderTaskStateTree: renderTaskState[] = [];
        for (let i = 0; i < renderableTasks.length; i++) {
            renderTaskStateTree.push(generateRenderTaskState(renderableTasks[i], true))
        }
        return renderTaskStateTree;
    }

    // @ts-ignore
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const [taskLayerState, setTaskLayerState] = useState<renderTreeState>({renderTaskStateTree: initStateTree()})
    const toggleChildren = (): void => {
        forceUpdate()
        setTaskLayerState(taskLayerState)
    }
    // je roept updateTaskLayerTree aan.
    // die vul je met geupdate tree.


    function renderTasks(): ReactNode[] {
        return taskLayerState.renderTaskStateTree.map(value => renderTaskTreeMember(value));
    }

    function renderParentChildConnections(parent: renderTaskState): ReactNode [] {
        const r: ReactNode[] = [];
        if (parent.display && parent.displayChildren) {
            parent.children?.forEach(item => {
                r.push(<TaskConnectorParentcChild taskConnection={new TaskConnectionBase(parent.task, item.task)}/>);
            })
        }
        return r;
    }

    function renderTaskTreeMember(task: renderTaskState): ReactNode {
        const self = <TaskView defaultState={task} taskController={props.GC_Service.taskController()}
                               timeline={props.GC_Service.timeLine()} onToggleChildren={toggleChildren}
                               showSnapHelper={renderSnapHelper}
                               updateSnapHelper={updateSnapHelper}
                               hideSnapHelper={removeSnapHelper}

        />;
        const children = renderTaskTreeMemberChildren(task);
        const TaskConnections: ReactNode = renderParentChildConnections(task)
        if (children.length > 0) {
            for (let i = 0; i < children.length; i++) {

            }
        }
        return <Fragment>
            {self}
            {TaskConnections}
            {children}
        </Fragment>
    }

    function renderTaskTreeMemberChildren(taskTreeMember: renderTaskState): ReactNode[] {
        const r: ReactNode[] = [];
        if (taskTreeMember.display && taskTreeMember.displayChildren) {
            if (taskTreeMember.children) {
                for (let i = 0; i < taskTreeMember.children.length; i++) {
                    r.push(renderTaskTreeMember(taskTreeMember.children[i]))

                }
            }
        }
        return r
    }


    return <div className={"TaskLayer CanvasLayer"} style={{zIndex: props.zIndex}}>
        <Xwrapper>
            {renderTasks()}
            {/* {this.renderConnections()} */}

            <button onClick={() => {updateSnapHelper(new SnapPoint(SnapType.Interval, {position: props.GC_Service.timeLine().relativePosition(new Date()), date: new Date()}))}}> test </button>
        </Xwrapper>
    </div>;
}