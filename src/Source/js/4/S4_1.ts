import MatrixState from '../../Utils/MatrixState.js'
import { loadShaderSerial } from '../../Utils/GLUtil.js'
import SixPointedStar from '../../Graphics/SixPointedStar.js'
window.onload = start;

let vtrtex =
  `#version 300 es
uniform mat4 uMVPMatrix; //总变换矩阵
in vec3 aPosition;  //顶点位置
in vec4 aColor;    //顶点颜色
out  vec4 aaColor;  //用于传递给片元着色器的变量
void main()
{
   gl_Position = uMVPMatrix * vec4(aPosition,1); //根据总变换矩阵计算此次绘制此顶点位置
   aaColor = aColor;//将接收的颜色传递给片元着色器
}` ;
let fragment =
  `#version 300 es
precision mediump float;
in vec4 aaColor; //接收从顶点着色器过来的参数
out vec4 fragColor;//输出到的片元颜色
void main()
{
   fragColor = aaColor;//给此片元颜色值
}
`
let gl: WebGL2RenderingContext;
const ms = new MatrixState();
let ooTri: SixPointedStar[] = new Array(6);
let shaderProgArray = new Array();
let currentYAngle = 0;
let currentXAngle = 0;
let incAngle = 0.5;
let lastClickX, lastClickY;
let isMoved = false;
document.onmousedown = (event) => {
  let x = event.clientX;
  let y = event.clientY;
  let canvas = (event.target || event.srcElement);
  let rect: DOMRect;
  if (canvas instanceof HTMLCanvasElement) {
    rect = canvas.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      isMoved = true;
      lastClickX = x;
      lastClickY = y;
    }
  }

}
document.onmouseup = () => {
  isMoved = false
}
document.onmousemove = (event) => {
  let x = event.clientX, y = event.clientY;
  if (isMoved) {
    currentYAngle = currentYAngle + (x - lastClickX) * incAngle;
    currentXAngle = currentXAngle + (y - lastClickY) * incAngle;
  }
  lastClickX = x;
  lastClickY = y;
}
function start(){
  let canvas = document.querySelector('canvas');
  gl = canvas.getContext('webgl2', {
    antialias: true
  });
  if (!gl) {
    alert('获取上下文失败');
    return;
  }
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 1);
  ms.setInitStack();
  ms.setCamera(0, 0, -5, 0, 0, 0, 0, 1, 0);
  ms.setProjectOrtho(-1.5, 1.5, -1, 1, 1, 6);
  gl.enable(gl.DEPTH_TEST);
  shaderProgArray[0] = loadShaderSerial(gl, vtrtex, fragment);
  if (shaderProgArray[0]) {
    for (let i = 0; i < 6; i++) {
      ooTri[i] = new SixPointedStar(gl, shaderProgArray[0], -0.3 * i)
    }
  } else {
    setTimeout(() => {
      for (let i = 0; i < 6; i++) {
        ooTri[i] = new SixPointedStar(gl, shaderProgArray[0], -0.3 * i)
      }
    }, 60)
  }
  drawFrame()
}

function drawFrame() {
  if (!ooTri[5]) {
    console.log('加载未完成');
    return;
  }
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  ms.pushMatrix();
  ms.translate(0, 0, 0);
  ms.rotate(currentYAngle, 0, 1, 0);
  ms.rotate(currentXAngle, -1, 0, 0);
  for (let j = 0; j < 6; j++) {
    ooTri[j].drawSelf(ms);
  }
  ms.popMatrix();
  requestAnimationFrame(drawFrame)
}
