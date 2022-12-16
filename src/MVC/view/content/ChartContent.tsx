import {Component, createElement} from "react";
import {ContentScaleBody, ContentScaleHeader} from "./ContentScale";
import {iTimelineController} from "../../controller/TimelineController";
import {NodeContent} from "./NodeContent";
import {iNodeController} from "../../controller/NodeController";
import {SnapController} from "../../controller/SnapController";

export interface ChartContentProps {
    timeline: iTimelineController
    nodes: iNodeController[];
    snapController: SnapController;
}
export interface ChartContentState {
    timeline: iTimelineController;
    nodes: iNodeController[];

}

export class ChartContent extends Component<ChartContentProps, ChartContentState> {

    constructor(props: Readonly<ChartContentProps> | ChartContentProps) {
        super(props);
        this.state = {
            timeline: this.props.timeline,
            nodes: this.props.nodes
        }
    }

    public rerenderNodes(nodes: iNodeController[]) {
        this.setState({nodes: nodes})
    }
    public renderNewTimeline(timeline: iTimelineController) {
        this.setState({timeline: timeline})
    }

    render() {
        return (
            <div className={"mx-groupbox-body ChartBody"}>
                <div className={"ChartContent"}>
                    <ContentScaleHeader timeline={this.state.timeline}/>
                    <div className={"ContentContainer"}>
                        <ContentScaleBody timeline={this.state.timeline}></ContentScaleBody>
                        <NodeContent timeline={this.state.timeline} nodes={this.props.nodes} snapController={this.props.snapController}> </NodeContent>
                    </div>
                </div>
            </div>
        )


    }
}