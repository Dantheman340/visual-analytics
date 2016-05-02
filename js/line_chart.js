/*
TODO: line updating is not working correctly, will work if I manually change and refresh but not by using the drop down
TODO: maybe need to create a refresh function

*/
var selected_team1 = "ARI",
    selected_team2 = "NYY",
    selected_team3 = "NYM",
    selected_y_variable = "RperG",
    margin = {top: 20, right: 20, bottom: 30, left: 70},
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
        return y(d.value);
    });

var svg = d3.select("#line").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataYear = function (d) {
    return +d.Year;
};

var new_data = [[], [],[]];

var g_data;

function refresh_data(){

};


d3.csv("data/BaseballData.csv", function (error, data) {
    if (error) throw error;

    g_data = data;

    //data for selected team #1
    var team1_data = [];

    data.forEach(function (d) {
        if (team1_data[d.Year] != undefined && d.Abbrev == selected_team1) {
            team1_data[d.Year].value += +d[selected_y_variable];
            team1_data[d.Year].teamname = d.Abbrev;
        }
        else if (d.Abbrev == selected_team1) {
            team1_data[d.Year] = [];
            team1_data[d.Year].year = d.Year;
            team1_data[d.Year].value = +d[selected_y_variable];
            team1_data[d.Year].teamname = d.Abbrev;
        }
    });

    //data for selected team #2
    var team2_data = [];

    data.forEach(function (d) {
        if (team2_data[d.Year] != undefined && d.Abbrev == selected_team2) {
            team2_data[d.Year].value += +d[selected_y_variable];
            team2_data[d.Year].teamname = d.Abbrev;
        }
        else if (d.Abbrev == selected_team2) {
            team2_data[d.Year] = [];
            team2_data[d.Year].year = d.Year;
            team2_data[d.Year].value = +d[selected_y_variable];
            team2_data[d.Year].teamname = d.Abbrev;
        }
    });

    //data for selected team #3
    var team3_data = [];

    data.forEach(function (d) {
        if (team3_data[d.Year] != undefined && d.Abbrev == selected_team3) {
            team3_data[d.Year].value += +d[selected_y_variable];
            team3_data[d.Year].teamname = d.Abbrev;
            team3_data[d.Year].year = +d.Year;
        }
        else if (d.Abbrev == selected_team3) {
            team3_data[d.Year] = [];
            team3_data[d.Year].year = +d.Year;
            team3_data[d.Year].value = +d[selected_y_variable];
            team3_data[d.Year].teamname = d.Abbrev;
        }
    });

    //create min and max year variables
    var max_year = d3.max(data, dataYear);
    var min_year = d3.min(data, dataYear)-1;

    for (var i = min_year; i < max_year + 1; i++) {
        var tmp1 = [];
        var tmp2 = [];
        var tmp3 = [];

          tmp1.date = parseDate(i + ""); //adds date to tmp1
          tmp2.date = parseDate(i + "");
          tmp3.date = parseDate(i + "");

        if (team1_data[i] != undefined && team2_data[i] != undefined && team3_data[i] != undefined) {
            tmp1.value = team1_data[i].value; //adds count to temp1
            tmp2.value = team2_data[i].value; //adds count to temp2
            tmp3.value = team3_data[i].value; //adds count to temp3
        }
        else {
            tmp1.value = 0;
            tmp2.value = 0;
            tmp3.value = 0;
        }
        new_data[0].push(tmp1);
        new_data[1].push(tmp2);
        new_data[2].push(tmp3);
    }

    var max1 = d3.max(new_data[0], function (d) {
        return d.value;
    });
    var max2 = d3.max(new_data[1], function (d) {
        return d.value;
    });
    var max3 = d3.max(new_data[2], function (d) {
        return d.value;
    });

    var axis_data = [];
    if (max1 > max2) {
        axis_data = new_data[0];
    }
    else if (max2 > max3) {
        axis_data = new_data[1];
    } else {
        axis_data = new_data[2];
    };

    x.domain(d3.extent(new_data[0], function (d) {
        return d.date;
    }));

    y.domain(d3.extent(axis_data, function (d) {
        return d.value;
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
        .text(selected_y_variable);

//dropdowns for team selection
    var dropDown = d3.selectAll(".dropdown")

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

//dropdown for Y-axis variable
    var y_variable = d3.selectAll(".y_variable_dropdown")

    var y_variable_options = y_variable.selectAll("option")
        .data(d3.keys(data[0]))
        .enter()
        .append("option")

    y_variable_options
        .text(function (d) {return d;})
        .attr("value", function (d) {return d;});

//color and name
    var color = ["steelblue", "red", "green"];
    var name = [selected_team1, selected_team2, selected_team3];

// Creates lines
    for (var i = 0; i < 3; i++) {
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
                return "translate(" + x(d.date) + "," + y(d.value) + ")";
            })
            .attr("x", 3)
            .attr("dy", ".15em")
            .style("text-anchor", "end")
            .text(name[i]);
    }
});