const express = require(`express`);
const axios = require(`axios`);
const { parse } = require(`node-html-parser`);
const cors = require('cors')
var CronJob = require('cron').CronJob;
const { timeout } = require('cron');

let res1;
let res2;
let res3;

const getImage = async (url) => {
  let image = await axios.get(url, {
    responseType: `arraybuffer`,
  });
  return Buffer.from(image.data, `binary`).toString(`base64`);
};

var job = new CronJob({
  cronTime: '00 00 7 * * *',
  onTick: function () {
    lmao()
  },
  start: false,
  timeZone: 'GMT'
});

job.start();
lmao()

async function lmao() {
  console.log("LMAO")
  async function getmenu() {
    const url = `http://193.2.128.4`;
    const request = await axios(`${url}/jedilnik`);
    const parsed = parse(request.data);

    const dnevi = parsed.querySelectorAll(`.content`);
    let data = new Array();

    for await (let [i, dan] of dnevi.entries()) {
      let datum = parsed.querySelector(`.content .datum`).childNodes[0].text;
      let slikaurl = url + parsed.querySelector(`.content figure img`).getAttribute(`src`);
      let slika = await getImage(slikaurl);
      let menu = dan.childNodes;
      let imglink = url + dan.querySelector(`img`).getAttribute(`src`);
      menu.forEach((child, j) =>
        child.rawTagName ? `` : menu.splice(j, 1)
      );
      menu.shift();
      menu.shift();
      let malice = new Array();
      let tmp = new Array();
      menu.forEach((child) => {
        if (child.rawTagName === `h4`) {
          malice.push(tmp);
          tmp = [];
        } else tmp.push(child.childNodes[0].text.split(` (`)[0]);
      });
      malice.push(tmp);
      malice.shift();

      let [dijaska, topla, vegetarijanska] = malice;

      data.push({
        datum: datum,
        slika: slika,
        url: imglink,
        dijaska: dijaska,
        topla: topla,
        vegetarijanska: vegetarijanska,
      });
    }
    items = {
      posts: data,
    };
    return items;
  }

  async function getnews(sendimg) {
    const url = `http://193.2.128.4`;
    const request = await axios(`${url}/novice`);
    const parsed = parse(request.data);

    let posts = parsed.querySelectorAll(`.container`);
    postItems = [];

    for await (let [i, item] of posts.entries()) {
      let title = item.querySelector(`h3`).innerText;
      let date = item.querySelector(`.datetime`).innerText;
      let content = item.querySelector(`.gray`).innerText;
      let img = await getImage(url + item.querySelector(`img`).getAttribute(`src`));
      let details = item.querySelector(`a`).getAttribute(`href`);
      let imglink = url + item.querySelector(`img`).getAttribute(`src`);
      let posturl = `http://193.2.128.4${item.querySelector(`a`).getAttribute(`href`)}`;
      if (sendimg) {
        postItems.push({
          title: title,
          date: date,
          url: imglink,
          posturl: posturl,
          content: content,
          img: img,
          details: details,
        });
      }
      else{
        postItems.push({
          title: title,
          date: date,
          url: imglink,
          posturl: posturl,
          content: content,
          details: details,
        });
      }
    }
    let items = {
      posts: postItems,
    };
    return items;
  }
  res1 = await getmenu();
  res2 = await getnews(true);
  res3 = await getnews();
};

const app = express();
app.use(cors())
app.options("*", cors())
app.get(`/api/menu/`, async (req, res) => { res.send(res1); console.log('Served menu') });
app.get(`/api/news/`, async (req, res) => { res.send(res2); console.log('Served news') });
app.get(`/api/news/app/`, async (req, res) => { res.send(res3); console.log('Served news without image') });
app.listen(80, () => console.log('Application is running'));