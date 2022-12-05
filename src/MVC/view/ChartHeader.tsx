import {Component, createElement, ReactNode} from "react";
import {SelectScaleControlProps, SelectScaleControls} from "./SelectScaleControls";

export interface ChartHeaderProps {
    title: string
    selectScaleControlsProps: SelectScaleControlProps
}


export class ChartHeader extends Component<ChartHeaderProps> {


    render(): ReactNode {
        return (
            <div className="mx-groupbox-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-6">
                            <h2 className="d-inline-block">{this.props.title}</h2>                        </div>
                        <div className="col-lg-6 col-md-6 col-6">
                            <div className="container row justify-content-end">
                                <SelectScaleControls {...this.props.selectScaleControlsProps}/>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
