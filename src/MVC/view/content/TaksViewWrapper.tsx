import {createElement} from "react";
import {TaskNodeView} from "./TaskNodeView";
import {iNodeViewWrapper, NodeViewWrapperProps, NodeViewWrapperState} from "./__viewNode";
import {NodeViewWrapper} from "./NodeViewWrapper";
import {timeXvalue} from "../../../util/ExtraTypes";
import {ResizeDirection} from "re-resizable";

export interface TaskViewWrapperProps extends NodeViewWrapperProps {
    updateOnResize: (newStart?: Date, newEnd?: Date) => void;
}

export interface TaskViewWrapperState extends NodeViewWrapperState {

}

export interface iTaskViewWrapper extends NodeViewWrapper<TaskViewWrapperProps, TaskViewWrapperState>, iNodeViewWrapper {

}

export class TaskViewWrapper extends NodeViewWrapper<TaskViewWrapperProps, TaskViewWrapperState> implements iTaskViewWrapper {

    constructor(props: TaskViewWrapperProps) {
        super(props);
        this.state = {
            display: this.props.display,
            displayChildren: this.props.displayChildren,
            deltaShift: 0,
            nodeSize: {
                x: this.props.size.start,
                width: this.props.size.end - this.props.size.start
            }
        }
    }


    private onResizeStop = (_dir: ResizeDirection, _timeXvalue: timeXvalue) => {
        this.props.updateOnResize((_dir === "left")? _timeXvalue.date : undefined, (_dir === "right")? _timeXvalue.date : undefined)

    }

    protected renderNode(): React.ReactNode {
        return <TaskNodeView name={this.props.name} anchorID={this.anchorID} nodeSize={this.getNodeSize()}
                             getMaxBounds={this.props.getMaxBounds}
                             timelineLength={this.props.timeLineLength} dayPixelLength={this.props.dayPixelLength}
                             onClick={this.bindDisplayChildren}
                             onDrag={this.onDrag}
                             onDragStop={this.onDragStop}
                             onResizeStop={this.onResizeStop}
                             useSnapHelper={this.props.snapController}

        />;
    }
}
