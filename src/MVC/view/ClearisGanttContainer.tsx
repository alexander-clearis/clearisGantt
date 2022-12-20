import {Component, ReactNode, createElement, Fragment} from "react";
import {iGanttController} from "../controller/ClearisGanttController";
import {ChartContent} from "./content/ChartContent";
import {ClearisGanttControl} from "./controls/ClearisGanttControl";


export interface ClearisGanttContainerProps {
    GanttController: iGanttController
}

export class ClearsGanttContainer extends Component<ClearisGanttContainerProps> {


    render(): ReactNode {
        return (
            <Fragment>
                <div className="GanttContent mx-groupbox w-100 h-100">
                    {/* <div className="mx-groupbox-header"> */}
                    {/* <ChartHeader title={this.props.GanttController.getTitle()}/> */}
                    {/* </div> */}

                    <div className={"mx-groupbox-body ChartBody"}>
                        <ChartContent timeline={this.props.GanttController.getTimeline()}
                                      ref={this.props.GanttController.chartContentRef()}
                                      nodes={this.props.GanttController.getNodes()}
                                      snapController={this.props.GanttController.getSnapController()}
                        />

                    </div>

                </div>
                <div className="GanttContent mx-groupbox w100">

                    <div className={"GanttContentControl form-horizontal mx-groupbox-body"}>
                        <ClearisGanttControl
                            selectScaleControlsProps={{
                                onSelect: this.props.GanttController.setScale,
                                scaleModes: this.props.GanttController.getAvailableScales(),
                                default: this.props.GanttController.getDefaultScale()
                            }}
                            saveCancelNewControlsProps={{
                                onSave: this.props.GanttController.bindSave,
                                onCancel: this.props.GanttController.bindCancel
                            }}
                        />
                    </div>
                </div>

            </Fragment>
        );
    }
}

