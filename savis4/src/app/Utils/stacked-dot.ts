import { Chart } from 'chart.js';
import { minmax } from '../Dto/twomean';

export class chatClass {
    private domElement: any;
    private datasets: any[] = [];
    private chart: any;
    options: any;
    minmax: minmax;
    private bucketWidth: number = 0;

    constructor(id: any, data: any, options: any = {}) {
        this.domElement = id;
        this.chart = new Chart(this.domElement, {
            type: "scatter",
            data: {
                datasets: [{
                    label: data.label,
                    data: data.data,
                    backgroundColor: data.backgroundColor,
                    pointRadius: 8,

                }]


            },
            options: {
                legend:{
                    display:data.legend,
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            fontColor: 'black',
                            fontSize: 16,
                            padding: 0,
                            min: -5.4,
                            max: 75
                        },
                        scaleLabel: {
                            display: false,
                            labelString: "",
                        }
                    }],
                    yAxes: [
                        {
                            ticks: {
                                fontColor: 'black',
                                fontSize: 16,
                                padding: 0,
                                min: 1,
                                stepSize: 1,
                                max: 7
                            },
                            scaleLabel: {
                                display: true,
                                labelString: ""
                            }
                        }
                    ]
                },

                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    backgroundColor: 'rgba(0,0,0,1.0)',
                    bodyFontStyle: 'normal',
                },

            }

        });
        options = options || {};
        this.options = {
            autoBuckets: options.autoBuckets !== undefined ? options.autoBuckets : true,
            bucketWidth: options.bucketWidth,
        };
    }



    round(x: number, bucketSize: number = NaN): number {
        if (!bucketSize) {
            if (this.options?.autoBuckets) {
                let inScaleWidth = this.minmax?.max - this.minmax?.min
                let chartWidth = this.chart.width;
                bucketSize = 2 * 8 * (inScaleWidth / chartWidth);
            }
            else if (this.options.bucketWidth) {
                bucketSize = this.bucketWidth;
            }
        }
        if (bucketSize) {
            let r = Math.floor(x / bucketSize) * bucketSize;
            return r;
        }
        else {
            return x;
        }
    }

    rawToScatter(arrs: any[]): any[] {
        let faceted = [];
        let counts: { [key: string]: number } = {};
        for (let arr of arrs) {
            let scatter = [];
            for (let item of arr) {
                item = this.round(item);
                let y = (counts[item] = (counts[item] || 0) + 1);
                scatter.push({ x: item, y: y });
            }
            faceted.push(scatter);
        }
        return faceted;
    }

    clear() {
        for (let dataset of this.chart.data.datasets) {
            dataset.data = [];
        }
        this.chart.options.scales.xAxes[0].ticks.min = 0;
        this.chart.options.scales.xAxes[0].ticks.max = 1;
    }

    setDataFromRaw(rawDataArrays: any) {
        if (rawDataArrays.minmax) {
            this.minmax = rawDataArrays.minmax

        }
        let scatterArrays = this.rawToScatter(rawDataArrays.data);
        this.chart.data.datasets = []
        for (let idx = 0; idx < rawDataArrays.data.length; idx++) {
            this.chart.data.datasets.push(
                {
                    data: scatterArrays[idx],
                    label: rawDataArrays.label,
                    backgroundColor: rawDataArrays?.backgroundColor ? rawDataArrays?.backgroundColor : idx == 0 ? "orange" : "rebeccapurple",
                    pointRadius: 8,
                }
            );
        }
        this.stepsize(scatterArrays[0])
    }

    stepsize(dataset: any) {
        let max = 1;
        for (let item of dataset) {
            max = Math.max(max, item.y);
        }
        this.chart.options.scales.yAxes[0].ticks.stepSize = Math.pow(10, Math.floor(Math.log10(max)));
    }
    setLengend(leg:any[], color:any[] = []){
        for (const [i,legend] of leg.entries()) {
            this.chart.data.datasets[i].label = legend
        }
        if (color.length >0) {
            for (const [i,legend] of color.entries()) {
                this.chart.data.datasets[i].backgroundColor = legend
            }
        }
    }

    setScale(start: number, end: number) {
        this.chart.options.scales.xAxes[0].ticks.min = start;
        this.chart.options.scales.xAxes[0].ticks.max = end;
    }

    setAxisLabels(xLabel: string, yLabel: string) {
        this.chart.options.scales.xAxes[0].scaleLabel.labelString = xLabel;
        this.chart.options.scales.yAxes[0].scaleLabel.labelString = yLabel;
    }

    scaleToStackDots() {
        let max = 1;
        for (let dataset of this.chart.data.datasets) {
            for (let item of dataset.data) {
                max = Math.max(max, item.y);
            }
        }

        this.chart.options.scales.yAxes[0].ticks.stepSize = (max > 10) ? Math.ceil(max * 0.2) : 1;
        if (max > 1000) this.chart.options.scales.yAxes[0].ticks.min = 0
    }



    updateLabelName(datasetIndex: number, labelName: string) {
        this.datasets[datasetIndex].label = labelName;
    }

    changeDotAppearance(pointRadius: number) {
        this.chart.data.datasets.forEach((x: any) => {
            x.pointRadius = pointRadius;
        });
    }

    setAnimationDuration(duration: number) {
        if (this.chart) {
            this.chart.options.animation.duration = duration;
        }
    }

    public getChart(): any {
        return this.chart;
    }
}