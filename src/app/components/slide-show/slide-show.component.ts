import { Component, OnInit, HostListener, Input, ViewChild } from '@angular/core';
import { ApiService } from "../../services/api.service";
import { Order } from '../../models/Order';
import { Slide } from '../../models/Slide';
import { Observable } from 'rxjs';
import { ElectronService } from "../../providers/electron.service";

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

@Component({
  selector: 'app-slide-show',
  templateUrl: './slide-show.component.html',
  styleUrls: ['./slide-show.component.scss']
})
export class SlideShowComponent implements OnInit {
  filePaths: any = this.apiService.filePaths;
  slides: Slide[];
  moment: any = this.electron.moment;
  slidePath: string;
  active: number = 0;
  @ViewChild('slideMessage') slideMessage: any;
  // OrderType: string;
  @Input() orderType: string;
  @Input() newActive: any;
  @Input() slideOrders: any;
  @Input() fullScreen: any;

  images = [
    '/home/stuart/Documents/sample data/tiff/africansavannah2_1530702787.tif',
    '/home/stuart/Documents/sample data/tiff/wintertrees7_1530702818.tif',
    '/home/stuart/Downloads/Backdrops/Hi Res Tifs/atlantaskyline.tif',
    '/home/stuart/Downloads/Backdrops/Hi Res Tifs/beachboards1.tif',
    '/home/stuart/Downloads/Backdrops/Hi Res Tifs/brickwall1.tif'

  ]

  constructor(private apiService: ApiService, private electron: ElectronService) {
    console.log('slide active', this.newActive)
    console.log('slides', this.slides)




  }

  getFilenameFromUrl(url) {
    return url.substring(url.lastIndexOf('/') + 1);
  }



  tiff(path) {
    // this.electron.tiffJs.close()
    this.electron.tiffJs.initialize({ TOTAL_MEMORY: 100000000 }) // 100MB

    // var filename = process.argv[2];
    var input = this.electron.fs.readFileSync(path);
    var image = new this.electron.tiffJs({ buffer: input });
    var canvas = image.toCanvas();
    canvas.style.width = '100%';
    var el = document.querySelector('#tiff');
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
    el.appendChild(canvas);
    console.log(image)
  }



  ngOnInit() {



    this.tiff(this.images[0])

    // for (let path of images) {
    //   this.tiff(path)
    // }
  }


  @HostListener('window:click', ['$event'])

  clickEvent(event: any) {
    // console.log('slide click', event);
    if (event.target.className == 'update-slides-state') {

      this.slideMessage.nativeElement.hidden = false;

      setTimeout(() => {
        this.slideMessage.nativeElement.hidden = true;
      }, 3000);


      if (this.orderType === 'active') {
        this.slidePath = this.filePaths.full;
      } else {
        this.slidePath = this.filePaths.watermarked;
      }

      this.active = this.newActive === undefined ? this.active : this.newActive.position - 1;

      this.slides = this.activeRentals(this.active);
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // console.log(event);
    if (event.keyCode === 71) {
      console.log('newActive', this.newActive);
      console.log('orderType', this.orderType);
      // this.slides = this.activeRentals(2);
      // this.activeRentals();
      console.log(this.slides);
    }
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      if (this.active < this.slides.length - 1) {
        this.slides.forEach(slide => slide.show = false);
        this.slides[this.active += 1].show = true;
      }
    }
    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      if (this.active > 0) {
        this.slides.forEach(slide => slide.show = false);
        this.slides[this.active -= 1].show = true;
      }
    }
    if (event.key === 'Escape') {
      this.active = 0;

    }
    if (event.keyCode >= 49 && event.keyCode <= 57 || event.keyCode >= 97 && event.keyCode <= 105) {
      console.log('numpad');
      this.slides.forEach(slide => slide.show = false);
      const selectSlide = this.slides[parseInt(event.key) - 1];
      if (selectSlide !== undefined) {
        selectSlide.show = true;
      }
    }
  }



  activeRentals(active) {
    const slides = this.slideOrders.sort((a, b) => a.position - b.position);

    for (let i = 0; i < slides.length; i++) {
      slides[i].show = false;
    }

    // show the first slide
    slides[active].show = true;

    return slides;

  }




}
