import MatrixState from "../Utils/MatrixState";
/**
 * @class Belt条带
 */
export default class Belt {
  vcount = 14;
  vertexData:number[];
  vertexBuffer:WebGLBuffer;
  colorsData:number[];
  colorBuffer:WebGLBuffer;
  program:WebGLProgram;
  gl:WebGL2RenderingContext


  constructor(gl: WebGL2RenderingContext, programIn: WebGLProgram) {
    let angdegBegin = -90;//角度起始值
    let angdegEnd = 90;//角度终止值
    let angdegSpan = (angdegEnd - angdegBegin) / 6;//角度步长值
    let vertexarray = new Array();//声明顶点数组
    let colorarray = new Array();//声明颜色坐标数组
    let count = 0;
    for(let i=angdegBegin;i<=angdegEnd;i+=angdegSpan){
      var angrad=i*Math.PI/180;
      //当前点
      vertexarray[count++]=-0.6*0.5*Math.sin(angrad);
      vertexarray[count++]=0.6*0.5*Math.cos(angrad);
      vertexarray[count++]=0;
      //当前点
      vertexarray[count++]=-0.5*Math.sin(angrad);
      vertexarray[count++]=0.5*Math.cos(angrad);
      vertexarray[count++]=0;
    }
    this.vertexData=vertexarray;
    this.vertexBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.vertexData),gl.STATIC_DRAW);
    count=0
    for(let i=0; i<56; i+=8){
      colorarray[count++] = 1;
      colorarray[count++] = 1;
      colorarray[count++] = 1;
      colorarray[count++] = 1.0;
      colorarray[count++] = 0;
      colorarray[count++] = 1;
      colorarray[count++] = 1;
      colorarray[count++] = 1.0;
    }
    this.colorsData=colorarray;
    this.colorBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.colorsData),gl.STATIC_DRAW);
    this.program=programIn;
    this.gl=gl;
  }
  drawSelf(ms:MatrixState){
    this.gl.useProgram(this.program);
    //获取总变换矩阵引用id
		let uMVPMatrixHandle=this.gl.getUniformLocation(this.program, "uMVPMatrix");
		//将总变换矩阵送入渲染管线
		this.gl.uniformMatrix4fv(uMVPMatrixHandle,false,new Float32Array(ms.getFinalMatrix()));

		this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.program, "aPosition"));//启用顶点坐标数据数组
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);	//绑定顶点坐标数据缓冲
		//给管线指定顶点坐标数据
		this.gl.vertexAttribPointer(this.gl.getAttribLocation(this.program,"aPosition"),3,this.gl.FLOAT,false,0, 0);

		this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.program, "aColor"));//启用顶点坐标数据数组
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);	//绑定顶点坐标数据缓冲
		//给管线指定顶点坐标数据
		this.gl.vertexAttribPointer(this.gl.getAttribLocation(this.program,"aColor"),4,this.gl.FLOAT,false,0, 0);
		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vcount);		//绘制条状物
  }
}