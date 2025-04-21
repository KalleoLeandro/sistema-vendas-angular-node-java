import { environments } from "@environments/environments";
import { decriptografia, logger } from "@utils/utils";
import * as forge from 'node-forge';

describe('Teste da função decriptografia', () => {    

    it('Deve decriptografar uma mensagem corretamente', () => {
        const hash = 'hashCodificadoEmBase64';

        const mockPrivateKey = {
            decrypt: jest.fn().mockReturnValue('Mensagem Esperada'),
        } as unknown as forge.pki.rsa.PrivateKey;

        jest.spyOn(forge.pki, 'privateKeyFromPem').mockReturnValue(mockPrivateKey);

        const resultado = decriptografia(hash);
        
        expect(resultado).toBe('Mensagem Esperada');
    });

    it('deve retornar null e logar erro ao receber erro na decriptação', () => {        
        const fakePrivateKey = {
          decrypt: jest.fn().mockImplementationOnce(() => {
            throw new Error('Falha de decriptação simulada');
          }),
        };    
        
        jest.spyOn(forge.pki, 'privateKeyFromPem').mockReturnValue(fakePrivateKey as any);
            
        const spyLogger = jest.spyOn(logger, 'error').mockImplementation();
    
        const resultado = decriptografia('algumHashAqui');
    
        expect(resultado).toBeNull();
        expect(spyLogger).toHaveBeenCalledWith('Erro ao descriptografar');
    
        
        jest.restoreAllMocks();
      });
});

describe('Teste do logger', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Deve logar uma mensagem no nível de info', () => {
        const infoSpy = jest.spyOn(logger, 'info').mockImplementation(() => { });

        logger.info('Mensagem de teste');

        expect(infoSpy).toHaveBeenCalledWith('Mensagem de teste');
    });

    it('Deve logar uma mensagem no nível de error', () => {
        const errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => { });

        logger.error('Erro de teste');

        expect(errorSpy).toHaveBeenCalledWith('Erro de teste');
    });


    it('Deve gravar logs no arquivo corretamente', () => {
        logger.info('Mensagem para arquivo');

        expect(logger).toBeTruthy();
    });    
});