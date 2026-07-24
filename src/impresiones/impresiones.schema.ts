import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImpresionDocument = Impresion & Document;

@Schema({ timestamps: true })
export class Impresion {
    @Prop({required: true})
    profesor: string;

    @Prop({required: true})
    seccion: string;

    @Prop({required: true})
    descripcion: string;

    @Prop({required: true})
    archivo: string;
}

export const ImpresionSchema = SchemaFactory.createForClass(Impresion);