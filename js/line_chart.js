/*
Ideas:
    Filter 3 different datasets based on user selected team names

*/

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function (d) {
        return x(d.date);
    })
    .y(function (d) {
        return y(d.count);
    });

//var team_1 = document.getElementById("dropdown_menu1").value,
//    team_2 = document.getElementById("dropdown_menu2").value,
//    team_3 = document.getElementById("dropdown_menu3").value;

var svg = d3.select("#line").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataYear = function (d) {
    return +d.Year;
};

var new_data = [[], []];
//var new_data = [[], [], []];
var focus = svg.append("g")
    .style("display", "none");


d3.csv("data/BaseballData.csv", function (error, data) {
    if (error) throw error;

    var baseballdata = [];
    data.forEach(function (d) {
        if (baseballdata[d.Year] != undefined) {
            for(i = min_year; i < max_year; i++){
                baseballdata[d.Year].count++;
                baseballdata[d.Year].HR += +d.HR;
                baseballdata[d.Year].Abbrev = d.Abbrev;
            }
        }
        else {
            baseballdata[d.Year] = [];
            baseballdata[d.Year].year = d.Year;
            baseballdata[d.Year].count = 1;
            baseballdata[d.Year].HR = +d.HR;
            baseballdata[d.Year].Abbrev = d.Abbrev;
        }
    });

    console.log(baseballdata);
    var max_year = d3.max(data, dataYear);
    var min_year = d3.min(data, dataYear) - 1;

    for (var i = min_year; i < max_year + 1; i++) {
        var tmp1 = [];
        var tmp2 = [];
        tmp1.date = parseDate(i + ""); //adds date to tmp1
        tmp2.date = parseDate(i + "");

        if (baseballdata[i] != undefined) {
            tmp1.count = baseballdata[i].count; //adds count to temp1
            tmp2.count = baseballdata[i].HR / baseballdata[i].count;
        }
        else {
            tmp1.count = 0;
            tmp2.count = 0;
        }
        new_data[0].push(tmp1);
        new_data[1].push(tmp2);
    }
    var max1 = d3.max(new_data[0], function (d) {
        return d.count;
    });
    var max2 = d3.max(new_data[1], function (d) {
        return d.count;
    });

    var axis_data = [];
    if (max1 > max2) {
        axis_data = new_data[0];
    }
    else {
        axis_data = new_data[1];
    }
    x.domain(d3.extent(new_data[0], function (d) {
        return d.date;
    }));
    y.domain(d3.extent(axis_data, function (d) {
        return d.count;
    }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("class", "label")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Home Runs");

    var dropDown = d3.selectAll(".dropdown")
        .append("select")
        .attr("name", "team_list");

    var options = dropDown.selectAll("option")
        .data(data.filter(function(d){
            if(d.Year == 2015) {
                return d
            }}))
        .enter()
        .append("option");

    options
        .text(function (d) { return d.Abbrev;})
        .attr("value", function (d) {return d.Abbrev;});

    d3.select()

    var color = ["steelblue", "red"];
    var name = ["team", "number of Home Runs", "something else"];

    for (var i = 0; i < 2; i++) {
        svg.append("path")
            .datum(new_data[i])
            .attr("class", "line")
            .attr("stroke", color[i])
            .attr("fill", "none")
            .attr("d", line);

        svg.append("text")
            .datum(new_data[i][new_data[1].length - 1])
            .attr("class", "title")
            .attr("transform", function (d) {
                return "translate(" + x(d.date) + "," + y(d.count) + ")";
            })
            .attr("x", 3)
            .attr("dy", ".15em")
            .style("text-anchor", "end")
            .text(name[i]);
    }
});