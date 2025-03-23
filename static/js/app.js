// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let result = metadata.filter(item => item.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panelData = result[0];
    let sampleMetadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sampleMetadata.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(panelData).forEach(([key, value]) => {
      sampleMetadata.append("p").text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let result = samples.filter(item => item.id == sample);
    let sampleData = result[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = sampleData.otu_ids;
    let otuLabels = sampleData.otu_labels;
    let sampleValues = sampleData.sample_values;

    // Build a Bubble Chart
    let bubbleData = [{
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      marker: {
        size: sampleValues, 
        color: otuIds, 
        colorscale: 'Viridis'
      },
      text: otuLabels 
    }];

    // Render the Bubble Chart
    let bubbleLayout = {
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" },
      title: "Bacteria Cultures Per Sample",
      height: 600,
      width: 1000
    };

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    Plotly.plot('bubble', bubbleData, bubbleLayout);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let yticks = otuIds.slice(0, 10).reverse().map(id => `OTU ${id}`);
    let barData = [{
      y: yticks,
      x: sampleValues.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };

    Plotly.plot('bar', barData, barLayout);

    // Render the Bar Chart

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(name => {
      dropdown.append("option")
        .text(name)
        .property("value", name);
    });

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
