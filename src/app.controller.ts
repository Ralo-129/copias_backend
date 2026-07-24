import { Controller, Get, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AppService } from './app.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Impresion, ImpresionSchema } from './impresiones/impresiones.schema';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectModel (Impresion.name) private impresionModel: Model<Impresion>
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  login(@Body() body:{ usuario: string; password: string }){
    if (body.usuario === 'admin' && body.password === '1234') {
      return { ok: true, rol: 'admin'};
    }
    if (body.usuario === 'profesor' && body.password === '1234') {
      return { ok: true, rol: 'profesor'};
    }
    return { ok: false };
  }

  @Get('impresiones')
  getImpresiones(){
    return [
      {profesor: 'Ana Torres', seccion:'1 A', hora:'10:00', descripcion:'10 copias, doble cara'},
      {profesor: 'Luis Ramos', seccion:'2 B', hora:'11:30', descripcion:'Imprimir examen, 30 hojas'},
    ]
  }

  @Post('subir')
  @UseInterceptors(
    FileInterceptor('archivo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const nombreUnico = Date.now() + '-' + file.originalname;
          callback(null, nombreUnico);
        },
      }),
    }),
  )

  async subirArchivo(
    @UploadedFile() archivo: Express.Multer.File,
    @Body() body: { seccion: string; descripcion: string },
  ){
    const nuevaImpresion = await this.impresionModel.create ({
      profesor: 'Profesor de prueba',
      seccion: body.seccion,
      descripcion: body.descripcion,
      archivo: archivo.filename,
    });

    return { ok: true, mensaje: 'Archivo recibido y guardado', data: nuevaImpresion };
  }

}
