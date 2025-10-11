import 'jest-preset-angular/setup-jest';

import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

export default async function setupJest() {

}