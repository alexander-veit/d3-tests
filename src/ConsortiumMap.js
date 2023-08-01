"use strict";

import React, {Component} from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import us from './data/us.json';
import consortia from './data/consortia.json';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';


export class ConsortiumMap extends Component {
  constructor(props) {
    super(props);
    this.mapReference = React.createRef();
    this.tableReference = React.createRef();
    this.drawn = false;

  }
  
  componentDidMount() {
    if(!this.drawn){
      this.drawChart();
      this.drawn = true;
    }
    

  }

  drawChart() {
    
    const color = d3.scaleLinear([1, 10], d3.schemeBlues[9]);
    const path = d3.geoPath();

    const states = topojson.feature(us, us.objects.states);
    const statemesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b);

     var container = d3.select(this.mapReference.current);

    const svg = container.append("svg")
      .attr("width", 1000)
      .attr("height", 600)
      .attr("viewBox", [0, 0, 1000, 600])
      .attr("style", "max-width: 100%; height: auto;");

    
    svg.append("g")
      .selectAll("path")
      .data(states.features)
      .join("path")
        .attr("fill", d => color(40))
        .attr("d", path);
      //   .append("title")
      // .text(d => `${d.properties.name}`);
     
    svg.append("path")
        .datum(statemesh)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);


    svg.selectAll(".m")
        .data(consortia)
        .enter()
        .append("image")
        .attr('width', 40)
        .attr('height', 40)
        .attr("xlink:href", (d) => {
          return `./map-marker-${d["marker-color"]}.svg`;
        })
        .attr("transform", (d) => {
            return `translate(${d.x}, ${d.y})`;
         })
         .on('mouseover', (evt, d) => {
          d3.select('#consortiumMapTooltip').html(this.getTooltip(d)).transition().duration(200).style('opacity', 1)
          })
          .on('mouseout', function() {
          d3.select('#consortiumMapTooltip').style('opacity', 0)
          })
          .on('mousemove', function(evt) {
          d3.select('#consortiumMapTooltip').style('left', (evt.pageX+10) + 'px').style('top', (evt.pageY+10) + 'px')
          });


    const legendData = [
    {
      type: "Organizational Center",
      color: "black"
    },
    {
      type: "Data Analysis Center",
      color: "red"
    },
    {
      type: "Genome Characterization Center",
      color: "purple"
    }];

    const legendBasePosX = 5;
    const legendBasePosY = 450;

    legendData.forEach((d, i) => {
      svg.append("image")
        .attr('width', 27)
        .attr('height', 27)
        .attr("x", legendBasePosX)
        .attr("y", legendBasePosY+i*25)
        .attr("xlink:href", `./map-marker-${d["color"]}.svg`);

      svg.append("text")
        .attr("x", legendBasePosX + 28)
        .attr("y", legendBasePosY + 15 + i*25)
        .text(d["type"])
        .style("font-size", "15px")
        .attr("alignment-baseline","middle");
    })
    
  }

  getTooltip(consortium){
    return `
    <div class="consortium-tooltip-wrapper">
      <div class="pb-2 font-weight-bold">${consortium.type}</div>
      <div class="consortium-tooltip-header">Principal Investigator</div>
      <div class="pb-2 consortium-tooltip-content">${consortium.pi}</div>
      <div class="consortium-tooltip-header">Institution</div>
      <div class="pb-2 consortium-tooltip-content">${consortium.affiliation}</div>
      <div class="consortium-tooltip-header">Project</div>
      <div class="consortium-tooltip-content">${consortium.project}</div>
    </div>`;
  }

  render() {
    return (
      <React.Fragment>
        <h1 className="text-center my-5">Consortium overview</h1>

        <div id="consortiumMapTooltip" className="p-1 rounded bg-white consortium-tooltip"></div>
      
        <Tabs
          defaultActiveKey="map"
          className="mb-3 float-right"
          variant="pills"
        >
          <Tab eventKey="map" title="Map view">
            <div ref={this.mapReference}></div>  
          </Tab>
          <Tab eventKey="table" title="Table view">
            <div>sss</div>  
          </Tab>
         
        </Tabs>
      </React.Fragment>
      
    );
  }
}
