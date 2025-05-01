import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { Currency } from './entities/create-currency.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { validateUUIDFormat } from '../../common/utils/uuid.utils';
import { throwUnprocessable } from '../../common/exceptions/error-handler';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async create(createCurrencyDto: CreateCurrencyDto) {
    const existingCurrency = await this.currencyRepository.findOne({
      where: [
        { name: createCurrencyDto.name },
        { code: createCurrencyDto.code },
      ],
    });
    if (existingCurrency) {
      throwUnprocessable(
        'Валюта із такою назвою та/або кодом та/або символом вже існує',
        'active_exists',
      );
    }
    const existingDeletedCurrency = await this.currencyRepository.findOne({
      withDeleted: true,
      where: [
        { name: createCurrencyDto.name, deletedAt: Not(IsNull()) },
        { code: createCurrencyDto.code, deletedAt: Not(IsNull()) },
      ],
    });
    if (existingDeletedCurrency) {
      throwUnprocessable(
        'Валюта із такою назвою та/або кодом та/або символом існує серед видалених',
        'deleted_exists',
      );
    }
    try {
      return await this.currencyRepository.save(createCurrencyDto);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  findAll() {
    return this.currencyRepository.find();
  }

  async findOne(uuid: string) {
    validateUUIDFormat(uuid);
    const existingCurrency = await this.currencyRepository.findOne({
      where: { uuid: uuid },
    });

    if (!existingCurrency) {
      throw new NotFoundException('Запис не знайдено');
    } else {
      return existingCurrency;
    }
  }

  async update(uuid: string, updateCurrencyDto: UpdateCurrencyDto) {
    validateUUIDFormat(uuid);
    if (!updateCurrencyDto) {
      throw new BadRequestException();
    }
    const existingCurrency = await this.currencyRepository.findOne({
      where: { uuid: uuid },
    });

    if (!existingCurrency) {
      throw new NotFoundException('Запис не знайдено');
    }

    const duplicatedCurrencies = await this.currencyRepository.find({
      withDeleted: true,
      where: [
        { name: updateCurrencyDto.name, uuid: Not(uuid) },
        { code: updateCurrencyDto.code, uuid: Not(uuid) },
      ],
    });
    if (duplicatedCurrencies.length !== 0) {
      throw new UnprocessableEntityException(
        'Валюта із такою назвою та/або кодом вже існує серед активних або видалених записів',
      );
    }

    await this.currencyRepository.update(uuid, updateCurrencyDto);
    return { uuid: uuid };
  }

  async softDelete(uuid: string) {
    validateUUIDFormat(uuid);
    const existingCurrency = await this.currencyRepository.findOne({
      where: { uuid: uuid },
    });
    if (!existingCurrency) {
      throw new NotFoundException(`Currency with ${uuid} not found`);
    }
    await this.currencyRepository.softDelete(uuid);
    return { uuid: uuid };
  }

  async restore(uuid: string) {
    validateUUIDFormat(uuid);
    const existingCurrency = await this.currencyRepository.findOne({
      withDeleted: true,
      where: { uuid: uuid },
    });
    if (!existingCurrency) {
      throw new NotFoundException(`Currency with ${uuid} not found`);
    }
    const existUndeletedCurrency = await this.currencyRepository.findOne({
      where: [{ name: existingCurrency.name }, { code: existingCurrency.code }],
    });
    if (existUndeletedCurrency) {
      throw new UnprocessableEntityException(
        'Запис із такою назвою та/або кодом є серед не видалених записів',
      );
    }

    await this.currencyRepository.restore(uuid);
    return { uuid: uuid };
  }

  async findDeletedAll() {
    const deletedItems = await this.currencyRepository.find({
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull()),
      },
      select: [
        'uuid',
        'name',
        'code',
        'symbol',
        'createdAt',
        'updatedAt',
        'deletedAt',
      ],
    });
    // if (deletedItems.length === 0) {
    //   throw new NotFoundException(`Записи відсутні`);
    // }
    return deletedItems;
  }
}
