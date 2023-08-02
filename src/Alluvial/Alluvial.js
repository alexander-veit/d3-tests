import React, { useRef, useEffect, StrictMode } from 'react';
import * as d3 from "d3";
import graph from "../data/alluvial-data.json";
import { sankeyFunc } from './util/sankey';


import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';


/**
 * Component for rendering
 * @returns 
*/
let isDrawn;
export const Alluvial = () => {
    
    const containerRef = useRef(null);
    isDrawn = false;
    
    
    // Run after JSX renders (for the ref), then add to the DOM
    useEffect(() => {

        if (graph && containerRef.current && !isDrawn) {
            const container = containerRef.current;

            // Loading in th sankey plot example from: 
            // set the dimensions and margins of the graph
            var margin = {top: 10, right: 10, bottom: 10, left: 10},
            width = 1000 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;

            // append the svg object to the body of the page
            var svg = d3.select(container).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .style("border", "1px solid black")
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");


            // Color scale used
            var color = d3.scaleOrdinal(d3.schemeTableau10);

            // Set the sankey diagram properties
            var sankey = sankeyFunc()
            .nodeWidth(10)
            .nodePadding(10)
            .size([width, height]);

            // load the data


            // Constructs a new Sankey generator with the default settings.
            sankey
            .nodes(graph.nodes)
            .links(graph.links)
            .layout(1);

            // add in the links
            var link = svg.append("g")
            .selectAll(".link")
            .data(graph.links)
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", sankey.link() )
            .style("stroke-width", function(d) { return 3 })
            // .style("stroke-width", function(d) { return Math.max(1, d.dy); })
            .sort(function(a, b) { return b.dy - a.dy; });

            // add in the nodes
            var node = svg.append("g")
            .selectAll(".node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .call(d3.drag()
                .subject(function(d) { return d; })
                .on("start", function() { this.parentNode.appendChild(this); })
                .on("drag", dragmove));

            // add the rectangles for the nodes
            node
            .append("rect")
            .attr("height", function(d) { return d.dy; })
            .attr("width", sankey.nodeWidth())
            .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
            .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
            // Add hover text
            .append("title")
            .text(function(d) { return d.name + "\n" + "There is " + d.value + " stuff in this node"; });

            // add in the title for the nodes
            node
            .append("text")
                .attr("x", -6)
                .attr("y", function(d) { return d.dy / 2; })
                .attr("dy", ".35em")
                .attr("text-anchor", "end")
                .attr("transform", null)
                .text(function(d) { return d.name; })
            .filter(function(d) { return d.x < width / 2; })
                .attr("x", 6 + sankey.nodeWidth())
                .attr("text-anchor", "start");

            // the function for moving the nodes
            function dragmove(event, d) {
                d3.select(this)
                .attr("transform", "translate(" + d.x + "," + (d.y = Math.max( 0, Math.min(height - d.dy, event.y))) + ")");
                
                sankey.relayout();
                link.attr("d", sankey.link() );
            }
        }

        return () => {
            isDrawn = true;
        }

    },[]);


    return (
        <>
            <Tabs
                defaultActiveKey="alluvial"
                className="mb-3 float-right"
                variant="pills"
            >
                <Tab eventKey="alluvial" title="Alluvial view">
                    <div ref={containerRef}>
                        <p>Container for the Alluvial plot.</p>
                    </div> 
                </Tab>
                <Tab eventKey="table" title="Table view">
                    <div className="text-center pt-5">Display alluvial data in a table here.</div>  
                </Tab>
                
            </Tabs>
        </>
    )
}

