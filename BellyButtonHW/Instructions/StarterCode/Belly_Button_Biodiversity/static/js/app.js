function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var metaPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metaPanel.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value]) => {
      metaPanel.append("p").text(`${key} : ${value}`);
    });
  });
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;

  d3.json(url).then(function(sampleData) {
    console.log(sampleData);

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: 'markers',
      markers: {
        color: sampleData.otu_ids,
        size: sampleData.sample_values
      }
    };

    var data = [trace1];

    Plotly.plot('bubble', data);
  

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var sortedData = sampleData.sample_values.sort(function compareFunction(firstNum, secondNum) {
      return secondNum - firstNum;
    });

    var values = sortedData;

    var pieChartData = values.slice(0, 10);
    console.log(pieChartData);

    var pieChartLabels = sampleData.otu_ids.slice(0, 10);

    var data = [{
       values: pieChartData,
       labels: pieChartLabels,
       type: "pie"
     }];

    var layout = {
       height: 600,
       width: 800
    };

    Plotly.plot("pie", data, layout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
