import { Component, ChangeDetectionStrategy, input, effect } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { LineChart as ApacheLineChart } from 'echarts/charts';
import {
  TitleComponent,
  ToolboxComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import { EChartsCoreOption } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  ApacheLineChart,
  CanvasRenderer,
  TitleComponent,
  ToolboxComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
]);

@Component({
  selector: 'app-line-chart',
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChart {
  readonly refNames = input<string[]>([]);
  readonly header = input<string[]>([]);
  readonly data = input<number[][]>([]);

  options: EChartsCoreOption = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [],
    },
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
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [],
  };

  mergeOptions: EChartsCoreOption = {};

  constructor() {
    effect(() => {
      const refNames = this.refNames();
      const header = this.header();
      const data = this.data();

      if (refNames.length === 0 || header.length === 0 || data.length === 0) {
        return;
      }

      const series = refNames.map((name, index) => ({
        name,
        type: 'line' as const,
        data: data[index] ?? [],
      }));

      this.mergeOptions = {
        legend: {
          data: refNames,
        },
        xAxis: {
          data: header,
        },
        series,
      };
    });
  }
}
