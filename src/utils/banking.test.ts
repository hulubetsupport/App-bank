import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePassword,
  formatETB,
  maskAccountNumber,
  searchRecipients,
  calculateCharges,
  generateTransactionId,
  createActivityLog,
  INITIAL_RECIPIENTS,
} from './banking.ts';

test('validatePassword accepts 0607 and rejects incorrect passwords', () => {
  assert.equal(validatePassword('0607'), true);
  assert.equal(validatePassword(' 0607 '), true);
  assert.equal(validatePassword('1234'), false);
  assert.equal(validatePassword(''), false);
  assert.equal(validatePassword('0000'), false);
});

test('formatETB correctly formats amounts with 2 decimals and commas', () => {
  assert.equal(formatETB(15683.01), '15,683.01');
  assert.equal(formatETB(850), '850.00');
  assert.equal(formatETB(5000), '5,000.00');
});

test('maskAccountNumber obscures middle digits in authentic CBE style', () => {
  assert.equal(maskAccountNumber('1000562339427'), '1*********9427');
  assert.equal(maskAccountNumber('1000293817314'), '1*********7314');
});

test('searchRecipients searches by name, account number and initials', () => {
  const resultByName = searchRecipients('bilal', INITIAL_RECIPIENTS);
  assert.equal(resultByName.length, 1);
  assert.equal(resultByName[0].name, 'Bilal Seid Abdu');

  const resultByAcc = searchRecipients('7314', INITIAL_RECIPIENTS);
  assert.equal(resultByAcc.length, 1);
  assert.equal(resultByAcc[0].name, 'Tsegaye Abebe Berihun');

  const resultByEmpty = searchRecipients('', INITIAL_RECIPIENTS);
  assert.equal(resultByEmpty.length, 0);
});

test('calculateCharges returns zero fee breakdown for mobile transfers', () => {
  const charges = calculateCharges(850);
  assert.equal(charges.totalDebited, 850);
  assert.equal(charges.serviceCharge, 0);
});

test('generateTransactionId creates authentic CBE reference starting with FT26', () => {
  const id = generateTransactionId();
  assert.match(id, /^FT26[0-9A-Z]{10}$/);
});

test('createActivityLog produces valid structured audit logs', () => {
  const log = createActivityLog('LOGIN_SUCCESS', 'AUTH', 'User authenticated via PIN 0607');
  assert.equal(log.action, 'LOGIN_SUCCESS');
  assert.equal(log.category, 'AUTH');
  assert.equal(log.status, 'SUCCESS');
  assert.ok(log.ipAddress);
  assert.ok(log.device);
});
