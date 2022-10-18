import { Component, createElement, ReactNode } from "react";
import { propsGCService } from "../../../../util/propsGCService";
import { Task } from "../Tasks/Task";


export interface TaskLayerProps extends propsGCService {
  zIndex: number;
}

export class TaskLayer extends Component<TaskLayerProps> {


  renderTasks(): ReactNode[] {
    return this.props.GC_Service.taskController.getTasks().map(value => <Task task={value} timeline={this.props.GC_Service.timeLine}></Task>);
  }

  render() {
    return <div className={"TaskLayer CanvasLayer"} style={{ zIndex: this.props.zIndex }}>
        {this.renderTasks()}
    </div>;
  }
}
