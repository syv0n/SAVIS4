export interface minmax {
    min: number
    max: number
}
export interface chartConfig {
   data:chartData
   options:chartOption
}
export interface chartData {
    label?:string
    data:number
    backgroundColor?:string
    pointRadius:number
}
export interface chartOption {
    xmin?: number
    xmax?: number
    stepSize?: number
    ylabel?: string
    xlabel?: string
}

