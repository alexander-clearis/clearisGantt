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
    class: string;
    style: string;
    chartTitle: string;
    activity: {} | null;
    name: string;
    StartDate: string;
    EndDate: string;
}
