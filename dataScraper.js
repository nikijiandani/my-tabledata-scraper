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
    const result = await nightmare
      .wait('.ellip')
      .evaluate(() => {
        return [...document.querySelectorAll('.ellip')]
          .map(el => el.parentNode.parentNode.attributes[0].value)
      })
      .end();

    // console.log('This is the result', result);
    return { ...result };
  } catch(e) {
    console.error(e);
    return undefined;
  }
}

getData(mySearch[0])
  .then(data => console.log("This is my data", data))
  .catch(e => console.error(e));
