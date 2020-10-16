import MatrixState from "./MatrixState"


export default class PointOrLines {
  vertexData = [
    0.0, 0.0, 0.0,
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0,
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0
  ]
  vcount = 5
  vertexBuffer: WebGLBuffer
  colorsData = [
    1, 1, 0, 1.0,// 黄
    1, 1, 1, 1.0,// 白
    0, 1, 0, 1.0,// 绿
    1, 1, 1, 1.0,// 白
    1, 1, 0, 1.0// 黄
  ]
  colorBuffer: WebGLBuffer
  program: WebGLProgram
  gl: WebGLRenderingContext
  constructor(
    gl: WebGL2RenderingContext,						 					//GL上下文
    programIn: WebGLProgram) {
    this.program = programIn;
    this.gl = gl;
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexData), gl.STATIC_DRAW)
    this.colorBuffer = this.gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colorsData), gl.STATIC_DRAW)
  }
  drawSelf(ms: MatrixState, currentmode: String) {
    this.gl.useProgram(this.program);//指定使用某套着色器程序
    //获取总变换矩阵引用id
    var uMVPMatrixHandle = this.gl.getUniformLocation(this.program, "uMVPMatrix");
    //将总变换矩阵送入渲染管线
    this.gl.uniformMatrix4fv(uMVPMatrixHandle, false, new Float32Array(ms.getFinalMatrix()));

    this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.program, "aPosition"));//启用顶点坐标数据数组
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);	//绑定顶点坐标数据缓冲
    //给管线指定顶点坐标数据
    this.gl.vertexAttribPointer(this.gl.getAttribLocation(this.program, "aPosition"), 3, this.gl.FLOAT, false, 0, 0);

    this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.program, "aColor"));//启用顶点坐标数据数组
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);	//绑定顶点坐标数据缓冲
    //给管线指定顶点坐标数据
    this.gl.vertexAttribPointer(this.gl.getAttribLocation(this.program, "aColor"), 4, this.gl.FLOAT, false, 0, 0);
    this.gl.lineWidth(2);//设置线的宽度
    switch (currentmode) {//switch用的是全等===与case匹配
      case '1':// GL_POINTS׽ʽ
        this.gl.drawArrays(this.gl.POINTS, 0, 5);
        break;
      case '2':// GL_LINES׽ʽ			
        this.gl.drawArrays(this.gl.LINES, 0, 5);
        break;
      case '3':// GL_LINE_STRIP׽ʽ
        this.gl.drawArrays(this.gl.LINE_STRIP, 0, 5);
        break;
      case '4':// GL_LINE_LOOP׽ʽ
        this.gl.drawArrays(this.gl.LINE_LOOP, 0, 5);
        break;
      default:
        this.gl.drawArrays(this.gl.LINE_LOOP, 0, 5);
        break;
    }
  }
}