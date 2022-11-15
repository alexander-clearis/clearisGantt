import {Component, createElement} from "react";
import {propsGCService} from "../../util/propsGCService";
import {TimeScaleHeader} from "./Content/TimeScale/TimeScaleHeader";
import {iTimeline} from "../../util/ITimeline";
import {TaskScaleCanvas} from "./Content/TaskScaleCanvas";
import {TaskLayer} from "./Content/TimeScale/TaskLayer";
import {TimeMarker} from "./Content/TimeScale/TimeMarker";
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

    private SnapHelper = new TimeMarker({positionOnTimeLine: 0,  display: true, className: "SnapHelper"});




    render() {


        return <div className={"ChartContent"}>
            <TimeScaleHeader timeLine={this.state.timeLine}/>

            <div className={"CanvasContainer"}>
                <div className={"Canvas"} style={{width: this.props.GC_Service.timeLine().timelinePixelLength()}}>
                    <TaskScaleCanvas timeline={this.props.GC_Service.timeLine()}> </TaskScaleCanvas>
                    {this.SnapHelper.render()}
                    <TaskLayer zIndex={2} GC_Service={this.props.GC_Service} SnapHelper={this.SnapHelper}/>
                </div>
            </div>
        </div>;
    }
}