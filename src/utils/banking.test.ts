import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePassword,
  formatETB,
  maskAccountNumber,
  searchRecipients,
  calculateCharges,
  generateTransactionId,
  generateReceiptId,
  createActivityLog,
  INITIAL_RECIPIENTS,
} from './banking.ts';

test('validatePassword accepts 0607 and custom PINs', () => {
  assert.equal(validatePassword('0607'), true);
  assert.equal(validatePassword(' 0607 '), true);
  assert.equal(validatePassword('1234', '1234'), true);
  assert.equal(validatePassword('123456', '123456'), true);
  assert.equal(validatePassword('1234'), false);
  assert.equal(validatePassword(''), false);
});

test('formatETB correctly formats amounts with 2 decimals and commas', () => {
  assert.equal(formatETB(9791.01), '9,791.01');
  assert.equal(formatETB(5), '5.00');
  assert.equal(formatETB(850), '850.00');
});

test('maskAccountNumber obscures middle digits in authentic CBE style', () => {
  assert.equal(maskAccountNumber('1000562339427'), '1*********9427');
  assert.equal(maskAccountNumber('1000382106157'), '1*********6157');
});

test('searchRecipients searches by name, account number and initials', () => {
  const resultByName = searchRecipients('bilal', INITIAL_RECIPIENTS);
  assert.equal(resultByName.length, 1);
  assert.equal(resultByName[0].name, 'Bilal Seid Abdu');

  const resultByAcc = searchRecipients('7314', INITIAL_RECIPIENTS);
  assert.equal(resultByAcc.length, 1);
  assert.equal(resultByAcc[0].name, 'Tsegaye Abebe Berihun');
});

test('generateTransactionId and generateReceiptId produce authentic CBE formats', () => {
  const txId = generateTransactionId();
  assert.match(txId, /^FT26311[0-9A-Z]{5}$/);

  const rcptId = generateReceiptId();
  assert.match(rcptId, /^v2-[a-zA-Z0-9]{20}$/);
});

test('createActivityLog produces valid structured audit logs', () => {
  const log = createActivityLog('LOGIN_SUCCESS', 'AUTH', 'User authenticated via PIN');
  assert.equal(log.action, 'LOGIN_SUCCESS');
  assert.equal(log.category, 'AUTH');
  assert.equal(log.status, 'SUCCESS');
});
