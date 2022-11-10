import { ChangeEvent, Component, createElement, ReactNode } from "react";
import { propsGCService } from "../../util/propsGCService";

export interface iCG_ControlScale extends propsGCService {

}

export class ScaleControl extends Component<iCG_ControlScale> {
  selectOptions(): ReactNode[] {
    const node: ReactNode[] = [];
    for (let i = 0; i < this.props.GC_Service.scaleModeControllers.length; i++) {
      node.push(<option value={(this.props.GC_Service.scaleModeControllers[i]).label()}
                        selected={this.props.GC_Service.timeLine().scaleMode().label === this.props.GC_Service.scaleModeControllers[i].label}>
        {this.props.GC_Service.scaleModeControllers[i].label}
      </option>);
    }
    return node;
  }

  onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    this.props.GC_Service.changeScale(this.props.GC_Service.scaleModeControllers.find(value => value.label() === event.target.value)!);
  };

  render() {
    return (
      <div className="mx-dropdown form-group">
        <label className="control-label col-sm-3" htmlFor="selectScaleMode">Scale</label>
        <select className="form-control" id="selectScaleMode"
                onChange={this.onChange}>
          {
            this.selectOptions()
          }
        </select>
      </div>
    );
  }


}