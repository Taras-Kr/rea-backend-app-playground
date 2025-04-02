import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate as validateUUID } from 'uuid';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { Currency } from './entities/create-currency.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

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
        { symbol: createCurrencyDto.symbol },
      ],
    });
    if (existingCurrency) {
      throw new UnprocessableEntityException(
        'Запис із такою назвою та/або кодом та/або символом вже існує',
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
    if (!validateUUID(uuid)) {
      throw new UnprocessableEntityException('Incorrect UUID');
    }
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
    if (!validateUUID(uuid)) {
      throw new UnprocessableEntityException('Incorrect UUID');
    }
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
      where: [
        { name: updateCurrencyDto.name, uuid: Not(uuid) },
        { symbol: updateCurrencyDto.symbol, uuid: Not(uuid) },
        { code: updateCurrencyDto.code, uuid: Not(uuid) },
      ],
    });
    console.log('duplicate:', duplicatedCurrencies);

    if (duplicatedCurrencies.length !== 0) {
      throw new UnprocessableEntityException(
        'Запис із такою назвою та/або кодом та/або символом вже існує',
      );
    }

    await this.currencyRepository.update(uuid, updateCurrencyDto);
    return { uuid: uuid };
  }

  async softDelete(uuid: string) {
    if (!validateUUID(uuid)) {
      throw new UnprocessableEntityException('Incorrect UUID');
    }
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
    if (!validateUUID(uuid)) {
      throw new UnprocessableEntityException('Incorrect UUID');
    }
    const existingCurrency = await this.currencyRepository.findOne({
      withDeleted: true,
      where: { uuid: uuid },
    });
    if (!existingCurrency) {
      throw new NotFoundException(`Currency with ${uuid} not found`);
    }
    const existUndeletedCurrency = await this.currencyRepository.findOne({
      where: [
        { name: existingCurrency.name },
        { code: existingCurrency.code },
        { symbol: existingCurrency.symbol },
      ],
    });
    if (existUndeletedCurrency) {
      throw new UnprocessableEntityException(
        'Запис із такою назвою та/або кодом та/або символом є серед не видалених записів',
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
    if (deletedItems.length === 0) {
      throw new NotFoundException(`Deleted items not found`);
    }
    return deletedItems;
  }
}
