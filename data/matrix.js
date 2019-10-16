class Matrix {
	constructor (arrayData) {
		this.data = null;
		let isMat = false;
		let width = 0;
		if (Array.isArray(arrayData)) {
			isMat = true;
			for (let i = 0; i < arrayData.length; i++) {
				if (!Array.isArray(arrayData[i])) {
					isMat = false;
					break;
				}
				if (!width) width = arrayData[i].length;
				else if (!(width === arrayData[i].length)) {
					isMat = false;
					break;
				}
			}
		}
		if (isMat) this.data = arrayData;
		this.isMatrix = isMat;
		this.isSquareMatrix = (isMat && width == arrayData.length)?true:false;
		this.height = (isMat)?this.data.length:null;
		this.width = (isMat)?this.data[0].length:null;
	}

	toString () {
		if (!this.isMatrix) return null;
		return this.data.toString();
	}
	
	transpose () {
		if (!this.isMatrix) return null;
		let newData = [];
		for (let j = 0; j < this.width; j++) {
			let rowData = [];
			for (let k = 0; k < this.height; k++) {
				rowData.push(this.data[k][j]);
			}
			newData.push(rowData);
		}
		let outMat = new Matrix (newData);
		return outMat;
	}

	add (matrix) {
		if (!this.isMatrix || !matrix.isMatrix) return null;
		if (!(this.height === matrix.height && this.width === matrix.width)) return null;
		let output = this;
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				output.data[i][j] += matrix.data[i][j];
			}
		}
		return output;
	}

	multiply (matrix) {
		if (!this.isMatrix || !matrix.isMatrix) return null;
		if (!this.width === matrix.height) return null;
		let newData = [];
		for (let i = 0; i < this.height; i++) {
			let tArr = [];
			for (let j = 0; j < matrix.width; j++) {
				let tElem = 0;
				for (let k = 0; k < this.width; k++) {
					tElem += this.data[i][k] * matrix.data[k][j];
				}
				tArr.push(tElem);
			}
			newData.push(tArr);
		}
		let output = new Matrix(newData);
		return output;
	}
	
	cofactor () {
		if (!this.isMatrix) return null;
		let newData = [];
		for (let j = 0; j < this.height; j++) {
			let rowData = [];
			for (let k = 0; k < this.width; k++) {
				rowData.push(((-1)**(j + k)) * this.data[j][k]);
			}
			newData.push(rowData);
		}
		let outMat = new Matrix(newData);
		return outMat;
	}
	
	dump (linear) {
		if (!this.isMatrix) return null;
		let outStr = '';
		if (linear) return JSON.stringify(this)
		outStr += '[';
		for (let i = 0; i < this.height; i++) {
			outStr += '\n  ' + JSON.stringify(this.data[i]) + ((this.height - 1 === i) ? '' : ',');
		}
		outStr += '\n]';
		return outStr;
	}
	
	sliceLines (row, column) {
		if (!this.isMatrix) return null;
		if (row > this.height - 1 || column > this.width - 1 || row < 0 || column < 0) return null;
		let sliced = [];
		for (let i = 0; i < this.height; i++) {
			if (!(i === row)) {
				let tArr = [];
				for (let j = 0; j < this.width; j++) {
					if (!(j === column)) {
						tArr.push(this.data[i][j]);
					}
				}
				sliced.push(tArr);
			}
		}
		let output = new Matrix(sliced);
		return output;
	}

	determinant () {
		if (!this.isSquareMatrix) return;
		let output = this;
		let det = 0;
		if (output.height === 1) {
			return output.data[0][0];
		}
		for (let i = 0; i < this.height; i++) {
			det += ((-1) ** (i)) * output.sliceLines(0, i).determinant() * output.data[0][i];
		}
		return det;
	}

	adjoint () {
		if (!this.isSquareMatrix) return null;
		let output = [];
		for (let i = 0; i < this.height; i++) {
			let tArr = [];
			for (let j = 0; j < this.width; j++) {
				tArr.push(this.sliceLines(i, j).determinant());
			}
			output.push(tArr);
		}
		let newMat = new Matrix(output);
		return newMat;
	}

	invert () {
		if (!this.determinant()) return null;
		let output = new Matrix(this.adjoint().transpose().cofactor().data.map(row => row.map(element => element / this.determinant())));
		return output;
	}
}

exports.Matrix = Matrix;