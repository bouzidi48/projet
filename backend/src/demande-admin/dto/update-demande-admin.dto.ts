import { PartialType } from '@nestjs/mapped-types';
import { CreateDemandeAdminDto } from './create-demande-admin.dto';

export class UpdateDemandeAdminDto extends PartialType(CreateDemandeAdminDto) {}
