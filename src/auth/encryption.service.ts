import { Injectable } from '@nestjs/common';
import { AssertionError } from 'assert';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

/**
 * Serviço de criptografia baseado no algoritmo Blowfish
 *
 * Utilizado para criptografia simétrica de valores, bom para criptografar senhas
 */
@Injectable()
export class EncryptionService {
  /**
   * Criptografa o valor passado com o algoritmo Blowfish
   *
   * @param password Valor a ser criptografado
   * @returns O valor criptografado
   */
  hash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (saltErr, salt) => {
        if (saltErr) {
          return reject(saltErr);
        }

        return bcrypt.hash(password, salt, (hashErr, hashed) => {
          if (hashErr) {
            return reject(hashErr);
          }

          return resolve(hashed);
        });
      });
    });
  }

  /**
   * Compara um valor não criptografado com um criptografado e retorna
   * verdadeiro se o segundo for o hash (valor criptografado) do primeiro
   *
   * @param password Valor não criptografado
   * @param hash Valor criptografado
   * @returns Um booleano verdadeiro se os valores corresponderem
   */
  async compareOrFail(password: string, hash: string): Promise<true> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (err, passwordValid) => {
        if (err) return reject(err);
        if (!passwordValid)
          return reject(new AssertionError({ message: 'Hash mismatch' }));
        return resolve(true);
      });
    });
  }
}
