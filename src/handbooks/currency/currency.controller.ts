import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { ApiResponse } from '../../common/dto/api-response.dto';

@Controller('handbooks/currencies')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currencyService.create(createCurrencyDto);
  }

  @Get('archive')
  findDeletedAll() {
    return this.currencyService.findDeletedAll();
  }

  @Get()
  findAll() {
    return this.currencyService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.currencyService.findOne(uuid);
  }

  @UsePipes(new ValidationPipe())
  @Put(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ) {
    const res = await this.currencyService.update(uuid, updateCurrencyDto);
    return new ApiResponse(res, 'Updated successfully', HttpStatus.OK);
  }

  @Delete(':uuid')
  async softDelete(@Param('uuid') uuid: string) {
    const res = await this.currencyService.softDelete(uuid);
    return new ApiResponse(res, 'Deleted', HttpStatus.OK);
  }

  @Put('archive/:uuid')
  async restore(@Param('uuid') uuid: string) {
    const res = await this.currencyService.restore(uuid);
    return new ApiResponse(res, 'Restored', HttpStatus.OK);
  }
}
