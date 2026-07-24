import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Impresion, ImpresionSchema } from './impresiones/impresiones.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    MongooseModule.forFeature([{ name: Impresion.name, schema: ImpresionSchema }])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
