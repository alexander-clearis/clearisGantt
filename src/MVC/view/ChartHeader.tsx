import {Component, createElement, ReactNode} from "react";

export interface ChartHeaderProps {
    title: string
}


export class ChartHeader extends Component<ChartHeaderProps> {


    render(): ReactNode {
        return
            // <div className="container-fluid">
            //     <div className="row">
            //         <div className="col-lg-6 col-md-6 col-6">
                        <h2 className="d-inline-block">{this.props.title}</h2>
            //         </div>
            //     </div>
            // </div>
            ;
    }
}
