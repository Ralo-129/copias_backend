import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

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
      return { ok: true, rol: ' admin'};
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
}
