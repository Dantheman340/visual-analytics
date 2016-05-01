/**
 * Created by fred on 5/1/2016.
 */


var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
// setup x
var xLabel = "RperG";
var xValue = function(d) { return d[xLabel];}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yLabel = "RunsAgperG";
var yValue = function(d) { return d[yLabel];}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");


// add the graph canvas to the body of the webpage
var svgplot = d3.select("#plot").append("svgplot")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("#plot").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var g_data;

var cValue = function(d) { return d.POResCode;},
    color = d3.scale.category10();

d3.csv("data/BaseballData.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
        //PayKey= d.PayKey;
        d.Year= +d.Year;
        d.Payroll= +d.Payroll;
        //Abbrev= +d.Abbrev;
        //PORes= +d.PORes;
        d.POResCode= +d.POResCode;
        d.RegSeasonW= +d.RegSeasonW;
        d.Batters= +d.Batters;
        d.BatAge= +d.BatAge;
        d.RperG= +d.RperG;
        d.PA= +d.PA;
        d.AB= +d.AB;
        d.R= +d.R;
        d.H= +d.H;
        d._2B= +d._2B;
        d._3B= +d._3B;
        d.HR= +d.HR;
        d.RBI= +d.RBI;
        d.SB= +d.SB;
        d.CS= +d.CS;
        d.BB= +d.BB;
        d.SO= +d.SO;
        d.BA= +d.BA;
        d.OBP= +d.OBP;
        d.SLG= +d.SLG;
        d.OPS= +d.OPS;
        d.OPSplus= +d.OPSplus;
        d.TB= +d.TB;
        d.GDP= +d.GDP;
        d.HBP= +d.HBP;
        d.SH= +d.SH;
        d.SF= +d.SF;
        d.IBB= +d.IBB;
        d.LOB= +d.LOB;
        d.PitchersUsed= +d.PitchersUsed;
        d.PAge= +d.PAge;
        d.RunsAgperG= +d.RunsAgperG;
        d.ERA= +d.ERA;
        d.pCG= +d.pCG;
        d.pSho= +d.pSho;
        d.cSho= +d.cSho;
        d.SV= +d.SV;
        d.IP= +d.IP;
        d.pH= +d.pH;
        d.pR= +d.pR;
        d.pER= +d.pER;
        d.pHR= +d.pHR;
        d.pBB= +d.pBB;
        d.pIBB= +d.pIBB;
        d.pSO= +d.pSO;
        d.pHBP= +d.pHBP;
        d.pBK= +d.pBK;
        d.pWP= +d.pWP;
        d.pBF= +d.pBF;
        d.pERA_= +d.pERA_;
        d.pFIP= +d.pFIP;
        d.pWHIP= +d.pWHIP;
        d.pH9= +d.pH9;
        d.pHR9= +d.pHR9;
        d.pBB9= +d.pBB9;
        d.pSO9= +d.pSO9;
        d.pKWratio= +d.pKWratio;
        d.pLOB= +d.pLOB;

        g_data= data;}
    );


    //   xScale.domain([d3.min(g_data, xValue)-1, d3.max(g_data, xValue)+1]);
    //   yScale.domain([d3.min(g_data, yValue)-1, d3.max(g_data, yValue)+1]);

    console.log(g_data[1].Year);

//    var g_filt = g_data.filter(yearfilter);
//    console.log(g_filt[1].Year);

//    function yearfilter(d) {
//            return g_data[d].Year == 1998;
//        }

    xScale.domain(d3.extent(data, function(d) { return d.RperG; })).nice();
    yScale.domain(d3.extent(data, function(d) { return d.RunsAgperG; })).nice();

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(xLabel);



    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yLabel);

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", function(d) { return x(d.RperG); })
        .attr("cy", function(d) { return y(d.RunsAgperG); })
        .style("fill", function(d) { return color(cValue(d));})

        .on("mouseover", function(d) {
            d3.select(this).style("fill", "yellow")
                .style("stroke", "black");
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d["PayKey"] + "<br/> (" + xValue(d)
                    + ", " + yValue(d) + ")")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", color(cValue(d)))
                .style("stroke","black");
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })



    //  .attr("r", function(d){return (d.Payroll/10000000)})
    //  .attr("stroke","black")
    //  .attr("stroke-width", "2");

    var leglabels = [ "Missed Playoffs", "Playoffs - LCS", "Playoffs - LDS", "Playoffs-Won World Series", "Lost World Series", "Playoffs - Wild Card"];

    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d,i){ return leglabels[i]});
});
