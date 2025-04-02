import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { Currency } from './entities/create-currency.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
  controllers: [CurrencyController],
  providers: [CurrencyService],
})
export class CurrencyModule {}
