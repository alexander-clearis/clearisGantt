import { propsGCService } from "../../util/propsGCService";
import { Component, createElement, ReactNode } from "react";
import { ScaleControl } from "./ScaleControl";

export interface ControlCollectionProps extends propsGCService {

}

export class CG_Controls extends Component<ControlCollectionProps> {
  constructor(props: ControlCollectionProps, kaasje: string, context: any) {
    super(props, context);
    console.log(kaasje)
  }

  render(): ReactNode {
    return (
      <div className="container row justify-content-end">
        <ScaleControl GC_Service={this.props.GC_Service}></ScaleControl>
      </div>
    );
  }
}
