import {Component, createElement} from "react";
import {propsGCService} from "../../util/propsGCService";
import {TimeScaleHeader} from "./Content/TimeScale/TimeScaleHeader";
import {Timeline} from "../../util/Timeline";
import {TaskScaleCanvas} from "./Content/TaskScaleCanvas";
import {TaskLayer} from "./Content/TimeScale/TaskLayer";

export interface ChartContentProps extends propsGCService {

}

export interface ChartContentState {
    timeLine: Timeline;
}
export class ChartContent extends Component<ChartContentProps, ChartContentState> {

    constructor(props: ChartContentProps, context: any) {
        super(props, context);

        this.state = {timeLine: this.props.GC_Service.timeLine()};
    }

    newTimeLine(timeline: Timeline){
        console.log("New Timeline!")
        this.setState({timeLine: timeline});
    }


    render() {
        const mockStart: Date = new Date();
        const mockEnd: Date = new Date();
        const yearDif: number = 5;
        mockEnd.setFullYear(mockStart.getFullYear() + yearDif);
        //RENDER
        return <div className={"ChartContent"}>
            <TimeScaleHeader timeLine={this.state.timeLine}/>

            <div className={"CanvasContainer"}>
                <div className={"Canvas"} style={{width: this.state.timeLine.timelinePixelLength()}}>
                    <TaskScaleCanvas timeline={this.state.timeLine}> </TaskScaleCanvas>
                    <TaskLayer zIndex={2} GC_Service={this.props.GC_Service}/>
                </div>
            </div>
        </div>;
    }
}