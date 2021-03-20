
// const findPixel = ((ctx) => {
//   // var can, ctx;
//   // function createCanvas(w, h) {
//   //     if (can === undefined){
//   //         can = document.createElement("canvas");
//   //         ctx = can.getContext("2d");     
//   //     }
//   //     can.width = w;
//   //     can.height = h;
//   // }

//   const canvas = document.getElementById("canvas");
//   const ctx = canvas.getContext("2d")
//   function getPixels(img) {
//       // console.log(img)
//       // const w = img.naturalWidth || img.width, h =  img.naturalHeight || img.height;
//       // createCanvas(w, h);
//       // ctx.drawImage(img, 0, 0);
//       try {
//         console.log(ctx)
//           const imgData = ctx.getImageData(0, 30, 500, 500);
//           // can.width = can.height = 1; // make canvas as small as possible so it wont 
//                                       // hold memory. Leave in place to avoid instantiation overheads
//           console.log(imgData)
//           return imgData;
//       } catch(e) { 
//           console.warn("Image is un-trusted and pixel access is blocked");
//           ctx = can = undefined; // canvas and context can no longer be used so dump them
//       }
//       return {width: 0, height: 0, data: []}; // return empty pixel data
//   }
//   // 若颜色值为十六进制则转为三位数组的形式的rgb值
//   const hex2RGB = h => { // Hex color to array of 3 values
//       if(h.length === 4 || h.length === 5) {
//           return [parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16), parseInt(h[3] + h[3], 16)];
//       }
//       return [parseInt(h[1] + h[2], 16), parseInt(h[3] + h[4], 16), parseInt(h[5] + h[6], 16)];
//   }
//   // ??
//   const idx2Coord = (idx, w) => ({x: idx % w, y: idx / w | 0});
//   return function (img, hex, minDist = Infinity) {
//       const [r, g, b] = hex2RGB(hex);         
//       const {width, height, data} = getPixels(img);

//       var idx = 0, found;
//       while (idx < data.length) {
//           const R = data[idx] - r;
//           const G = data[idx + 1] - g;
//           const B = data[idx + 2] - b;
//           const d = R * R + G * G + B * B;
//           // 通过rgb每项的分别的加减法是否为0来判断是否匹配
//           if (d === 0) { // found exact match 
//               return {...idx2Coord(idx / 4, width), distance: 0};
//           }
//           // 若不匹配为0，则设个阈值来判断寻找阈值范围内最相似的
//           if (d < minDist) {
//               minDist = d;
//               found = idx;
//           }
//           idx += 4;
//       }
//       return found ? {...idx2Coord(found / 4, width), distance: minDist ** 0.5 | 0 } : undefined;
//   }
// })();

var loadFile = function(event) {
// 创建一个canvas画板
var canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d")

// 位置匹配
function getPosition(obj) {
  var right = 0,
  down = 0;
  if (obj.offsetParent) {
    do {
      right += obj.offsetLeft;
      down += obj.offsetTop;
    } while (obj = obj.offsetParent);
    return {
      x: right,
      y: down
    };
  }
  return undefined;
}
// rgb转换为16进制
function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255)
    throw "color component not found";
    return ((r << 16) | (g << 8) | b).toString(16);
  }


// 通过canvas来绘制我们的图片
  function drawImageFromWebUrl(sourceurl,callback) {
    var img = new Image();
    img.addEventListener("load", function() {
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

      // const result = findPixel(ctx, "#34634F"); // find exact match for red
      // if (result) { // only if found
      //      console.log("Found color #FF0000 at pixel " + result.x + ", " + result.y);
      // } else {
      //      console.log("The color #FF0000 is not in the image");
      // }

      let w = canvas.width;
      let h = canvas.height;
      let r = 26, g = 47, b = 54;
      let minDist = 20;
      let data = ctx.getImageData(0, 0, w, h);console.log(data);
      let width = data.width;
      data = data.data
      
      const idx2Coord = (idx, w) => ({x: idx % w, y: idx / w | 0});
      var idx = 0, found;
      
      for (let i = 0; i < data.length; i++) {
          const R = data[idx] - r;
          const G = data[idx + 1] - g;
          const B = data[idx + 2] - b;
          const d = R * R + G * G + B * B;
          const rgb = `rgb(${r}, ${g}, ${b})`
          // 通过rgb每项的分别的加减法是否为0来判断是否匹配
          if (d === 0) { // found exact match 
              console.log('get')
              console.log(width)
              console.log(idx)
              callback({...idx2Coord(idx / 4, width), distance: 0}, rgb)
              return {...idx2Coord(idx / 4, width), distance: 0};
          }
          // 若不匹配为0，则设个阈值来判断寻找阈值范围内最相似的
          if (d < minDist) {
              console.log('unget')
              minDist = d;
              found = idx;
          }
          idx += 4;
      }
      // callback({...idx2Coord(idx / 4, width), distance: 0})
      return found ? {...idx2Coord(found / 4, width), distance: minDist ** 0.5 | 0 } : undefined;
    });
    img.setAttribute("src", sourceurl);
  }
 
  // drawImageFromWebUrl(URL.createObjectURL(event.target.files[0]));
  drawImageFromWebUrl('../css/img1.jpg', function(result, rgb) {
    if (result) { // only if found
      ctx.fillStyle = rgb;
      ctx.strokeStyle = "white"
      ctx.beginPath();
      ctx.arc(result.x, result.y, 10, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      console.log(`Found color rgb(26,47,54) at pixel  ( ${result.x} , ${result.y} )`);
    } else {
        console.log("The color #FF0000 is not in the image");
    }
  })

  // 拿图片
   var image = document.getElementById('output');
  // 找想要颜色对应在图片中位置


  // 根据鼠标移动事件，然后返回xy轴的值，然后将xy的值传递给canvas，canvas通过getImageData的方法来得到rgb
  canvas.addEventListener("mousemove", function(e) {
  var pos = getPosition(this);
  var x = e.pageX - pos.x;
  var y = e.pageY - pos.y;
  var coord = "coordinate : ("+x+","+y+")";
  var c = this.getContext('2d');
  var p = c.getImageData(x, y, 1, 1).data;
  
  var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    document.getElementById("show").innerHTML="hex : "+hex;
    document.getElementById("show2").innerHTML="rgb : "+"("+p[0]+", "+p[1]+", "+p[2]+")";
    document.getElementById("status").innerHTML = coord;
    document.getElementById("color").style.backgroundColor = hex;
  }, false);
}
loadFile()

