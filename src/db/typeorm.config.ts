import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Wallet } from 'src/wallets/wallet.entity';
import { connectionName } from './connection';

function getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
  return {
    name: connectionName,
    type: 'postgres',
    host: configService.get('DB_HOST') || 'postgres',
    port: +configService.get('DB_PORT') || 5432,
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [Wallet],
    synchronize: true,
    autoLoadEntities: true,
  };
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) =>
    getOrmConfig(configService),
  inject: [ConfigService],
};
