/* eslint-disable no-undef */
// TODO: replace implementation with transactions
module.exports = {
  async up(db) {
    await db.collection('todos').dropIndex('customId_1_owner_1')
    await db
      .collection('todos')
      .updateMany({}, { $rename: { customId: 'publicId' } })
    await db
      .collection('todos')
      .createIndex({ publicId: 1, owner: 1 }, { unique: true })
  },

  async down(db) {
    await db.collection('todos').dropIndex('publicId_1_owner_1')
    await db
      .collection('todos')
      .updateMany({}, { $rename: { publicId: 'customId' } })
    await db
      .collection('todos')
      .createIndex({ customId: 1, owner: 1 }, { unique: true })
  },
}
