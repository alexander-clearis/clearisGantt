import { Component, ReactNode, createElement } from "react";
import {ChartHeader} from "./ChartHeader";
import {iGanttController} from "../controller/ClearisGanttController";

export interface ClearisGanttContainerProps {
    GanttController: iGanttController
}

export class ClearisGanttConainter extends Component<ClearisGanttContainerProps> {
    render(): ReactNode {
        return (
            <div className="GanttLayout mx-groupbox w-100 h-100">

                <ChartHeader title={this.props.GanttController.getTitle()}
                             selectScaleControlsProps={{
                                 onSelect: this.props.GanttController.setScale,
                                 scaleModes: this.props.GanttController
                             }}
                ></ChartHeader>
            </div>
        );
    }
}
