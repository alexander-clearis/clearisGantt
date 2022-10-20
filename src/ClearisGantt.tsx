import { Component, ReactNode, createElement, Fragment } from "react";
import { ClearisGanttConainter } from "./components/ClearisGanttConainter";
import { ClearisGanttContainerProps } from "../typings/ClearisGanttProps";
import "./ui/ClearisGantt.css";
import { ClearisGanttController, iClearisGanttController } from "./util/ClearisGanttController";

export default class ClearisGantt extends Component<ClearisGanttContainerProps> {
  private readonly service: iClearisGanttController;

  constructor(props: ClearisGanttContainerProps, context: any) {
    super(props, context);
    this.service = new ClearisGanttController(this.props.chartTitle.value ? this.props.chartTitle.value : this.props.chartTitle.status, 1500);
  }

  updateChartTitle() {
    this.service.chartTitle = this.props.chartTitle.value ? this.props.chartTitle.value : this.props.chartTitle.status;
  }
  render(): ReactNode {
    this.updateChartTitle();
    return <Fragment>
      <ClearisGanttConainter GC_Service={this.service}></ClearisGanttConainter>
    </Fragment>;
  }
}
