const entries = new Map([
  [
    'mario@email.com',
    { name: 'mario junior', key: 'mario@email.com', keyType: 'EMAIL', endToEndId: 'af7aec1b-70bf-4a49-8a30-e3f3e1b58c7a' },
  ],
  [
    'fabio@email.com',
    { name: 'fabio junior', key: 'fabio@email.com', keyType: 'EMAIL', endToEndId: 'ceaaab79-983f-434f-abbb-9b0d9fdbcbcb' },
  ],
  [
    'marcos@email.com',
    { name: 'marcos junior', key: 'marcos@email.com', keyType: 'EMAIL', endToEndId: '9bb9037a-f9fa-4139-8df5-cbae9cf25a36' },
  ],
])

const lastEntriesCreated = new Set([
  'af7aec1b-70bf-4a49-8a30-e3f3e1b58c7a',
  'ceaaab79-983f-434f-abbb-9b0d9fdbcbcb',
  '9bb9037a-f9fa-4139-8df5-cbae9cf25a36',
])

export default {
  entries,
  lastEntriesCreated,
}
