import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import { ChartSpec } from '../types/TestAgentTypes';

interface ChartRendererProps {
  chartSpec: ChartSpec;
}

export const ChartRenderer = ({ chartSpec }: ChartRendererProps) => {
  if (!chartSpec || !chartSpec.chart_type) return null;

  // ใช้ข้อมูล Nivo ถ้ามี
  if (chartSpec.nivo_type && chartSpec.nivo_data) {
    const commonProps = {
      data: chartSpec.nivo_data,
      margin: chartSpec.nivo_margin || { top: 50, right: 130, bottom: 50, left: 60 },
      colors: { scheme: 'nivo' },
      animate: true,
      enableSlices: 'x',
      labelSkipWidth: 12,
      labelSkipHeight: 12,
      labelTextColor: { from: 'color', modifiers: [['darker', 1.6]] }
    } as any;

    switch (chartSpec.nivo_type) {
      case 'bar':
        return (
          <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
            <h4 className="font-medium text-sm mb-2">{chartSpec.title || "Chart"}</h4>
            <div className="h-[300px]">
              <ResponsiveBar
                {...commonProps}
                keys={chartSpec.nivo_keys || ['value']}
                indexBy={chartSpec.nivo_index_by || 'category'}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: chartSpec.x_axis_label,
                  legendPosition: 'middle',
                  legendOffset: 32
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: chartSpec.y_axis_label,
                  legendPosition: 'middle',
                  legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                legends={[
                  {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemOpacity: 1
                        }
                      }
                    ]
                  }
                ]}
              />
            </div>
          </div>
        );
      case 'pie':
        return (
          <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
            <h4 className="font-medium text-sm mb-2">{chartSpec.title || "Chart"}</h4>
            <div className="h-[300px]">
              <ResponsivePie
                {...commonProps}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                legends={[
                  {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemTextColor: '#000'
                        }
                      }
                    ]
                  }
                ]}
              />
            </div>
          </div>
        );
      case 'line':
        return (
          <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
            <h4 className="font-medium text-sm mb-2">{chartSpec.title || "Chart"}</h4>
            <div className="h-[300px]">
              <ResponsiveLine
                {...commonProps}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: chartSpec.x_axis_label,
                  legendOffset: 36,
                  legendPosition: 'middle'
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: chartSpec.y_axis_label,
                  legendOffset: -40,
                  legendPosition: 'middle'
                }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[
                  {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemBackground: 'rgba(0, 0, 0, .03)',
                          itemOpacity: 1
                        }
                      }
                    ]
                  }
                ]}
              />
            </div>
          </div>
        );
      case 'scatter':
        return (
          <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
            <h4 className="font-medium text-sm mb-2">{chartSpec.title || "Chart"}</h4>
            <div className="h-[300px]">
              <ResponsiveScatterPlot
                {...commonProps}
                xScale={{ type: 'linear', min: 0, max: 'auto' }}
                yScale={{ type: 'linear', min: 0, max: 'auto' }}
                blendMode="multiply"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: chartSpec.x_axis_label,
                  legendPosition: 'middle',
                  legendOffset: 46
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: chartSpec.y_axis_label,
                  legendPosition: 'middle',
                  legendOffset: -60
                }}
                legends={[
                  {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 130,
                    translateY: 0,
                    itemWidth: 100,
                    itemHeight: 12,
                    itemsSpacing: 5,
                    itemDirection: 'left-to-right',
                    symbolSize: 12,
                    symbolShape: 'circle',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemOpacity: 1
                        }
                      }
                    ]
                  }
                ]}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
            <h4 className="font-medium text-sm mb-2">{chartSpec.title || "Chart"}</h4>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {`Chart type: ${chartSpec.chart_type}`}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {`X-axis: ${chartSpec.x_axis_label || "N/A"}`}
              {chartSpec.y_axis_label ? `, Y-axis: ${chartSpec.y_axis_label}` : ""}
            </div>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <pre className="text-xs overflow-auto">{JSON.stringify(chartSpec.data, null, 2)}</pre>
            </div>
          </div>
        );
    }
  }

  // ถ้าไม่มีข้อมูล Nivo ให้แสดงผลแบบเดิม
  return (
    <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
      <h4 className="font-medium text-sm mb-2">{chartSpec.title || "Chart"}</h4>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        {`Chart type: ${chartSpec.chart_type}`}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        {`X-axis: ${chartSpec.x_axis_label || "N/A"}`}
        {chartSpec.y_axis_label ? `, Y-axis: ${chartSpec.y_axis_label}` : ""}
      </div>
      <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
        <pre className="text-xs overflow-auto">{JSON.stringify(chartSpec.data, null, 2)}</pre>
      </div>
    </div>
  );
}; 