import { Module } from '@nestjs/common';
import { BfhlController } from './bfhl.controller';
import { BfhlService } from './bfhl.service';

@Module({
  imports: [],
  controllers: [BfhlController],
  providers: [BfhlService],
})
export class AppModule {}
