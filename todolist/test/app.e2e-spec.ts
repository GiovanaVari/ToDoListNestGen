import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Teste do Module Tarefa (e2e)', () => {
  let app: INestApplication;

  let tarefaId: number

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'root',
          database: 'db_todo_teste',
          autoLoadEntities: true,
          synchronize: true,
          logging: false,
          dropSchema: true
        }),
        AppModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  //Teste post tarefa
  it('1 - Inserir uma tarefa no bd', async () => {
    let response = await request(app.getHttpServer())
      .post('/tarefa')
      .send({
        nome: 'Lavar roupa',
        descricao: 'Pegar roupa suja',
        responsavel: 'Qualquer ser humano',
        data: '2022-09-12',
        status: true
      })
      .expect(201)

      tarefaId = response.body.id

  })

//Teste get tarefa criada anteriormente
it('2 - Recupera a tarefa anterior', async () => {
    return request(app.getHttpServer())
      .get(`/tarefa/${tarefaId}`)
      .expect(200)
  })

  //Teste put
  it('3 - Atualiza a tarefa', async () => {
    return request(app.getHttpServer())
      .put('/tarefa')
      .send({
        id: 1,
        nome: 'Lavar roupas',
        descricao: 'Pegar roupa suja',
        responsavel: 'Qualquer ser humano',
        data: '2022-09-12',
        status: false
      })
      .expect(200)
      .then(response => {
        expect('Lavar roupas').toEqual(response.body.nome)
      })
  })

  //Teste put de uma tarefa que não existe
  it('4 - Não atualiza, pois a tarefa não existe', async () => {
    return request(app.getHttpServer())
      .put('/tarefa')
      .send({
        id: 303,
        nome: 'Lavar roupas',
        descricao: 'Pegar roupa suja',
        responsavel: 'Qualquer ser humano',
        data: '2022-09-12',
        status: false
      })
      .expect(404)
  })

  //Teste delete
  it('5 - Deleta uma tarefa', async () => {
    return request(app.getHttpServer())
      .delete('/tarefa/' + tarefaId)
      .expect(204)
  })

  //Finalizar execução dos testes
  afterAll(async () => {
    await app.close()
  })

});
