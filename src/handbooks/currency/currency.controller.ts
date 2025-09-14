import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { CustomApiResponse } from '../../common/dto/api-response.dto';
import { CustomValidationPipe } from '../../common/pipes/custom-validation.pipe';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import {
  SwaggerCreate,
  SwaggerDelete,
  SwaggerGet,
  SwaggerGetArchive,
  SwaggerGetByUUID,
  SwaggerRestore,
  SwaggerUpdate,
} from '../../common/decorators/swagger/common.decorator';
import * as examples from './swagger/responses.swagger';
import { AccessTokenGuard } from '../../common/guards/accessToken.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Довідник валют')
@Controller('handbooks/currencies')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin')
  @Post()
  @UsePipes(new CustomValidationPipe())
  @SwaggerCreate({
    description: 'Створення нового запису про валюту',
    summary: 'Створення нового запису про валюту',
    example422: examples.create422,
    example400: examples.create400,
    example201: examples.create201,
  })
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currencyService.create(createCurrencyDto);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Get('archive')
  @SwaggerGetArchive({
    example200: examples.getArchive200,
  })
  findDeletedAll() {
    return this.currencyService.findDeletedAll();
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Get()
  @SwaggerGet({
    description: 'Отримання всіх не видалених записів про валюти',
    summary: 'Отримання всіх не видалених записів про валюти',
    example200: examples.get200,
  })
  findAll() {
    return this.currencyService.findAll();
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin', 'agent')
  @Get(':uuid')
  @SwaggerGetByUUID({
    description: 'Отримання одного не видаленого запису про валюти',
    summary: 'Отримання одного не видаленого запису про валюти',
    example200: examples.getByUuid200,
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID валюти',
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  findOne(@Param('uuid') uuid: string) {
    return this.currencyService.findOne(uuid);
  }


  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin')
  @Put(':uuid')
  @UsePipes(new CustomValidationPipe())
  @SwaggerUpdate({
    description: 'Отримання одного не видаленого запису про валюти',
    summary: 'Отримання одного не видаленого запису про валюти',
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID валюти',
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ) {
    const res = await this.currencyService.update(uuid, updateCurrencyDto);
    return new CustomApiResponse(res, 'Updated successfully', HttpStatus.OK);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin')
  @Delete(':uuid')
  @SwaggerDelete({
    description: "М'яке запису про валюту",
    summary: "М'яке запису про валюту",
  })
  @ApiParam({
    name: 'uuid',
    description: "UUID категорії об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async softDelete(@Param('uuid') uuid: string) {
    const res = await this.currencyService.softDelete(uuid);
    return new CustomApiResponse(res, 'Deleted', HttpStatus.OK);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('owner', 'admin')
  @Put('archive/:uuid')
  @SwaggerRestore({
    description: 'Поновлення з архіву запису про валюту',
    summary: 'Поновлення з архіву запису про валюту',
  })
  @ApiParam({
    name: 'uuid',
    description: "UUID категорії об'єкта нерухомості",
    example: '4deedf09-b86d-4799-ab10-ae1424471540',
  })
  async restore(@Param('uuid') uuid: string) {
    const res = await this.currencyService.restore(uuid);
    return new CustomApiResponse(res, 'Restored', HttpStatus.OK);
  }
}
