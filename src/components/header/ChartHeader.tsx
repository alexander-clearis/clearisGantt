import { Component, createElement, ReactNode } from "react";
import { ChartTitle } from "./ChartTitle";
import { propsGCService } from "../../util/propsGCService";
import { CG_Controls } from "./CG_Controls";

export interface iChartHeader extends propsGCService {

}

export class ChartHeader extends Component<iChartHeader> {
  constructor(props: iChartHeader, context: any) {
    super(props, context);
  }

  render(): ReactNode {
    return (
      <div className="mx-groupbox-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-6">
              <ChartTitle title={this.props.GC_Service.getChartTitle()}></ChartTitle>
            </div>
            <div className="col-lg-6 col-md-6 col-6">
              <CG_Controls GC_Service={this.props.GC_Service}></CG_Controls>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
