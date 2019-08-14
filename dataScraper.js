const { csvFormat } = require('d3-dsv');
const Nightmare = require('nightmare');
const { writeFileSync } = require('fs');

const mySearch = "datatables";

const START = 'https://www.google.com/';

const getData = async myInput => {
  console.log(`Searching Google for ${myInput}...`);
  const nightmare = new Nightmare({ show: true });

  //Go to search page
  try {
    await nightmare
      .goto(START)
      .wait('input[title=Search]')
      .type('input[title=Search]', `${myInput}\u000d`);
  } catch(e) {
    console.error(e);
  }
  
  //click on the first search result link
  try {
    await nightmare
      .wait('.rc .r a')
      .click('.rc .r a')
  } catch(e) {
    console.error(e);
    return undefined;
  }

  try {
    const table = await nightmare
      .wait('#example')
      .evaluate(() => {
        return [...document.querySelectorAll('#example')[0].children[1].children]
          .map(el => {
            return {
              name: el.children[0].innerText,
              position: el.children[1].innerText,
              office: el.children[2].innerText,
              age: el.children[3].innerText,
              startDate: el.children[4].innerText
            }
          })
      })
      .end();
  
  console.log(table);
  return [...table];
  } catch(e) {
    console.error(e);
    return undefined;
  }
}

getData(mySearch)
  .then(data => {
    const csvData = csvFormat(data.filter(i => i));
    writeFileSync('./output.csv', csvData, { encoding: 'utf8' });
  })
  .catch(e => console.error(e));
