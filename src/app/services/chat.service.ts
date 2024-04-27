import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { Message } from '../models/Message';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly url = `${environment.url}${'chat-socket'}`
  private stomClient: any
  private messageSub: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
  constructor() { 
    this.initConnectionSocket();
  }
  initConnectionSocket(){
    const socket = new SockJS(this.url);
    this.stomClient = Stomp.over(socket);
  }

  joinRoom(roomId: string) {
    this.stomClient.connect({}, () => {
      this.stomClient.subscribe(`/topic/${roomId}`, (message: any) => {
        const messageContent = JSON.parse(message.body);
        const currentMessages = this.messageSub.getValue();
        currentMessages.push(messageContent);
        this.messageSub.next(currentMessages); 
      });
    });
  }

  sendMessage(roomId: string, message: Message) {
    this.stomClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(message));
  }

  getMessageSub() {
    return this.messageSub.asObservable();
  }

}
