import {Component, createElement} from "react";
import {NodeViewSize, StartEndClearis} from "../../util/ExtraTypes";
import {TaskNode} from "./TaskNode";
import {iNodeViewWrapper, NodeViewWrapperProps, NodeViewWrapperState} from "./__viewNode";



export interface TaskViewWrapperProps extends NodeViewWrapperProps {

}
export interface TaskViewWrapperState  extends NodeViewWrapperState {

}

export class TaskViewWrapper extends Component<TaskViewWrapperProps, TaskViewWrapperState> implements iNodeViewWrapper {
    private readonly anchorID = "NodeAnchor-" + this.props.id;

    constructor(props: TaskViewWrapperProps) {
        super(props);
        this.state = {
            display: this.props.display,
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

    public getAnchorID() {
        return this.anchorID
    }


    /* Should re-render TaskNode */
    public updateSize(size: StartEndClearis)  {
        this.setState({
            nodeSize: {
                x: size.start,
                width: size.end - size.start
            }
        })
    }
    public onNodeChange(size: NodeViewSize): void {
        console.log("Taskwrapper: ", this.props.id, " ", this.props.name, " has a new size. ", size);
        //todo snap?
    }


    render() {
        return <TaskNode name={this.props.name} anchorID={this.anchorID} nodeSize={this.state.nodeSize} onSizeUpdate={this.onNodeChange}/>
    }
}