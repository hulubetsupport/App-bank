import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePassword,
  formatETB,
  formatCardTimestamp,
  formatTransactionDate,
  formatReceiptDate,
  maskAccountNumber,
  searchRecipients,
  calculateCharges,
  generateTransactionId,
  generateReceiptId,
  createCustomTransaction,
  removeTransactionById,
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

test('formatCardTimestamp, formatTransactionDate, and formatReceiptDate produce authentic CBE date formats', () => {
  const sampleDate = new Date(2026, 10, 6, 22, 52, 0);
  const cardStamp = formatCardTimestamp(sampleDate);
  assert.match(cardStamp, /^06 Nov 2026 • 10:52\s?PM$/i);

  const txStamp = formatTransactionDate(sampleDate);
  assert.match(txStamp, /^06-Nov-26 10:52\s?PM$/i);

  assert.equal(formatReceiptDate('06-Nov-26 10:54 PM'), 'Nov 06, 2026 10:54 PM');
  assert.equal(formatReceiptDate('20-Nov-2026 04:00 PM'), 'Nov 20, 2026 04:00 PM');
  assert.equal(formatReceiptDate('Nov 20, 2026 04:00 PM'), 'Nov 20, 2026 04:00 PM');
});

test('maskAccountNumber obscures middle digits in authentic CBE style', () => {
  assert.equal(maskAccountNumber('1000758204567'), '1*********4567');
  assert.equal(maskAccountNumber('1000614289312'), '1*********9312');
});

test('searchRecipients searches by name, account number and initials', () => {
  const resultByName = searchRecipients('dawit', INITIAL_RECIPIENTS);
  assert.equal(resultByName.length, 1);
  assert.equal(resultByName[0].name, 'Dawit Bekele Tadesse');

  const resultByAcc = searchRecipients('6208', INITIAL_RECIPIENTS);
  assert.equal(resultByAcc.length, 1);
  assert.equal(resultByAcc[0].name, 'Yohannes Girma Tesfaye');
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

test('calculateCharges supports zero fees and optional standard CBE fee tier', () => {
  const zeroFees = calculateCharges(1000);
  assert.equal(zeroFees.serviceCharge, 0);
  assert.equal(zeroFees.vat, 0);
  assert.equal(zeroFees.disasterRecovery, 0);
  assert.equal(zeroFees.totalDebited, 1000);

  const withFees = calculateCharges(5000, true);
  assert.equal(withFees.serviceCharge, 10);
  assert.equal(withFees.vat, 1.5);
  assert.equal(withFees.disasterRecovery, 0.5);
  assert.equal(withFees.totalDebited, 5012);
});

test('createCustomTransaction and removeTransactionById manage transaction records cleanly', () => {
  const tx = createCustomTransaction({
    name: 'Telebirr Wallet',
    amount: 4980,
    type: 'debited',
    category: 'TRANSFER TO TELEBIRR',
    accountNumber: '+251996910607',
    remark: 'Transfer to Telebirr',
    serviceCharge: 10,
    vat: 1.5,
    disasterRecovery: 0.5,
  });

  assert.equal(tx.name, 'Telebirr Wallet');
  assert.equal(tx.amount, 4980);
  assert.equal(tx.type, 'debited');
  assert.equal(tx.serviceCharge, 10);
  assert.match(tx.referenceId, /^FT26311[0-9A-Z]{5}$/);

  const remaining = removeTransactionById([tx], tx.id);
  assert.equal(remaining.length, 0);
});


