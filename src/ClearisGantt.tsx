import {Component, createElement, ReactNode} from "react";
import {ClearisGanttContainerProps} from "../typings/ClearisGanttProps";
import "./ui/ClearisGantt.css";
import {ClearisGanttController, iGanttController} from "./MVC/controller/ClearisGanttController";
import {ClearsGanttContainer} from "./MVC/view/container/ClearisGanttContainer";
import {iNodeController, TaskController} from "./MVC/controller/TaskController";
import {iTaskModel, MockTaskModel} from "./MVC/model/TaskModel";
import {v4 as uuid} from "uuid";

export default class ClearisGantt extends Component<ClearisGanttContainerProps> {

    private readonly service: iGanttController;


    private constructorNodeModels: iTaskModel[] = [
        new MockTaskModel(
            "Taak ZERO", uuid(), new Date(2020, 0, 1), new Date(2020, 1, 1)
        ),
        new MockTaskModel(
            "Taak UNO", uuid(), new Date(2019, 0, 1), new Date(2019, 1, 1)
        ),
        new MockTaskModel(
            "Taak DOS", uuid(), new Date(2019, 0, 1), new Date(2019, 1, 1)
        ),
        new MockTaskModel(
            "Taak Tres", uuid(), new Date(2019, 1, 1), new Date(2019, 6, 1)
        ),
        new MockTaskModel("Taak Quatro", uuid(), new Date(2019, 7, 12), new Date(2020, 1, 1)),
    ]
    private constructorNodeControllers: iNodeController[] = [
        new TaskController(this.constructorNodeModels[0]),
        new TaskController(this.constructorNodeModels[1]),
        new TaskController(this.constructorNodeModels[2]),
        new TaskController(this.constructorNodeModels[3]),
        new TaskController(this.constructorNodeModels[4])
    ]


    constructor(props: ClearisGanttContainerProps, context: any) {
        super(props, context);
        this.service = new ClearisGanttController(this.props.chartTitle.value ? this.props.chartTitle.value : this.props.chartTitle.status, 1500, 640, this.constructorNodeControllers);
    }

    updateChartTitle() {

        this.service.setTitle(this.props.chartTitle.value ? this.props.chartTitle.value : "NO TITLE");
    }

    render(): ReactNode {
        this.updateChartTitle();

        return <ClearsGanttContainer GanttController={this.service}/>
    }
}
