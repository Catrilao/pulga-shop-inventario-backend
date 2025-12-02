import { JwtService } from '@nestjs/jwt';
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('role', {
    type: 'string',
    default: 'vendedor',
    choices: ['', 'vendedor', 'administrador', 'usuario'],
  })
  .option('vendedor', {
    type: 'string',
    default: 'VEND_001',
    description: 'ID del vendedor (sub en el token)',
  })
  .help()
  .parseSync();

const jwtService = new JwtService({
  secret: process.env.JWT_SECRET || 'EstoEsUnSecretoSuperSeguro',
});

const payload = {
  sub: argv.vendedor,
  email: 'correo@correo.com',
  role: argv.role,
};

const token = jwtService.sign(payload);
console.log(`Test JWT:\n${token}`);
console.log(`\nPayload: ${JSON.stringify(payload, null, 4)}`);
