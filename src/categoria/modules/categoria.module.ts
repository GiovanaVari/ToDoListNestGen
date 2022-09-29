import { CategoriaController } from './../controllers/categori.controller';
import { CategoriaService } from './../services/categoria.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from "@nestjs/common";
import { Categoria } from '../entities/categoria.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Categoria])],
    providers: [CategoriaService],
    controllers: [CategoriaController],
    exports: [TypeOrmModule]
})
export class CategoriaModule { }