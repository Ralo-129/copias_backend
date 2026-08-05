import { Controller, Get, Post, Body, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AppService } from './app.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Impresion, ImpresionDocument} from './impresiones/impresiones.schema';
import { Usuario, UsuarioDocument } from './usuarios/usuarios.schema';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectModel(Impresion.name) private impresionModel: Model<ImpresionDocument>,
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  async login(@Body() body: { usuario: string; password: string }) {
    const usuarioEncontrado = await this.usuarioModel.findOne({ usuario: body.usuario });

    if (!usuarioEncontrado) {
      return { ok: false };
    }

    const passwordValida = await bcrypt.compare(body.password, usuarioEncontrado.password);

    if (!passwordValida) {
      return { ok: false };
    }

    if (!usuarioEncontrado.activo) {
      return { ok: false, mensaje: 'Ceunta deshabilitada. Contacta al administrador.' };
    }

    return {
      ok: true,
      rol : usuarioEncontrado.rol,
      nombre: usuarioEncontrado.nombre,
      grado: usuarioEncontrado.grado,
      seccion: usuarioEncontrado.seccion,
    };
  }
  

  @Post('registro')
  async registro(@Body() body: { usuario: string; password: string; nombre: string; rol: string, grado?: string; seccion?: string }) {
    const hash = await bcrypt.hash(body.password, 10);

    const nuevoUsuario = await this.usuarioModel.create({
      usuario: body.usuario,
      password: hash,
      nombre: body.nombre,
      rol: body.rol,
      grado: body.grado,
      seccion: body.seccion,
      activo: true,
    });

    return { ok: true, mensaje: 'Usuario creado exitosamente', data: nuevoUsuario };
  }

  @Get('impresiones')
   async getImpresiones(){
    return this.impresionModel.find().sort({ createdAt: -1 });
  }

  @Get('usuarios')
  async getUsuarios(){
    return this.usuarioModel.find().select('-password');
  }

  @Post('usuarios/:id/toggle-activo')
  async toggleActivo(@Param('id') id: string) {
    const usuario = await this.usuarioModel.findById(id);

    if (!usuario) {
      return { ok: false, mensaje: ('Usuario no encontrado') }
    }

    usuario.activo = !usuario.activo;
    await usuario.save();

    return { ok: true, activo: usuario.activo };
  }

  @Post('usuario/:id/editar')
  async editarUsuario(
    @Param('id') id: string,
    @Body() body: { grado: string; seccion: string },
  ) {
    const usuario = await this.usuarioModel.findById(id);

    if (!usuario) {
      return { ok: false, mensaje: 'Usuario no encontrado' };
    }

    usuario.grado = body.grado;
    usuario.seccion = body.seccion;
    await usuario.save();

    return { ok:true, mensaje: 'Usuario actualizado' };
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
    @Body() body: { grado: string; seccion: string; descripcion: string; profesor: string },
  ){
    const nuevaImpresion = await this.impresionModel.create ({
      profesor: body.profesor,
      grado: body.grado,
      seccion: body.seccion,
      descripcion: body.descripcion,
      archivo: archivo.filename,
    });

    return { ok: true, mensaje: 'Archivo recibido y guardado', data: nuevaImpresion };
  }

  @Post('impresiones/:id/toggle-completado')
  async toggleCompletado(@Param('id') id: string) {
    const impresion = await this.impresionModel.findById(id);

    if (!impresion) {
      return { ok: false, mensaje: 'Impresion no encontrada' }
    }

    const actualizado = await this.impresionModel.findByIdAndUpdate(
      id,
      { completado: !impresion.completado },
      { new: true }
    )
    
    return { ok: true, completado: impresion.completado };

  }

}