import {Component, ReactNode, createElement} from "react";
import {ChartHeader} from "../header/ChartHeader";
import {iGanttController} from "../../controller/ClearisGanttController";
import {ChartContent} from "../content/ChartContent";

export interface ClearisGanttContainerProps {
    GanttController: iGanttController
}

export class ClearsGanttContainer extends Component<ClearisGanttContainerProps> {


    render(): ReactNode {
        return (
            <div className="GanttLayout mx-groupbox w-100 h-100">
                <ChartHeader title={this.props.GanttController.getTitle()}
                             selectScaleControlsProps={{

                                 onSelect: this.props.GanttController.setScale,
                                 scaleModes: this.props.GanttController.getAvailableScales(),
                                 default: this.props.GanttController.getDefaultScale()
                             }}
                ></ChartHeader>
                <ChartContent timeline={this.props.GanttController.getTimeline()}
                              ref={this.props.GanttController.chartContentRef()}
                              nodes={this.props.GanttController.getNodes()}
                              snapController={this.props.GanttController.getSnapController()}
                />
            </div>
        );
    }
}
