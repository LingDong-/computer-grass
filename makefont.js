const fs = require('fs');
const {encode_ttf} = require("./ttfw.js");

let gs0 = [];
let hz = fs.readFileSync("mmhz_trad.hershez.txt").toString().split("\n").filter(x=>x.length);

let info = {
  upM:960,
  asc:900,
  dsc:-300,
}

function get_bbox(points){
  let xmin = Infinity;
  let ymin = Infinity;
  let xmax = -Infinity;
  let ymax = -Infinity
  for (let i = 0;i < points.length; i++){
    let x = points[i][0];
    let y = points[i][1];
    xmin = Math.min(xmin,x);
    ymin = Math.min(ymin,y);
    xmax = Math.max(xmax,x);
    ymax = Math.max(ymax,y);
  }
  return {xmin,ymin,xmax,ymax};
}

for (let i = 0; i < hz.length; i++){
  if (i % 100 == 0) console.log(i,'/',hz.length)
  let g0 = {};

  let fn = `contours/`+hz[i].slice(0,5)+".json";
  let ps = JSON.parse(fs.readFileSync(fn).toString());

  for (let k = ps.length-1; k>=0; k--){

    for (let l = 0; l < ps[k].length; l++){
      ps[k][l][0] -= 32;
      ps[k][l][1] -= 936;
      ps[k][l][0] /= 960;
      ps[k][l][1] /=-960;
      ps[k][l][0] *= info.upM;
      ps[k][l][1] *= info.upM;
      ps[k][l][0] = ~~ps[k][l][0];
      ps[k][l][1] = ~~ps[k][l][1];
    }
  }
  let bb = get_bbox(ps.flat());
  g0.unicode = parseInt(hz[i].slice(0,5));
  g0.contours = ps;
  g0.lsb = bb.xmin;
  g0.advw = 960;
  g0.tsb = 50;
  g0.advh = (bb.ymax-bb.ymin)+100;
  gs0.push(g0);
}

let style = process.argv[2];
style = style[0].toUpperCase()+style.slice(1)

{
  let bytes = encode_ttf({
    family : "Computer Grass",
    style : style,
    license : 'Arphic Public License',
    designer : 'Lingdong Huang',
    description : 'An algorithmically generated typeface using makemeahanzi dataset, which was based on Arphic PL UKai.',
    upM : info.upM,
    asc : info.asc,
    dsc : info.dsc,
  }, gs0, []);
  fs.writeFileSync(`ComputerGrass${style}.ttf`,new Uint8Array(bytes));
}
