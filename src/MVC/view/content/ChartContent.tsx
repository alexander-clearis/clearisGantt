import React, {Component, createElement} from "react";
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
    scrollDate: Date

}

export class ChartContent extends Component<ChartContentProps, ChartContentState> {
    private ref = React.createRef<HTMLDivElement>();
    constructor(props: Readonly<ChartContentProps> | ChartContentProps) {
        super(props);
        this.state = {
            timeline: this.props.timeline,
            nodes: this.props.nodes,
            scrollDate: this.props.timeline.startDate()
        }
    }

    public rerenderNodes(nodes: iNodeController[]) {
        this.setState({nodes: nodes}, () => {
        })
    }

    public renderNewTimeline(timeline: iTimelineController) {
        this.setState({timeline: timeline, scrollDate: this.getNewScrollDate(timeline.startDate(), timeline.endDate())}, () => {
            this.ref.current?.scrollTo(this.state.timeline.dateToNumber(this.state.scrollDate), this.ref.current.scrollTop)
        })
    }

    public renderNewSetUp(timeline: iTimelineController, nodes: iNodeController[]) {
        this.setState({timeline: timeline, nodes: nodes}, () => {

        })
    }

    private getCurrentScrollDate(): Date {
        return this.state.timeline.numberToDate(this.ref.current?.scrollLeft ?? 0);
    }
    private getNewScrollDate(min: Date, max: Date): Date {
        const current = this.getCurrentScrollDate()
        return (current.valueOf() < min.valueOf()) ? min : (current.valueOf() > max.valueOf()) ? max : current
    }


    render() {
        return (
            <div className={"ChartContent"} ref={this.ref}>

                    <ContentScaleHeader timeline={this.state.timeline}/>

                <div className={"ContentContainer"}>
                    <ContentScaleBody timeline={this.state.timeline}></ContentScaleBody>
                    <NodeContent timeline={this.state.timeline} nodes={this.props.nodes}
                                 snapController={this.props.snapController}> </NodeContent>
                </div>
            </div>
        )
    }
}