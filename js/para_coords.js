/**
 * Created by Dan J. on 4/24/2016.
 */

var para_g_data,
    pc1,
    selected_year = "All",
    gradient_selected = "HR",
    margin = {top: 20, right: 40, bottom: 30, left: 70},
    width = 1300 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

//color scale variable for gradient
var color_scale = d3.scale.linear(),
    xScale = d3.scale.linear().range([0, width]),
    yScale = d3.scale.linear().range([height, 0]);

//central function to control order of operations and condense code
function initializeGraph(){
    minVal();
    maxVal();
    create_color_scale();
    loadParset();
}

//pull color_scale variable and reset gradient based on user defined variable
function create_color_scale(){
    color_scale
        .domain([gradient_min,gradient_max])
        .range(["red", "green"])
        .interpolate(d3.interpolateLab);
}

//iterate through data based on user selected variable and find minimum value
function minVal(){
    var minList = [];
    for(i=0;i < para_g_data.length; i++){
        minList.push(para_g_data[i][gradient_selected]);
    }
    var sortedList1 = minList.sort(function(a, b){return a-b});
    gradient_min = sortedList1[0];
    return gradient_min;
}

//iterate through data based on user selected variable and find maximum value
function maxVal(){
    var maxList = [];
    for(i=0;i < para_g_data.length; i++){
        maxList.push(para_g_data[i][gradient_selected]);
    }
    var sortedList2 = maxList.sort(function(a, b){return b-a});
    gradient_max = sortedList2[0];
    return gradient_max;
}

//creates parallel coordinate visualization
function loadParset(){
        pc1 = d3.parcoords()("#para_coords")
        .data(para_g_data.filter(function(d){
            if(selected_year === "All") {
                return d
            }else{
                return d.Year == selected_year
            }}))
        .hideAxis(["Year","PayKey","Abbrev"])
        .composite("darken")
        .color(function(d){ return color_scale(d[gradient_selected]);})  // quantitative color scale
        .alpha(0.35)
        .render()
        .brushMode("1D-axes")  // enable brushing
        .alphaOnBrushed(0.30)
        .interactive()  // command line mode
        .reorderable(); // enables reordering
}

//load data set, create brushing functionality
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

    para_g_data = data;

    initializeGraph();

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

    pc1.svg
        .selectAll(".background path")
        .on("mouseover",function(d){console.log(d)});


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

