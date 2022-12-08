export type StartEndClearis =  {
    start: number,
    end: number
}

export type MaxBoundsClearis = {
    StartMinL: number | undefined,
    StartMaxL: number | undefined,
    EndMinR: number | undefined,
    EndMaxR: number | undefined
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