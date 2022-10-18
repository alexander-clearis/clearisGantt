import { Component, ReactNode, createElement } from "react";
import { ClearisGanttConainter } from "./components/ClearisGanttConainter";
import { ClearisGanttPreviewProps } from "../typings/ClearisGanttProps";
import { ClearisGanttController } from "./util/ClearisGanttController";

export class preview extends Component<ClearisGanttPreviewProps> {
    render(): ReactNode {
        return <ClearisGanttConainter GC_Service={new ClearisGanttController(this.props.chartTitle)} />;
    }
}

export function getPreviewCss(): string {
    return require("./ui/ClearisGantt.css");
}
