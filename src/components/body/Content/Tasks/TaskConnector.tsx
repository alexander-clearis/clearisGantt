import {Component} from "react";
import {TaskConnectionBase} from "../../../../util/TaskConnectionBase";

export interface TaskConnectorProps {
    taskConnection: TaskConnectionBase;
}

export class TaskConnector extends Component<TaskConnectorProps> {


    render() {
        console.log("arrow")
        return null;
    }
}