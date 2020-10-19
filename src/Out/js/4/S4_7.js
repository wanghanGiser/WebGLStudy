import MatrixState from '../../Utils/MatrixState.js';
import { loadShaderSerial } from '../../Utils/GLUtil.js';
import Belt from '../../Graphics/Belt.js';
import Circle from '../../Graphics/Circle.js';
var vshader = "#version 300 es\nuniform mat4 uMVPMatrix; //\u603B\u53D8\u6362\u77E9\u9635\nlayout (location = 0) in vec3 aPosition;  //\u9876\u70B9\u4F4D\u7F6E\nlayout (location = 1) in vec4 aColor;    //\u9876\u70B9\u989C\u8272\nout  vec4 vColor;  //\u7528\u4E8E\u4F20\u9012\u7ED9\u7247\u5143\u7740\u8272\u5668\u7684\u53D8\u91CF\n\nvoid main()\n{\n   gl_Position = uMVPMatrix * vec4(aPosition,1); //\u6839\u636E\u603B\u53D8\u6362\u77E9\u9635\u8BA1\u7B97\u6B64\u6B21\u7ED8\u5236\u6B64\u9876\u70B9\u4F4D\u7F6E\n   vColor = aColor;//\u5C06\u63A5\u6536\u7684\u989C\u8272\u4F20\u9012\u7ED9\u7247\u5143\u7740\u8272\u5668\n}";
var fshader = "#version 300 es\nprecision mediump float;\nin  vec4 vColor; //\u63A5\u6536\u4ECE\u9876\u70B9\u7740\u8272\u5668\u8FC7\u6765\u7684\u53C2\u6570\nout vec4 fragColor;//\u8F93\u51FA\u5230\u7684\u7247\u5143\u989C\u8272\nvoid main()\n{\n   fragColor = vColor;//\u7ED9\u6B64\u7247\u5143\u989C\u8272\u503C\n}";
window.onload = start;
var gl;
var ms = new MatrixState();
var ooTri;
var ooTriC;
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
    ms.setCamera(-16, 8, 45, 0, 0, 0, 0, 1.0, 0.0);
    ms.setProjectOrtho(-1.5, 1.5, -1, 1, 1, 100);
    gl.enable(gl.DEPTH_TEST);
    shaderProgArray[0] = loadShaderSerial(gl, vshader, fshader);
    if (shaderProgArray[0]) {
        ooTri = new Belt(gl, shaderProgArray[0]);
        ooTriC = new Circle(gl, shaderProgArray[0]);
    }
    else {
        setTimeout(function () {
            ooTri = new Belt(gl, shaderProgArray[0]);
            ooTriC = new Circle(gl, shaderProgArray[0]);
        }, 300);
    }
    drawFrame();
}
function drawFrame() {
    if (!(ooTri && ooTriC)) {
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
    ooTriC.drawSelf(ms);
    //恢复现场
    ms.popMatrix();
    //保护现场
    ms.pushMatrix();
    requestAnimationFrame(drawFrame);
}
