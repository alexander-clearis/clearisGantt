import {Component, createElement} from "react";
import {iTaskConnection} from "../../../../util/TaskConnectionBase";
import Xarrow from "react-xarrows";

export interface TaskConnectorProps {
    taskConnection: iTaskConnection;
}

export class TaskConnectorParentcChild extends Component<TaskConnectorProps> {

    getStart(): string {
        return "Task-A-" + this.props.taskConnection.getParent().getID();
    }


    getEnd(): string {
        return "Task-A-" + this.props.taskConnection.getChild().getID();
    }

    render() {
        return <Xarrow start={this.getStart()} end={this.getEnd()} startAnchor={"bottom"} endAnchor={"auto"} path={"grid"} />
    }
}