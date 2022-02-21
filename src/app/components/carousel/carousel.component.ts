import { AfterViewInit, Component } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})

export class CarouselComponent implements  AfterViewInit {
  // testSwiper: Swiper;
  path = "assets/images/carousel/"
  // images: { image: string; title: string; caption: string; }[];

  constructor(private config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    // config.interval = 10000;
    config.wrap = false;
    // config.keyboard = false;
    // config.pauseOnHover = true;
    config.interval = 0;
  }
  ngAfterViewInit() {
  }
  images = [{
    image: this.path + "imagen1.png" ,
    title:"",
    caption:""
  },{
    image: this.path + "imagen2.png",
    title:"",
    caption:""
  },{
    image: this.path + "imagen3.png",
    title:"",
    caption:""
  },{
    image: this.path + "imagen4.png",
    title:"",
    caption:""
  },{
    image: this.path + "imagen5.png",
    title:"Insertar símbolos",
    caption:"Para cada categoría aparecen los iconos de los puntos." + 
    "Pulsando en ellos en la parte de la derecha de la ventana aparecerán opciones adicionales para cada punto, como el nombre, el número o el tipo" +
    "Una vez seleccionado pulsar CREAR y podremos ubicar el punto en el mapa"
  },{
    image: this.path + "imagen6.png",
    title:"Insertar símbolos",
    caption:"Con las Líneas procederemos de forma similar a los puntos" +
    "Al pintar las líneas, los puntos ya ubicados nos sirven de referencia." +
    "Si acercamos el ratón lo suficiente al punto la línea se enganchará al punto"
  },{
    image: this.path + "imagen7.png",
    title:"Insertar símbolos",
    caption:"Y con las áreas es igual" 
  },{
    image: this.path + "imagen8.png",
    title:"Insertar Unidades",
    caption:"Una vez iluminado el plano procedemos a crear las Unidades tanto propias como enemigas" +
    "La ventana tiene varias partes:" +  
    "1.- Tabs para desplazarse entre Nuevas unidades, las seleccionadas como favoritas y las creadas recientemente" +
    "2.- Desplegable para seleccionar qué parte del símboo de la Unidad deseamos" +
    "3.- Los símbolos que deseamos incorporar a la Unidad" + 
    "4.- El resultado visual de la Unidad que se está componiendo" +
    "5.- Opciones para agregar el símbolo a Favorito, Crear el símbolo sin insertarlo en el mapa o insertarlo en el mapa"
  },{
    image: this.path + "imagen9.png",
    title:"Insertar Tareas",
    caption:"Terminado el despliegue procedemos a dibujar en el mapa las tareas que se asignan a cada Unidad. Tan sólo hay que pinchar, crear y ubicar" +
    "Para su ubicación se ha de tener en cuanta el número de puntos de anclaje que cada símbolo tiene según el APP6-C y pulsar tantas veces como puntos tenga el símbolo " + 
    "Una vez ubicado se puede modificar forma y posición" 
  },{
    image: this.path + "imagen10.png",
    title:"",
    caption:"" 
  },{
    image: this.path + "imagen11.png",
    title:"",
    caption:"" 
  },{
    image: this.path + "imagen12.png",
    title:"",
    caption:"" 
  },
  ]
    // this.testSwiper = new Swiper('.swiper-container', {
    //   direction: 'horizontal',
    //   loop: true,
    //   pagination: {
    //     el: '.swiper-pagination',
    //   },
    //   navigation: {
    //     nextEl: '.swiper-button-next',
    //     prevEl: '.swiper-button-prev',
    //   },
    //   scrollbar: {
    //     el: '.swiper-scrollbar',
    //   },
    // });
  // }

}
