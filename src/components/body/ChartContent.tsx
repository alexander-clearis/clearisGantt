import { Component, createElement } from "react";
import { propsGCService } from "../../util/propsGCService";
import { TimeScaleHeader } from "./Content/TimeScale/TimeScaleHeader";

import { TaskLayer } from "./Content/TimeScale/TaskLayer";


export interface ChartContentProps extends propsGCService {

}

export class ChartContent extends Component<ChartContentProps> {

  constructor(props: ChartContentProps, context: any) {
    super(props, context);

  }

  render() {
    const mockStart: Date = new Date();
    const mockEnd: Date = new Date();
    const yearDif: number = 5;
    mockEnd.setFullYear(mockStart.getFullYear() + yearDif);
    //RENDER
    return <div className={"ChartContent"}>
      <TimeScaleHeader timeLine={this.props.GC_Service.timeLine} viewLength={this.props.GC_Service.viewLength} />

      <div className={"CanvasContainer"} style={{width: this.props.GC_Service.viewLength + "px", height: this.props.GC_Service.viewHeigth + "px"}}>
        <div className={"Canvas"} style={{width: this.props.GC_Service.viewLength * this.props.GC_Service.timeLine.scalesOnTimeLine()}}>
          <TaskLayer zIndex={1} GC_Service={this.props.GC_Service} />
        </div>
      </div>

    </div>;
  }
}