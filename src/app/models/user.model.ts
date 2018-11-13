export class User {
    private email: string;
    private name: string;
    private notifed: boolean;
    private password: string;


    constructor(email:string,name:string,notifed:boolean){
        this.email = email;
        this.name = name;
        this.notifed = notifed;
    }

    getEmail(){
        return this.email;
    }

    getPassword(){
        return this.password;
    }

    getName(){
        return this.name;
    }

    getNotifed(){
        return this.notifed;
    }

    setNotifed(val){
        this.notifed = val;
    }
}