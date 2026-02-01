import { Component, ChangeDetectionStrategy, input, effect } from '@angular/core';
import * as echarts from 'echarts/core';
import { ScatterChart as ApacheScatterChart } from 'echarts/charts';
import {
  TitleComponent,
  ToolboxComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import { EChartsCoreOption } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';

echarts.use([
  ApacheScatterChart,
  CanvasRenderer,
  TitleComponent,
  ToolboxComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
]);

type ScatterDataPoint = [number, number];

@Component({
  selector: 'app-scatter-chart',
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './scatter-chart.html',
  styleUrl: './scatter-chart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScatterChart {
  readonly data = input<ScatterDataPoint[]>([]);
  options: EChartsCoreOption = {
    xAxis: {},
    yAxis: {},
    series: [
      {
        symbolSize: 5,
        data: [],
        type: 'scatter',
      },
    ],
    grid: {
      top: '50px',
      bottom: '50px',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
  };
  mergeOptions: EChartsCoreOption = {};

  constructor() {
    effect(() => {
      const data = this.data();

      if (data.length === 0) {
        return;
      }

      this.mergeOptions = {
        series: [
          {
            data,
          },
        ],
      };
    });
  }
}
