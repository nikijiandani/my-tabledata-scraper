// const { csvFormat } = require('d3-dsv');
const Nightmare = require('nightmare');
// const { readFileSync, writeFileSync } = require('fs');
//get search input from command line args
const mySearch = process.argv.slice(2);
const START = 'https://www.google.com/';
const getData = async myInput => {
  console.log(`Searching Google for ${myInput}`);
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
  try {
    const searchResults = await nightmare
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
          .map(el => el.innerText)
      })
      .end();
  
  console.log(table);
  return { ...table };
  } catch(e) {
    console.error(e);
    return undefined;
  }
}

getData(mySearch[0])
  .then(data => console.log("This is my data", data))
  .catch(e => console.error(e));
