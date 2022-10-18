/**
 * This file was generated from ClearisGantt.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { DynamicValue, ListValue, ListAttributeValue } from "mendix";

export interface ClearisGanttContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    chartTitle: DynamicValue<string>;
    activity: ListValue;
    name: ListAttributeValue<string>;
    StartDate: ListAttributeValue<Date>;
    EndDate: ListAttributeValue<Date>;
}

export interface ClearisGanttPreviewProps {
    className: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    chartTitle: string;
    activity: {} | { type: string } | null;
    name: string;
    StartDate: string;
    EndDate: string;
}
