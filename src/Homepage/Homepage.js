import React , { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import * as d3 from 'd3';

function HomePage() {
  const [data, setData] = useState([]);
    const d3SvgRef = useRef();
    const chartRef = useRef(null);

    useEffect(() => {
        // Make an Axios API request for Chart.js
        axios.get('http://localhost:3000/budget')
            .then((response) => {
                const myBudget = response.data.myBudget;

                const chartData = myBudget.map((item) => item.budget);
                const chartLabels = myBudget.map((item) => item.title);

                // Destroy the existing Chart.js chart if it exists
                if (chartRef.current) {
                    chartRef.current.destroy();
                }

                const ctx = document.getElementById('myChart').getContext('2d');
                const newChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: chartLabels,
                        datasets: [
                            {
                                label: 'Budget',
                                data: chartData,
                                backgroundColor: [
                                    '#ffcd56',
                                    '#ff6384',
                                    '#36a2eb',
                                    '#fd6b19',
                                ],
                            },
                        ],
                    },
                });
                chartRef.current = newChart; // Save the chart instance
            })
            .catch((error) => {
                console.error(error);
            });

        // Make an Axios API request for D3.js
        axios.get('http://localhost:3000/data')
            .then((response) => {
                const d3Data = response.data;

                // D3.js code for processing and rendering data
                const svg = d3.select(d3SvgRef.current);

                const margin = { top: 50, right: 50, bottom: 50, left: 50 };
                const width = 550 - margin.left - margin.right;
                const height = 350 - margin.top - margin.bottom;

                const x = d3.scaleBand()
                    .range([0, width])
                    .domain(d3Data.map((d) => d.Framework))
                    .padding(0.2);

                const y = d3.scaleLinear()
                    .domain([0, 200000])
                    .range([height, 0]);

                const xAxis = d3.axisBottom(x);
                const yAxis = d3.axisLeft(y);

                svg.selectAll('*').remove(); // Clear previous SVG content

                svg.attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`);

                svg.append('g')
                    .attr('transform', `translate(0,${height})`)
                    .call(xAxis)
                    .selectAll('text')
                    .attr('transform', 'translate(-10,0)rotate(-45)')
                    .style('text-anchor', 'end');

                svg.append('g')
                    .call(yAxis);

                svg.selectAll('bars')
                    .data(d3Data)
                    .enter()
                    .append('rect')
                    .attr('x', (d) => x(d.Framework))
                    .attr('y', (d) => y(+d.Stars))
                    .attr('width', x.bandwidth())
                    .attr('height', (d) => height - y(+d.Stars))
                    .attr('fill', '#d04a35');
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
  return (
    <main className="center" id="main">

        <div className="page-area">

            <article>
                <h1>Stay on track</h1>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
            </article>
    
            <article>
                <h1>Alerts</h1>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </article>
    
            <article>
                <h1>Results</h1>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they to live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </article>
    
            <article>
                <h1>Free</h1>
                <p>
                    This app is free!!! And you are the only one holding your data!
                </p>
            </article>
    
            <article>
                <h1>Stay on track</h1>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
            </article>
    
            <article>
                <h1>Alerts</h1>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </article>
    
            <article>
                <h1>Results</h1>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they to live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </article>
    
            <article>
                <h1>Chart</h1>
                <p>
                    <canvas id="myChart" width="400" height="400"></canvas>
                </p>
            </article>
            <figure id="bar">
                <svg ref={d3SvgRef}></svg>
            </figure>
        </div>

    </main>
  );
}

export default HomePage;