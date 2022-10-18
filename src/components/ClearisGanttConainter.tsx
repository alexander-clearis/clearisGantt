import { Component, ReactNode, createElement } from "react";
import { ChartHeader } from "./header/ChartHeader";
import { ChartBody } from "./body/ChartBody";
import { propsGCService } from "../util/propsGCService";

export interface ClearisGanttContainerProps extends propsGCService {
}

export class ClearisGanttConainter extends Component<ClearisGanttContainerProps> {
  render(): ReactNode {
    return (
      <div className="GanttLayout mx-groupbox w-100 h-100">
          <ChartHeader GC_Service={this.props.GC_Service}></ChartHeader>
          <ChartBody GC_Service={this.props.GC_Service}></ChartBody>
      </div>
    );
  }
}
