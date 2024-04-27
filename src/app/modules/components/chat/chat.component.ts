import { Component } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { Message } from '../../../models/Message';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  constructor(private chatService: ChatService, private route: ActivatedRoute) {
    
  }

  messageInput:string = "";
  userId:string = "";

  allMessages :any[] = [];

  ngOnInit(): void {
    this.chatService.joinRoom("Room1");
    this.userId = this.route.snapshot.params['userId'];
    this.listenerMessage();
  }

  sendMessage() {
    const message : Message = {
      message: this.messageInput,
      user: this.userId
    }
    this.chatService.sendMessage("Room1", message);
    this.messageInput = "";
    
  }

  listenerMessage() {
    this.chatService.getMessageSub().subscribe((message: any) => {
      this.allMessages = message.map((item: any) => ({
        ...item,
        message_side: item.user === this.userId ? "sender" : "receiver"
      }))
      
    });
  }
  
}
