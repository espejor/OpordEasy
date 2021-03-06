import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EntityUnit } from 'src/app/entities/entity-unit';
import { Entity } from 'src/app/entities/entity.class';
import { OperationsService } from 'src/app/services/operations.service';
// import jsPDF from 'jspdf';
// import htmlToPdfmake from 'html-to-pdfmake';
// import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, Style, TDocumentDefinitions } from 'pdfmake/interfaces';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-opord',
  templateUrl: './opord.component.html',
  styleUrls: ['./opord.component.css']
})
export class OpordComponent implements OnInit {
  bubbles:  Bubbles;
  textComposed: string;

  @ViewChild('pdfDocument') pdfDocument: ElementRef;
  constructor(public operationsService:OperationsService) {}

  ngOnInit(): void {

  }

  createPDF2(){
    const contents:Content[] = []
    const title1 = "OPERACIÓN " + this.operationsService.selectedOperation.name
    var title2 = "ORDEN DE OPERACIONES" 
    title2 += this.operationsService.selectedOperation.order?" Nº: " + this.operationsService.selectedOperation.order:""
    const title =[title1,title2]
    const contentTitle:Content = {
      stack:title,
      style: {
        fontSize:14,
        font : 'Roboto',
        bold:true,
        alignment:"center",
        lineHeight:2
      }
    }

    const fonts = {
      'Roboto' : {
         normal: 'Roboto-Regular.ttf',
         bold: 'Roboto-Medium.ttf',
         italics: 'Roboto-Italic.ttf',
         bolditalics: 'Roboto-Italic.ttf'
      },
   
      'OpenSans' : {
         normal: 'OpenSans-Regular.ttf',
         bold: 'OpenSans-Medium.ttf',
         italics: 'OpenSans-Italic.ttf',
         bolditalics: 'OpenSans-Italic.ttf'
      }
   
   }

    // Contenido del Título
    contents.push(contentTitle)
    // Contenido del body
    const arrayDocumentHTML = document.querySelectorAll("h3,h4,textarea")
    contents.push(...this.arrayContentsOfBody(arrayDocumentHTML))

    const documentDefinition:TDocumentDefinitions = { 
      content: contents,
      pageSize: 'A4',
      info:{
        title:"OPORD " + this.operationsService.selectedOperation.name
      }
    };

    pdfMake.createPdf(documentDefinition,{},fonts,pdfFonts.pdfMake.vfs).open();
  }

  arrayContentsOfBody(arrayDocumentHTML):Content[] {
    var styles
    const styleH3:Style = {
        fontSize:12,
        font : 'Roboto',
        bold:true,
        alignment:"left",
        // leadingIndent:10,
    }

    const styleH4:Style = {
      fontSize:11,
      font : 'Roboto',
      bold:true,
      alignment:"left",
        // leadingIndent:20,
        lineHeight:1.5
    }
    
    const styleContent:Style = {
      fontSize:10,
      bold:false,
      alignment:"justify",
      // leadingIndent:30,
      // margin:[50,50],
      lineHeight:1,
      // preserveLeadingSpaces:true
    }

    styles = {"styleH3":styleH3,"styleH4":styleH4,"styleContent":styleContent}
    
    const bodyContents:Content[] = []
    arrayDocumentHTML.forEach(node => {
      switch (node.nodeName){
        case "H3":
          if(node.classList.contains("title1"))
          bodyContents.push({
            text:node.innerHTML,
            margin:[10,10,0,0],
            style:styleH3
          })
          break
        case "H4":
          if (!node.classList.contains("phase") && node.classList.contains("title2"))
          bodyContents.push({
            text:node.innerHTML,
            margin:[20,10,0,0],
            style:styleH4
          })
          if (node.classList.contains("combat"))
            this.loadContentPhase(bodyContents,styles,"combat")
          if (node.classList.contains("support"))
            this.loadContentPhase(bodyContents,styles,"support")
          break
        case "TEXTAREA":
          if (node.classList.contains("content"))
          bodyContents.push({
            text:node.value,
            margin:[30,10,0,0],
            style:styleContent
          })
          break
        }
    })
    return bodyContents
  }

  updateOperation(){
    this.operationsService.updateOperation()
    .subscribe(data => {
      console.log(data);
    });
  }

  loadContentPhase(bodyContents:Content[],styles,combatFunction:string) {
    this.operationsService.selectedOperation.phases.forEach(phase => {
      bodyContents.push({
        text:phase.name,
        margin:[20,10,0,0],
        style:styles.styleH4
      })
      phase.timelines.forEach(timeline => {
        if((<EntityUnit>timeline.entities[0]).getCombatFunction() == combatFunction){
          var textLine = ""
          timeline.entities.forEach((entity,i) => {
            textLine += entity.getVerbose()
              textLine += i == 0? ": ": " "
          })
          bodyContents.push({
            text:textLine,
            margin:[30,10,0,0],
            style:styles.styleContent
          })
        }
      })
    })
  }

  extractText(node: any): string {
    var value = node.textContent;
    do{
      node = node.nextElementSibling
      if(node)
        value += node.textContent
    }while(node && node.nextElementSibling)
    return value
  }


  compoundText(text:string){
    this.textComposed += text + " "
  }

  clearText(){
    this.textComposed = ""
  }
  
  isCombatUnit(unit:Entity) : boolean { 
    return (<EntityUnit>unit).getCombatFunction() == "combat"; 
  }  
  isSupportUnit(unit:Entity) : boolean { 
    return (<EntityUnit>unit).getCombatFunction() == "support"; 
  }

  situation:Bubbles = {
    state:false,
    text:"Explicar brevemente la situación actual para que las unidades subordinadas puedan entender la situación táctica en el que se va a desarrollar la operación. Además de los puntos que se especifican, se puede añadir información relativa al entorno físico y consideraciones civiles que se consideren relevantes."
  }

  enemy: Bubbles ={
    state:false,
    text:"Hace referencia a la organización de las fuerzas enemigas descendiendo hasta dos escalones por debajo del propio. También se describen las líneas de acción del adversario, especificando la más probable y la más peligrosa. Cuando sea posible se proporciona un esquema o superponible de esas líneas de acción, con lo que se reduce el volumen de la expresión escrita a lo mínimo necesario para aclarar aspectos que puedan producir confusión. Esos esquemas se proporcionarán como apéndices al anexo inteligencia.\nPara tratar otros aspectos relativos a Inteligencia se hace referencia al anexo inteligencia."
  }

  ourForces: Bubbles ={
    state:false,
    text:"Contiene el propósito del JU de dos escalones por encima del propio y la misión y propósito del JU del escalón inmediatamente superior. Se expone la información relativa a otras unidades (propias o aliadas), sean adyacentes o no, cuyas actividades tengan una influencia significativa en la operación propia."  
  }

  aggregationsAndSegregations: Bubbles ={
    state:false,
    text:"No debe ser una repetición de lo ya indicado en el apartado o anexo organización operativa. Se relacionan las unidades propias segregadas y otras que se reciban agregadas, con la indicación del GFH en el que la agregación o segregación entra en vigor, cuándo finaliza y el modelo de autoridad operativa. En caso de que se mantenga la segregación o agregación previa de determinadas unidades, se debe seguir haciendo referencia a esta situación empleando alguno de los términos: “Continúa agregada” o “Continúa segregada”."
  }

  mission: Bubbles ={
    state:false,
    text:"En este apartado se expone la misión asignada a la unidad propia o la que se ha desarrollado durante el proceso de planeamiento."
  }
  coordination: Bubbles ={
    state:false,
    text:"Instrucciones aplicables a dos o más elementos de la organización operativa. Normalmente incluye límites, puntos de enlace, posiciones/bases de partida, líneas de partida, hora del ataque y todas aquellas consideradas necesarias para coordinar las actividades de las diferentes unidades y medios subordinados. Se incluye también otra información, como instrucciones para remisión de informes, hora prevista de ejecución y cuándo entra en vigor la orden (si difiere de la indicada en la firma). No se expresa lo que esté contemplado en una NOP/SOP o consista en un procedimiento de rutina. En ocasiones, cuando las instrucciones sean más extensas o complejas, se tratan en un anexo (ROE, medidas para la protección de la fuerza, aspectos relativos a la conservación del medio ambiente, etc.)."
  }
  apolog: Bubbles ={
    state:false,
    text:"Este párrafo está orientado a informar a los JU de las unidades subordinadas y a sus EM/PLM cómo el JU pretende apoyar la operación desde el punto de vista logístico. Se puede hacer referencia a: prioridades en el apoyo, unidades logísticas del escalón superior que apoyan a la propia unidad, aspectos relativos al apoyo de la nación anfitriona, aspectos no usuales de este apoyo que puedan influir notablemente en la operación, riesgos significativos y a la propia organización del apoyo logístico para toda la operación."
  }
  command: Bubbles ={
    state:false,
    text:"Este apartado incluye instrucciones relativas a situación y movimiento de los PC."
  }
  communications: Bubbles ={
    state:false,
    text:"Este apartado incluye instrucciones relativas transmisiones, empleo del espectro electromagnético, reconocimiento e identificación de unidades y medios, palabras clave, lenguaje convenido, etc."
  }
}

interface Bubbles{
  state:boolean,
  text:string
}

  

