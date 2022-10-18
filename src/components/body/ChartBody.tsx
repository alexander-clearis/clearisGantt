import { Component, createElement, ReactNode } from "react";
import { propsGCService } from "../../util/propsGCService";
// import { CG_TaskList } from "./TaskList/CG_TaskList";
import { ChartContent } from "./ChartContent";

export interface CG_BodyProps extends propsGCService {
}

export class ChartBody extends Component<CG_BodyProps> {
  render(): ReactNode {
    return (
      <div className={"mx-groupbox-body ChartBody"}>
          <ChartContent GC_Service={this.props.GC_Service}></ChartContent>
      </div>
    );
  }
}