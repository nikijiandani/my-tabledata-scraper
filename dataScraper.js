const { csvFormat } = require("d3-dsv");
const Nightmare = require("nightmare");
const { writeFileSync } = require("fs");

const mySearch = "datatables";
const START = "https://www.google.com/";

const getData = async myInput => {
  console.log(`Searching Google for ${myInput}...`);
  const nightmare = new Nightmare({ show: true });

  //navigates to URL, waits for the Search input to load and searches for given value
  try {
    await nightmare
      .goto(START)
      .wait("input[title=Search]")
      .type("input[title=Search]", `${myInput}\u000d`);
  } catch (e) {
    console.error(e);
    return undefined;
  }

  //waits for the search results to load then clicks on the first result
  try {
    await nightmare.wait(".rc .r a").click(".rc .r a");
  } catch (e) {
    console.error(e);
    return undefined;
  }

  //waits for the example table to load, if the page title matches what we're looking for, it returns an array of objects.
  try {
    const table = await nightmare
      .wait("#example")
      .evaluate(() => {
        if (document.title === "DataTables | Table plug-in for jQuery") {
          return [
            ...document.querySelectorAll("#example")[0].children[1].children
          ].map(el => {
            return {
              name: el.children[0].innerText,
              position: el.children[1].innerText,
              office: el.children[2].innerText,
              age: el.children[3].innerText,
              startDate: el.children[4].innerText
            };
          });
        }
      })
      .end();

    return [...table];
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

//fetches data, filters it for any undefined values, reformats it to a CSV string and creates an output dataset
getData(mySearch)
  .then(data => {
    const csvData = csvFormat(data.filter(i => i));
    console.log("Exporting results to output.csv...");
    writeFileSync("./output.csv", csvData, { encoding: "utf8" });
    console.log("Done!");
  })
  .catch(e => console.error(e));
