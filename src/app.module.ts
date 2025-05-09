import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserTypeModule } from './handbooks/user-type/user-type.module';
import { UserRoleModule } from './handbooks/user-role/user-role.module';
import { CurrencyModule } from './handbooks/currency/currency.module';
import { PropertyCategoryModule } from './handbooks/property-category/property-category.module';
import { PropertyTypeModule } from './handbooks/property-type/property-type.module';
import { LocationModule } from './location/location.module';
import { GeocodingModule } from './geocoding/geocoding.module';
import { PropertyCharacteristicModule } from './handbooks/property-characteristic/property-characteristic.module';
import { CharacteristicValueModule } from './handbooks/characteristic-value/characteristic-value.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
        synchronize: true,
      }),

      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    UserTypeModule,
    UserRoleModule,
    CurrencyModule,
    PropertyCategoryModule,
    PropertyTypeModule,
    LocationModule,
    GeocodingModule,
    PropertyCharacteristicModule,
    CharacteristicValueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
