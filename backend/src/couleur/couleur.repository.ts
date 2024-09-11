import { EntityRepository, Repository } from 'typeorm';
import { Couleur } from './entities/couleur.entity';



@EntityRepository(Couleur)
export class CouleurRepository extends Repository<Couleur> {}