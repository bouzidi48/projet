import { EntityRepository, Repository } from 'typeorm';
import { DemandeAdmin } from './entities/demande-admin.entity';



@EntityRepository(DemandeAdmin)
export class DemandeAdminRepository extends Repository<DemandeAdmin> {}