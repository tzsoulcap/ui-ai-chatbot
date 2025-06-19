import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import { ResponsiveHeatMap } from '@nivo/heatmap';

interface ChartRendererProps {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'heatmap';
  data: any[];
  keys: string[];
  indexBy: string;
  width?: number;
  height?: number;
}

const chartContainerStyle = {
  width: '100%',
  minWidth: 400,
  minHeight: 400,
  height: '40vw',
  maxHeight: 700,
  maxWidth: 900,
  margin: '0 auto',
};

export const ChartRenderer = ({ type, data, keys, indexBy, width = 600, height = 400 }: ChartRendererProps) => {
  const commonProps = {
    data,
    margin: { top: 50, right: 110, bottom: 50, left: 60 },
    animate: true,
    enableSlices: 'x' as const,
  };

  switch (type) {
    case 'bar':
      return (
        <div style={{ width, height }}>
          <ResponsiveBar
            {...commonProps}
            keys={keys}
            indexBy={indexBy}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            colors={{ scheme: 'nivo' }}
            axisTop={null}
            axisRight={null}
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
      );

    case 'line':
      return (
        <div style={{ width, height }}>
          <ResponsiveLine
            {...commonProps}
            data={data}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
            axisTop={null}
            axisRight={null}
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
      );

    case 'pie':
      return (
        <div style={{ width, height }}>
          <ResponsivePie
            {...commonProps}
            data={data.map(d => ({
              id: d[indexBy],
              label: d[indexBy],
              value: d[keys[0]]
            }))}
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
      );

    case 'scatter':
      return (
        <div style={{ width, height }}>
          <ResponsiveScatterPlot
            {...commonProps}
            data={data.map(d => ({
              id: d[indexBy],
              data: keys.map(key => ({
                x: key,
                y: d[key]
              }))
            }))}
            margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'X',
              legendPosition: 'middle',
              legendOffset: 46
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Y',
              legendPosition: 'middle',
              legendOffset: -60
            }}
            tooltip={({ node }) => (
              <div
                style={{
                  background: 'white',
                  padding: '9px 12px',
                  border: '1px solid #ccc',
                }}
              >
                <strong>{node.data.x}</strong>
                <br />
                {node.data.y}
              </div>
            )}
          />
        </div>
      );


    default:
      return null;
  }
}; 