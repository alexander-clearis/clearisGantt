import {Component, createElement, ReactNode} from "react";
import { ClearisGanttPreviewProps } from "../typings/ClearisGanttProps";
import {ClearsGanttContainer} from "./MVC/view/container/ClearisGanttContainer";
import {ClearisGanttController} from "./MVC/controller/ClearisGanttController";

export class preview extends Component<ClearisGanttPreviewProps> {
    render(): ReactNode {
        return <ClearsGanttContainer GanttController={new ClearisGanttController(this.props.chartTitle.valueOf(), 1500, 640, [])} />;
    }

}

export function getPreviewCss(): string {
    return require("./ui/ClearisGantt.css");
}
