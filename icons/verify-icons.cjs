/* Independent checks for offline icon coverage, font glyphs, and safe SVG content. */
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),zlib=require('zlib');
const api=require('../icons.js');
const font=fs.readFileSync(path.join(__dirname,'MaterialIcons-Regular.woff2'));
assert.equal(font.toString('ascii',0,4),'wOF2');
let cursor=48,offset=0,cmapRecord;
function base128(){let n=0;for(let i=0;i<5;i++){const b=font[cursor++];n=n*128+(b&127);if(!(b&128))return n;}throw Error('Invalid WOFF2 integer');}
for(let i=0;i<font.readUInt16BE(12);i++){
 const flags=font[cursor++],index=flags&63,version=flags>>6;
 let name=index===0?'cmap':null;
 if(index===63){name=font.toString('ascii',cursor,cursor+4);cursor+=4;}
 const original=base128(),transformed=(index===10||index===11)?version===0:version!==0;
 const length=transformed?base128():original;
 if(name==='cmap')cmapRecord={offset,length};offset+=length;
}
assert.ok(cmapRecord);
const decoded=zlib.brotliDecompressSync(font.subarray(cursor,cursor+font.readUInt32BE(20)));
const cmap=decoded.subarray(cmapRecord.offset,cmapRecord.offset+cmapRecord.length),glyphs=new Set();
for(let n=0;n<cmap.readUInt16BE(2);n++){
 const p=cmap.readUInt32BE(4+n*8+4),format=cmap.readUInt16BE(p);
 if(format===4){
  const count=cmap.readUInt16BE(p+6)/2,end=p+14,start=end+count*2+2,delta=start+count*2,range=delta+count*2;
  for(let s=0;s<count;s++)for(let ch=cmap.readUInt16BE(start+s*2);ch<=cmap.readUInt16BE(end+s*2)&&ch!==65535;ch++){
   const r=cmap.readUInt16BE(range+s*2),d=cmap.readInt16BE(delta+s*2);
   const g=r?cmap.readUInt16BE(range+s*2+r+2*(ch-cmap.readUInt16BE(start+s*2))):(ch+d)&65535;
   if(g)glyphs.add(ch);
  }
 }else if(format===12){for(let g=0;g<cmap.readUInt32BE(p+12);g++){const b=p+16+g*12;for(let ch=cmap.readUInt32BE(b);ch<=cmap.readUInt32BE(b+4);ch++)glyphs.add(ch);}}
}
assert.equal(new Set(api.catalog.map(i=>i.id)).size,api.catalog.length,'Unique IDs');
for(const icon of api.catalog){assert.equal(api.resolve(icon.id),icon.id);if(icon.kind==='material')assert.ok(glyphs.has(parseInt(icon.codepoint,16)),'Missing actual font glyph '+icon.id);}
const requested=JSON.parse(fs.readFileSync(path.join(__dirname,'coverage.json'),'utf8'));
assert.equal(requested.missingRequestedMaterial.length,0);
for(const term of ['unreal_engine','unity','C++','C#','marmoset_toolbag','Autodesk Maya','Discord','Favicon','Git Fork','Sketchfab','Adobe Photoshop'])assert.ok(api.has(term),term);
assert.ok(api.search('arrow').length>10);assert.ok(api.search('blender','Game tools & Brands').length===1);
for(const file of fs.readdirSync(__dirname).filter(f=>f.endsWith('.svg')))assert.doesNotMatch(fs.readFileSync(path.join(__dirname,file),'utf8'),/<script|onload=|href=/i,'Active SVG: '+file);
assert.match(api.css,/data:font\/woff2;base64,/);assert.doesNotMatch(api.css,/https?:\/\//);
console.log('PASS: '+api.catalog.length+' unique icons, all '+requested.requestedMaterialCount+' requested Material names, all actual font glyphs, brand aliases, search, and offline SVG/font safety.');
