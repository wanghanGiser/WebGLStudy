import MatrixState from '../../Utils/MatrixState.js';
import { loadShaderSerial } from '../../Utils/GLUtil.js';
import Ball from '../../Graphics/Ball.js';
var vshader = "#version 300 es\nuniform mat4 uMVPMatrix; //\u603B\u53D8\u6362\u77E9\u9635\nin vec3 aPosition;  //\u9876\u70B9\u4F4D\u7F6E\nout vec3 vPosition;//\u7528\u4E8E\u4F20\u9012\u7ED9\u7247\u5143\u7740\u8272\u5668\u7684\u9876\u70B9\u4F4D\u7F6E\nvoid main()\n{\n   //\u6839\u636E\u603B\u53D8\u6362\u77E9\u9635\u8BA1\u7B97\u6B64\u6B21\u7ED8\u5236\u6B64\u9876\u70B9\u4F4D\u7F6E\n   gl_Position = uMVPMatrix * vec4(aPosition,1);\n   //\u5C06\u9876\u70B9\u7684\u4F4D\u7F6E\u4F20\u7ED9\u7247\u5143\u7740\u8272\u5668\n   vPosition = aPosition;//\u5C06\u539F\u59CB\u9876\u70B9\u4F4D\u7F6E\u4F20\u9012\u7ED9\u7247\u5143\u7740\u8272\u5668\n}";
var fshader = "#version 300 es\nprecision mediump float;\nuniform float uR;\nin vec2 mcLongLat;//\u63A5\u6536\u4ECE\u9876\u70B9\u7740\u8272\u5668\u8FC7\u6765\u7684\u53C2\u6570\nin vec3 vPosition;//\u63A5\u6536\u4ECE\u9876\u70B9\u7740\u8272\u5668\u8FC7\u6765\u7684\u9876\u70B9\u4F4D\u7F6E\nout vec4 fragColor;//\u8F93\u51FA\u7684\u7247\u5143\u989C\u8272\nvoid main()\n{\n   vec3 color;\n   float n = 8.0;//\u5916\u63A5\u7ACB\u65B9\u4F53\u6BCF\u4E2A\u5750\u6807\u8F74\u65B9\u5411\u5207\u5206\u7684\u4EFD\u6570\n   float span = 2.0*uR/n;//\u6BCF\u4E00\u4EFD\u7684\u5C3A\u5BF8\uFF08\u5C0F\u65B9\u5757\u7684\u8FB9\u957F\uFF09\n   int i = int((vPosition.x + uR)/span);//\u5F53\u524D\u7247\u5143\u4F4D\u7F6E\u5C0F\u65B9\u5757\u7684\u884C\u6570\n   int j = int((vPosition.y + uR)/span);//\u5F53\u524D\u7247\u5143\u4F4D\u7F6E\u5C0F\u65B9\u5757\u7684\u5C42\u6570\n   int k = int((vPosition.z + uR)/span);//\u5F53\u524D\u7247\u5143\u4F4D\u7F6E\u5C0F\u65B9\u5757\u7684\u5217\u6570\n    //\u8BA1\u7B97\u5F53\u524D\u7247\u5143\u884C\u6570\u3001\u5C42\u6570\u3001\u5217\u6570\u7684\u548C\u5E76\u5BF92\u53D6\u6A21\n   int whichColor = int(mod(float(i+j+k),2.0));\n   if(whichColor == 1) {//\u5947\u6570\u65F6\u4E3A\u7EA2\u8272\n   \t\tcolor = vec3(0.5,0,0.0);//\u7EA2\u8272\n   }\n   else {//\u5076\u6570\u65F6\u4E3A\u767D\u8272\n   \t\tcolor = vec3(1.0,1.0,1.0);//\u767D\u8272\n   }\n\t//\u5C06\u8BA1\u7B97\u51FA\u7684\u989C\u8272\u4F20\u9012\u7ED9\u7BA1\u7EBF\n   fragColor=vec4(color,1);\n}";
window.onload = start;
var gl;
var ms = new MatrixState();
var ooTri;
var shaderProgArray = new Array();
var currentYAngle = 0;
var currentXAngle = 0;
var incAngle = 0.5;
var lastClickX, lastClickY;
var isMoved = false;
document.onmousedown = function (event) {
    var x = event.clientX;
    var y = event.clientY;
    var canvas = (event.target || event.srcElement);
    var rect;
    if (canvas instanceof HTMLCanvasElement) {
        rect = canvas.getBoundingClientRect();
        if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
            isMoved = true;
            lastClickX = x;
            lastClickY = y;
        }
    }
};
document.onmouseup = function () {
    isMoved = false;
};
document.onmousemove = function (event) {
    var x = event.clientX, y = event.clientY;
    if (isMoved) {
        currentYAngle = currentYAngle + (x - lastClickX) * incAngle;
        currentXAngle = currentXAngle + (y - lastClickY) * incAngle;
    }
    lastClickX = x;
    lastClickY = y;
};
function start() {
    var canvas = document.querySelector('canvas');
    gl = canvas.getContext("webgl2");
    if (!gl) {
        alert("创建GLES上下文失败，不支持webGL2.0!");
        return;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    ms.setInitStack();
    ms.setCamera(0, 0, -2, 0, 0, 0, 0, 1, 0);
    ms.setProjectOrtho(-1.5, 1.5, -1, 1, 1, 100);
    gl.enable(gl.DEPTH_TEST);
    shaderProgArray[0] = loadShaderSerial(gl, vshader, fshader);
    if (shaderProgArray[0]) {
        ooTri = new Ball(gl, shaderProgArray[0], 0.5);
    }
    else {
        setTimeout(function () {
            ooTri = new Ball(gl, shaderProgArray[0], 0.5);
        }, 300);
    }
    drawFrame();
}
function drawFrame() {
    if (!(ooTri)) {
        return;
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
    requestAnimationFrame(drawFrame);
}
