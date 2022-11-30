import { Component} from "react";
import { ClearisGanttPreviewProps } from "../typings/ClearisGanttProps";

export class preview extends Component<ClearisGanttPreviewProps> {
}

export function getPreviewCss(): string {
    return require("./ui/ClearisGantt.css");
}
