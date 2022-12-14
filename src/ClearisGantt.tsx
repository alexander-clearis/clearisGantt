import {Component, createElement, ReactNode} from "react";
import {ClearisGanttContainerProps} from "../typings/ClearisGanttProps";
import "./ui/ClearisGantt.css";
import {ClearisGanttController, iGanttController} from "./MVC/controller/ClearisGanttController";
import {ClearsGanttContainer} from "./MVC/view/container/ClearisGanttContainer";
import {TaskController} from "./MVC/controller/TaskController";
import {iTaskModel, MockTaskModel} from "./MVC/model/TaskModel";
import {v4 as uuid} from "uuid";
import {iNodeController} from "./MVC/controller/NodeController";

export default class ClearisGantt extends Component<ClearisGanttContainerProps> {

    private readonly service: iGanttController;


    private constructorNodeModels: iTaskModel[] = [
        new MockTaskModel(
            "Taak ZERO", uuid(), new Date(2020, 0, 1), new Date(2020, 1, 1)
        ),
        new MockTaskModel(
            "Taak UNO", uuid(), new Date(2019, 6, 1), new Date(2019, 7, 1)
        ),
        new MockTaskModel(
            "Taak DOS", uuid(), new Date(2019, 6, 1), new Date(2019, 7, 1)
        ),
        new MockTaskModel(
            "Taak Tres", uuid(), new Date(2019, 1, 1), new Date(2019, 6, 1)
        ),
        new MockTaskModel("Taak Quatro", uuid(), new Date(2019, 7, 12), new Date(2020, 1, 1)),
        new MockTaskModel("Taak Quatro", uuid(), new Date(2022, 9, 12), new Date(2022, 11, 25)),
    ]
    private childModels: iTaskModel[] = [
        new MockTaskModel("T", uuid(), new Date(2019, 1, 1), new Date(2019, 2, 1)),
        new MockTaskModel("R", uuid(), new Date(2019, 2, 1), new Date(2019, 3, 1)),
        new MockTaskModel("E", uuid(), new Date(2019, 3, 15), new Date(2019, 4, 15)),
        new MockTaskModel("S", uuid(), new Date(2019, 5, 1), new Date(2019, 6, 1))
    ]
    private childControllers: iNodeController[] =  [
        new TaskController(this.childModels[0]),
        new TaskController(this.childModels[1]),
        new TaskController(this.childModels[2]),
        new TaskController(this.childModels[3], [new TaskController(        new MockTaskModel("SLANGG", uuid(), new Date(2019, 5, 6), new Date(2019, 5, 16))
        )])
    ];
    private constructorNodeControllers: iNodeController[] = [
        new TaskController(this.constructorNodeModels[0]),
        new TaskController(this.constructorNodeModels[1]),
        new TaskController(this.constructorNodeModels[2]),
        new TaskController(this.constructorNodeModels[3], this.childControllers),
        new TaskController(this.constructorNodeModels[4]),
        new TaskController(this.constructorNodeModels[5])
    ]


    constructor(props: ClearisGanttContainerProps, context: any) {
        super(props, context);
        this.service = new ClearisGanttController("TEST", 1500, 640, this.constructorNodeControllers);
    }

    updateChartTitle() {

        this.service.setTitle("NO TITLE");
    }

    render(): ReactNode {
        this.updateChartTitle();

        return <ClearsGanttContainer GanttController={this.service}/>
    }
}
