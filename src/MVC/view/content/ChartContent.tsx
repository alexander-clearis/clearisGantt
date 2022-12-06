import {Component, createElement} from "react";
import {ContentScaleBody, ContentScaleHeader} from "./ContentScale";
import {iTimelineController} from "../../controller/TimelineController";
import {iNodeController} from "../../controller/TaskController";
import {NodeContent} from "./NodeContent";

export interface ChartContentProps {
    timeline: iTimelineController
    nodes: iNodeController[];
}
export interface ChartContentState {
    timeline: iTimelineController;
}

export class ChartContent extends Component<ChartContentProps, ChartContentState> {

    constructor(props: Readonly<ChartContentProps> | ChartContentProps) {
        super(props);
        this.state = {
            timeline: this.props.timeline
        }
    }

    public renderNewTimeline(timeline: iTimelineController) {
        this.setState({timeline: timeline})
    }

    render() {
        return (
            <div className={"mx-groupbox-body ChartBody"}>
                <div className={"ChartContent"}>
                    <ContentScaleHeader timeline={this.state.timeline}/>
                    <div className={"CanvasContainer"}>
                        <ContentScaleBody timeline={this.state.timeline}></ContentScaleBody>
                        <NodeContent timeline={this.state.timeline} nodes={this.props.nodes}> </NodeContent>
                    </div>
                </div>
            </div>
        )


    }
}