export type StartEndViewClearis =  {
    start: number,
    end: number
}

export type MaxBoundsClearis = {
    StartMinL: timeXvalue | undefined,
    StartMaxL: timeXvalue | undefined,
    EndMinR: timeXvalue | undefined,
    EndMaxR: timeXvalue | undefined
}

export type NodeViewSize = {
    x: number
    width: number;
}


export type timeXvalue = {
    date: Date,
    x: number,
}
export type scaleProps = {
    start: timeXvalue;
    end: timeXvalue;
}