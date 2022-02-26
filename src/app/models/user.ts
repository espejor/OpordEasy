import { Operation } from "./operation";

export class User {
    _id: String;
    firstName: String;
    lastName: String;
    userName: String;
    email: String;
    password: String;
    avatar:string;
    operations:{operation:Operation,role:string}[] = []
}
