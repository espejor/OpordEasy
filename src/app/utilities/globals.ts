import { Map } from "ol";
import Modify from "ol/interaction/Modify";
import VectorSource from "ol/source/Vector";
import { OperationsService } from "../services/operations.service";
// import { OlMapComponent } from "../components/nav/ol-map/ol-map.component";

export const Globals = Object({
    MAP: Map,
    SHAPES_VECTOR_LAYER:VectorSource,
    DRAG_SOURCE: VectorSource,
    MODIFY:Modify,
    ALREADY_REGITERED :"alreadyRegistered" 
    // OPERATION_SVC:OperationsService
})

