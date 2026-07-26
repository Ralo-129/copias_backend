import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema({ timestamps: true })
export class Usuario {
    @Prop({ required: true, unique: true })
    usuario:string;

    @Prop({ required: true })
    password:string;

    @Prop({ required: true })
    nombre:string;

    @Prop({ required: true })
    rol:string;

    @Prop()
    grado?:string;

    @Prop()
    seccion?:string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);