import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Action } from './entities/action.entity';
import { ActionsService } from './actions.service';

/**
 * CRUD package (@nestjsx/crud) oficial do NestJs.
 *
 * Métodos habilitados:
 * getOneBase     - GET     /:id  - recupera um registro específico
 * getManyBase    - GET     /     - recupera vários registros
 * createOneBase  - POST    /     - cria um registro
 * updateOneBase  - PATCH   /:id  - atualiza partes um registro específico
 *
 * Métodos não habilitados:
 * createManyBase - POST    /bulk - cria vários registros
 * deleteOneBase  - DELETE  /:id  - deleta um registro específico
 * replaceOneBase - PUT     /:id  - atualiza por completo um registro específico
 *
 * Exemplo de request:
 * GET /?select=name&filter=power||gt||90&sort=name,ASC&page=1&limit=3
 *  - Seleciona apenas o atributo "name" (select=name)
 *  - Filtra resultados com campo "power" > 90 (power||gt||90)
 *  - Ordena os resultados pelo campo name de forma ASCENDENTE (sort=name,ASC)
 *  - Lista os dados da página 1 (page=1)
 *  - Lista apenas 3 registros (limit=3)
 */
@Crud({
  model: {
    type: Action,
  },
  routes: {
    only: ['getOneBase', 'getManyBase', 'createOneBase', 'updateOneBase'],
  },
})
/**
 * Controller de profiles-actions
 *
 * Implementado utilizando o CRUD package (@nestjsx/crud) oficial do NestJS.
 */
@Controller('profiles-actions')
export class ActionsController {
  constructor(public service: ActionsService) {}
}
