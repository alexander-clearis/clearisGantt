import {Component, createElement, Fragment} from "react";

export interface SaveCancelNewControlsProps {
    onSave: () => void;
    onCancel: () => void;
}

export class SaveCancelNewControls extends Component<SaveCancelNewControlsProps> {


    render() {
        return (
            <Fragment>
                <button type={"button"} className={"btn mx-button btn-success"} onClick={this.props.onSave}> Save
                </button>
                <button type={"button"} className={"btn mx-button btn-default"} onClick={this.props.onCancel}> Cancel
                </button>
            </Fragment>
        );
    }
}