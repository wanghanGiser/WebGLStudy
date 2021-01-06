import MatrixState from '../../Utils/MatrixState.js'
import { loadShaderSerial } from '../../Utils/GLUtil.js'
import Ball from '../../Graphics/Ball.js';

const vshader = `#version 300 es
uniform mat4 uMVPMatrix; //总变换矩阵
in vec3 aPosition;  //顶点位置
out vec3 vPosition;//用于传递给片元着色器的顶点位置
void main()
{
   //根据总变换矩阵计算此次绘制此顶点位置
   gl_Position = uMVPMatrix * vec4(aPosition,1);
   //将顶点的位置传给片元着色器
   vPosition = aPosition;//将原始顶点位置传递给片元着色器
}`
const fshader = `#version 300 es
precision mediump float;
uniform float uR;
in vec2 mcLongLat;//接收从顶点着色器过来的参数
in vec3 vPosition;//接收从顶点着色器过来的顶点位置
out vec4 fragColor;//输出的片元颜色
void main()
{
   vec3 color;
   float n = 8.0;//外接立方体每个坐标轴方向切分的份数
   float span = 2.0*uR/n;//每一份的尺寸（小方块的边长）
   int i = int((vPosition.x + uR)/span);//当前片元位置小方块的行数
   int j = int((vPosition.y + uR)/span);//当前片元位置小方块的层数
   int k = int((vPosition.z + uR)/span);//当前片元位置小方块的列数
    //计算当前片元行数、层数、列数的和并对2取模
   int whichColor = int(mod(float(i+j+k),2.0));
   if(whichColor == 1) {//奇数时为红色
   		color = vec3(0.5,0,0.0);//红色
   }
   else {//偶数时为白色
   		color = vec3(1.0,1.0,1.0);//白色
   }
	//将计算出的颜色传递给管线
   fragColor=vec4(color,1);
}`


window.onload = start;
let gl: WebGL2RenderingContext;
const ms = new MatrixState();
let ooTri: Ball;
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

function start() {
  let canvas = document.querySelector('canvas');
  gl = canvas.getContext("webgl2");
  if (!gl) {
    alert("创建GLES上下文失败，不支持webGL2.0!")
    return;
  }
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  ms.setInitStack();
  ms.setCamera(0,0,-2,0,0,0,0,1,0);
  ms.setProjectOrtho(-1.5, 1.5, -1, 1, 1, 100);
  gl.enable(gl.DEPTH_TEST);
  shaderProgArray[0] = loadShaderSerial(gl, vshader, fshader);
  if (shaderProgArray[0]) {
    ooTri = new Ball(gl, shaderProgArray[0],0.5)
  } else {
    setTimeout(() => {
      ooTri = new Ball(gl, shaderProgArray[0],0.5);
    }, 300)
  }
  drawFrame();
}
function drawFrame() {
  if (!(ooTri)) {
    return
  }
  
  //清除着色缓冲与深度缓冲
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //保护现场
  ms.pushMatrix();
  //执行平移
  ms.translate(-0.2, 0, 0);
  //执行绕Y轴旋转
  ms.rotate(currentYAngle, 0, 1, 0);
  //执行绕X轴旋转
  ms.rotate(currentXAngle, 1, 0, 0);
  //绘制物体
  ooTri.drawSelf(ms);
  //恢复现场
  ms.popMatrix();
  //保护现场
  ms.pushMatrix();
  //执行平移
  ms.translate(1.0, 0, 0);
  //执行绕Y轴旋转
  ms.rotate(currentYAngle, 0, 1, 0);
  //执行绕X轴旋转
  ms.rotate(currentXAngle, 1, 0, 0);
  //绘制物体
  //恢复现场
  ms.popMatrix();
  //保护现场
  ms.pushMatrix();
  requestAnimationFrame(drawFrame)
}