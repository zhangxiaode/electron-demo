import * as echarts from 'echarts';
import lodash from 'lodash'
type EChartsOption = echarts.EChartsOption;
interface ParamsType {
    ref: any,
    options: EChartsOption
}

export default class {
    chart: any
    defaultOption: EChartsOption = {
        // color: [
        //     { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#5470c6' }, { offset: 1, color: 'rgba(84, 112, 198, 0.2)' }] },
        //     { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#91cc75' }, { offset: 1, color: 'rgba(145, 204, 117, 0.2)' }] },
        //     { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#fac858' }, { offset: 1, color: 'rgba(250, 200, 88, 0.2)' }] },
        //     { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#ee6666' }, { offset: 1, color: 'rgba(238, 102, 102, 0.2)' }] },
        //     { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#73c0de' }, { offset: 1, color: 'rgba(115, 192, 222, 0.2)' }] },
        //     { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#3ba272' }, { offset: 1, color: 'rgba(59, 162, 114, 0.2)' }] },
        //     { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#fc8452' }, { offset: 1, color: 'rgba(252, 132, 82, 0.2)' }] },
        //     { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#9a60b4' }, { offset: 1, color: 'rgba(154, 96, 180, 0.2)' }] },
        //     { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#ea7ccc' }, { offset: 1, color: 'rgba(234, 124, 204, 0.2)' }] }
        // ],
        title: {
            left: 20,
            top: 20
        },
        legend: {
            selectedMode: false,
            top: 10,
            right: 30
        },
        grid: {
            left: 80,
            right: 30,
            top: 50,
            bottom: 40
        },
        xAxis: {
            type: 'category',
            nameTextStyle: {
                color: '#666'
            },
            nameGap: 25,
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#ccc'
                }
            },
            axisLabel: {
                color: '#666'
            }
        },
        yAxis: {
            type: 'value',
            nameTextStyle: {
                align: 'left',
                verticalAlign: 'top',
                color: '#666'
            },
            nameGap: 20,
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#ccc'
                }
            },
            axisLabel: {
                color: '#666'
            }
        },
        series: [
            {
                type: 'line'
            }
        ]
    }

    constructor(props: ParamsType) {
        this.create(props.ref)
        this.setOptions(props.options, props.ref)
    }

    create(ref: any) {
        this.chart = echarts.init(ref.value);
        this.resize(this.chart)
    }

    setOptions(options: EChartsOption, ref: any) {
        const currentOptions: any = lodash.merge(this.defaultOption, options)
        if (currentOptions.series[0].type === 'line') {
            currentOptions['color'] = [
                { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#5470c6' }, { offset: 1, color: 'rgba(84, 112, 198, 0.2)' }] },
                { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#91cc75' }, { offset: 1, color: 'rgba(145, 204, 117, 0.2)' }] },
                { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#fac858' }, { offset: 1, color: 'rgba(250, 200, 88, 0.2)' }] },
                { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#ee6666' }, { offset: 1, color: 'rgba(238, 102, 102, 0.2)' }] },
                { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#73c0de' }, { offset: 1, color: 'rgba(115, 192, 222, 0.2)' }] },
                { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#3ba272' }, { offset: 1, color: 'rgba(59, 162, 114, 0.2)' }] },
                { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#fc8452' }, { offset: 1, color: 'rgba(252, 132, 82, 0.2)' }] },
                { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#9a60b4' }, { offset: 1, color: 'rgba(154, 96, 180, 0.2)' }] },
                { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#ea7ccc' }, { offset: 1, color: 'rgba(234, 124, 204, 0.2)' }] }
            ]
        }
        if(currentOptions.series.every((item: any) => item.data.length == 0)) {
            while (ref.value.firstChild) {
                ref.value.removeChild(ref.value.firstChild)
            }
            const empty: any = document.createElement('n-empty')
            empty.style.height = '100%'
            empty.style.display = 'flex'
            empty.style.justifyContent = 'center'
            empty.style.alignItems = 'center'
            empty.innerHTML = '暂无数据'
            ref.value.appendChild(empty)
        } else {
            this.chart.setOption(currentOptions);
        }
    }

    resize(chart: any) {
        window.addEventListener('resize', () => {
            chart.resize();
        });
    }

    refresh() {
        setTimeout(() => {
            this.chart.resize({
                width: 'auto',
                height: 'auto',
                silent: false,
                animation: {
                    duration: 300,
                    easing: 'linear'
                }
            });
        }, 300)
    }
}