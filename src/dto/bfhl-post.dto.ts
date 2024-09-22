import { IsArray, IsString, IsOptional } from 'class-validator';

export class BfhlPostDto {
  @IsArray()
  @IsString({ each: true })
  data: string[];

  @IsOptional()
  @IsString()
  file_b64?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selected_options?: string[];
}