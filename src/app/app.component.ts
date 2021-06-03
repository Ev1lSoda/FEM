import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  roundNum(num: number): number {
    return Math.round((num + Number.EPSILON) * 1000) / 1000;
  }

  title = 'FEM';
  public inputController = {
    a: 5,
    b: 4,
    c: 3,
    d: 3,
    deltaA: 2,
    deltaB: 2,
    deltaC: 2,
    deltaD: 2,
    F: 1,
    G: 2,
  };
  public answer = [];

  onUpdate(): void {
    let lengthForNode = [];

    let lengths = {
      bigX:
        (this.inputController.a - this.inputController.c) /
        (this.inputController.deltaA + 1),
      bigY:
        (this.inputController.b - this.inputController.d) /
        (this.inputController.deltaB + 1),
      smallX: this.inputController.c / (this.inputController.deltaC + 1),
      smallY: this.inputController.d / (this.inputController.deltaD + 1),
    };

    let nodesX =
      3 + (2 * this.inputController.deltaA + this.inputController.deltaC);
    let nodesY =
      3 + (2 * this.inputController.deltaB + this.inputController.deltaD);

    lengthForNode[0] = null;

    for (let i = 1; i <= nodesY; i++) {
      lengthForNode[i] = [];
      let localLength = {
        y1: 0,
        y2: 0,
      };
      if (i === nodesY) {
        lengthForNode[i] = null;
        break;
      } else if (i <= this.inputController.deltaB) {
        localLength = {
          y1: lengths.bigY,
          y2: lengths.bigY,
        };
      } else if (i === this.inputController.deltaB + 1) {
        localLength = {
          y1: lengths.bigY,
          y2: lengths.smallY,
        };
      } else if (
        i <
        2 + this.inputController.deltaB + this.inputController.deltaD
      ) {
        localLength = {
          y1: lengths.smallY,
          y2: lengths.smallY,
        };
      } else if (
        i ===
        2 + this.inputController.deltaB + this.inputController.deltaD
      ) {
        localLength = {
          y1: lengths.smallY,
          y2: lengths.bigY,
        };
      } else if (i < nodesY) {
        localLength = {
          y1: lengths.bigY,
          y2: lengths.bigY,
        };
      }

      lengthForNode[i][0] = null;
      for (let j = 1; j <= this.inputController.deltaA; j++) {
        lengthForNode[i][j] = {
          x1: lengths.bigX,
          x2: lengths.bigX,
          y1: localLength.y1,
          y2: localLength.y2,
        };
      }
      // console.log('lengthForNode1: ', JSON.stringify(lengthForNode));
      lengthForNode[i][this.inputController.deltaA + 1] = {
        x1: lengths.smallX,
        x2: lengths.bigX,
        y1: localLength.y1,
        y2: localLength.y2,
      };
      for (
        let j = this.inputController.deltaA + 2;
        j < 2 + this.inputController.deltaA + this.inputController.deltaC;
        j++
      ) {
        lengthForNode[i][j] = {
          x1: lengths.smallX,
          x2: lengths.smallX,
          y1: localLength.y1,
          y2: localLength.y2,
        };
      }
      // console.log('lengthForNode2: ', JSON.stringify(lengthForNode));
      lengthForNode[i][
        2 + this.inputController.deltaA + this.inputController.deltaC
      ] = {
        x1: lengths.bigX,
        x2: lengths.smallX,
        y1: localLength.y1,
        y2: localLength.y2,
      };
      for (
        let j = 3 + this.inputController.deltaA + this.inputController.deltaC;
        j < nodesX;
        j++
      ) {
        lengthForNode[i][j] = {
          x1: lengths.bigX,
          x2: lengths.bigX,
          y1: localLength.y1,
          y2: localLength.y2,
        };
      }
      lengthForNode[i][nodesX] = null;
    }
    // console.log('lengthForNode: ', lengthForNode);
    this.answer = [];
    for (let i = 0; i <= nodesY; i++) {
      this.answer[i] = [];
      for (let j = 0; j <= nodesX; j++) {
        if (i === 0 || i === nodesY || j === 0 || j === nodesX) {
          this.answer[i][j] = this.inputController.G;
        } else if (
          i > this.inputController.deltaB &&
          i <= 2 + this.inputController.deltaB + this.inputController.deltaD &&
          j > this.inputController.deltaA &&
          j <= 2 + this.inputController.deltaA + this.inputController.deltaC
        ) {
          this.answer[i][j] = this.inputController.F;
        } else {
          this.answer[i][j] = 0;
        }
      }
    }
    for (let n = 0; n < 10; n++) {
      let flag = [0, 0];
      for (let i = 1; i < nodesY; i++) {
        for (let j = 1; j < nodesX; j++) {
          let x1 = lengthForNode[i][j].x1;
          let y1 = lengthForNode[i][j].y1;
          let x2 = lengthForNode[i][j].x2;
          let y2 = lengthForNode[i][j].y2;
          let c = 0;
          let a1 = 0;
          let a2 = 0;
          let a3 = 0;
          let b1 = 0;
          let b2 = 0;
          let b3 = 0;
          let c1 = 0;
          let c2 = 0;
          let c3 = 0;
          if (
            i > this.inputController.deltaB &&
            i <=
              2 + this.inputController.deltaB + this.inputController.deltaD &&
            j > this.inputController.deltaA &&
            j <= 2 + this.inputController.deltaA + this.inputController.deltaC
          ) {
            c =
              3 *
              this.inputController.F *
              (x1 * y1 + x2 * y1 + x1 * y2 + x2 * y2);
            this.answer[i][j] = c;
          } else {
            c = 0;
          }
          b2 =
            2 *
            (x1 / y1 +
              x1 / y2 +
              x2 / y1 +
              x2 / y2 +
              y1 / x1 +
              y1 / x2 +
              y2 / x1 +
              y2 / x2);
          b1 = y1 / x1 + y1 / x2 - 2 * (x1 / y1 + x2 / y1);
          c2 = x2 / y1 + x2 / y2 - 2 * (y1 / x2 + y2 / x2);
          a2 = x1 / y1 + x1 / y2 - 2 * (y1 / x1 + y2 / x1);
          b3 = y2 / x1 + y2 / x2 - 2 * (x1 / y2 + x2 / y2);
          a1 = -1 * (x1 / y1 + y1 / x1);
          a3 = -1 * (x1 / y2 + y2 / x1);
          c1 = -1 * (x2 / y1 + y1 / x2);
          c3 = -1 * (x2 / y2 + y2 / x2);
          this.answer[i][j] = this.roundNum(
            (c -
              this.answer[i][j + 1] * a2 -
              this.answer[i][j - 1] * c2 -
              this.answer[i - 1][j] * b1 -
              this.answer[i + 1][j] * b3 +
              this.answer[i - 1][j - 1] * c1 +
              this.answer[i - 1][j + 1] * a1 +
              this.answer[i + 1][j - 1] * c3 +
              this.answer[i + 1][j + 1] * a3) /
              b2
          );
          console.log('NEW NUMBER');
          console.log(`[${i}][${j}]`);
          // console.log('x1: ', x1);
          // console.log('x2: ', x2);
          // console.log('y1: ', y1);
          // console.log('y2: ', y2);
          let forTest = this.roundNum(
            this.answer[i][j] * b2 +
              this.answer[i][j + 1] * a2 +
              this.answer[i][j - 1] * c2 +
              this.answer[i - 1][j] * b1 +
              this.answer[i + 1][j] * b3 -
              this.answer[i - 1][j - 1] * c1 -
              this.answer[i - 1][j + 1] * a1 -
              this.answer[i + 1][j - 1] * c3 -
              this.answer[i + 1][j + 1] * a3
          );
          flag[0] += this.roundNum(c);
          flag[1] += forTest;
          console.log('c: ', this.roundNum(c));
          console.log('answer: ', forTest);
        }
      }
      let tester = flag[0] - flag[1];
      if ((0 <= tester && tester <= 1) || (0 >= tester && tester >= -1)) {
        console.log('n: ', n);
        break;
      }
    }
  }
}
