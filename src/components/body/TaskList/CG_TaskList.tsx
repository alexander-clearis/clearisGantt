import { Component, createElement } from "react";
import { CG_TaskListHeader } from "./CG_TaskListHeader";


export class CG_TaskList extends Component<any, any>{

  render() {
    return <div className={"TaskList"}>
      <CG_TaskListHeader />
    </div>;
  }
}