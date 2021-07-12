import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';

export default function Chart(props) {
  return (
    <div>
      <Doughnut
        data={props.state}
        options={{
          title: {
            display: true,
            text: 'Average Rainfall per month',
            fontSize: 20
          },
          legend: {
            display: true,
            position: 'right'
          }
        }}
      />
    </div>
  );
}

