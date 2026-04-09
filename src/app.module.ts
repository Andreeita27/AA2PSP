// Aquí se conectn los demás modulos del proyecto
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServersModule } from './servers/servers.module';
import { ChannelsModule } from './channels/channels.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true,}), PrismaModule, UsersModule, AuthModule, ServersModule, ChannelsModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
