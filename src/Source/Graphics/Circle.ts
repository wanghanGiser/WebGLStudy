import MatrixState from "../Utils/MatrixState";

export default class Circle {

  colorsData: number[];
  vertexData: number[];
  vcount :number;
  vertexBuffer: WebGLBuffer;
  colorBuffer: WebGLBuffer;
  program: WebGLProgram;
  gl: WebGL2RenderingContext


  constructor(gl: WebGL2RenderingContext, programIn: WebGLProgram,splitnum=30) {
    var angdegSpan = 360 /splitnum;
    this.vcount=splitnum+2
    var vertexarray = new Array();//声明顶点数组
    var colorarray = new Array();//声明颜色数组
    //坐标数据初始化
    var count = 0;
    vertexarray[count++] = 0;//初始在原点
    vertexarray[count++] = 0;
    vertexarray[count++] = 0;
    for (var i = 0; Math.ceil(i) <= 360; i += angdegSpan) {
      var angrad = i * Math.PI / 180;//当前弧度
      //当前点
      vertexarray[count++] = 0.5 * Math.sin(angrad);//顶点坐标
      vertexarray[count++] = 0.5 * Math.cos(angrad);
      vertexarray[count++] = 0;
    }
    this.vertexData = vertexarray;
    this.vertexBuffer = gl.createBuffer();				//创建顶点坐标数据缓冲
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer); 	//绑定顶点坐标数据缓冲
    //将顶点坐标数据送入缓冲
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexData), gl.STATIC_DRAW);

    count = 0;
    colorarray[count++] = 1;
    colorarray[count++] = 1;
    colorarray[count++] = 1;
    colorarray[count++] = 1.0;
    for (var i = 4; i < 48; i += 4) {
      colorarray[count++] = 1;
      colorarray[count++] = 1;
      colorarray[count++] = 0;
      colorarray[count++] = 1.0;
    }
    this.colorsData = colorarray;
    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer); 	//绑定颜色数据缓冲
    //将颜色数据送入缓冲
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colorsData), gl.STATIC_DRAW);
    this.program = programIn;		//初始化着色器程序id
    this.gl = gl;

  }
  drawSelf(ms: MatrixState) {
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
    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.vcount);		//绘制圆
  }
}