import {
	setIdentityM,
  translateM,
  rotateM,
  scaleM,
  frustumM,
  orthoM,
	multiplyMM,
	setLookAtM
} from './Matrix.js'

export default class MatrixState
{
	mProjMatrix = new Array(16);//投影矩阵
	mVMatrix = new Array(16);//摄像机矩阵
	currMatrix=new Array(16);//基本变换矩阵
	mStack=new Array(100);//矩阵栈

	//初始化矩阵的方法
	setInitStack=function()
	{
		this.currMatrix=new Array(16);//创建用于存储矩阵元素的数组
		setIdentityM(this.currMatrix);//将元素填充为单位阵的元素值
	}

	//保护变换矩阵，当前矩阵入栈
	pushMatrix=function()
	{
		this.mStack.push(this.currMatrix.slice(0));
	}

	//恢复变换矩阵，当前矩阵出栈
	popMatrix=function()
	{
		this.currMatrix=this.mStack.pop();
	}

	//执行平移变换
	translate=function(x,y,z)//设置沿xyz轴移动
	{
		translateM(this.currMatrix, 0, x, y, z);//将平移变换记录进矩阵
	}

	//执行旋转变换
	rotate=function(angle,x,y,z)//设置绕xyz轴移动
	{
		rotateM(this.currMatrix,0,angle,x,y,z);//将旋转变换记录进矩阵
	}

	//执行缩放变换
	scale=function(x,y,z)//设置绕xyz轴移动
	{
		scaleM(this.currMatrix,0,x,y,z)//将缩放变换记录进矩阵
	}

	//设置摄像机
	setCamera=function
		(
			cx,	//摄像机位置x
			cy,   //摄像机位置y
			cz,   //摄像机位置z
			tx,   //摄像机目标点x
			ty,   //摄像机目标点y
			tz,   //摄像机目标点z
			upx,  //摄像机UP向量X分量
			upy,  //摄像机UP向量Y分量
			upz   //摄像机UP向量Z分量
		)
	{
		setLookAtM
		(
			this.mVMatrix,0,
			cx,cy,cz,
			tx,ty,tz,
			upx,upy,upz
		);
	}

	//设置透视投影参数
	setProjectFrustum=function
		(
			left,		//near面的left
			right,    //near面的right
			bottom,   //near面的bottom
			top,      //near面的top
			near,		//near面距离
			far       //far面距离
		)
	{
		frustumM(this.mProjMatrix, 0, left, right, bottom, top, near, far);
	}

	//设置正交投影参数
	setProjectOrtho=function
		(
			left,		//near面的left
			right,    //near面的right
			bottom,   //near面的bottom
			top,      //near面的top
			near,		//near面与视点的距离
			far       //far面与视点的距离
		)
	{
		orthoM(this.mProjMatrix, 0, left, right, bottom, top, near, far);
	}

	//获取具体物体的总变换矩阵
	getFinalMatrix=function()
	{
		var mMVPMatrix=new Array(16);
		multiplyMM(mMVPMatrix, 0, this.mVMatrix, 0, this.currMatrix, 0);
		multiplyMM(mMVPMatrix, 0, this.mProjMatrix, 0, mMVPMatrix, 0);
		return mMVPMatrix;
	}

	//获取具体物体的变换矩阵
	getMMatrix=function()
	{
		return this.currMatrix;
	}
}
