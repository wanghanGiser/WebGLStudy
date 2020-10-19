var Cube = /** @class */ (function () {
    function Cube(//声明绘制用物体对象所属类
    gl, //GL上下文
    programIn //着色器程序id
    ) {
        var UNIT_SIZE = 0.3;
        this.vertexData = [
            //前面
            0.0, 0.0, UNIT_SIZE,
            UNIT_SIZE, UNIT_SIZE, UNIT_SIZE,
            -UNIT_SIZE, UNIT_SIZE, UNIT_SIZE,
            0.0, 0.0, UNIT_SIZE,
            -UNIT_SIZE, UNIT_SIZE, UNIT_SIZE,
            -UNIT_SIZE, -UNIT_SIZE, UNIT_SIZE,
            0.0, 0.0, UNIT_SIZE,
            -UNIT_SIZE, -UNIT_SIZE, UNIT_SIZE,
            UNIT_SIZE, -UNIT_SIZE, UNIT_SIZE,
            0.0, 0.0, UNIT_SIZE,
            UNIT_SIZE, -UNIT_SIZE, UNIT_SIZE,
            UNIT_SIZE, UNIT_SIZE, UNIT_SIZE,
            //后面
            0.0, 0.0, -UNIT_SIZE,
            UNIT_SIZE, UNIT_SIZE, -UNIT_SIZE,
            UNIT_SIZE, -UNIT_SIZE, -UNIT_SIZE,
            0.0, 0.0, -UNIT_SIZE,
            UNIT_SIZE, -UNIT_SIZE, -UNIT_SIZE,
            -UNIT_SIZE, -UNIT_SIZE, -UNIT_SIZE,
            0.0, 0.0, -UNIT_SIZE,
            -UNIT_SIZE, -UNIT_SIZE, -UNIT_SIZE,
            -UNIT_SIZE, UNIT_SIZE, -UNIT_SIZE,
            0.0, 0.0, -UNIT_SIZE,
            -UNIT_SIZE, UNIT_SIZE, -UNIT_SIZE,
            UNIT_SIZE, UNIT_SIZE, -UNIT_SIZE,
            //左面
            -UNIT_SIZE, 0.0, 0.0,
            -UNIT_SIZE, UNIT_SIZE, UNIT_SIZE,
            -UNIT_SIZE, UNIT_SIZE, -UNIT_SIZE,
            -UNIT_SIZE, 0.0, 0.0,
            -UNIT_SIZE, UNIT_SIZE, -UNIT_SIZE,
            -UNIT_SIZE, -UNIT_SIZE, -UNIT_SIZE,
            -UNIT_SIZE, 0.0, 0.0,
            -UNIT_SIZE, -UNIT_SIZE, -UNIT_SIZE,
            -UNIT_SIZE, -UNIT_SIZE, UNIT_SIZE,
            -UNIT_SIZE, 0.0, 0.0,
            -UNIT_SIZE, -UNIT_SIZE, UNIT_SIZE,
            -UNIT_SIZE, UNIT_SIZE, UNIT_SIZE,
            //右面
            UNIT_SIZE, 0.0, 0.0,
            UNIT_SIZE, UNIT_SIZE, UNIT_SIZE,
            UNIT_SIZE, -UNIT_SIZE, UNIT_SIZE,
            UNIT_SIZE, 0.0, 0.0,
            UNIT_SIZE, -UNIT_SIZE, UNIT_SIZE,
            UNIT_SIZE, -UNIT_SIZE, -UNIT_SIZE,
            UNIT_SIZE, 0.0, 0.0,
            UNIT_SIZE, -UNIT_SIZE, -UNIT_SIZE,
            UNIT_SIZE, UNIT_SIZE, -UNIT_SIZE,
            UNIT_SIZE, 0.0, 0.0,
            UNIT_SIZE, UNIT_SIZE, -UNIT_SIZE,
            UNIT_SIZE, UNIT_SIZE, UNIT_SIZE,
            //上面
            0.0, UNIT_SIZE, 0.0,
            UNIT_SIZE, UNIT_SIZE, UNIT_SIZE,
            UNIT_SIZE, UNIT_SIZE, -UNIT_SIZE,
            0.0, UNIT_SIZE, 0.0,
            UNIT_SIZE, UNIT_SIZE, -UNIT_SIZE,
            -UNIT_SIZE, UNIT_SIZE, -UNIT_SIZE,
            0.0, UNIT_SIZE, 0.0,
            -UNIT_SIZE, UNIT_SIZE, -UNIT_SIZE,
            -UNIT_SIZE, UNIT_SIZE, UNIT_SIZE,
            0.0, UNIT_SIZE, 0.0,
            -UNIT_SIZE, UNIT_SIZE, UNIT_SIZE,
            UNIT_SIZE, UNIT_SIZE, UNIT_SIZE,
            //下面
            0.0, -UNIT_SIZE, 0.0,
            UNIT_SIZE, -UNIT_SIZE, UNIT_SIZE,
            -UNIT_SIZE, -UNIT_SIZE, UNIT_SIZE,
            0.0, -UNIT_SIZE, 0.0,
            -UNIT_SIZE, -UNIT_SIZE, UNIT_SIZE,
            -UNIT_SIZE, -UNIT_SIZE, -UNIT_SIZE,
            0.0, -UNIT_SIZE, 0.0,
            -UNIT_SIZE, -UNIT_SIZE, -UNIT_SIZE,
            UNIT_SIZE, -UNIT_SIZE, -UNIT_SIZE,
            0.0, -UNIT_SIZE, 0.0,
            UNIT_SIZE, -UNIT_SIZE, -UNIT_SIZE,
            UNIT_SIZE, -UNIT_SIZE, UNIT_SIZE
        ];
        this.vcount = this.vertexData.length / 3; //得到顶点数量
        this.vertexBuffer = gl.createBuffer(); //创建顶点坐标数据缓冲
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer); //绑定顶点坐标数据缓冲
        //将顶点坐标数据送入缓冲
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexData), gl.STATIC_DRAW);
        this.colorsData = [
            //前面
            1.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            //后面
            1.0, 1.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            //左面
            1.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            //右面
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            //上面
            1.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            //下面
            1.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0,
            0.0, 1.0, 1.0, 1.0
        ];
        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer); //绑定颜色数据缓冲
        //将颜色数据送入缓冲
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colorsData), gl.STATIC_DRAW);
        this.program = programIn;
        this.gl = gl;
    } //初始化着色器程序id
    Cube.prototype.drawSelf = function (ms) {
        this.gl.useProgram(this.program); //指定使用某套着色器程序
        //获取总变换矩阵引用id
        var uMVPMatrixHandle = this.gl.getUniformLocation(this.program, "uMVPMatrix");
        //将总变换矩阵送入渲染管线
        this.gl.uniformMatrix4fv(uMVPMatrixHandle, false, new Float32Array(ms.getFinalMatrix())); //getFinalMatrix为矩阵状态中的
        this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.program, "aPosition")); //启用顶点坐标数据数组
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer); //绑定顶点坐标数据缓冲
        //给管线指定顶点坐标数据
        this.gl.vertexAttribPointer(this.gl.getAttribLocation(this.program, "aPosition"), 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.gl.getAttribLocation(this.program, "aColor")); //启用顶点坐标数据数组
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer); //绑定顶点坐标数据缓冲
        //给管线指定顶点坐标数据
        this.gl.vertexAttribPointer(this.gl.getAttribLocation(this.program, "aColor"), 4, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vcount); //用顶点法绘制物体
    };
    return Cube;
}());
export default Cube;
