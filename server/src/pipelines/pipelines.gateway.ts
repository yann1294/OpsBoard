import {
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PipelinesService } from './pipelines.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL ?? 'http://localhost:3000',
    credentials: true,
  },
})
export class PipelinesGateway
  implements OnGatewayConnection, OnModuleInit, OnModuleDestroy
{
  @WebSocketServer()
  private server!: Server;

  private readonly logger = new Logger(PipelinesGateway.name);
  private intervalHandle: NodeJS.Timeout | null = null;

  constructor(private readonly pipelinesService: PipelinesService) {}

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('pipeline:snapshot', this.pipelinesService.getAllRuns());
  }

  onModuleInit(): void {
    if (this.intervalHandle) {
      return;
    }

    this.intervalHandle = setInterval(() => {
      const update = this.pipelinesService.createMockUpdate();
      this.server.emit('pipeline:update', update);
    }, 5000);
  }

  onModuleDestroy(): void {
    if (!this.intervalHandle) {
      return;
    }

    clearInterval(this.intervalHandle);
    this.intervalHandle = null;
  }
}
