import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { ReturnTableDto, returnTableQuery } from './dto/return-table.dto';

@Injectable()
export class TableService {
  constructor(private prisma: PrismaService) { }

  async create(createTableDto: CreateTableDto): Promise<ReturnTableDto> {
    const tables = await this.findAll();
    if (tables.length >= 15) throw new BadRequestException("Maximum tables reached")

    try {
      const table = await this.prisma.table.create({
        data: createTableDto,
        select: returnTableQuery
      })

      return table;
    }
    catch (error) {
      throw new BadRequestException(error.name);
    }
  }

  async findAll(): Promise<ReturnTableDto[]> {
    const tables = await this.prisma.table.findMany({
      select: returnTableQuery
    });

    return tables;
  }

  async findById(id: number): Promise<ReturnTableDto> {
    const table = await this.prisma.table.findFirst({
      where: { id },
      select: returnTableQuery
    })

    if (!table) throw new NotFoundException("Table not found");

    return table;
  }

  async update(id: number, updateTableDto: UpdateTableDto): Promise<ReturnTableDto> {
    await this.findById(id);

    try {
      const table = await this.prisma.table.update({
        where: { id },
        data: updateTableDto,
        select: returnTableQuery
      })

      return table;
    }
    catch (error) {
      throw new BadRequestException(error.name);
    }
  }

  async remove(id: number): Promise<void> {
    await this.findById(id)
    await this.prisma.table.delete({ where: { id } });
  }
}
