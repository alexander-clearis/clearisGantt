import {Component, createElement} from "react";
import {SaveCancelNewControls, SaveCancelNewControlsProps} from "./SaveCancelNewControls";
import {SelectScaleControlProps, SelectScaleControls} from "./SelectScaleControls";

export interface ClearisGanttControlProps {
    saveCancelNewControlsProps: SaveCancelNewControlsProps;
    selectScaleControlsProps: SelectScaleControlProps
}

export class ClearisGanttControl extends Component<ClearisGanttControlProps> {


    render() {
        return <div className={"mx-layoutgrid mx-layoutgrid-fluid container-fluid"}>
                <div className={"row"}>
                    <div className={"col-lg-6 col-md-0 col-0 button-controls"}>
                        <SaveCancelNewControls {...this.props.saveCancelNewControlsProps} />
                    </div>
                    <div className={"col-lg-6 col-md-0 col-0"}>
                        <SelectScaleControls {...this.props.selectScaleControlsProps}/>
                    </div>
                </div>
            </div>
    }
}
