import {Component, createElement} from "react";
import {propsGCService} from "../../util/propsGCService";
import {TimeScaleHeader} from "./Content/TimeScale/TimeScaleHeader";

import {TaskLayer} from "./Content/TimeScale/TaskLayer";
import {TaskScaleCanvas} from "./Content/TaskScaleCanvas";


export interface ChartContentProps extends propsGCService {

}

export class ChartContent extends Component<ChartContentProps> {

    constructor(props: ChartContentProps, context: any) {
        super(props, context);

    }

    render() {
        const mockStart: Date = new Date();
        const mockEnd: Date = new Date();
        const yearDif: number = 5;
        mockEnd.setFullYear(mockStart.getFullYear() + yearDif);
        //RENDER
        return <div className={"ChartContent"}>
            <TimeScaleHeader timeLine={this.props.GC_Service.timeLine}/>

            <div className={"CanvasContainer"} style={{
                width: this.props.GC_Service.viewLength + "px",
                height: this.props.GC_Service.viewHeight + "px"
            }}>
                <div className={"Canvas"} style={{width: this.props.GC_Service.timeLine.timelinePixelLength()}}>
                    <TaskScaleCanvas timeline={this.props.GC_Service.timeLine}> </TaskScaleCanvas>
                    <TaskLayer zIndex={2} GC_Service={this.props.GC_Service}/>
                </div>
            </div>

        </div>;
    }
}