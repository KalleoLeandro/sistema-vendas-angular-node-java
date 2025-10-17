import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TesteController } from './controllers/teste/teste.controller';
import { LoginController } from './controllers/login/login.controller';
import { UtilsController } from './controllers/utils/utils.controller';
import { TokenMiddleware } from '@middlewares/token-middleware/token.middleware';
import { MetricsController } from './controllers/metrics/metrics.controller';
import { LoginService } from './services/login/login.service';
import { UtilsService } from './services/utils/utils.service';

@Module({
  imports: [],
  controllers: [TesteController, LoginController, UtilsController, MetricsController],
  providers: [LoginService, UtilsService],
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
