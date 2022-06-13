import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  title = 'FEM';
  public inputController = {
    a: 10,
    b: 10,
    c: 3,
    deltaA: 5,
    deltaB: 5,
    F: 3,
    G: -1,
  };
  public answer = [];
  roundNum(num: number): number {
    return Math.round((num + Number.EPSILON) * 1000) / 1000;
  }

  onUpdate(): void {

    const length = {
      x: (this.inputController.a / this.inputController.deltaA) / 2,
      y: (this.inputController.b / this.inputController.deltaB) / 2,
    };

    const nodesX = 2 + this.inputController.deltaA;
    const nodesY = 2 + this.inputController.deltaB;

    const x1 = length.x;
    const y1 = length.y;
    const x2 = length.x;
    const y2 = length.y;
    const c = 0;
    const b2 =
      2 *
      (x1 / y1 +
        x1 / y2 +
        x2 / y1 +
        x2 / y2 +
        y1 / x1 +
        y1 / x2 +
        y2 / x1 +
        y2 / x2);
    const b1 = y1 / x1 + y1 / x2 - 2 * (x1 / y1 + x2 / y1);
    const c2 = x2 / y1 + x2 / y2 - 2 * (y1 / x2 + y2 / x2);
    const a2 = x1 / y1 + x1 / y2 - 2 * (y1 / x1 + y2 / x1);
    const b3 = y2 / x1 + y2 / x2 - 2 * (x1 / y2 + x2 / y2);
    const a1 = -1 * (x1 / y1 + y1 / x1);
    const a3 = -1 * (x1 / y2 + y2 / x1);
    const c1 = -1 * (x2 / y1 + y1 / x2);
    const c3 = -1 * (x2 / y2 + y2 / x2);

    // console.log('lengthForNode: ', lengthForNode);
    this.answer = [];

    const oddOrNot = !!(nodesY % 2) ? ((nodesY) / 2) : ((nodesY + 1) / 2);
    let cof = (length.x - length.y);
    const whatsBigger = ((length.x - length.y) < 0) ? true : false;

    for (let n = 0; n < n + 1; n++) {
      if (cof < 1) {
        cof += 1;
        break;
      }
      cof = cof / 10;
    }

    const cofX = whatsBigger ? 1 : cof;
    const cofY = whatsBigger ? cof : 1;

    for (let i = 0; i <= oddOrNot; i++) {
      this.answer[i] = [];
      this.answer[nodesY - i] = [];
      for (let j = 0; j <= nodesX; j++) {
        if (j === 0 || (j <= this.inputController.c && (i === 0 || i === nodesY))) {
          this.answer[i][j] = 0;
          this.answer[nodesY - i][j] = 0;
        } else if (j === nodesX || (j > this.inputController.c && (i === 0 || i === nodesY))) {
          this.answer[i][j] = this.inputController.G;
          this.answer[nodesY - i][j] = this.inputController.G;
        } else if (j <= this.inputController.c && (i !== 0 && i !== nodesY)) {
          this.answer[i][j] = this.inputController.F;
          this.answer[nodesY - i][j] = this.inputController.F;
        } else {
          this.answer[i][j] = (((this.answer[i - 1][j] * cofY) + (this.answer[i][j - 1] * cofX)) / 2) - 0.001;
          this.answer[nodesY - i][j] = whatsBigger ? this.answer[i][j] - 0.001 : this.answer[i][j] + 0.001;
        }
      }
    }
    for (let n = 0; n < 10; n++) {
      const flag = [0, 0, 0];
      for (let i = 1; i < nodesY; i++) {
        for (let j = 1; j < nodesX; j++) {
          if ( j > this.inputController.c) {
          this.answer[i][j] = (this.answer[i - 1][j] + this.answer[i + 1][j] + this.answer[i][j - 1] + this.answer[i][j + 1]) / 4;
          }
          console.log('NEW NUMBER');
          console.log(`[${i}][${j}]`);
          const flagger =
            this.answer[i][j] * b2 +
            this.answer[i][j + 1] * a2 +
            this.answer[i][j - 1] * c2 +
            this.answer[i - 1][j] * b1 +
            this.answer[i + 1][j] * b3 -
            this.answer[i - 1][j - 1] * c1 -
            this.answer[i - 1][j + 1] * a1 -
            this.answer[i + 1][j - 1] * c3 -
            this.answer[i + 1][j + 1] * a3;
          flag[0] += c;
          flag[1] += flagger;
          flag[2]++;
          console.log('c: ', c);
          console.log('answer: ', flagger);
        }
      }
      const testFlag = (flag[0] - flag[1]) / flag[2];
      if (
        (0 < testFlag && testFlag <= 0.0001) ||
        (0 > testFlag && testFlag >= -0.0001)
      ) {
        console.log('n: ', n);
        break;
      }
    }

    for (let i = 1; i < nodesY; i++) {
      for (let j = 1; j < nodesX; j++) {
        this.answer[i][j] = this.roundNum(this.answer[i][j]);
      }
    }
  }
}
