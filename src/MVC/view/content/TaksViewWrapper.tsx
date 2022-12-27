    import React, {createElement, Fragment} from "react";
import {TaskNodeView} from "./TaskNodeView";
import {iNodeViewWrapper, NodeViewWrapperProps, NodeViewWrapperState} from "./__viewNode";
import {NodeViewWrapper} from "./NodeViewWrapper";
import {ResizeDirection} from "re-resizable";
import {timeXvalue} from "../../../util/ExtraTypes";
import {iNodeController} from "../../controller/NodeController";

export interface TaskViewWrapperProps extends NodeViewWrapperProps {
    updateOnResize: (newStart?: Date, newEnd?: Date) => void;
    getFirstChild: () => iNodeController | undefined
    getLastChild: () => iNodeController | undefined
    color?: string
}

export interface TaskViewWrapperState extends NodeViewWrapperState {
    timelineLength: number
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
            },
            timelineLength: this.props.timeLineLength
        }

    }


    componentDidUpdate(prevProps:Readonly<TaskViewWrapperProps>) {
        super.componentDidUpdate(prevProps);
        if(this.state.timelineLength != this.props.timeLineLength) {
            this.setState({timelineLength: this.props.timeLineLength})
        }
    }

    private onResizeStop = (_dir: ResizeDirection, timeXvalue: timeXvalue) => {

        if ((_dir === "left")) {
            const firstChild = this.props.getFirstChild();
            if ((firstChild && firstChild.getStartEndView()?.start) && timeXvalue.x >= firstChild.getStartEndView()!.start) {
                    this.props.updateOnResize(new Date(firstChild.getStart()))
            } else if (timeXvalue.x >= (this.state.nodeSize.x + this.state.nodeSize.width)) {
                this.props.updateOnResize(new Date(timeXvalue.date.valueOf() - (1000 * 3600 * 24)))
            } else {
                this.props.updateOnResize(timeXvalue.date)
            }

        } else {
            const lastChild = this.props.getLastChild();

            if ((lastChild && lastChild.getStartEndView()?.end) && timeXvalue.x <= lastChild.getStartEndView()!.end) {
                    this.props.updateOnResize(undefined, new Date(lastChild.getEnd()))
            } else if (timeXvalue.x <= this.state.nodeSize.x) {
                this.props.updateOnResize(undefined, new Date(timeXvalue.date.valueOf() + (1000 * 3600 * 24)))
            }else {
                this.props.updateOnResize(undefined, timeXvalue.date)

            }
        }
    }


    renderNode():
        React.ReactNode {


        return <Fragment>
            <TaskNodeView name={this.props.name} anchorID={this.anchorID} nodeSize={this.getNodeSize()}
                          getMaxBounds={this.props.getMaxBounds}
                          timelineLength={this.props.timeLineLength} dayPixelLength={this.props.dayPixelLength}
                          onDrag={this.onDrag}
                          onDragStop={this.onDragStop}
                          onResizeStop={this.onResizeStop}
                          useSnapHelper={this.props.snapController}
                          onClick={this.props.onClick}
                          color={this.props.color}
            />

        </Fragment>;
    }
}
