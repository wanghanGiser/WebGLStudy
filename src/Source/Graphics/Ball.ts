import MatrixState from "../Utils/MatrixState"


export default class Ball {
  vertexData = new Array<number>();
  BallR: number;
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  vcount: number;
  vertexBuffer: WebGLBuffer;

  constructor(gl: WebGL2RenderingContext, programIn: WebGLProgram, BallR: number) {
    this.BallR = BallR;
    this.gl = gl;
    this.program = programIn;
    this.initVertexData();
    this.vcount = this.vertexData.length / 3;
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertexData), this.gl.STATIC_DRAW)
  }
  initVertexData() {
    var angleSpan = 10;//将求进行单位切分的角度
    var r=this.BallR
    for (var vAngle = -90; vAngle < 90; vAngle = vAngle + angleSpan) {
      for (var hAngle = 0; hAngle <= 360; hAngle = hAngle + angleSpan)// 水平方向angleSpan度一份
      {// 纵向横向各到一个角度后计算对应的此点在球面上的坐标
        var x0 = r * Math.cos(vAngle * Math.PI / 180) * Math.cos(hAngle * Math.PI / 180);
        var y0 = r * Math.cos(vAngle * Math.PI / 180) * Math.sin(hAngle * Math.PI / 180);
        var z0 = r * Math.sin(vAngle * Math.PI / 180);

        var x1 = r * Math.cos(vAngle * Math.PI / 180) * Math.cos((hAngle + angleSpan) * Math.PI / 180);
        var y1 = r * Math.cos(vAngle * Math.PI / 180) * Math.sin((hAngle + angleSpan) * Math.PI / 180);
        var z1 = r * Math.sin(vAngle * Math.PI / 180);

        var x2 = r * Math.cos((vAngle + angleSpan) * Math.PI / 180) * Math.cos((hAngle + angleSpan) * Math.PI / 180);
        var y2 = r * Math.cos((vAngle + angleSpan) * Math.PI / 180) * Math.sin((hAngle + angleSpan) * Math.PI / 180);
        var z2 = r * Math.sin((vAngle + angleSpan) * Math.PI / 180);

        var x3 = r * Math.cos((vAngle + angleSpan) * Math.PI / 180) * Math.cos(hAngle * Math.PI / 180);
        var y3 = r * Math.cos((vAngle + angleSpan) * Math.PI / 180) * Math.sin(hAngle * Math.PI / 180);
        var z3 = r * Math.sin((vAngle + angleSpan) * Math.PI / 180);

        this.vertexData.push(x1, y1, z1);
        this.vertexData.push(x3, y3, z3);
        this.vertexData.push(x0, y0, z0);

        this.vertexData.push(x1, y1, z1);
        this.vertexData.push(x2, y2, z2);
        this.vertexData.push(x3, y3, z3);
      }
    }
  }
  drawSelf(ms: MatrixState) {
    this.gl.useProgram(this.program);
    let uMVPMatrixHandle = this.gl.getUniformLocation(this.program, "uMVPMatrix");
    //将总变换矩阵送入渲染管线
    this.gl.uniformMatrix4fv(uMVPMatrixHandle, false, new Float32Array(ms.getFinalMatrix()));

    this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.program, "aPosition"));//启用顶点坐标数据数组
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);	//绑定顶点坐标数据缓冲
    //给管线指定顶点坐标数据
    this.gl.vertexAttribPointer(this.gl.getAttribLocation(this.program, "aPosition"), 3, this.gl.FLOAT, false, 0, 0);

    var muRHandle = this.gl.getUniformLocation(this.program, "uR");
    this.gl.uniform1f(muRHandle, this.BallR);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vcount);
  }
}