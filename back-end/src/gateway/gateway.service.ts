import { Injectable, OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {Server} from 'socket.io'

@WebSocketGateway(3010)
@Injectable()
export class GatewayService implements OnModuleInit {

    @WebSocketServer()
    server: Server

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id)
            console.log("Connected")
        })
    }

    @SubscribeMessage('order')
    handleEvent(@MessageBody() data: string): string {
        console.log(data)
        this.server.emit("on", {
            msg: "New Event",
            content: data
        })
        return data;
    }
}
