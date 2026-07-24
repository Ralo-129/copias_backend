import { Controller, Get, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { uptime } from 'process';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
  @UseInterceptors(FileInterceptor('archivo'))
  subirArchivo(
    @UploadedFile() archivo: Express.Multer.File,
    @Body() body: { seccion: string; descripcion: string },
  ){
    console.log('Archivo recibido:', archivo?.originalname);
    console.log('Seccion: ', body.seccion);
    console.log('Descripcion: ', body.descripcion);

    return {ok: true, mensaje: 'Archivo recibido correctamente'}
  }

}
