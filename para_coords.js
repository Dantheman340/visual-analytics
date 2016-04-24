/**
 * Created by Dan J. on 4/24/2016.
 */

d3.csv("data/BaseballData.csv", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
        d.Abbrev = d.Abbrev;
        d.Year= +d.Year;
        d.HR= +d.HR;
        d.SO= +d.SO;
        d.OBP= +d.OBP;
        d.SLG= +d.SLG;
        d.FIP = +d.FIP;
    });
});
