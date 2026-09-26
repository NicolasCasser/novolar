import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { BrazilianState } from 'src/common/enums/brazilian-state.enum';

@InputType()
export class CreateAdoptionRequestInputDTO {
  @Field()
  @IsUUID()
  animalId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  applicantName: string;

  @Field()
  @IsEmail()
  applicantEmail: string;

  @Field()
  @IsPhoneNumber('BR')
  @IsNotEmpty()
  applicantPhone: string;

  @Field(() => BrazilianState)
  @IsEnum(BrazilianState)
  state: BrazilianState;

  @Field()
  @IsString()
  @IsNotEmpty()
  city: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  message: string;
}
