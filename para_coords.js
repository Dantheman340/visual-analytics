/**
 * Created by Dan J. on 4/24/2016.
 */
// gradstop.js - color gradients!
//initializing variables
var g_data;
var pc1;
var selected_year = 2015;

//setting gradient values
//var gradient_max = d3.max(g_data.document.getElementById("gradient_filter").value);
//var gradient_min = d3.min(g_data.document.getElementById("gradient_filter").value);

//color scale variable for gradient
var color_scale = d3.scale.linear()
    //.domain([data.min([g_data.HR]), data.max([g_data.HR])])
    .domain([100,250])
    .range(["red", "green"])
    .interpolate(d3.interpolateLab);

function loadParset(){
    pc1 = d3.parcoords()("#para_coords")
        .data(g_data.filter(function(d){
            if(selected_year === "All") {
                return d
            }else{
                return d.Year == selected_year
            }}))
        .hideAxis(["Year","PayKey","Payroll","Abbrev"])
        .composite("darken")
        .color(function(d) { return color_scale(d["HR"]); })  // quantitative color scale
        .alpha(0.35)
        .render()
        .brushMode("1D-axes")  // enable brushing
        .alphaOnBrushed(0.30)
        .interactive()  // command line mode
        .reorderable(); // enables reordering
}

d3.csv('data/BaseballData_ParaCoords.csv', function(data) {

    //data conversion from string to number
    data.forEach(function(d) {
        d.Year = +d.Year;
        d.Payroll = +d.Payroll;
        d.HR = +d.HR;
        d.SO = +d.SO;
        d.OBP = +d.OBP;
        d.SLG = +d.SLG;
        d.pFIP = +d.pFIP;
        });

    g_data = data;

    loadParset();

    //building custom team list - work in progress
    d3.select("#team-list")
        .data(data)
        .enter()
        .append("table");

    var explore_count = 0;
    var exploring = {};
    var explore_start = false;
    pc1.svg
        .selectAll(".dimension")
        .style("cursor", "pointer")
        .on("click", function(d) {
            exploring[d] = d in exploring ? false : true;
            event.preventDefault();
            if (exploring[d]) d3.timer(explore(d,explore_count));
        });

    function explore(dimension,count) {
        if (!explore_start) {
            explore_start = true;
            d3.timer(pc1.brush);
        }
        var speed = (Math.round(Math.random()) ? 1 : -1) * (Math.random()+0.5);
        return function(t) {
            if (!exploring[dimension]) return true;
            var domain = pc1.yscale[dimension].domain();
            var width = (domain[1] - domain[0])/4;

            var center = width*1.5*(1+Math.sin(speed*t/1200)) + domain[0];

            pc1.yscale[dimension].brush.extent([
                d3.max([center-width*0.01, domain[0]-width/400]),
                d3.min([center+width*1.01, domain[1]+width/100])
            ])(pc1.g()
                .filter(function(d) {
                    return d == dimension;
                })
            );
        };
    };

});

