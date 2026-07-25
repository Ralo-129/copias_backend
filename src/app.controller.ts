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
      return { ok: true, rol: 'admin', nombre: 'Rafael (Admin)'};
    }
    if (body.usuario === 'profesor' && body.password === '1234') {
      return { ok: true, rol: 'profesor', nombre: 'Profesor Demo'};
    }
    return { ok: false };
  }

  @Get('impresiones')
   async getImpresiones(){
    return this.impresionModel.find().sort({ createdAt: -1 });
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
    @Body() body: { seccion: string; descripcion: string; profesor: string },
  ){
    const nuevaImpresion = await this.impresionModel.create ({
      profesor: body.profesor,
      seccion: body.seccion,
      descripcion: body.descripcion,
      archivo: archivo.filename,
    });

    return { ok: true, mensaje: 'Archivo recibido y guardado', data: nuevaImpresion };
  }

}
