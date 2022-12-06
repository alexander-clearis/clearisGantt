export type StartEndClearis =  {
    start: number,
    end: number
}

export type MaxBoundsClearis = {
    StartMin: number | undefined,
    StartMax: number | undefined,
    EndMin: number | undefined,
    EndMax: number | undefined
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