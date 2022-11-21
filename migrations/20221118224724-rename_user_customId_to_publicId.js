// TODO: replace implementation with transactions
module.exports = {
  async up(db) {
    await db.collection('users').dropIndex('customId_1')
    await db
      .collection('users')
      .updateMany({}, { $rename: { customId: 'publicId' } })
    await db.collection('users').createIndex({ publicId: 1 }, { unique: true })
  },

  async down(db) {
    await db.collection('users').dropIndex('publicId_1')
    await db
      .collection('users')
      .updateMany({}, { $rename: { publicId: 'customId' } })
    await db.collection('users').createIndex({ customId: 1 }, { unique: true })
  },
}
