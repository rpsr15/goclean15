import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'https://goclean1508.herokuapp.com:3001';

@Injectable()
export class SocketService {
    private socket;

    public initSocket(): void {
        this.socket = socketIo(SERVER_URL);
    }

    public onNewNotification(): Observable<String> {
        return new Observable<String>(observer => {
            this.socket.on('notification', (data: String) => observer.next(data));
        });
    }

    public onNewReading(): Observable<Object> {
        return new Observable<Object>(observer => {
            this.socket.on('binReadings', (data) => observer.next(data));
        });
    }
}
