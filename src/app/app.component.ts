import {Component, OnInit, ViewChild} from '@angular/core';

const SIZE = 50;
const SEA_LAND_RATIO = 40;

enum AreaStatus {
  Sea = 0,
  Land = 1,
  Discovered = 2,
}

const SEA_COLOR = '#cbe1ff';
const LAND_COLOR = '#bbbbbb';

function ISLAND_COLOR() {
  let r = function () {
    return Math.floor(Math.random() * 256)
  };
  return "rgb(" + r() + "," + r() + "," + r() + ")";
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public title = 'The Island Discovery';
  public canvasWidth = 800;
  public canvasHeight = 800;
  public island: number[] = new Array(SIZE * SIZE);
  public color: string[] = new Array(SIZE * SIZE);
  public newColor: string = '#00FF00';
  public timeGeneration = 0;
  public numberOfIslands = 0;

  @ViewChild('canvasElement')
  public canvasEl;

  @ViewChild('inputElement')
  public inputEl;

  private position;

  public ngOnInit() {
    this.generate();

    const start = performance.now();
    this.findIslands();
    const end = performance.now();
    this.timeGeneration = Math.floor((end - start) * 100) / 100;

    this.attachEventListeners();
    this.render();
  }

  public onColorChanged(event: Event) {
    // Write your code below.

  }

  private getInitialColor(value: number): string {
    if (value === AreaStatus.Land) {
      return LAND_COLOR;
    } else if (value == AreaStatus.Sea) {
      return SEA_COLOR;
    } else {
      return ISLAND_COLOR();
    }
  }

  private setValueAt(row: number, column: number, value: number) {
    this.island[row * SIZE + column] = value;
  }

  private getValueAt(row: number, column: number): number {
    return this.island[row * SIZE + column];
  }

  private setIslandColor(row: number, column: number, value: string) {
    this.color[row * SIZE + column] = value;
  }

  private getIslandColor(row: number, column: number): string {
    return this.color[row * SIZE + column];
  }

  /**
   * generate new island
   */
  private generate() {

    let state, color;
    for (let col = 0; col < SIZE; col++) {
      for (let row = 0; row < SIZE; row++) {
        state = Math.round(Math.random() * 100);
        const area = state >= SEA_LAND_RATIO ? AreaStatus.Sea : AreaStatus.Land;
        color = this.getInitialColor(area);

        this.setValueAt(row, col, area);
        this.setIslandColor(row, col, color);
      }
    }
  }

  /**
   * render the island into the canvas Element
   */
  private render() {

    const canvas = this.canvasEl.nativeElement;
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    const ctx = canvas.getContext('2d');

    const squareWidth = Math.floor(canvas.width / SIZE);
    const squareHeight = Math.floor(canvas.height / SIZE);

    let x, y;
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        ctx.fillStyle = this.getIslandColor(row, col);
        y = row * squareHeight;
        x = col * squareWidth;
        ctx.fillRect(x, y, squareWidth, squareHeight);
        ctx.fillStyle = '#000';
      }
    }
  }

  /**
   * generate random color
   * @return {string}
   */
  private generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    const color = ['#'];
    for (let i = 0; i < 6; i++) {
      color.push(letters[Math.floor(Math.random() * 16)]);
    }
    return color.join('');
  }

  /**
   * attach event listeners
   */
  private attachEventListeners() {
    // Write your code below.


  }

  /**
   * discover islands and apply a new color to each of them.
   * the definition of an Island is : All LAND square that connect to an other LAND square
   */

  private findIslands() {


    let randomColor = [];

    for (let i = 0; i < 1000; i++) {

      randomColor.push(ISLAND_COLOR());

    }

    //Startin counting the number of islands
    let counter = 0;

    //Make use of AreaStatus Discovered
    //Make use of private position.
    //Setting a new color for each island using random color.

    for (let col = 0; col < SIZE; col++) {
      for (let row = 0; row < SIZE; row++) {
        let top = this.getValueAt(row + 1, col);
        let topRight = this.getValueAt(row + 1, col + 1);
        let topLeft = this.getValueAt(row + 1, col - 1);
        let bottom = this.getValueAt(row - 1, col);
        let bottomRight = this.getValueAt(row - 1, col + 1);
        let bottomLeft = this.getValueAt(row - 1, col - 1);
        let right = this.getValueAt(row, col + 1);
        let left = this.getValueAt(row, col - 1);
        let landArea = this.getValueAt(row, col);


        //Attempt to count the number of islands on the canvas
        if (landArea == AreaStatus.Land) {
          counter++;
        }

        //Series of if and else statements to properly reassign Area Status and Island Colors
        if (landArea == AreaStatus.Land || landArea == AreaStatus.Discovered) {


          this.setIslandColor(row, col, randomColor[counter]);
          this.setValueAt(row, col, AreaStatus.Discovered);

          if (top == AreaStatus.Discovered) {
            let islandColor = this.getIslandColor(row + 1, col);
            //If top has already been discovered, assign color top island color to 'landArea'.
            this.setIslandColor(row, col, islandColor);
            counter--;
          } else if (bottom == AreaStatus.Discovered) {
            let islandColor = this.getIslandColor(row - 1, col);
            this.setIslandColor(row, col, islandColor);
            counter--;
          } else if (right == AreaStatus.Discovered) {
            let islandColor = this.getIslandColor(row, col + 1);
            this.setIslandColor(row, col, islandColor);
            counter--;
          } else if (left == AreaStatus.Discovered) {
            let islandColor = this.getIslandColor(row, col - 1);
            this.setIslandColor(row, col, islandColor);
            counter--;
          } else if (topRight == AreaStatus.Discovered) {
            let islandColor = this.getIslandColor(row + 1, col + 1);
            this.setIslandColor(row, col, islandColor);
            counter--;
          } else if (topLeft == AreaStatus.Discovered) {
            let islandColor = this.getIslandColor(row + 1, col - 1);
            this.setIslandColor(row, col, islandColor);
            counter--;
          } else if (bottomRight == AreaStatus.Discovered) {
            let islandColor = this.getIslandColor(row - 1, col + 1);
            this.setIslandColor(row, col, islandColor);
            counter--;
          } else if (bottomLeft == AreaStatus.Discovered) {
            let islandColor = this.getIslandColor(row - 1, col - 1);
            this.setIslandColor(row, col, islandColor);
            counter--;
          } else if (top == AreaStatus.Land) {


            this.setValueAt(row + 1, col, AreaStatus.Discovered);

          } else if (bottom == AreaStatus.Land) {

            this.setValueAt(row - 1, col, AreaStatus.Discovered);

          } else if (right == AreaStatus.Land) {
            this.setValueAt(row, col + 1, AreaStatus.Discovered);

          } else if (left == AreaStatus.Land) {
            this.setValueAt(row, col - 1, AreaStatus.Discovered);
          } else if (topRight == AreaStatus.Land) {

            this.setValueAt(row + 1, col + 1, AreaStatus.Discovered);

          } else if (topLeft == AreaStatus.Land) {

            this.setValueAt(row + 1, col - 1, AreaStatus.Discovered);

          } else if (bottomRight == AreaStatus.Land) {
            this.setValueAt(row - 1, col + 1, AreaStatus.Discovered);

          } else if (bottomLeft == AreaStatus.Land) {
            this.setValueAt(row - 1, col - 1, AreaStatus.Discovered);
          }

        }


      }


    }

    this.numberOfIslands = counter;

  }
}
