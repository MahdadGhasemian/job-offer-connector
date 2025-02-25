import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

export enum LogLevel {
  // The server/app is in a critical state.
  Fatal = 'fatal',
  // An error has occurred.
  Error = 'error',
  // A warning message.
  Warn = 'warn',
  // An informational message.
  Info = 'info',
  // A debug message.
  Debug = 'debug',
  // Trace-level information, the most detailed log level.
  Trace = 'trace',
}

@Module({
  imports: [ConfigModule],
})
export class LoggerModule {
  static forRoot(): DynamicModule {
    return {
      module: LoggerModule,
      imports: [
        PinoLoggerModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            pinoHttp: {
              transport: {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorize: false,
                },
              },
              level: configService.get<LogLevel>('LOG_LEVEL') || LogLevel.Info,

              customSuccessMessage: function () {
                return '';
              },

              customAttributeKeys: {
                req: 'request',
                res: 'response',
                err: 'error',
                responseTime: 'response_time',
              },
            },
          }),
          inject: [ConfigService],
        }),
      ],
    };
  }
}
