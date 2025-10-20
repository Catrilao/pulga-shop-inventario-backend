import { JwtService } from '@nestjs/jwt';
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('role', {
    type: 'string',
    default: '',
    choices: ['', 'vendedor', 'admin', 'usuario'],
  })
  .help()
  .parseSync();

const jwtService = new JwtService({
  secret: 'EstoEsUnSecretoSuperSeguro',
});

const payload = {
  sub: 123,
  email: 'correo@correo.com',
  role: argv.role,
};

const token = jwtService.sign(payload);
console.log(`Test JWT:\n${token}`);
console.log(`\nPayload: ${JSON.stringify(payload, null, 4)}`);
