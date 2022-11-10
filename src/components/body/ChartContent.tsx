import {Component, createElement} from "react";
import {propsGCService} from "../../util/propsGCService";
import {TimeScaleHeader} from "./Content/TimeScale/TimeScaleHeader";
import {iTimeline} from "../../util/ITimeline";
import {TaskScaleCanvas} from "./Content/TaskScaleCanvas";
import {FriendlyTimeline} from "../../util/FriendlyTimeline";
// import {TaskLayer} from "./Content/TimeScale/TaskLayer";

export interface ChartContentProps extends propsGCService {

}

export interface ChartContentState {
    timeLine: iTimeline;
}
export class ChartContent extends Component<ChartContentProps, ChartContentState> {

    constructor(props: ChartContentProps, context: any) {
        super(props, context);

        this.state = {timeLine: this.props.GC_Service.timeLine()};
    }

    newTimeLine(timeline: iTimeline){
        console.log("New Timeline!")
        this.setState({timeLine: timeline});
    }


    render() {


        const timeline = this.state.timeLine;
        const friendlyTimeline = new FriendlyTimeline(timeline.scaleMode(), timeline.singleScaleLength(), timeline.startDate(), timeline.endDate())
        return <div className={"ChartContent"}>
            <TimeScaleHeader timeLine={friendlyTimeline}/>

            <div className={"CanvasContainer"}>
                <div className={"Canvas"} style={{width: this.state.timeLine.timelinePixelLength()}}>
                    <TaskScaleCanvas timeline={this.state.timeLine}> </TaskScaleCanvas>
                    {/* <TaskLayer zIndex={2} GC_Service={this.props.GC_Service}/> */}
                </div>
            </div>
        </div>;
    }
}