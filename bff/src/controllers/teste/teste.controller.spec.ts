import { Test, TestingModule } from '@nestjs/testing';
import { TesteController } from './teste.controller';

describe('TesteController', () => {
  let controller: TesteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TesteController],
    }).compile();

    controller = module.get<TesteController>(TesteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('deve retornar a mensagem "Teste Ok"', () => {
    const result = controller.teste();
    expect(result).toEqual({ message: 'Teste Ok' });
  });
});
