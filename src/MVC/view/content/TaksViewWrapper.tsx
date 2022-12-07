import {Component, createElement} from "react";
import {NodeViewSize, StartEndClearis} from "../../../util/ExtraTypes";
import {TaskNodeView} from "./TaskNodeView";
import {iNodeViewWrapper, NodeViewWrapperProps, NodeViewWrapperState} from "./__viewNode";

export interface TaskViewWrapperProps extends NodeViewWrapperProps {

}

export interface TaskViewWrapperState extends NodeViewWrapperState {

}

export interface iTaskViewWrapper extends Component<TaskViewWrapperProps, TaskViewWrapperState>, iNodeViewWrapper {

}

export class TaskViewWrapper extends Component<TaskViewWrapperProps, TaskViewWrapperState> implements iTaskViewWrapper {
    private readonly anchorID = "NodeAnchor-" + this.props.id;

    constructor(props: TaskViewWrapperProps) {
        super(props);
        this.state = {
            display: this.props.display,
            displayChildren: this.props.displayChildren,
            nodeSize: {
                x: this.props.size.start,
                width: this.props.size.end - this.props.size.start
            }
        }
    }

    public getStartEnd(): StartEndClearis {
        return {
            start: this.state.nodeSize.x,
            end: this.state.nodeSize.x + this.state.nodeSize.width
        }
    }

    public getAnchorID(): string {
        return this.anchorID
    }


    /* Should re-render TaskNode */
    public updateSize(size: StartEndClearis) {
        this.setState({
            nodeSize: {
                x: size.start,
                width: size.end - size.start
            }
        })
    }

    public onNodeChange = (size: NodeViewSize): void => {
        console.log("Taskwrapper: DOORSCHIETEN NAAR MODEL! ", this.props.id, " ", this.props.name, " has a new size. ", size);
    }

    display(value: boolean): void {
        this.setState({display: value})
    }


    bindDisplayChildren = (): void => {
        this.setState((prevState) => {
            return {
                ...prevState, displayChildren: !prevState.displayChildren
            }
        }, () => {
            this.props.bindDisplayChildren(this.state.displayChildren);
        })
    }

    render() {
        if (this.state.display) {
            return <TaskNodeView name={this.props.name} anchorID={this.anchorID} nodeSize={this.state.nodeSize}
                                 onSizeUpdate={this.onNodeChange} getMaxBounds={this.props.getMaxBounds} timelineLength={this.props.timeLineLength} dayPixelLength={this.props.dayPixelLength}
                                 onClick={this.bindDisplayChildren}

            />
        }
        return null;
    }
}