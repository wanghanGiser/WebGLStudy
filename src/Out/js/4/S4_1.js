import MatrixState from '../../Utils/MatrixState.js';
import { loadShaderSerial } from '../../Utils/GLUtil.js';
import SixPointedStar from '../../Graphics/SixPointedStar.js';
window.onload = start;
var vtrtex = "#version 300 es\nuniform mat4 uMVPMatrix; //\u603B\u53D8\u6362\u77E9\u9635\nin vec3 aPosition;  //\u9876\u70B9\u4F4D\u7F6E\nin vec4 aColor;    //\u9876\u70B9\u989C\u8272\nout  vec4 aaColor;  //\u7528\u4E8E\u4F20\u9012\u7ED9\u7247\u5143\u7740\u8272\u5668\u7684\u53D8\u91CF\nvoid main()\n{\n   gl_Position = uMVPMatrix * vec4(aPosition,1); //\u6839\u636E\u603B\u53D8\u6362\u77E9\u9635\u8BA1\u7B97\u6B64\u6B21\u7ED8\u5236\u6B64\u9876\u70B9\u4F4D\u7F6E\n   aaColor = aColor;//\u5C06\u63A5\u6536\u7684\u989C\u8272\u4F20\u9012\u7ED9\u7247\u5143\u7740\u8272\u5668\n}";
var fragment = "#version 300 es\nprecision mediump float;\nin vec4 aaColor; //\u63A5\u6536\u4ECE\u9876\u70B9\u7740\u8272\u5668\u8FC7\u6765\u7684\u53C2\u6570\nout vec4 fragColor;//\u8F93\u51FA\u5230\u7684\u7247\u5143\u989C\u8272\nvoid main()\n{\n   fragColor = aaColor;//\u7ED9\u6B64\u7247\u5143\u989C\u8272\u503C\n}\n";
var gl;
var ms = new MatrixState();
var ooTri = new Array(6);
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
        for (var i = 0; i < 6; i++) {
            ooTri[i] = new SixPointedStar(gl, shaderProgArray[0], -0.3 * i);
        }
    }
    else {
        setTimeout(function () {
            for (var i = 0; i < 6; i++) {
                ooTri[i] = new SixPointedStar(gl, shaderProgArray[0], -0.3 * i);
            }
        }, 60);
    }
    drawFrame();
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
    for (var j = 0; j < 6; j++) {
        ooTri[j].drawSelf(ms);
    }
    ms.popMatrix();
    requestAnimationFrame(drawFrame);
}
