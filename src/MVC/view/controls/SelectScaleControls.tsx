import {ChangeEvent, Component, createElement, ReactNode} from "react";

export interface SelectScaleControlProps {
    scaleModes: Map<string, string>
    default: string
    onSelect: (scaleModeID: string) => void
}

export class SelectScaleControls extends Component<SelectScaleControlProps>{
    constructor(props: SelectScaleControlProps) {
        super(props);
    }

    selectOptions(): ReactNode[] {
        const node: ReactNode[] = [];
        this.props.scaleModes.forEach((label, id) => {
            node.push(<option value={id}
                              selected={(id === this.props.default)}
            >
                {label}
            </option>)
        })
        return node;
    }

    onChange = (event: ChangeEvent<HTMLSelectElement>) => {
        this.props.onSelect(event.target.value)
    };

    render() {
        return (
            <div className="mx-dropdown form-group">
                <label className="control-label col-sm-3" htmlFor="selectScaleModeClearisGantt" id={"selectScaleModeClearisGantt-label"}>Scale</label>
                <select className="form-control" id="selectScaleModeClearisGantt"
                        onChange={this.onChange}>
                    {
                        this.selectOptions()
                    }
                </select>
            </div>
        );
    }
}