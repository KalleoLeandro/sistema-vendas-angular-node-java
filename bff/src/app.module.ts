import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TesteController } from './controllers/teste/teste.controller';
import { LoginController } from './controllers/login/login.controller';
import { UtilsController } from './controllers/utils/utils.controller';
import { TokenMiddleware } from '@middlewares/token-middleware/token.middleware';
import { MetricsController } from './controllers/metrics/metrics.controller';
import { LoginService } from './services/login/login.service';
import { UtilsService } from './services/utils/utils.service';
import { ProdutoController } from './controllers/produto/produto.controller';
import { ProdutoService } from './services/produto/produto.service';

@Module({
  imports: [],
  controllers: [TesteController, LoginController, UtilsController, MetricsController, ProdutoController],
  providers: [LoginService, UtilsService, ProdutoService],
})
export class AppModule {

   configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleware)
      .exclude(
        { path: 'teste', method: RequestMethod.GET },
        { path: 'metrics', method: RequestMethod.GET },
        { path: 'login/validar-login', method: RequestMethod.POST },
        { path: 'login/validar-token', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
