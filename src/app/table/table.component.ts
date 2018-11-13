import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {User} from "../models/user.model";

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'table-cmp',
    moduleId: module.id,
    templateUrl: 'table.component.html'
})

export class TableComponent implements OnInit{
    public tableData1: TableData;
    public tableData2: TableData;

    public userAry:User[] = [];

    public superArray:any[] = [];

    public notifyArray:any[] = [];
    public msg:string;
    public editMode:boolean = false;
    notifySent:boolean = false;

    listOfNotifiedUsers= [];

    constructor(private userService: UserService){

    }

    getUser(email) {
        for (let i = 0; i < this.userAry.length ; i++) {
            //console.log('matching',this.userAry[i].getEmail(),'with',email.email);
            if (this.userAry[i].getEmail() === email) {
                //console.log(this.userAry[i]);
                return this.userAry[i];
            }
        }
    }

    ngOnInit(){
        this.userService.getUserData().then((userData: User[])=>{
            //console.log(userData);
            this.userAry = userData;

            console.log('USER DATA',this.userAry);
            this.userService.getNotifiedUsers().subscribe((data: Object) => {
                //console.log(data);
                for( let key in data) {

                    const email = data[key];
                    ///console.log('mf',email);
                    const user = this.getUser(email.email);
                    user.setNotifed(true);

                }
                console.log(this.userAry);
            });


        });
        this.tableData1 = {
            headerRow: [ 'Select', 'Name', 'Email', 'isNotified'],
            dataRows: this.superArray
        };



    }



    getNotified(user:any):boolean{



        return true;
    }


    handleChange(data){
        //console.log(data.email);
        let temp = {email:data.email};
        this.notifyArray.push(temp);


        console.log(this.notifyArray);
    }

    enableEdit(){
        this.editMode = true;
    }

    sendNotification(){
        if(this.editMode) {
            this.editMode = false;

        }
        console.log("Here is data of users to be notified");
        console.log(this.notifyArray);

        this.userService.postUserEmail(this.notifyArray)
            .subscribe(data => { console.log('IN RETURN COMPONENT success',data) // Data which is returned by call
                    this.msg = 'User are updated successfully';
                    this.notifySent = true;
                },
                error => { console.log('IN RETURN COMPONENT error',error); // Error if any

                });

    }

    dismissAlert(){
        this.notifySent =false; 
    }


}
